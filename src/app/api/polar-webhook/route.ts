import { createHmac, timingSafeEqual } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/log";
import { notifyDonation, formatMoney } from "@/lib/notify";

// Polar 결제 완료 웹훅 — 후원이 들어오면 내역을 저장하고 카카오톡·메일로 알린다.
// (doc/18_contact_notifications.md §6)
//
// 서명 검증: Polar는 Standard Webhooks 규격을 따른다.
//   headers: webhook-id, webhook-timestamp, webhook-signature("v1,<base64>" 공백 구분 다중)
//   서명   : base64( HMAC-SHA256( secretBytes, `${id}.${timestamp}.${rawBody}` ) )
//   비밀키 : Polar가 준 문자열(polar_whs_…)의 UTF-8 바이트를 그대로 쓴다.
//            (스펙상 "secret은 base64로 인코딩된 값" → 라이브러리가 디코딩하므로 결국 원문 바이트)
// 검증 실패는 401. 성공 처리는 202(재전송 방지).

export const dynamic = "force-dynamic";

const TOLERANCE_SEC = 5 * 60; // 재전송(replay) 방지 — 5분 이상 지난 서명은 거절

// HMAC 키 후보 — 시크릿 형식에 따라 해석이 갈린다.
//  · 평문(polar_whs_… 등): Polar SDK가 base64 인코딩해 넘기고 라이브러리가 디코딩 → 원문 바이트
//  · whsec_ 접두사: Standard Webhooks 관례상 접두사를 떼고 base64 디코딩한 바이트
// 어느 쪽이든 시크릿을 알아야만 만들 수 있으므로, 둘 다 대조해도 보안은 약해지지 않는다.
function keyCandidates(secret: string): Buffer[] {
  const keys = [Buffer.from(secret, "utf8")];
  const stripped = secret.replace(/^whsec_/, "");
  if (stripped !== secret) {
    const decoded = Buffer.from(stripped, "base64");
    if (decoded.length > 0) keys.push(decoded);
  }
  return keys;
}

function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string
): { ok: true } | { ok: false; reason: string } {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signature = headers.get("webhook-signature");
  if (!id || !timestamp || !signature) return { ok: false, reason: "서명 헤더 누락" };

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return { ok: false, reason: "timestamp 형식 오류" };
  if (Math.abs(Date.now() / 1000 - ts) > TOLERANCE_SEC) {
    return { ok: false, reason: "timestamp 허용 범위 초과" };
  }

  const signedPayload = `${id}.${timestamp}.${rawBody}`;
  const expectedList = keyCandidates(secret).map((key) =>
    createHmac("sha256", key).update(signedPayload).digest("base64")
  );

  // "v1,<sig> v1,<sig2>" 형태 — 하나라도 일치하면 통과
  const provided = signature.split(" ").map((p) => p.split(",").pop() ?? "");
  const match = provided.some((p) => {
    const pBuf = Buffer.from(p, "utf8");
    return expectedList.some((exp) => {
      const expBuf = Buffer.from(exp, "utf8");
      return pBuf.length === expBuf.length && timingSafeEqual(pBuf, expBuf);
    });
  });
  return match ? { ok: true } : { ok: false, reason: "서명 불일치" };
}

// Polar order 페이로드에서 필요한 값만 방어적으로 추출한다(스키마 변화 대비).
type PolarOrder = {
  id?: string;
  amount?: number;
  total_amount?: number;
  net_amount?: number;
  currency?: string;
  customer?: { name?: string | null; email?: string | null } | null;
  product?: { name?: string | null } | null;
};

export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    await logActivity({ action: "donation.webhook", level: "error", message: "POLAR_WEBHOOK_SECRET 미설정" });
    return new Response("not configured", { status: 503 });
  }

  const rawBody = await req.text();
  const verified = verifySignature(rawBody, req.headers, secret);
  if (!verified.ok) {
    await logActivity({
      action: "donation.webhook",
      level: "issue",
      message: `서명 검증 실패: ${verified.reason}`,
    });
    return new Response("invalid signature", { status: 401 });
  }

  let event: { type?: string; data?: PolarOrder };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  // 결제가 실제로 완료된 이벤트만 처리한다(체크아웃 진행 중 이벤트는 무시).
  const PAID_EVENTS = ["order.created", "order.paid"];
  if (!event.type || !PAID_EVENTS.includes(event.type)) {
    return new Response("ignored", { status: 202 });
  }

  const order = event.data ?? {};
  const orderId = order.id;
  if (!orderId) return new Response("no order id", { status: 202 });

  const amountCents = order.total_amount ?? order.amount ?? order.net_amount ?? 0;
  const currency = order.currency ?? "usd";
  const customerName = order.customer?.name ?? null;
  const customerEmail = order.customer?.email ?? null;
  const productName = order.product?.name ?? null;

  const service = createServiceClient();
  if (!service) {
    await logActivity({ action: "donation.webhook", level: "error", message: "서비스 키 없음" });
    return new Response("not configured", { status: 503 });
  }

  // 재전송 대비: order_id 가 이미 있으면 알림을 다시 보내지 않는다.
  const { data: existing } = await service
    .from("donations")
    .select("id, notified_at")
    .eq("order_id", orderId)
    .maybeSingle<{ id: string; notified_at: string | null }>();

  if (existing?.notified_at) {
    return new Response("duplicate", { status: 202 });
  }

  if (!existing) {
    const { error: insErr } = await service.from("donations").insert({
      order_id: orderId,
      amount_cents: amountCents,
      currency,
      customer_name: customerName,
      customer_email: customerEmail,
      product_name: productName,
      raw: event,
    });
    // 동시 전송으로 unique 충돌이 나면 다른 요청이 처리 중이므로 여기서 종료
    if (insErr) {
      await logActivity({
        action: "donation.webhook",
        level: insErr.code === "23505" ? "info" : "error",
        targetType: "donation",
        targetId: orderId,
        message: `저장 실패(${insErr.code}): ${insErr.message}`,
      });
      return new Response("stored elsewhere", { status: 202 });
    }
  }

  await logActivity({
    action: "donation.received",
    targetType: "donation",
    targetId: orderId,
    message: `${formatMoney(amountCents, currency)} · ${customerName || "익명"}`,
  });

  const results = await notifyDonation({
    orderId,
    amountCents,
    currency,
    customerName,
    customerEmail,
    productName,
  });

  await service
    .from("donations")
    .update({ notified_at: new Date().toISOString() })
    .eq("order_id", orderId);

  await logActivity({
    action: "donation.notify",
    targetType: "donation",
    targetId: orderId,
    message: results.map((r) => `${r.channel}:${r.status}`).join(" "),
  });

  return new Response("ok", { status: 202 });
}

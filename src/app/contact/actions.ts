"use server";

import { createHash } from "node:crypto";
import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";
import { notifyContact } from "@/lib/notify";

function enc(s: string) {
  return encodeURIComponent(s);
}

// 스팸/알림 폭탄 방지 임계값 (doc/18 §5)
const RATE_WINDOW_SEC = 60;
const RATE_NOTIFY_MAX = 3; // 이 이상이면 접수는 받되 알림은 건너뛴다
const RATE_BLOCK_MAX = 10; // 이 이상이면 접수 자체를 거절한다

// 원문 IP는 저장하지 않는다 — 서버 전용 솔트로 해시해 빈도 판정에만 쓴다.
async function clientIpHash(): Promise<string | null> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    null;
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || "habitree-local-salt";
  return createHash("sha256").update(salt + "|" + ip).digest("hex").slice(0, 32);
}

// 최근 창(window) 안의 동일 IP 제출 건수. service_role 로만 조회 가능(RLS).
async function recentCount(ipHash: string | null): Promise<number> {
  if (!ipHash) return 0;
  const service = createServiceClient();
  if (!service) return 0;
  const since = new Date(Date.now() - RATE_WINDOW_SEC * 1000).toISOString();
  const { count, error } = await service
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) return 0; // 판정 실패 시 막지 않는다(정상 사용자 우선)
  return count ?? 0;
}

// 문의 접수 — contact_messages 테이블에 저장(RLS: contact_insert_valid) 후
// 운영자에게 메일·카카오톡 알림을 보낸다(doc/18_contact_notifications.md).
// 알림은 after()로 응답 뒤에 실행 — 외부 API가 느려도 접수 응답이 지연되지 않는다.
export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  // 허니팟 — 사람에게는 보이지 않는 필드. 채워져 있으면 봇이므로 조용히 성공 처리.
  const trap = String(formData.get("website") || "").trim();

  if (trap) {
    await logActivity({ action: "contact.honeypot", level: "issue", message: "봇 제출 차단" });
    redirect("/contact?success=1");
  }

  if (!name || !email || !message) {
    redirect("/contact?error=" + enc("이름·이메일·내용을 입력해 주세요."));
  }
  if (!isSupabaseConfigured) {
    redirect("/contact?error=" + enc("아직 서버가 설정되지 않았습니다. 잠시 후 다시 시도해 주세요."));
  }

  const ipHash = await clientIpHash();
  const recent = await recentCount(ipHash);
  if (recent >= RATE_BLOCK_MAX) {
    await logActivity({
      action: "contact.rate_limited",
      level: "issue",
      message: `동일 IP ${recent}건/${RATE_WINDOW_SEC}초 — 접수 거절`,
    });
    redirect("/contact?error=" + enc("잠시 후 다시 시도해 주세요. 짧은 시간에 너무 많이 보내셨어요."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    user_id: user?.id ?? null,
    name,
    email,
    type: type || null,
    subject: subject || null,
    message,
    ip_hash: ipHash,
  });

  if (error) {
    await logActivity({
      action: "contact.submit",
      level: "error",
      userId: user?.id ?? null,
      message: error.message,
      metadata: { email },
    });
    redirect("/contact?error=" + enc("전송에 실패했습니다. 잠시 후 다시 시도해 주세요."));
  }

  await logActivity({
    action: "contact.submit",
    userId: user?.id ?? null,
    targetType: "contact_message",
    message: `${name} 문의`,
    metadata: { email, type },
  });

  // 알림은 응답 이후에 — 폭주 구간에서는 저장만 하고 알림을 건너뛴다(채널 무력화 방지).
  if (recent >= RATE_NOTIFY_MAX) {
    await logActivity({
      action: "contact.notify",
      level: "issue",
      targetType: "contact_message",
      message: `동일 IP ${recent}건/${RATE_WINDOW_SEC}초 — 알림 생략(접수는 정상)`,
    });
  } else {
    const userId = user?.id ?? null;
    after(async () => {
      const notified = await notifyContact({ name, email, type, subject, message });
      await logActivity({
        action: "contact.notify",
        userId,
        targetType: "contact_message",
        message: notified.map((r) => `${r.channel}:${r.status}`).join(" "),
      });
    });
  }

  redirect("/contact?success=1");
}

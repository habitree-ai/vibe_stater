import { createServiceClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/log";
import { site } from "@/lib/site";

// 운영자 알림 발송 — 이메일(Resend) + 카카오톡 '나에게 보내기'.
// 설계 원칙(doc/18_contact_notifications.md):
//  · best-effort: 어떤 실패도 호출부(문의 접수 흐름)를 막지 않는다.
//  · 채널 미설정(키/토큰 없음)은 오류가 아니라 '건너뜀'.
//  · 카카오 access 토큰은 DB(notification_tokens)에서 관리하고 만료 시 자동 갱신한다.

export type ContactNotification = {
  name: string;
  email: string;
  phone?: string | null;
  type?: string | null;
  subject?: string | null;
  message: string;
};

export type ChannelResult = {
  channel: "email" | "kakao";
  status: "sent" | "skipped" | "failed";
  detail?: string;
};

const ADMIN_CONTACT_URL = `${site.url}/admin/contact`;

// 외부 API가 응답하지 않을 때 무한 대기하지 않도록 모든 fetch에 건다.
// (undici 기본 헤더 타임아웃은 300초라 폼 응답을 사실상 붙잡는다)
const FETCH_TIMEOUT_MS = 5000;

// 카카오 미리보기용 이메일 마스킹 — 로컬파트 앞 2자만 남긴다(a***@b.com).
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email.slice(0, 2) + "***";
  const head = local.slice(0, 2);
  return `${head}${local.length > 2 ? "***" : ""}@${domain}`;
}

// ------------------------------------------------------------------ 이메일
// 제목·본문만 받아 보내는 범용 발송기(문의·후원 등 모든 알림이 공유).
async function sendEmailRaw(subject: string, text: string): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  if (!apiKey || !to) {
    return { channel: "email", status: "skipped", detail: "RESEND_API_KEY/ADMIN_EMAIL 미설정" };
  }
  const from = process.env.RESEND_FROM_EMAIL || "habitree <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) {
    return { channel: "email", status: "failed", detail: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  return { channel: "email", status: "sent" };
}

async function sendContactEmail(input: ContactNotification): Promise<ChannelResult> {
  const lines = [
    `이름: ${input.name}`,
    `이메일: ${input.email}`,
    input.phone ? `연락처: ${input.phone}` : null,
    input.type ? `유형: ${input.type}` : null,
    input.subject ? `제목: ${input.subject}` : null,
    "",
    input.message,
    "",
    `관리자에서 보기: ${ADMIN_CONTACT_URL}`,
  ].filter((l) => l !== null);

  return sendEmailRaw(
    `[habitree 문의] ${input.type || "일반"} — ${input.name}`,
    lines.join("\n")
  );
}

// ------------------------------------------------------ 카카오 토큰 관리
type KakaoTokenRow = {
  access_token: string | null;
  refresh_token: string | null;
  access_expires_at: string | null;
};

async function getKakaoAccessToken(): Promise<
  { token: string } | { skip: string } | { fail: string }
> {
  const clientId = process.env.KAKAO_REST_API_KEY;
  if (!clientId) return { skip: "KAKAO_REST_API_KEY 미설정" };
  const service = createServiceClient();
  if (!service) return { skip: "서비스 키 없음" };

  const { data, error } = await service
    .from("notification_tokens")
    .select("access_token, refresh_token, access_expires_at")
    .eq("id", "kakao")
    .maybeSingle<KakaoTokenRow>();
  if (error) return { fail: "토큰 조회 실패: " + error.message };
  if (!data?.refresh_token) return { skip: "카카오 미연동(scripts/kakao-connect.mjs 참조)" };

  // 여유 60초를 두고 유효하면 그대로 사용
  const expiresAt = data.access_expires_at ? Date.parse(data.access_expires_at) : 0;
  if (data.access_token && expiresAt - Date.now() > 60_000) {
    return { token: data.access_token };
  }

  // 갱신 — 카카오는 만료 임박 시 새 refresh_token을 함께 내려준다(회전분 저장 필수)
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: data.refresh_token,
  });
  if (process.env.KAKAO_CLIENT_SECRET) body.set("client_secret", process.env.KAKAO_CLIENT_SECRET);

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
  });
  if (!res.ok) {
    return { fail: `카카오 토큰 갱신 실패 ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  const tok = (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  // 회전된 refresh_token을 못 남기면 다음 갱신이 막힌다 — 실패를 반드시 남긴다.
  // (발송 자체는 방금 받은 access 토큰으로 계속 진행 — best-effort 원칙)
  const { error: upErr } = await service
    .from("notification_tokens")
    .update({
      access_token: tok.access_token,
      access_expires_at: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
      ...(tok.refresh_token ? { refresh_token: tok.refresh_token } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", "kakao");
  if (upErr) {
    await logActivity({
      action: "notify.kakao.token_persist",
      level: "error",
      message:
        (tok.refresh_token ? "회전된 refresh_token 저장 실패 — 재연동 필요할 수 있음: " : "access 토큰 저장 실패: ") +
        upErr.message,
    });
  }

  return { token: tok.access_token };
}

// ------------------------------------------------- 카카오 '나에게 보내기'
// 텍스트 템플릿 발송 공통부 — 문의·후원 알림이 함께 쓴다.
async function sendKakaoText(
  text: string,
  linkUrl: string,
  buttonTitle: string
): Promise<ChannelResult> {
  const got = await getKakaoAccessToken();
  if ("skip" in got) return { channel: "kakao", status: "skipped", detail: got.skip };
  if ("fail" in got) return { channel: "kakao", status: "failed", detail: got.fail };

  const res = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${got.token}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      template_object: JSON.stringify({
        object_type: "text",
        text: text.slice(0, 200), // 텍스트 템플릿 최대 200자
        link: { web_url: linkUrl, mobile_web_url: linkUrl },
        button_title: buttonTitle,
      }),
    }),
  });
  if (!res.ok) {
    return { channel: "kakao", status: "failed", detail: `카카오 ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  return { channel: "kakao", status: "sent" };
}

async function sendContactKakao(input: ContactNotification): Promise<ChannelResult> {
  // 미리보기는 80자까지만 — 전체 내용은 관리자 링크에서 (개인정보 최소 노출)
  const preview = input.message.length > 80 ? input.message.slice(0, 80) + "…" : input.message;
  const text = [
    "📮 새 문의 도착",
    `${input.name} (${maskEmail(input.email)})`,
    input.phone ? `☎ ${input.phone}` : null,
    input.type ? `유형: ${input.type}` : null,
    `"${preview}"`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendKakaoText(text, ADMIN_CONTACT_URL, "관리자에서 보기");
}

// 관리자 화면용 연동 상태 — 토큰 값은 절대 노출하지 않고 상태만 요약한다.
export async function kakaoLinkStatus(): Promise<{ linked: boolean; detail: string }> {
  if (!process.env.KAKAO_REST_API_KEY) {
    return { linked: false, detail: "KAKAO_REST_API_KEY 미설정 — doc/18 §3의 앱 생성부터 진행하세요." };
  }
  const service = createServiceClient();
  if (!service) return { linked: false, detail: "서버 설정 오류(서비스 키 없음)" };

  const { data, error } = await service
    .from("notification_tokens")
    .select("refresh_token, updated_at")
    .eq("id", "kakao")
    .maybeSingle<{ refresh_token: string | null; updated_at: string }>();
  if (error) return { linked: false, detail: "토큰 조회 실패: " + error.message };
  if (!data?.refresh_token) {
    return { linked: false, detail: "토큰 없음 — node scripts/kakao-connect.mjs 로 1회 연동이 필요합니다." };
  }
  return {
    linked: true,
    detail: `연동 완료 · 마지막 토큰 갱신 ${new Date(data.updated_at).toLocaleString("ko-KR")}`,
  };
}

// ------------------------------------------------------------------ 공개 API
// 문의 접수 알림 — 두 채널 병렬 발송. 실패는 로그로만 남기고 절대 throw하지 않는다.
export async function notifyContact(input: ContactNotification): Promise<ChannelResult[]> {
  const settled = await Promise.allSettled([sendContactEmail(input), sendContactKakao(input)]);
  const results: ChannelResult[] = settled.map((s, i) =>
    s.status === "fulfilled"
      ? s.value
      : {
          channel: i === 0 ? "email" : "kakao",
          status: "failed",
          detail: String(s.reason).slice(0, 200),
        }
  );

  // 실패뿐 아니라 '건너뜀' 사유도 남긴다 — 운영에서 키/토큰 누락을 바로 진단하기 위해.
  for (const r of results) {
    if (r.status === "sent") continue;
    await logActivity({
      action: `notify.${r.channel}`,
      level: r.status === "failed" ? "issue" : "info",
      targetType: "contact_message",
      message: `${r.status}: ${r.detail ?? ""}`,
    });
  }
  return results;
}

// ------------------------------------------------------------- 후원 알림
// Polar 결제 완료 웹훅에서 호출한다. 금액과 내역(후원자·상품·주문번호)을 카카오톡·메일로 보낸다.
export type DonationNotification = {
  orderId: string;
  amountCents: number;
  currency: string;
  customerName?: string | null;
  customerEmail?: string | null;
  productName?: string | null;
};

// 통화 단위 표시 — Polar는 최소 단위(센트)로 준다.
export function formatMoney(amountCents: number, currency: string): string {
  const major = amountCents / 100;
  const cur = (currency || "usd").toUpperCase();
  const symbol = cur === "USD" ? "$" : cur === "KRW" ? "₩" : "";
  // KRW처럼 소수가 없는 통화도 Polar는 100배로 주므로 동일하게 나눈다.
  const num = major.toLocaleString("ko-KR", {
    minimumFractionDigits: Number.isInteger(major) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return symbol ? `${symbol}${num}` : `${num} ${cur}`;
}

export async function notifyDonation(input: DonationNotification): Promise<ChannelResult[]> {
  const money = formatMoney(input.amountCents, input.currency);
  const who = input.customerName?.trim() || "익명 후원자";
  const supportUrl = `${site.url}/admin`;

  const kakaoText = [
    "💚 새 후원이 도착했어요",
    `금액: ${money}`,
    `후원자: ${who}${input.customerEmail ? ` (${maskEmail(input.customerEmail)})` : ""}`,
    input.productName ? `상품: ${input.productName}` : null,
    `주문번호: ${input.orderId.slice(0, 20)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const emailText = [
    `금액: ${money}`,
    `후원자: ${who}`,
    input.customerEmail ? `이메일: ${input.customerEmail}` : null,
    input.productName ? `상품: ${input.productName}` : null,
    `주문번호: ${input.orderId}`,
    "",
    `관리자: ${supportUrl}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const settled = await Promise.allSettled([
    sendEmailRaw(`[habitree 후원] ${money} — ${who}`, emailText),
    sendKakaoText(kakaoText, supportUrl, "관리자에서 보기"),
  ]);

  const results: ChannelResult[] = settled.map((s, i) =>
    s.status === "fulfilled"
      ? s.value
      : {
          channel: i === 0 ? "email" : "kakao",
          status: "failed",
          detail: String(s.reason).slice(0, 200),
        }
  );

  for (const r of results) {
    if (r.status === "sent") continue;
    await logActivity({
      action: `notify.${r.channel}`,
      level: r.status === "failed" ? "issue" : "info",
      targetType: "donation",
      targetId: input.orderId,
      message: `${r.status}: ${r.detail ?? ""}`,
    });
  }
  return results;
}

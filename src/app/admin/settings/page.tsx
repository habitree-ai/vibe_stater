import type { Metadata } from "next";
import { getChatSettings } from "@/lib/chat-settings";
import { Badge } from "@/components/ui/badge";
import { ChatSettingsForm } from "./ChatSettingsForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { sendTestNotification } from "./actions";
import { kakaoLinkStatus } from "@/lib/notify";

export const metadata: Metadata = { title: "연동설정" };

// 설정 화면은 항상 현재 env/DB 상태를 그대로 보여줘야 한다(캐시 금지).
export const dynamic = "force-dynamic";

// 키 앞 6자만 노출. 값 자체는 절대 화면에 내리지 않는다.
function mask(v: string | undefined): string {
  if (!v) return "—";
  return `${v.slice(0, 6)}…(${v.length}자)`;
}

type Integration = {
  name: string;
  purpose: string;
  ok: boolean;
  detail: string;
  envKey: string;
};

function collectIntegrations(): Integration[] {
  const openai = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const polar = process.env.POLAR_ACCESS_TOKEN;
  const resend = process.env.RESEND_API_KEY;
  const kakao = process.env.KAKAO_REST_API_KEY;

  return [
    {
      name: "OpenAI",
      purpose: "AI 챗봇 (/api/chat)",
      ok: Boolean(openai),
      detail: mask(openai),
      envKey: "OPENAI_API_KEY",
    },
    {
      name: "Supabase",
      purpose: "인증 · DB",
      ok: Boolean(supabaseUrl),
      detail: supabaseUrl ? new URL(supabaseUrl).hostname : "—",
      envKey: "NEXT_PUBLIC_SUPABASE_URL",
    },
    {
      name: "Supabase service_role",
      purpose: "관리자 조회 · 챗봇 설정 로드",
      ok: Boolean(serviceKey),
      detail: mask(serviceKey),
      envKey: "SUPABASE_SERVICE_ROLE_KEY",
    },
    {
      name: "Polar",
      purpose: "응원 키트 결제 (/api/donate)",
      ok: Boolean(polar),
      detail: mask(polar),
      envKey: "POLAR_ACCESS_TOKEN",
    },
    {
      name: "Resend",
      purpose: "문의 알림 메일 (doc/18)",
      ok: Boolean(resend),
      detail: mask(resend),
      envKey: "RESEND_API_KEY",
    },
    {
      name: "카카오톡",
      purpose: "문의 알림 '나에게 보내기' (doc/18)",
      ok: Boolean(kakao),
      detail: mask(kakao),
      envKey: "KAKAO_REST_API_KEY",
    },
  ];
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  // 접근 제어는 admin/layout.tsx의 requireAdmin()이 담당.
  const settings = await getChatSettings();
  const integrations = collectIntegrations();
  const kakaoLink = await kakaoLinkStatus();

  return (
    <section className="py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">연동설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          외부 서비스 연동 상태와 AI 챗봇 동작을 관리합니다.
        </p>
      </div>

      {success ? (
        <p className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {/* 1) 연동 상태 — 읽기전용 */}
      <h2 className="mt-10 font-heading text-lg font-semibold">연동 상태</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        API 키는 환경변수(.env.local / 배포 시크릿)에만 저장되며 DB에 기록하지 않습니다. 값을 바꾸려면
        환경변수를 수정한 뒤 재배포하세요.
      </p>
      <ul className="mt-4 space-y-2">
        {integrations.map((it) => (
          <li
            key={it.envKey}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${it.ok ? "bg-primary" : "bg-muted-foreground/40"}`}
                />
                <span className="text-sm font-medium">{it.name}</span>
                <Badge variant={it.ok ? "default" : "outline"}>{it.ok ? "연결됨" : "미설정"}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {it.purpose} · <code className="font-mono">{it.envKey}</code>
              </p>
            </div>
            <code className="shrink-0 font-mono text-xs text-muted-foreground">{it.detail}</code>
          </li>
        ))}
      </ul>

      {/* 1-2) 문의 알림 — 메일 + 카카오톡 */}
      <h2 className="mt-12 font-heading text-lg font-semibold">문의 알림</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        문의가 등록되면 운영자에게 메일과 카카오톡(나에게 보내기)으로 알립니다. 발송 실패는 접수를
        막지 않고 활동로그에 남습니다. 최초 카카오 연동 방법은 <code>doc/18_contact_notifications.md</code>{" "}
        참조.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={`size-2 rounded-full ${kakaoLink.linked ? "bg-primary" : "bg-muted-foreground/40"}`}
            />
            <span className="text-sm font-medium">카카오톡 연동</span>
            <Badge variant={kakaoLink.linked ? "default" : "outline"}>
              {kakaoLink.linked ? "연동됨" : "미연동"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{kakaoLink.detail}</p>
        </div>
        <form action={sendTestNotification}>
          <SubmitButton className="h-9 text-sm" pendingText="발송 중…">
            알림 테스트 발송
          </SubmitButton>
        </form>
      </div>

      {/* 2) 챗봇 설정 — 저장 시 즉시 반영 */}
      <h2 className="mt-12 font-heading text-lg font-semibold">AI 챗봇 설정</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        저장하면 다음 대화부터 즉시 반영됩니다(재배포 불필요).
        {settings.updatedAt
          ? ` 마지막 저장: ${new Date(settings.updatedAt).toLocaleString("ko-KR")}`
          : null}
      </p>

      <ChatSettingsForm
        model={settings.model}
        temperature={settings.temperature}
        maxTokens={settings.maxTokens}
        systemPrompt={settings.systemPrompt}
        enabled={settings.enabled}
      />
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/admin";
import { getChatSettings } from "@/lib/chat-settings";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "관리자 대시보드" };

export const dynamic = "force-dynamic";

// 관리자 첫 화면 — 처리할 일(신규 문의·커피챗)과 챗봇 상태를 한눈에.
// 접근 제어는 admin/layout.tsx의 requireAdmin()이 담당.

async function counts() {
  const service = createServiceClient();
  if (!service) return null;

  const [contactNew, contactAll, coffeeNew, subscribers] = await Promise.all([
    service.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    service.from("contact_messages").select("id", { count: "exact", head: true }),
    service
      .from("coffee_chat_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    service.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
  ]);

  return {
    contactNew: contactNew.count ?? 0,
    contactAll: contactAll.count ?? 0,
    coffeeNew: coffeeNew.count ?? 0,
    subscribers: subscribers.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const [c, settings] = await Promise.all([counts(), getChatSettings()]);
  const openaiReady = Boolean(process.env.OPENAI_API_KEY);

  return (
    <section className="py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">사이트 운영 현황을 한눈에 확인합니다.</p>
      </div>

      {c === null ? (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          서버 설정 오류(서비스 키 없음) — 집계를 불러올 수 없습니다.
        </p>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat href="/admin/contact" label="신규 문의" value={c.contactNew} sub={`전체 ${c.contactAll}건`} />
          <Stat href="/admin/coffee-chat" label="대기 커피챗" value={c.coffeeNew} sub="대기(pending)" />
          <Stat href="/admin/subscribers" label="구독자" value={c.subscribers} sub="뉴스레터" />
          <Stat href="/admin/logs" label="활동로그" value="→" sub="최근 기록 보기" />
        </div>
      )}

      {/* 챗봇 요약 */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-lg font-semibold">AI 챗봇</h2>
          <Badge variant={settings.enabled && openaiReady ? "default" : "outline"}>
            {!openaiReady ? "키 미설정" : settings.enabled ? "사용 중" : "중지됨"}
          </Badge>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          <Row k="모델" v={settings.model} />
          <Row k="temperature" v={String(settings.temperature)} />
          <Row k="최대 응답 길이" v={`${settings.maxTokens} 토큰`} />
          <Row k="기본지침" v={`${settings.systemPrompt.length}자`} />
        </dl>
        <Link
          href="/admin/settings"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          연동설정에서 변경 →
        </Link>
      </div>
    </section>
  );
}

function Stat({
  href,
  label,
  value,
  sub,
}: {
  href: string;
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-foreground/[0.02]"
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </Link>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 py-1 sm:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-mono text-xs">{v}</dd>
    </div>
  );
}

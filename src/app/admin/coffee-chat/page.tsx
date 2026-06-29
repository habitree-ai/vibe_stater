import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateCoffeeChatStatus } from "./actions";

export const metadata: Metadata = { title: "커피챗 신청 관리" };

const STATUS_OPTIONS = ["pending", "scheduled", "done", "canceled"] as const;
const statusLabel: Record<string, string> = {
  pending: "접수됨",
  scheduled: "일정 확정",
  done: "완료",
  canceled: "취소됨",
};

type CoffeeChatRow = {
  id: string;
  seq: number;
  name: string;
  email: string;
  topic: string | null;
  message: string | null;
  status: string;
  user_id: string | null;
  created_at: string;
};

export default async function AdminCoffeeChatPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  if (!isSupabaseConfigured) {
    redirect("/me?error=" + encodeURIComponent("Supabase가 설정되지 않았습니다."));
  }

  // 관리자 가드 ----------------------------------------------------
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?notice=" + encodeURIComponent("로그인이 필요합니다."));
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user!.id)
    .single();
  if (profile?.role !== "admin" || profile?.status !== "active") {
    redirect("/me?error=" + encodeURIComponent("관리자만 접근할 수 있습니다."));
  }

  // 전체 신청 목록(service_role로 RLS 우회) -------------------------
  const service = createServiceClient();
  let rows: CoffeeChatRow[] = [];
  if (service) {
    const { data } = await service
      .from("coffee_chat_requests")
      .select("id, seq, name, email, topic, message, status, user_id, created_at")
      .order("seq", { ascending: false });
    rows = (data as CoffeeChatRow[]) ?? [];
  }

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">커피챗 신청 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            전체 {rows.length}건 · 접수 {counts.pending ?? 0} · 확정 {counts.scheduled ?? 0} · 완료{" "}
            {counts.done ?? 0} · 취소 {counts.canceled ?? 0}
          </p>
        </div>
        <Link href="/me" className={buttonVariants({ variant: "outline" })}>
          마이페이지
        </Link>
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

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">아직 신청 내역이 없습니다.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      #{String(r.seq).padStart(4, "0")}
                    </span>
                    <span className="font-medium">{r.name}</span>
                    <Badge variant={r.status === "done" ? "default" : "secondary"}>
                      {statusLabel[r.status] ?? r.status}
                    </Badge>
                    {r.user_id ? null : <Badge variant="outline">비회원</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                  {r.topic ? <p className="text-sm">{r.topic}</p> : null}
                  {r.message ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{r.message}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>

                <form action={updateCoffeeChatStatus} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <select
                    name="status"
                    defaultValue={r.status}
                    className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel[s]}
                      </option>
                    ))}
                  </select>
                  <SubmitButton pendingText="변경 중…" className="h-9">
                    변경
                  </SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

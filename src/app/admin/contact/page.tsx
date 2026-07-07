import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateContactStatus } from "./actions";

export const metadata: Metadata = { title: "문의 인박스" };

const STATUS_OPTIONS = ["new", "read", "done"] as const;
const statusLabel: Record<string, string> = {
  new: "신규",
  read: "확인",
  done: "완료",
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  type: string | null;
  subject: string | null;
  message: string;
  status: string;
  user_id: string | null;
  created_at: string;
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  // 접근 제어는 admin/layout.tsx의 requireAdmin()이 담당.
  const service = createServiceClient();
  let rows: ContactRow[] = [];
  if (service) {
    const { data } = await service
      .from("contact_messages")
      .select("id, name, email, type, subject, message, status, user_id, created_at")
      .order("created_at", { ascending: false });
    rows = (data as ContactRow[]) ?? [];
  }

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">문의 인박스</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 {rows.length}건 · 신규 {counts.new ?? 0} · 확인 {counts.read ?? 0} · 완료{" "}
          {counts.done ?? 0}
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

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">아직 문의가 없습니다.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    <Badge variant={r.status === "done" ? "default" : "secondary"}>
                      {statusLabel[r.status] ?? r.status}
                    </Badge>
                    {r.type ? <Badge variant="outline">{r.type}</Badge> : null}
                    {r.user_id ? null : <Badge variant="outline">비회원</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="hover:underline">
                      {r.email}
                    </a>
                  </p>
                  {r.subject ? <p className="text-sm font-medium">{r.subject}</p> : null}
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>

                <form action={updateContactStatus} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <select
                    name="status"
                    defaultValue={r.status}
                    className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="문의 상태"
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

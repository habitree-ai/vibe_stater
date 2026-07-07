import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "활동 로그" };

const LEVELS = ["all", "info", "issue", "error"] as const;
const levelVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  info: "secondary",
  issue: "outline",
  error: "destructive",
};

type LogRow = {
  id: string;
  user_id: string | null;
  action: string;
  level: string;
  target_type: string | null;
  target_id: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;
  const activeLevel = level && LEVELS.includes(level as (typeof LEVELS)[number]) ? level : "all";

  // 접근 제어는 admin/layout.tsx의 requireAdmin()이 담당.
  const service = createServiceClient();
  let rows: LogRow[] = [];
  if (service) {
    let query = service
      .from("activity_logs")
      .select("id, user_id, action, level, target_type, target_id, message, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (activeLevel !== "all") query = query.eq("level", activeLevel);
    const { data } = await query;
    rows = (data as LogRow[]) ?? [];
  }

  return (
    <section className="py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">활동 로그</h1>
        <p className="mt-1 text-sm text-muted-foreground">최근 {rows.length}건 (최대 200)</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {LEVELS.map((lv) => (
          <Link
            key={lv}
            href={lv === "all" ? "/admin/logs" : `/admin/logs?level=${lv}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeLevel === lv
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {lv === "all" ? "전체" : lv}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">로그가 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-card p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={levelVariant[r.level] ?? "secondary"}>{r.level}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{r.action}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              {r.message ? <p className="mt-1.5">{r.message}</p> : null}
              {r.metadata && Object.keys(r.metadata).length > 0 ? (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {JSON.stringify(r.metadata)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

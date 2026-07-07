import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/admin";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "뉴스레터 구독자" };

type SubscriberRow = { id: string; email: string; created_at: string };

export default async function AdminSubscribersPage() {
  // 접근 제어는 admin/layout.tsx의 requireAdmin()이 담당.
  const service = createServiceClient();
  let rows: SubscriberRow[] = [];
  if (service) {
    const { data } = await service
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    rows = (data as SubscriberRow[]) ?? [];
  }

  return (
    <section className="py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">뉴스레터 구독자</h1>
          <p className="mt-1 text-sm text-muted-foreground">총 {rows.length}명</p>
        </div>
        {rows.length > 0 ? (
          <a
            href="/admin/subscribers/export"
            className={buttonVariants({ variant: "outline" })}
            download
          >
            CSV 내보내기
          </a>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">아직 구독자가 없습니다.</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">이메일</th>
                <th className="px-4 py-3 font-medium">구독일</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <a href={`mailto:${r.email}`} className="hover:underline">
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

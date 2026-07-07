// 뉴스레터 구독자 CSV 내보내기 — 관리자 전용 Route Handler.
import { getAdminUserId } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// CSV 셀 이스케이프(따옴표/콤마/줄바꿈 안전).
function cell(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET() {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return new Response("Forbidden", { status: 403 });
  }

  const service = createServiceClient();
  if (!service) {
    return new Response("Service unavailable", { status: 503 });
  }

  const { data, error } = await service
    .from("newsletter_subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Failed to fetch subscribers", { status: 500 });
  }

  const rows = (data as { email: string; created_at: string }[]) ?? [];
  const header = "email,created_at";
  const body = rows.map((r) => `${cell(r.email)},${cell(r.created_at)}`).join("\n");
  const csv = "﻿" + header + "\n" + body; // BOM: 엑셀 한글 인코딩 보정

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="newsletter_subscribers.csv"',
    },
  });
}

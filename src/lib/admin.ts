import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 관리자 판별 공용 유틸 — 페이지 가드/서버 액션 양쪽에서 재사용한다.
// (기존 admin/coffee-chat/actions.ts의 중복 구현을 여기로 통합.)

// 현재 로그인 사용자가 활성 관리자면 user.id, 아니면 null.
export async function getAdminUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin" || profile?.status !== "active") return null;
  return user.id;
}

// 관리자 페이지 가드 — 비로그인은 로그인으로, 비관리자는 /me로 돌려보낸다.
// 통과하면 관리자 user.id를 반환.
export async function requireAdmin(): Promise<string> {
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
  return user!.id;
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "@/app/auth/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "마이페이지" };

export default async function MePage() {
  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="font-heading text-xl font-bold">마이페이지</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Supabase가 아직 설정되지 않았습니다. <code>.env.local</code>에 키를 등록하면 활성화됩니다.
          </p>
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?notice=" + encodeURIComponent("로그인이 필요합니다."));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, role, status, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  const name = profile?.name ?? user.email?.split("@")[0] ?? "사용자";
  const email = profile?.email ?? user.email ?? "";
  const role = profile?.role ?? "user";
  const isAdmin = role === "admin";

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{name}</h1>
            {isAdmin ? <Badge>관리자</Badge> : <Badge variant="secondary">회원</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <form action={logout}>
          <button type="submit" className={buttonVariants({ variant: "outline" })}>
            로그아웃
          </button>
        </form>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        <Row label="이름" value={name} />
        <Row label="이메일" value={email} />
        <Row label="권한" value={isAdmin ? "관리자(admin)" : "회원(user)"} />
        <Row label="상태" value={profile?.status ?? "active"} />
      </dl>

      {isAdmin ? (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-semibold">관리자 영역</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            콘텐츠·상품·주문 관리 기능은 다음 단계(Step 4~)에서 연결됩니다.
          </p>
          <Link href="/" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            대시보드(준비 중) →
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

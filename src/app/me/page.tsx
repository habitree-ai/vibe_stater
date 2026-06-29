import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout, updateProfile } from "@/app/auth/actions";
import { cancelCoffeeChat } from "@/app/coffee-chat/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AvatarUploader } from "./AvatarUploader";

export const metadata: Metadata = { title: "마이페이지" };

export default async function MePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
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
  const avatarUrl = profile?.avatar_url ?? (user.user_metadata?.avatar_url as string | undefined) ?? "";

  // 내 커피챗 신청 내역(RLS: 본인 user_id만 조회 가능)
  const { data: coffeeChats } = await supabase
    .from("coffee_chat_requests")
    .select("id, topic, message, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabel: Record<string, string> = {
    pending: "접수됨",
    scheduled: "일정 확정",
    done: "완료",
    canceled: "취소됨",
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name}
              className="size-14 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="grid size-14 shrink-0 place-items-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight">{name}</h1>
              {isAdmin ? <Badge>관리자</Badge> : <Badge variant="secondary">회원</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className={buttonVariants({ variant: "outline" })}>
            로그아웃
          </button>
        </form>
      </div>

      {success ? (
        <p className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">{success}</p>
      ) : null}
      {error ? (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        <Row label="이름" value={name} />
        <Row label="이메일" value={email} />
        <Row label="권한" value={isAdmin ? "관리자(admin)" : "회원(user)"} />
        <Row label="상태" value={profile?.status ?? "active"} />
      </dl>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">내 정보 수정</h2>
        <p className="mt-1 text-sm text-muted-foreground">표시 이름과 프로필 이미지를 변경할 수 있습니다.</p>
        <form action={updateProfile} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={name}
              className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <AvatarUploader userId={user.id} initialUrl={avatarUrl} name={name} />
          <SubmitButton pendingText="저장 중…" className="h-11">
            저장
          </SubmitButton>
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">내 커피챗 신청 내역</h2>
          <Link href="/coffee-chat" className="text-sm font-medium text-primary hover:underline">
            새 신청 →
          </Link>
        </div>
        {coffeeChats && coffeeChats.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {coffeeChats.map((c) => (
              <li
                key={c.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium">
                    {c.topic || "주제 미입력"}
                  </p>
                  {c.message ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{c.message}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant={c.status === "done" ? "default" : "secondary"}>
                    {statusLabel[c.status] ?? c.status}
                  </Badge>
                  {c.status === "pending" ? (
                    <form action={cancelCoffeeChat}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-xs text-muted-foreground hover:text-destructive hover:underline"
                      >
                        신청 취소
                      </button>
                    </form>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            아직 신청 내역이 없습니다.{" "}
            <Link href="/coffee-chat" className="font-medium text-primary hover:underline">
              1:1 커피챗 신청하기
            </Link>
          </p>
        )}
      </div>

      {isAdmin ? (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-semibold">관리자 영역</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            커피챗 신청 현황을 확인하고 상태를 관리할 수 있습니다.
          </p>
          <Link
            href="/admin/coffee-chat"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            커피챗 신청 관리 →
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

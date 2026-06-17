import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { login } from "@/app/auth/actions";

export const metadata: Metadata = { title: "로그인" };

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20 sm:px-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">로그인</h1>
        <p className="text-sm text-muted-foreground">계정에 로그인하고 내 자료실을 확인하세요.</p>
      </div>

      {notice ? (
        <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">{notice}</p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      <form className="space-y-4" aria-label="로그인" action={login}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={fieldClass} />
        </div>
        <button type="submit" className={buttonVariants({ variant: "default", className: "h-11 w-full text-base" })}>
          로그인
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">회원가입</Link>
      </p>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { signup } from "@/app/auth/actions";

export const metadata: Metadata = { title: "회원가입" };

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20 sm:px-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight">회원가입</h1>
        <p className="text-sm text-muted-foreground">가입하고 무료 자료와 뉴스레터를 받아보세요.</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      <form className="space-y-4" aria-label="회원가입" action={signup}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">이름</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder="홍길동" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="6자 이상" className={fieldClass} />
        </div>
        <button type="submit" className={buttonVariants({ variant: "default", className: "h-11 w-full text-base" })}>
          가입하기
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">로그인</Link>
      </p>
    </section>
  );
}

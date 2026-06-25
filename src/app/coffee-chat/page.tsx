import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { submitCoffeeChat } from "./actions";

export const metadata: Metadata = {
  title: "1:1 커피챗 신청",
  description: "신청자가 모이면 추첨을 통해 무료로 1:1 커피챗 세션을 진행합니다.",
};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default async function CoffeeChatPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  let prefillName = "";
  let prefillEmail = "";
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      prefillEmail = user.email ?? "";
      prefillName = (user.user_metadata?.name as string) || (user.email?.split("@")[0] ?? "");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Coffee Chat"
        title={
          <>
            1:1 <span className="serif-accent text-primary">커피챗</span> 신청
          </>
        }
        subtitle="신청자 100명이 모이면 추첨을 통해, 원하시는 방식(온라인·오프라인)으로 무료 세션을 진행합니다."
      />

      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 md:py-20">
        {success ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
            <p className="font-heading text-xl font-semibold text-primary">신청이 접수되었습니다 ✦</p>
            <p className="mt-2 text-sm text-muted-foreground">
              추첨이 시작되면 입력하신 이메일로 안내드릴게요. 응원해 주셔서 감사합니다!
            </p>
            <a href="/" className={buttonVariants({ variant: "outline", className: "mt-5" })}>
              홈으로
            </a>
          </div>
        ) : (
          <form action={submitCoffeeChat} className="space-y-4" aria-label="커피챗 신청">
            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">이름</label>
                <input id="name" name="name" type="text" required defaultValue={prefillName} placeholder="홍길동" className={fieldClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">이메일</label>
                <input id="email" name="email" type="email" required defaultValue={prefillEmail} placeholder="you@example.com" className={fieldClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">관심 주제 <span className="text-muted-foreground">(선택)</span></label>
              <input id="topic" name="topic" type="text" placeholder="예: 바이브코딩으로 서비스 출시하기" className={fieldClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">하고 싶은 이야기 <span className="text-muted-foreground">(선택)</span></label>
              <textarea id="message" name="message" rows={5} placeholder="어떤 이야기를 나누고 싶으신가요?" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
            </div>
            <button type="submit" className={buttonVariants({ variant: "default", className: "h-11 w-full text-base" })}>
              커피챗 신청하기
            </button>
            <p className="text-center text-xs text-muted-foreground">신청은 무료이며, 추첨 결과는 이메일로 안내드립니다.</p>
          </form>
        )}
      </section>
    </>
  );
}

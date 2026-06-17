import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { newsletter } from "@/data/sample";
import { cn } from "@/lib/utils";

export function Newsletter() {
  return (
    <section id="newsletter" className="relative grain border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* 뉴스레터 구독 */}
          <Reveal>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="relative space-y-5">
                <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Newsletter
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  {newsletter.title}
                </h2>
                <p className="max-w-md text-muted-foreground">{newsletter.description}</p>
                <form className="flex flex-col gap-3 pt-1 sm:flex-row" aria-label="뉴스레터 구독">
                  <label htmlFor="newsletter-email" className="sr-only">
                    이메일 주소
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm outline-none backdrop-blur focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-12 px-7 text-base shadow-[0_0_30px_-8px_var(--primary)]"
                    )}
                  >
                    {newsletter.cta}
                  </button>
                </form>
                <p className="text-xs text-muted-foreground">
                  * 현재는 데모입니다. 구독 기능은 백엔드 연동 단계에서 활성화됩니다.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 문의 CTA */}
          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-center gap-5 rounded-3xl border border-border bg-card p-8 sm:p-10">
              <h3 className="font-heading text-2xl font-semibold tracking-tight">
                함께 만들 일이 <span className="serif-accent text-primary">있으신가요?</span>
              </h3>
              <p className="text-muted-foreground">
                강연·협업·컨설팅 등 어떤 제안이든 편하게 남겨주세요. 영업일 기준 2일 내에
                답변드립니다.
              </p>
              <div>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 px-7 text-base")}
                >
                  문의하기 →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

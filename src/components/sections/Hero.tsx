import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/sample";
import { cn } from "@/lib/utils";

const stack = ["Next.js", "Supabase", "Stripe", "Resend", "Vercel"];

export function Hero() {
  return (
    <section className="relative grain overflow-hidden">
      {/* 오로라 배경 */}
      <div className="aurora">
        <div className="aurora-orb left-[8%] top-[-6%] h-[34rem] w-[34rem] bg-primary/35" />
        <div
          className="aurora-orb right-[2%] top-[6%] h-[28rem] w-[28rem] bg-[oklch(0.7_0.16_195/0.35)]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="aurora-orb bottom-[-10%] left-[40%] h-[26rem] w-[26rem] bg-[oklch(0.62_0.17_280/0.28)]"
          style={{ animationDelay: "-12s" }}
        />
      </div>
      {/* 미세 그리드 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]"
      />

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-36 text-center sm:px-6 md:pt-44">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="text-primary">✦</span>
            LINKMAP으로 만든 서비스형 개인 플랫폼
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 font-heading text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
            AI 시대, 읽고 만들고
            <br />
            <span className="serif-accent text-gradient pr-2">연결하는</span>
            개인 플랫폼
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.bio}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#newsletter"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 px-7 text-base shadow-[0_0_40px_-8px_var(--primary)]"
              )}
            >
              무료 자료 받기
            </Link>
            <Link
              href="#projects"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "glass h-12 px-7 text-base"
              )}
            >
              서비스 둘러보기
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <dl className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {profile.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-10">
                {i > 0 ? <span className="h-8 w-px bg-border" /> : null}
                <div className="text-center">
                  <dd className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-0.5 text-xs text-muted-foreground">{stat.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* 글래스 브라우저 목업 */}
      <Reveal delay={120} className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="glass overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-amber-400/80" />
            <span className="size-3 rounded-full bg-emerald-400/80" />
            <div className="mx-auto rounded-md bg-foreground/5 px-4 py-1 font-mono text-xs text-muted-foreground">
              creator-link-hub.dev
            </div>
          </div>
          <div className="relative grid gap-4 bg-gradient-to-br from-background/40 to-primary/5 p-6 sm:grid-cols-3 sm:p-8">
            <div className="space-y-3 sm:col-span-2">
              <div className="h-3 w-24 rounded-full bg-primary/40" />
              <div className="h-7 w-3/4 rounded-lg bg-foreground/10" />
              <div className="h-7 w-1/2 rounded-lg bg-foreground/10" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 w-28 rounded-lg bg-primary/60" />
                <div className="h-8 w-24 rounded-lg bg-foreground/10" />
              </div>
            </div>
            <div className="grid gap-3">
              <div className="h-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/30 ring-1 ring-border" />
              <div className="h-20 rounded-xl bg-gradient-to-br from-accent/30 to-primary/10 ring-1 ring-border" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 px-6 py-3">
            {stack.map((s) => (
              <span key={s} className="font-mono text-xs text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/sample";
import { cn } from "@/lib/utils";

const chips = [
  { label: "LINKMAP · 원클릭 배포" },
  { label: "ReadTree · 독서 습관" },
];

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

      <div className="mx-auto max-w-4xl px-4 pb-12 pt-36 text-center sm:px-6 md:pt-44">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="text-primary">✦</span>
            코딩 몰라도 직접 만든 우리의 공간
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 font-heading text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
            AI 시대, 읽고 만들고
            <br />
            <span className="serif-accent text-gradient pr-2">연결하는</span>
            우리의 공간
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
              href="#resources"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 px-7 text-base shadow-[0_0_40px_-8px_var(--primary)]"
              )}
            >
              무료 자료 받기
            </Link>
            <Link
              href="#services"
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
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                <span className="size-1.5 rounded-full bg-primary" />
                {c.label}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
              함께 만드는 중
            </span>
          </div>
        </Reveal>

        <Reveal delay={380}>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">
            혼자 만든 서비스가 아니라, 같이 쓰고 같이 고치며{" "}
            <strong className="font-semibold text-foreground">함께 키워가는</strong> 도구들입니다.
          </p>
        </Reveal>
      </div>

      {/* 브라우저 목업 — linkmap.biz 랜딩(다크) */}
      <Reveal delay={120} className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <LinkmapLandingMockup />
      </Reveal>
    </section>
  );
}

function LinkmapLandingMockup() {
  const nav = ["원클릭 배포", "내 프로젝트", "가격", "서비스 탐색", "쇼케이스", "가이드"];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)]">
      {/* 브라우저 크롬 */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-amber-400/80" />
        <span className="size-3 rounded-full bg-emerald-400/80" />
        <div className="mx-auto rounded-md bg-zinc-800 px-4 py-1 font-mono text-xs text-zinc-400">
          🔒 linkmap.biz
        </div>
      </div>

      {/* 서비스 상단 내비 */}
      <div className="hidden items-center justify-between border-b border-zinc-800/80 px-5 py-3 sm:flex">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <span className="text-emerald-400">⠿</span> Linkmap
          </span>
          <nav className="flex items-center gap-3 text-xs text-zinc-400">
            {nav.map((n) => (
              <span key={n} className="whitespace-nowrap hover:text-zinc-200">
                {n}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-zinc-700 px-2 py-1 text-[0.65rem] text-zinc-400">
            검색 ⌘K
          </span>
          <span className="grid size-7 place-items-center rounded-full bg-emerald-500/90 text-xs font-bold text-white">
            h
          </span>
        </div>
      </div>

      {/* 히어로 본문 */}
      <div className="relative px-6 py-14 text-center sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.16),transparent)]"
        />
        <div className="relative space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" /> 바이브 코딩 플랫폼
          </span>
          <p className="text-sm font-medium text-zinc-500">초보자부터 개발자까지</p>
          <h3 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            한 플랫폼에서
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              서비스를 시각화하세요
            </span>
          </h3>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-400">
            Google 계정 하나면 GitHub 가입부터 홈페이지 배포까지 자동으로. 개발자는 서비스
            맵·환경변수·팀 협업까지 한곳에서 관리하세요.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
              🚀 3분 만에 내 홈페이지 만들기
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200">
              ▦ 내 프로젝트
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 pt-2 text-xs text-zinc-500">
            <span>✓ 무료 플랜</span>
            <span>✓ Google 계정만 있으면 OK</span>
            <span>✓ AES-256 암호화</span>
          </div>
        </div>
      </div>
    </div>
  );
}

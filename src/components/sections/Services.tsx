import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { liveServices, youtubeChannel, type LiveService } from "@/data/sample";
import { cn } from "@/lib/utils";

export function Services() {
  const [linkmap, readtree] = liveServices;

  return (
    <section id="services" className="relative grain border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              지금 운영 중인 <span className="serif-accent text-primary">실제 서비스</span>
            </>
          }
          description="직접 만들어 지금 운영 중인 실제 서비스입니다. 아래 버튼으로 라이브 서비스에 바로 접속해 보세요."
        />

        <div className="mt-14 space-y-20">
          {/* LINKMAP — 텍스트 좌 / 목업 우 */}
          <ServiceRow service={linkmap}>
            <LinkmapBoardMockup />
          </ServiceRow>

          {/* ReadTree — 목업 좌 / 텍스트 우 */}
          <ServiceRow service={readtree} reverse>
            <ReadTreeMockup />
          </ServiceRow>

          {/* YouTube 카드 */}
          <Reveal>
            <a
              href={youtubeChannel.url}
              target="_blank"
              rel="noreferrer"
              className="lift group flex items-center gap-5 rounded-2xl border border-border/70 bg-card p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-red-500/10 text-red-500">
                <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {youtubeChannel.name}
                  </h3>
                  <span className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                    {youtubeChannel.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{youtubeChannel.description}</p>
              </div>
              <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary">
                ↗
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  reverse = false,
  children,
}: {
  service: LiveService;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {/* 텍스트 */}
      <Reveal className={cn(reverse && "lg:order-2")}>
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> 서비스 · 라이브
          </span>
          <h3 className="font-heading text-4xl font-bold tracking-tight">{service.name}</h3>
          <a
            href={service.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {service.domain} ↗
          </a>
          <p className="max-w-md leading-relaxed text-muted-foreground">{service.description}</p>
          <ul className="space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="text-primary">✓</span>
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((t) => (
              <span key={t} className="text-xs font-medium text-primary/80">
                #{t}
              </span>
            ))}
          </div>
          <a
            href={service.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px_var(--primary)] transition-colors hover:bg-primary/90"
          >
            {service.name} 바로가기 ↗
          </a>
        </div>
      </Reveal>

      {/* 목업 */}
      <Reveal delay={100} className={cn(reverse && "lg:order-1")}>
        {children}
      </Reveal>
    </div>
  );
}

/* LINKMAP — 원클릭 배포 환경 보드 (다크) */
function LinkmapBoardMockup() {
  const side = ["전체 보기", "· myinvite", "· namecard", "내 프로젝트", "서비스 탐색", "가이드"];
  const templates = [
    { name: "링크카드", recommend: false },
    { name: "나만의 홈페이지", recommend: true },
    { name: "디지털 명함", recommend: false },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <div className="mx-auto rounded bg-zinc-800 px-3 py-0.5 font-mono text-[0.65rem] text-zinc-400">
          linkmap.biz · 원클릭 배포
        </div>
      </div>
      <div className="grid grid-cols-[7rem_1fr] text-xs">
        {/* 사이드바 */}
        <aside className="flex flex-col gap-1.5 border-r border-zinc-800 p-3">
          <span className="mb-1 flex items-center gap-1.5 font-display text-[0.8rem] font-semibold text-white">
            <span className="text-emerald-400">⠿</span> Linkmap
          </span>
          <span className="rounded-md bg-emerald-500/15 px-2 py-1 font-medium text-emerald-300">
            원클릭 배포
          </span>
          {side.map((s) => (
            <span key={s} className="px-2 py-1 text-zinc-500">
              {s}
            </span>
          ))}
          <span className="mt-auto flex items-center gap-1.5 pt-3 text-zinc-400">
            <span className="grid size-5 place-items-center rounded-full bg-emerald-500/90 text-[0.6rem] font-bold text-white">
              h
            </span>
            habitree
          </span>
        </aside>
        {/* 메인 */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
            <span className="text-zinc-300">@habitree-ai</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] text-emerald-300">
              연결됨
            </span>
          </div>
          <div>
            <p className="mb-1 text-[0.65rem] text-zinc-500">사이트 이름</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-200">
                mypage
              </div>
              <span className="rounded-lg bg-emerald-500 px-3 py-2 text-[0.7rem] font-semibold text-white">
                원클릭
              </span>
            </div>
            <p className="mt-1 text-[0.65rem] text-zinc-500">🌐 habitree-ai.github.io/mypage</p>
          </div>
          <div>
            <p className="mb-1.5 text-[0.65rem] text-zinc-500">템플릿 선택</p>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((t) => (
                <div
                  key={t.name}
                  className={cn(
                    "rounded-lg border p-2",
                    t.recommend
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  )}
                >
                  {t.recommend && (
                    <span className="mb-1 block text-[0.6rem] font-semibold text-emerald-400">
                      ★ 추천
                    </span>
                  )}
                  <div className="mb-2 h-6 rounded bg-zinc-800" />
                  <span className="text-[0.65rem] text-zinc-300">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ReadTree — 독서 대시보드 (다크) */
function ReadTreeMockup() {
  const side = ["홈", "기록", "독서", "내 기록", "프로필", "내 서재"];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <div className="mx-auto rounded bg-zinc-800 px-3 py-0.5 font-mono text-[0.65rem] text-zinc-400">
          readingtree.vercel.app
        </div>
      </div>
      <div className="grid grid-cols-[5.5rem_1fr_4.5rem] text-xs">
        {/* 사이드바 */}
        <aside className="flex flex-col gap-1.5 border-r border-zinc-800 p-3">
          <span className="mb-1 font-display text-[0.8rem] font-semibold text-emerald-400">
            ReadTree
          </span>
          {side.map((s, i) => (
            <span
              key={s}
              className={cn("px-1.5 py-1", i === 0 ? "text-emerald-300" : "text-zinc-500")}
            >
              {s}
            </span>
          ))}
        </aside>
        {/* 책 그리드 */}
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[0.6rem] text-emerald-300">
              Lv.2
            </span>
            <span className="text-[0.65rem] text-zinc-400">197P · 누적 기록</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div
                  className={cn(
                    "h-10 rounded",
                    [
                      "bg-emerald-700/50",
                      "bg-rose-700/40",
                      "bg-sky-700/40",
                      "bg-amber-700/40",
                    ][i % 4]
                  )}
                />
                <div className="h-1 w-3/4 rounded-full bg-zinc-800" />
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-2 text-[0.65rem] text-emerald-200">
            🌱 오늘의 독서 — 한 페이지가 한 걸음
          </div>
        </div>
        {/* 미니 캘린더 */}
        <div className="border-l border-zinc-800 p-2">
          <p className="mb-1.5 text-[0.6rem] text-zinc-500">독서 달력</p>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-sm",
                  i % 3 === 0 ? "bg-emerald-600/60" : "bg-zinc-800"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

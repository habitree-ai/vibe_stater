import { Reveal } from "@/components/ui/Reveal";

// 하위 페이지 공통 헤더 영역 (eyebrow + 제목 + 부제). 홈과 동일한 grain/glow 톤.
export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative grain overflow-hidden border-b border-border/60 bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground),transparent_95%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground),transparent_95%)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_80%_at_70%_0%,#000,transparent)]"
      />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-36">
        <Reveal className="max-w-2xl space-y-4">
          {eyebrow ? (
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary/50" />
              <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </span>
            </div>
          ) : null}
          <h1 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

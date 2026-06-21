import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resources, supportBanner, type Resource } from "@/data/sample";

export function Resources() {
  return (
    <section id="resources" className="relative border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <SectionHeading
          eyebrow="Resources"
          title={
            <>
              무료로 공개하는 <span className="serif-accent text-primary">교육 자료</span>
            </>
          }
          description="전자책·강의·1:1 커피챗까지, 모두 교육 목적으로 무료 공개합니다. 비용 대신, 도움이 되었다면 자율 후원으로 응원해 주세요."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {resources.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <ResourceCard resource={r} />
            </Reveal>
          ))}
        </div>

        {/* 후원 배너 */}
        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/30 bg-primary/[0.06] px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <div className="space-y-1">
              <h3 className="font-display text-base font-semibold tracking-tight">
                모든 자료와 서비스는 교육 목적의{" "}
                <span className="text-primary">무료 공개</span>입니다
              </h3>
              <p className="text-sm text-muted-foreground">{supportBanner.description}</p>
            </div>
            <Link
              href={supportBanner.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px_var(--primary)] transition-colors hover:bg-primary/90"
            >
              <span aria-hidden>♥</span> {supportBanner.cta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const isCoffee = resource.id === "coffeechat";
  const pct = resource.signup
    ? Math.round((resource.signup.current / resource.signup.total) * 100)
    : 0;
  return (
    <Link
      href={resource.href}
      className="lift gradient-border group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
    >
      {/* 상단 비주얼 */}
      <div className="relative grid aspect-[5/3] place-items-center overflow-hidden bg-gradient-to-br from-accent/40 via-card to-primary/10">
        {isCoffee ? (
          <span className="text-3xl opacity-70" aria-hidden>
            ☕
          </span>
        ) : (
          <span className="text-3xl opacity-30" aria-hidden>
            {resource.type === "전자책" ? "📘" : "🎬"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
          {resource.type}
        </Badge>
        <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
          {resource.name}
        </h3>
        <p className="text-sm text-muted-foreground">{resource.summary}</p>

        {resource.signup && (
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">신청 인원</span>
              <span className="font-semibold">
                {resource.signup.current}{" "}
                <span className="text-muted-foreground">/ {resource.signup.total}명</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{resource.signup.note}</p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> {resource.tag}
          </span>
          <span className="text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {resource.cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}

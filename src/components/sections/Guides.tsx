import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides, type Guide } from "@/data/guides";

// 메인페이지 "가이드/자료" 섹션 — Cloudflare 셋업·배포 가이드 노출.
export function Guides() {
  return (
    <section id="guides" className="relative border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <SectionHeading
          eyebrow="Guides"
          title={
            <>
              직접 따라 하는 <span className="serif-accent text-primary">셋업 가이드</span>
            </>
          }
          description="서비스 가입부터 배포까지, 마우스 포인터로 짚어 주는 단계별 매뉴얼과 영상."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {guides.map((guide, i) => (
            <Reveal key={guide.id} delay={i * 80}>
              <GuideCard guide={guide} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8" delay={160}>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform hover:translate-x-0.5"
          >
            모든 가이드 보기 →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href="/guides"
      className="lift gradient-border group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklch,var(--primary),transparent_82%),transparent_60%)]"
      />
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="border-border/80 bg-background/60 backdrop-blur">
          {guide.service}
        </Badge>
        <span className="text-xs font-medium text-primary/80">{guide.badge}</span>
      </div>

      <div className="mt-auto space-y-2 pt-8">
        <h3 className="font-display text-xl font-semibold tracking-tight">{guide.title}</h3>
        <p className="text-sm text-muted-foreground">{guide.summary}</p>
        <p className="pt-1 text-xs text-muted-foreground/80">
          {guide.steps}단계 · 영상 {guide.duration}
        </p>
      </div>
    </Link>
  );
}

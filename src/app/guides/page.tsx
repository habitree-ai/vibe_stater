import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "셋업 가이드",
  description:
    "서비스 가입부터 배포까지, 마우스 포인터로 짚어 주는 단계별 매뉴얼과 영상 모음.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title={
          <>
            셋업 <span className="serif-accent text-primary">가이드</span>
          </>
        }
        subtitle="서비스 가입부터 배포까지, 마우스 포인터로 따라 하는 단계별 매뉴얼과 영상."
      />
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        <div className="space-y-16">
          {guides.map((guide, i) => (
            <Reveal key={guide.id} delay={i * 60}>
              <article className="grid gap-8 md:grid-cols-2 md:items-center">
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-black shadow-lg">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full"
                    src={guide.videoHref}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border/80">
                      {guide.service}
                    </Badge>
                    <span className="text-xs font-medium text-primary/80">{guide.badge}</span>
                  </div>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground">{guide.summary}</p>
                  <p className="text-xs text-muted-foreground/80">
                    {guide.steps}단계 · 영상 {guide.duration}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={guide.manualHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:translate-y-[-1px]"
                    >
                      전체 매뉴얼 열기 ↗
                    </a>
                    <a
                      href={guide.videoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      영상만 보기
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 rounded-2xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
          <p>
            이 가이드의 화면은 각 서비스의 공식 문서 절차에 따라 재현(representative)한 것입니다.
            가입·인증 등 민감한 단계는 직접 진행하며, 자세한 제작 방식은 저장소의
            <code className="mx-1 rounded bg-background px-1.5 py-0.5">doc/service-setup/method_template.md</code>
            를 참고하세요.
          </p>
        </Reveal>
      </section>
    </>
  );
}

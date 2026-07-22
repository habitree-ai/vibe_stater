import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { education, educationModules, followAlong } from "@/data/sample";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "교육 — 바이브코딩 무작정 따라하기",
  description: education.description,
};

export default function EducationPage() {
  return (
    <>
      <PageHeader eyebrow="EDUCATION" title={education.title} subtitle={education.description} />

      {/* 지금 볼 수 있는 3편 — 실제 유튜브 재생목록 */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">지금 볼 수 있는 3편</h2>
          <a
            href={followAlong.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            유튜브 재생목록 전체 보기 ↗
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {followAlong.episodes.map((ep) => (
            <a
              key={ep.no}
              href={ep.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`}
                  alt={`영상 — ${ep.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                  ▶
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg font-bold italic text-primary">{ep.no}</span>
                  <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                    {ep.role}
                  </span>
                </div>
                <h3 className="font-heading text-base font-semibold leading-snug tracking-tight">
                  {ep.title}
                </h3>
                <p className="text-sm text-muted-foreground">{ep.short}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 전체 커리큘럼 로드맵 — 무엇을 배우는지 한눈에 */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-20">
        <h2 className="mb-2 font-heading text-2xl font-semibold tracking-tight">앞으로 다룰 내용</h2>
        <p className="mb-8 text-sm text-muted-foreground">
          앞 세 단계(계정·AI·배포)는 EP3에서 이미 다뤘어요. 나머지는 다음 편으로 순차 공개합니다.
        </p>
        <div className="grid gap-4">
          {educationModules.map((m) => (
            <Card key={m.step} className={cn(m.status === "planned" && "opacity-75")}>
              <CardContent className="flex items-start gap-5 py-2">
                <span className="font-heading text-2xl font-bold text-primary">{m.step}</span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold">{m.title}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.65rem] font-bold",
                        m.status === "done"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {m.status === "done" ? "공개됨 · EP3" : "다음 편 예정"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={followAlong.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "default", className: "h-11 px-6 text-base" })}
          >
            재생목록 전체 보기
          </a>
          <a
            href="https://linkmap.biz"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", className: "h-11 px-6 text-base" })}
          >
            LINKMAP으로 시작
          </a>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", className: "h-11 px-6 text-base" })}
          >
            교육 문의하기
          </Link>
        </div>
      </section>
    </>
  );
}

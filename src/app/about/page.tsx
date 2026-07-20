import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { profile, career } from "@/data/sample";

export const metadata: Metadata = {
  title: "소개",
  description: `${profile.name} 소개 — ${profile.tagline}`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            안녕하세요, <span className="serif-accent text-primary">{profile.name}</span>입니다
          </>
        }
        subtitle={profile.tagline}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          {/* ReadTree 캐릭터 — 메이커(남자) + 수달 마스코트 */}
          <div className="relative aspect-square max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-accent/40 ring-1 ring-border">
            <img
              src="/img/about-characters.png"
              alt="노트북 앞의 메이커 캐릭터와 책을 읽는 ReadTree 수달 마스코트"
              width={1200}
              height={1200}
              className="h-full w-full object-cover object-bottom"
            />
          </div>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-muted-foreground">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.keywords.map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="mb-8 font-heading text-2xl font-semibold tracking-tight">경력 / 이력</h2>
          <ol className="space-y-6">
            {career.map((c) => (
              <li key={c.period} className="grid gap-2 border-l-2 border-primary/40 pl-5 md:grid-cols-[160px_1fr] md:gap-6">
                <span className="text-sm font-medium text-muted-foreground">{c.period}</span>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/badge";
import {
  aboutInfo,
  aboutPage,
  career,
  liveServices,
  profile,
  youtubeChannel,
} from "@/data/sample";

export const metadata: Metadata = {
  title: "소개",
  description: `${profile.name} 소개 — ${profile.tagline}`,
};

// 소개 페이지에서 소개하는 '지금 운영 중인 것들' — 라이브 서비스 + 유튜브 채널
const proofItems = [
  ...liveServices.map((s) => ({
    name: s.name,
    domain: s.domain,
    url: s.url,
    desc: s.description,
  })),
  {
    name: youtubeChannel.name,
    domain: "youtube.com",
    url: youtubeChannel.url,
    desc: youtubeChannel.description,
  },
];

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

      {/* 인트로 — 캐릭터 + 인용 + 자기소개 + 키워드 + 소셜 */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-14">
          <Reveal className="relative mx-auto w-full max-w-sm md:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-accent/40 ring-1 ring-border">
              <img
                src="/img/about-characters.png"
                alt="노트북 앞의 메이커 캐릭터와 책을 읽는 ReadTree 수달 마스코트"
                width={768}
                height={768}
                className="h-full w-full object-cover object-bottom"
              />
            </div>
            {/* 말풍선 */}
            <span className="absolute -top-3 left-3 rounded-full border border-primary/25 bg-background px-3.5 py-1.5 text-xs font-medium text-primary shadow-sm">
              {aboutPage.intro.bubble}
            </span>
          </Reveal>

          <div className="space-y-7">
            <Reveal>
              <p className="font-heading text-xl font-medium leading-snug tracking-tight text-balance sm:text-2xl">
                “{aboutInfo.quote}”
              </p>
            </Reveal>

            <Reveal delay={80} className="space-y-4">
              {aboutPage.intro.paragraphs.map((p) => (
                <p key={p} className="text-base leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={140} className="flex flex-wrap gap-2">
              {profile.keywords.map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
            </Reveal>

            <Reveal delay={200} className="flex flex-wrap gap-2 pt-1">
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="lift inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium"
                >
                  {s.label}
                  <span className="text-muted-foreground">↗</span>
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 읽고 · 만들고 · 나누고 — 캐릭터 컷 3카드 */}
      <section className="grain border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow={aboutPage.makes.eyebrow}
            title={
              <>
                읽고, 만들고, <span className="serif-accent text-primary">나눕니다</span>
              </>
            }
            description={aboutPage.makes.description}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {aboutPage.makes.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <div className="flex h-40 items-end justify-center bg-gradient-to-b from-accent/30 to-transparent px-4">
                    <img
                      src={item.img}
                      alt={item.alt}
                      width={item.w}
                      height={item.h}
                      loading="lazy"
                      className="h-36 w-auto object-contain"
                    />
                  </div>
                  <div className="space-y-2 p-6 pt-4">
                    <h3 className="font-heading text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 지키는 약속 4가지 */}
      <section className="border-t border-border/60">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow={aboutPage.promises.eyebrow}
            title={
              <>
                이 네 가지는 <span className="serif-accent text-primary">지킵니다</span>
              </>
            }
            description={aboutPage.promises.description}
          />
          {/* 수달 장식 */}
          <img
            src="/img/about/otter-cheer.png"
            alt=""
            aria-hidden
            width={172}
            height={256}
            loading="lazy"
            className="pointer-events-none absolute right-4 top-2 hidden h-32 w-auto lg:block"
          />
          <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {aboutPage.promises.items.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} as="li">
                <div className="flex gap-4">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-base font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 지금 운영 중인 서비스 — 확인 가능한 근거 */}
      <section className="grain border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow={aboutPage.proof.eyebrow}
            title={
              <>
                직접 만들어, <span className="serif-accent text-primary">지금 운영 중</span>입니다
              </>
            }
            description={aboutPage.proof.description}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {proofItems.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="lift group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6"
                >
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-primary">
                    <span className="size-1.5 rounded-full bg-primary" /> 라이브
                  </span>
                  <h3 className="font-heading text-xl font-semibold tracking-tight">{s.name}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <span className="text-sm font-medium text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                    {s.domain} ↗
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 경력 / 이력 */}
      <section className="border-t border-border/60">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow={aboutPage.careerSection.eyebrow}
            title={
              <>
                <span className="serif-accent text-primary">지나온</span> 길
              </>
            }
            description={aboutPage.careerSection.description}
          />
          <img
            src="/img/about/otter-coffee.png"
            alt=""
            aria-hidden
            width={169}
            height={256}
            loading="lazy"
            className="pointer-events-none absolute right-6 top-6 hidden h-32 w-auto lg:block"
          />
          <ol className="mt-12 space-y-6">
            {career.map((c, i) => (
              <Reveal key={c.period} delay={i * 70} as="li">
                <div className="grid gap-2 border-l-2 border-primary/40 pl-5 md:grid-cols-[160px_1fr] md:gap-6">
                  <span className="text-sm font-medium text-muted-foreground">{c.period}</span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 자주 받는 질문 */}
      <section className="grain border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-14">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={aboutPage.faq.eyebrow}
                title={
                  <>
                    자주 받는 <span className="serif-accent text-primary">질문</span>
                  </>
                }
              />
              <Reveal delay={80} className="flex items-end gap-4">
                <img
                  src="/img/about/otter-idea.png"
                  alt=""
                  aria-hidden
                  width={229}
                  height={288}
                  loading="lazy"
                  className="h-36 w-auto shrink-0 object-contain"
                />
                <p className="pb-3 text-sm leading-relaxed text-muted-foreground">
                  {aboutPage.faq.note}
                </p>
              </Reveal>
            </div>
            <dl className="space-y-6">
              {aboutPage.faq.items.map((f, i) => (
                <Reveal key={f.q} delay={i * 70}>
                  <div className="rounded-2xl border border-border/70 bg-card p-6">
                    <dt className="font-heading text-base font-semibold tracking-tight">
                      Q. {f.q}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/70 bg-card px-6 py-10 text-center sm:flex-row sm:text-left">
              <img
                src="/img/about/otter-read.png"
                alt=""
                aria-hidden
                width={204}
                height={224}
                loading="lazy"
                className="h-28 w-auto shrink-0 object-contain"
              />
              <div className="flex-1 space-y-2">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance">
                  {aboutPage.cta.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {aboutPage.cta.desc}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                <a
                  href={aboutPage.cta.primary.href}
                  className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px_var(--primary)] transition-colors hover:bg-primary/90"
                >
                  {aboutPage.cta.primary.label}
                </a>
                <a
                  href={aboutPage.cta.secondary.href}
                  className="inline-flex items-center rounded-xl border border-border/70 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {aboutPage.cta.secondary.label}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

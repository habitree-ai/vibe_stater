import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/sample";

export function About() {
  return (
    <section id="about" className="relative border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.3fr] md:items-center">
          <Reveal className="relative">
            <div className="aspect-[4/5] max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-muted via-accent/30 to-primary/10 ring-1 ring-border" />
            <div className="glass absolute -bottom-5 -right-3 rounded-2xl px-5 py-3 shadow-lg md:-right-6">
              <p className="font-display text-sm font-semibold">최동혁 · Creator</p>
              <p className="text-xs text-muted-foreground">읽고 · 만들고 · 연결하다</p>
            </div>
          </Reveal>

          <div className="space-y-7">
            <Reveal className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary/50" />
              <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
                About
              </span>
            </Reveal>
            <Reveal delay={60}>
              <p className="font-heading text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
                코드를 몰라도 <span className="serif-accent text-primary">직접 만드는</span> 시대.
                저는 그 과정을 콘텐츠와 템플릿으로 정리합니다.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-prose leading-relaxed text-muted-foreground">{profile.bio}</p>
            </Reveal>
            <Reveal delay={180} className="flex flex-wrap gap-2">
              {profile.keywords.map((k) => (
                <Badge key={k} variant="outline" className="border-border/80 px-3 py-1">
                  {k}
                </Badge>
              ))}
            </Reveal>
            <Reveal delay={240}>
              <Link href="/about" className={buttonVariants({ variant: "outline" })}>
                더 알아보기 →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

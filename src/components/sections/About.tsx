import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { aboutInfo } from "@/data/sample";

export function About() {
  return (
    <section id="about" className="relative border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.95fr_1.1fr] md:gap-16">
          {/* 좌: 헤드라인 + 키워드 */}
          <div className="space-y-7">
            <Reveal className="flex items-center gap-2.5">
              <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
                {aboutInfo.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
                안녕하세요,
                <br />
                <span className="serif-accent text-gradient pr-2">바이브코딩 치트키</span>
                사람입니다
              </h2>
            </Reveal>
            <Reveal delay={120} className="flex flex-wrap gap-2">
              {aboutInfo.badges.map((b) => (
                <Badge key={b} variant="outline" className="border-border/80 px-3 py-1">
                  {b}
                </Badge>
              ))}
            </Reveal>
          </div>

          {/* 우: 인용 + 타임라인 */}
          <div className="space-y-8">
            <Reveal>
              <p className="font-heading text-2xl font-medium leading-snug tracking-tight text-balance sm:text-[1.75rem]">
                “AI가 답을 대신 써주는 시대일수록, 저는 더 많이{" "}
                <span className="text-primary">읽고 직접 만들어</span> 봅니다. 가르치기보다, 같이
                공부하며 배운 걸 나눕니다.”
              </p>
            </Reveal>

            <div className="space-y-0">
              {aboutInfo.timeline.map((item, i) => (
                <Reveal key={item.title} delay={(i + 1) * 80}>
                  <div className="grid gap-2 border-t border-border/60 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <span className="text-sm text-muted-foreground">{item.period}</span>
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

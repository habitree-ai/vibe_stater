import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { education, educationModules } from "@/data/sample";
import { cn } from "@/lib/utils";

export function EducationCTA() {
  return (
    <section id="education" className="border-t border-border/60 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="relative grain overflow-hidden rounded-[2rem] bg-[oklch(0.18_0.02_165)] px-6 py-16 text-[oklch(0.97_0.01_160)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)] sm:px-12 md:py-20">
            {/* 오로라 */}
            <div className="aurora">
              <div className="aurora-orb left-[-5%] top-[-20%] h-[24rem] w-[24rem] bg-primary/40" />
              <div
                className="aurora-orb right-[-5%] bottom-[-30%] h-[26rem] w-[26rem] bg-[oklch(0.6_0.17_280/0.45)]"
                style={{ animationDelay: "-8s" }}
              />
            </div>

            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur">
                  <span className="text-primary">✦</span> 바이브코딩 실습 과정
                </span>
                <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
                  나만의 서비스를
                  <br />
                  <span className="serif-accent text-gradient">직접 만들어</span> 보세요
                </h2>
                <p className="max-w-md leading-relaxed text-white/70">{education.description}</p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/education"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-12 bg-white px-7 text-base text-[oklch(0.18_0.02_165)] hover:bg-white/90 shadow-[0_0_40px_-8px_rgba(255,255,255,0.4)]"
                    )}
                  >
                    {education.cta}
                  </Link>
                  <Link
                    href="#projects"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
                    )}
                  >
                    LINKMAP 살펴보기
                  </Link>
                </div>
              </div>

              {/* 커리큘럼 미리보기 */}
              <div className="space-y-2.5">
                {educationModules.slice(0, 5).map((m) => (
                  <div
                    key={m.step}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition-colors hover:bg-white/10"
                  >
                    <span className="font-display text-lg font-semibold text-primary">{m.step}</span>
                    <div>
                      <p className="font-display text-sm font-semibold">{m.title}</p>
                      <p className="text-xs text-white/60">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { CardCover } from "@/components/ui/CardCover";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/sample";

export const metadata: Metadata = {
  title: "서비스",
  description: "LINKMAP, ReadTree, YouTube 등 제작/운영 중인 서비스와 프로젝트.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            서비스 & <span className="serif-accent text-primary">프로젝트</span>
          </>
        }
        subtitle="직접 만들고 운영하는 서비스를 LINKMAP으로 연결해 관리합니다."
      />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <Link
                href={project.url}
                {...(project.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="lift gradient-border group relative flex h-full min-h-[13rem] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
              >
                <CardCover cover={project.cover} fallbackMark="🧩" className="aspect-[16/10]" />
                <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="border-border/80 bg-background/60 backdrop-blur">
                    {project.category}
                  </Badge>
                  <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary">
                    {project.external ? "↗" : "→"}
                  </span>
                </div>
                <div className="mt-auto space-y-2 pt-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium text-primary/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

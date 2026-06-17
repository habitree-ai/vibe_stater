import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/data/sample";
import { cn } from "@/lib/utils";

export function Projects() {
  const [feature, ...rest] = projects;

  return (
    <section id="projects" className="relative grain border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              지금 만들고 있는 <span className="serif-accent text-primary">것들</span>
            </>
          }
          description="서비스와 콘텐츠를 LINKMAP으로 연결해 직접 운영합니다."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* 피처 타일 (大) */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <ProjectTile project={feature} featured />
          </Reveal>
          {rest.map((project, i) => (
            <Reveal key={project.id} delay={(i + 1) * 80}>
              <ProjectTile project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link
      href={project.url}
      {...(project.external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "lift gradient-border group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card",
        featured ? "min-h-[20rem] p-8" : "min-h-[9.5rem] p-6"
      )}
    >
      {/* 배경 비주얼 */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-80",
          featured
            ? "bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklch,var(--primary),transparent_80%),transparent_60%)]"
            : "bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklch,var(--accent),transparent_55%),transparent_60%)]"
        )}
      />
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="border-border/80 bg-background/60 backdrop-blur">
          {project.category}
        </Badge>
        <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary">
          {project.external ? "↗" : "→"}
        </span>
      </div>

      <div className="mt-auto space-y-2 pt-8">
        <h3 className={cn("font-display font-semibold tracking-tight", featured ? "text-3xl" : "text-xl")}>
          {project.name}
        </h3>
        <p className={cn("text-muted-foreground", featured ? "max-w-md text-base" : "text-sm")}>
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-primary/80">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

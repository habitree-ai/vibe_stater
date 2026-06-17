import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

// 섹션 공통 헤딩: eyebrow + 타이틀 + 설명.
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "flex items-center gap-2.5",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-primary/50" />
          <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        </div>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

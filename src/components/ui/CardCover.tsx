import type { Cover } from "@/data/sample";
import { cn } from "@/lib/utils";

// 카드 상단 비주얼 영역.
// cover가 있으면 이미지를, 없으면 브랜드 그라데이션 위에 이모지 마크를 띄운다.
// (빈 그라데이션만 남는 자리를 없애기 위한 공용 컴포넌트)
export function CardCover({
  cover,
  fallbackMark,
  className,
  imgClassName,
  children,
}: {
  cover?: Cover;
  fallbackMark?: string; // 이미지가 없을 때 띄울 이모지
  className?: string; // 비율 등 외부 지정 (예: aspect-[5/3])
  imgClassName?: string;
  children?: React.ReactNode; // 뱃지 등 오버레이
}) {
  const contain = cover?.fit === "contain";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-accent/40 via-card to-primary/10",
        className
      )}
    >
      {cover ? (
        <img
          src={cover.src}
          alt={cover.alt}
          loading="lazy"
          style={cover.position ? { objectPosition: cover.position } : undefined}
          className={cn(
            "absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.03]",
            contain ? "object-contain p-5" : "object-cover",
            imgClassName
          )}
        />
      ) : (
        fallbackMark && (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center text-3xl opacity-30"
          >
            {fallbackMark}
          </span>
        )
      )}

      {cover?.kicker && (
        <span className="absolute bottom-3 left-3 z-10 rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[0.7rem] font-medium text-foreground/80 backdrop-blur">
          {cover.kicker}
        </span>
      )}

      {children}
    </div>
  );
}

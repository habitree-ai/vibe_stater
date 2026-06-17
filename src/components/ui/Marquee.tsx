// 키워드/스택을 무한 흐름으로 보여주는 마퀴 밴드. (CSS 애니메이션, 서버 컴포넌트)
export function Marquee({ items }: { items: string[] }) {
  // 끊김 없는 루프를 위해 동일 트랙을 2번 렌더한다.
  const tracks = [0, 1];
  return (
    <div className="marquee py-2" aria-hidden>
      {tracks.map((t) => (
        <div className="marquee-track" key={t}>
          {items.map((item, i) => (
            <span
              key={`${t}-${i}`}
              className="flex items-center gap-3 font-display text-sm font-medium tracking-wide text-muted-foreground"
            >
              {item}
              <span className="text-primary/50">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

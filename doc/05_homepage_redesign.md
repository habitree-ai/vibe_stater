# 05. 메인페이지 프리미엄 리디자인 기획

> 목표: "비용이 크게 들어간 듯한" 고퀄리티 랜딩페이지. 최신 트렌드를 반영해 메인페이지를 전면 리뉴얼한다.
> 적용 범위: 홈(`/`)의 모든 섹션 + 헤더/푸터 + 디자인 시스템. 하위 페이지는 동일 토큰을 상속.

---

## 1. 디자인 컨셉

**Editorial × Tech Premium (에디토리얼 테크 프리미엄)**

- 큰 디스플레이 타이포 + 세리프 이탤릭 액센트로 "잡지/스튜디오" 무드.
- 절제된 오프화이트 배경 + 시그니처 emerald + 오로라 글로우(emerald·teal·violet) + 미세 그레인(noise).
- 글래스모피즘 카드, 그래디언트 보더, 베이토(bento) 그리드 등 2025–2026 트렌드.
- 스크롤 진입 애니메이션, 마퀴(흐르는 로고/키워드), 마이크로 인터랙션(hover lift/glow).
- 다크 드라마틱 밴드(교육 CTA)로 명암 대비 → 페이지 리듬.

## 2. 디자인 원칙

| 항목 | 방향 |
|---|---|
| 여백 | 과감하게(섹션 `py-28~36`), 콘텐츠 폭 `max-w-6xl`, 텍스트 `max-w-2xl` |
| 타이포 | Display(Space Grotesk) + Body(Pretendard/Geist) + Serif accent(Instrument Serif italic) |
| 컬러 | 오프화이트 베이스, emerald primary, teal/violet 보조 글로우, 잉크블랙 대비 섹션 |
| 모션 | CSS 키프레임(aurora-drift, float, gradient-shift, marquee) + 스크롤 Reveal(fade-up) |
| 질감 | grain overlay, soft shadow, ring-1 border, gradient border |
| 무드 | 신뢰감·정교함·여백의 미. 화려함보다 "정제된 비쌈" |

## 3. 폰트 시스템

| 역할 | 폰트 | 변수 |
|---|---|---|
| Display(헤드라인) | Space Grotesk | `--font-display` |
| Serif accent(이탤릭) | Instrument Serif | `--font-serif` |
| Body(한글/본문) | Pretendard → Geist fallback | `--font-sans` |
| Mono | Geist Mono | `--font-mono` |

## 4. 신규 CSS 유틸/모션 (globals.css)

- `.text-gradient` — emerald→teal 그래디언트 텍스트(animate)
- `.aurora` / `.aurora-orb` — 블러 그래디언트 오브(드리프트 애니메이션)
- `.grain` — SVG noise 오버레이
- `.glass` — 반투명 + backdrop-blur 카드
- `.gradient-border` — 그래디언트 테두리 카드
- `.marquee` / `.marquee-track` — 무한 흐름
- keyframes: `aurora-drift`, `float`, `gradient-shift`, `marquee`, `reveal-up`

## 5. 신규 컴포넌트

- `components/ui/Reveal.tsx` (client) — IntersectionObserver 기반 스크롤 진입 fade-up
- `components/ui/Marquee.tsx` — 키워드/스택 무한 흐름 밴드
- `components/ui/SectionHeading.tsx` — eyebrow + 타이틀 + 설명 공통

## 6. 섹션별 리디자인 명세

| 섹션 | 변경 핵심 |
|---|---|
| Header | 투명→스크롤 시 글래스, 알약형 내비, primary CTA 글로우 |
| Hero | 오로라+그레인 배경, 디스플레이 헤드라인(그래디언트/세리프 액센트), 알약 배지, 듀얼 CTA, 신뢰 지표 + 글래스 "브라우저 목업" 카드 |
| Marquee | 기술 스택/키워드 무한 흐름 밴드 (신규) |
| About | 2단 에디토리얼, 큰 인용형 소개, 키워드 칩, 통계 |
| Projects | **Bento 그리드**(1개 大 + 2개 小), 글로우 hover, 카테고리 태그 |
| Products | 그래디언트 보더 카드, 유형 알약, 가격 강조, hover lift |
| Posts | 에디토리얼 리스트(첫 글 大 피처드 + 나머지 컴팩트) |
| EducationCTA | **다크 잉크 밴드** + 오로라 + 그레인, 큰 카피, 라이트 CTA |
| Newsletter | 글래스 카드 2분할, 인풋 정제, 문의 CTA |
| Footer | 대형 워드마크, 컬럼 정리, 소셜, 미세 보더 |

## 7. 성능/구현 주의

- 서버 컴포넌트 유지. 모션은 CSS 우선, 스크롤 Reveal만 경량 client 컴포넌트.
- `prefers-reduced-motion` 존중(애니메이션 비활성 분기).
- 이미지 자산이 없으므로 그래디언트/그레인 placeholder로 고급감 연출(추후 실사로 교체).
- 다크모드 토큰은 유지하되 이번 리뉴얼은 라이트 기준 + 다크 밴드 섹션.

## 8. 검증
- `npm run build` 통과(타입/정적 생성).
- 홈 7개 섹션 + 마퀴 렌더, 모바일/데스크톱 반응형, reduced-motion 동작.

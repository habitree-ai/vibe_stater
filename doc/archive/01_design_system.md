> ⚠️ **SUPERSEDED — 이전 세대 디자인 문서입니다.** 디자인 정본은 `doc/14_homepage_v2_personality.md`(v2) + `src/app/globals.css`. 아래는 계보 참고 기록으로만 보존합니다.

# 01. 디자인 시스템

> Creator Link Hub 브랜드 디자인 토큰. `src/app/globals.css`와 Tailwind/shadcn 테마에 반영한다.

---

## 1. 브랜드 톤 & 매너

- **키워드:** AI 시대 · 읽고(Read) · 만들고(Build) · 연결한다(Link)
- **인상:** 신뢰감 있는 전문가, 깔끔하고 현대적, 약간의 테크 감성
- **레퍼런스 방향:** 개인 브랜드 + SaaS 랜딩(여백 넉넉, 큰 타이포, 카드 기반)

---

## 2. 컬러 팔레트

라이트 모드 기준. (shadcn은 HSL 변수를 사용)

| 역할 | 토큰 | 값(예시) | 용도 |
|---|---|---|---|
| Primary | `--primary` | `158 64% 40%` (Emerald) | 핵심 CTA, 강조 — "연결/성장" 상징 |
| Primary Foreground | `--primary-foreground` | `0 0% 100%` | Primary 위 텍스트 |
| Accent | `--accent` | `199 89% 48%` (Sky) | 보조 강조, 링크 |
| Background | `--background` | `0 0% 100%` | 페이지 배경 |
| Foreground | `--foreground` | `222 47% 11%` | 본문 텍스트 |
| Muted | `--muted` | `210 40% 96%` | 섹션 구분 배경 |
| Muted Foreground | `--muted-foreground` | `215 16% 47%` | 보조 텍스트 |
| Border | `--border` | `214 32% 91%` | 카드/구분선 |

> 다크 모드는 후속 단계에서 추가(`.dark` 변수). MVP는 라이트 우선.

---

## 3. 타이포그래피

| 항목 | 설정 |
|---|---|
| 본문 폰트 | Pretendard (한글) / Inter (영문·숫자) fallback |
| 코드 폰트 | JetBrains Mono / monospace |
| H1 (Hero) | 3rem~3.75rem, bold, tracking-tight |
| H2 (섹션 제목) | 2rem~2.5rem, semibold |
| H3 (카드 제목) | 1.25rem, semibold |
| Body | 1rem, leading-relaxed |
| Caption | 0.875rem, muted-foreground |

> Next.js `next/font`로 Inter 로드. Pretendard는 CDN/로컬 중 택1(스캐폴딩 시 결정, 미적용 시 system-ui fallback).

---

## 4. 간격 · 형태

| 항목 | 값 |
|---|---|
| 컨테이너 최대폭 | `max-w-6xl` (1152px) |
| 섹션 상하 패딩 | `py-16 md:py-24` |
| 카드 라운드 | `--radius: 0.75rem` (rounded-xl) |
| 그림자 | 카드 hover 시 `shadow-md` 정도, 과하지 않게 |
| 그리드 간격 | `gap-6 md:gap-8` |

---

## 5. 컴포넌트 규칙 (shadcn/ui 기반)

| 컴포넌트 | 용도 |
|---|---|
| `Button` | CTA(primary/outline/ghost) |
| `Card` | 프로젝트·상품·콘텐츠 카드 |
| `Badge` | 상품 유형(전자책/강의/템플릿/컨설팅), 콘텐츠 태그 |
| `Separator` | 섹션/푸터 구분 |
| `NavigationMenu` | 헤더 내비게이션 |

### 버튼 위계
1. **Primary** — 핵심 전환(구매/회원가입/뉴스레터 구독)
2. **Outline** — 보조(자세히 보기, 더 보기)
3. **Ghost/Link** — 내비, 텍스트 링크

---

## 6. 반응형 브레이크포인트 (Tailwind 기본)

| 접두사 | 최소폭 | 레이아웃 |
|---|---|---|
| (기본) | 모바일 | 1열 |
| `md` | 768px | 2열 |
| `lg` | 1024px | 3열(프로젝트/상품/콘텐츠 그리드) |

모바일 우선으로 작성하고 `md`/`lg`에서 다열로 확장한다.

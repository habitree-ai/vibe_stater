# 02. 메인페이지(공개 홈) 상세 기획

> 마스터 기획서 8.1을 확장한 섹션별 구현 명세. URL: `/` (공개)
> 데이터는 모두 `src/data/sample.ts`에서 주입(UI 우선). 컴포넌트는 `src/components/sections/*`.

---

## 페이지 구조 개요

| # | 섹션 | 컴포넌트 | 데이터 소스 | 핵심 CTA |
|---|---|---|---|---|
| 0 | 헤더(고정) | `layout/Header` | nav 정적 | 로그인 / 시작하기 |
| 1 | Hero | `sections/Hero` | `profile` | 무료 자료 받기 / 서비스 보기 |
| 2 | 소개(About) | `sections/About` | `profile` | 더 알아보기 → /about |
| 3 | 핵심 프로젝트 | `sections/Projects` | `projects[]` | 프로젝트별 외부/상세 링크 |
| 4 | 판매 상품 | `sections/Products` | `products[]` | 자세히 보기 → /products/[slug] |
| 5 | 최신 콘텐츠 | `sections/Posts` | `posts[]` | 더 보기 → /posts |
| 6 | 교육 CTA | `sections/EducationCTA` | 정적 | 바이브코딩 시작하기 |
| 7 | 뉴스레터/문의 | `sections/Newsletter` | 정적 | 구독하기 / 문의하기 |
| 8 | 푸터 | `layout/Footer` | 정적 | 소셜·정책 링크 |

---

## 1. Hero
- **헤드라인:** "AI 시대, 읽고 만들고 연결하는 개인 플랫폼"
- **서브:** 최동혁의 전자책·강의·템플릿과 LINKMAP/ReadTree 서비스를 한 곳에서.
- **구성:** 좌측 텍스트(H1 + 서브 + 버튼 2개), 우측 비주얼(그라데이션 카드 또는 프로필 일러스트 placeholder)
- **CTA:** Primary "무료 자료 받기"(→ #newsletter or /resources), Outline "서비스 둘러보기"(→ #projects)
- **부가:** 신뢰 지표(누적 독자/구독자/제작 사례 숫자 — 샘플 값)

## 2. 소개(About)
- **제목:** "안녕하세요, 최동혁입니다"
- **구성:** 짧은 자기소개(2~3문장) + 키워드 뱃지(AI·바이브코딩·독서·서비스 기획) + 핵심 이력 3줄
- **CTA:** Outline "더 알아보기" → /about

## 3. 핵심 프로젝트 (Projects)
- **제목:** "지금 만들고 있는 것들"
- **카드 3개(`Card`):** LINKMAP / ReadTree / YouTube
  - 각 카드: 아이콘/썸네일, 이름, 한줄 설명, 태그 뱃지, 링크(외부 ↗ 또는 상세)
- **레이아웃:** `grid md:grid-cols-3 gap-6`

## 4. 판매 상품 (Products)
- **제목:** "바로 활용하는 자료"
- **카드 4개:** 전자책 / 강의 / 템플릿 / 컨설팅
  - 각 카드: 썸네일, 유형 `Badge`, 상품명, 한줄 설명, 가격(KRW 포맷), "자세히 보기" 버튼
- **레이아웃:** `grid sm:grid-cols-2 lg:grid-cols-4 gap-6`
- **가격 포맷:** `₩{price.toLocaleString('ko-KR')}` (무료는 "무료")

## 5. 최신 콘텐츠 (Posts)
- **제목:** "최근 글과 영상"
- **카드 3개:** 블로그/유튜브 정리 글
  - 각 카드: 커버 이미지, 태그, 제목, 요약, 날짜
- **CTA:** Outline "전체 보기" → /posts

## 6. 교육 CTA (EducationCTA)
- **배경:** muted 또는 primary 톤 강조 밴드
- **카피:** "바이브코딩으로 나만의 서비스를 직접 만들어보세요"
- **부가:** LINKMAP 템플릿으로 Supabase·Stripe·Resend까지 연결하는 실습 과정 안내
- **CTA:** Primary "교육 과정 보기" → /education(추후)

## 7. 뉴스레터 / 문의 (Newsletter)
- **2분할:** 좌측 뉴스레터 구독(이메일 input + 구독 버튼, 현재는 정적/비제출), 우측 문의 안내(버튼 → /contact)
- **카피:** "새 글·자료·강의 소식을 가장 먼저 받아보세요"

## 8. 푸터 (Footer)
- 로고 + 한줄 소개
- 컬럼: 소개/콘텐츠/서비스/상품 링크 모음
- 소셜: YouTube, GitHub, ReadTree, LINKMAP
- 하단: © 2026 최동혁 · 이용약관 · 개인정보처리방침

---

## 내비게이션(헤더) 메뉴
| 라벨 | 링크 | 상태 |
|---|---|---|
| 소개 | /about | 추후 |
| 콘텐츠 | /posts | 추후 |
| 서비스 | /projects | 추후 |
| 상품 | /products | 추후 |
| 교육 | /education | 추후 |
| 문의 | /contact | 추후 |
| 로그인 | /login | 추후 |
| 시작하기(Primary) | /signup | 추후 |

> 현재 단계에서는 미구현 라우트로의 링크는 `href`만 두고(404 가능) 메인페이지 렌더에 집중. 앵커(#newsletter 등) 위주로 동작.

## 구현 체크리스트
- [ ] 모든 섹션 모바일 1열 → md/lg 다열 반응형
- [ ] 색상/간격은 디자인 정본([`14_homepage_v2_personality.md`](./14_homepage_v2_personality.md) + `globals.css`) 토큰 사용
- [ ] 이미지 없는 항목은 그라데이션/이니셜 placeholder
- [ ] 시맨틱 태그(`<section>`, `<nav>`, `<footer>`) + 기본 a11y(alt, aria-label)

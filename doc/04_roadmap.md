# 04. 실행 로드맵

> 마스터 기획서 11·12장을 실행 단위로 재구성. 각 단계의 산출물·체크리스트.
> **현재 위치(2026-07)**: Step 0~4·6 대부분 완료, **Vercel 배포 운영 중**(`vibe.habitree.io`). 다음: 문서 통합 마스터 확정 · Step 5(커머스 판매) · Step 7(교육화).
> ⚠️ 이 문서 작성 당시 결제=Stripe·배포=Cloudflare로 적혔으나, 실제는 **결제=Polar·배포=Vercel**. 전환 경위는 [`WORKLOG.md`](./WORKLOG.md)(2026-07-22), 원본 대비 변경은 마스터 [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md) 부록 참조.
> 관련: 디자인 [`14_homepage_v2_personality.md`](./14_homepage_v2_personality.md) · 배포 [`13_vercel_deployment.md`](./13_vercel_deployment.md) · 서비스 셋업 [`service-setup/README.md`](./service-setup/README.md)

---

## Step 0. 개발 환경 세팅 ✅
- [x] Node.js LTS + Git 설치 (winget) — node v24.16.0 / git 2.54.0
- [ ] VS Code 확장 설치
- [ ] 외부 서비스 가입은 백엔드 단계 직전까지 보류
- 산출물: 동작하는 로컬 개발 환경 · `doc/00_setup_guide.md`

## Step 1. 메인페이지 UI (샘플 데이터) ✅
- [x] Next.js 16 + Tailwind v4 + shadcn/ui 스캐폴딩
- [x] `src/data/sample.ts` 샘플 데이터
- [x] Header/Footer + 7개 섹션 구현
- [x] 반응형/접근성 점검, 로컬 실행
- 산출물: `/` 메인페이지, `doc/02·03` 기반 컴포넌트

## Step 2. 정적 하위 페이지 확장 ✅
- [x] /about, /projects, /products(목록), /posts(목록) — 샘플 데이터로
- [x] 상품 상세 `/products/[slug]`(기획서 8.2 구조, SSG)
- [x] 글 상세 `/posts/[slug]`(문단 렌더, SSG)
- [x] /education, /contact, /login, /signup 골격
- 산출물: 사이트맵(기획서 4.1)의 공개 영역 골격 (총 19개 라우트)

## Step 3. 인증 + DB 연동 (Supabase) ✅
- [x] Supabase 프로젝트(`ofxzkwbqwpsjoeqjhrpl`), `profiles` + RLS + 가입 트리거
- [x] 회원가입/로그인 (`/login`·`/signup`·`/auth/callback`)
- [x] 관리자 권한 구분(role) + `/me` 마이페이지(아바타 업로드)
- [x] 마이그레이션 0001~0015 적용
- 산출물: 회원 기능, 관리자 허브 `/admin/*`

## Step 4. 콘텐츠/자료 — 부분
- [x] `/posts`·`/products` 목록/상세(현재 샘플 데이터 기반 SSG)
- [ ] posts/tags/assets DB CRUD + Storage 업로드/다운로드
- [ ] 공개/회원/구매자 가시성(visibility) 처리
- 산출물: 블로그·자료실(콘텐츠는 정적, DB화는 다음)

## Step 5. 상품/결제 — 현재 = 후원(Polar), 판매는 계획
- [x] **후원 결제(Polar)**: `/support`·`/api/donate`·`/api/polar-webhook`·`donations` 테이블
- [ ] (계획) products CRUD + Polar 상품 판매/체크아웃 → orders/entitlements
- [ ] (계획) 구매자 자료실 `/me/library`
- 산출물: **현재는 자율 후원 모델**. 유료 상품 판매 파이프라인은 미구현
- ⚠️ 기획 원안은 Stripe였으나 실제 구현은 **Polar**(SDK 없이 raw fetch)

## Step 6. 운영/전환 — 대부분 완료
- [x] 문의/상담 `/contact` + `contact_messages` (+ 메일·카카오톡 알림, `18` 참조)
- [x] 뉴스레터 구독 `/api/newsletter` + `newsletter_subscribers`
- [x] 1:1 커피챗 `/coffee-chat` + 관리자 관리
- [x] AI 챗봇 `/api/chat`(**OpenAI** `gpt-4o-mini`, 설정 DB `chat_settings`)
- [ ] (미도입) PostHog 등 분석
- [ ] (계획) LINKMAP 서비스맵 공개 페이지

## Step 7. 교육화 / 템플릿화
- [ ] 각 구축 과정을 강의 모듈로 분리
- [ ] LINKMAP 체크리스트화 + 템플릿 패키징
- [ ] YouTube/ReadTree CTA 연결
- 산출물: Creator Business Platform Template 상품

---

## 우선순위 매핑 (기획서 12장 백로그)
| 단계 | 백로그 ID |
|---|---|
| Step 1 | T-004(홈 IA) |
| Step 3 | T-001~T-003 |
| Step 4 | T-005, T-007 |
| Step 5 | T-006, T-008~T-010 |
| Step 6 | T-011~T-014 |
| Step 7 | T-015 |

## 문서 인덱스
- 마스터: `linkmap_personal_platform_plan.md`
- 00 환경 세팅 / 01 디자인 시스템 / 02 메인페이지 / 03 샘플 콘텐츠 / 04 로드맵(본 문서)

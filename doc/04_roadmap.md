# 04. 실행 로드맵

> 마스터 기획서 11·12장을 실행 단위로 재구성. 각 단계의 산출물·체크리스트.
> 현재 위치: **Step 2 완료 + 프리미엄 리디자인 + 배포/셋업 문서화**. 다음: git/GitHub → Cloudflare 배포 → Step 3(Supabase 인증/DB).
> 관련: 디자인 [`05_homepage_redesign.md`](./05_homepage_redesign.md) · 배포 [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) · 서비스 셋업 [`service-setup/README.md`](./service-setup/README.md)

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

## Step 3. 인증 + DB 연동 (Supabase)
- [ ] Supabase 프로젝트, `profiles` + RLS(기획서 6.1, 13장)
- [ ] 회원가입/로그인/비밀번호 재설정
- [ ] 관리자 권한 구분(role)
- [ ] 샘플 데이터 → DB 테이블로 점진 이전
- 산출물: 회원 기능, 마이페이지 `/me` 골격

## Step 4. 콘텐츠/자료 (posts·tags·assets)
- [ ] posts/tags CRUD, 관리자 글 작성
- [ ] assets + Supabase Storage 업로드/다운로드
- [ ] 공개/회원/구매자 가시성(visibility) 처리
- 산출물: 블로그·자료실, 관리자 콘텐츠 관리

## Step 5. 상품/결제 (Stripe)
- [ ] products CRUD, Stripe Product/Price 연동
- [ ] Stripe Checkout + Webhook(`checkout.session.completed`)
- [ ] orders/payments/user_entitlements 생성
- [ ] 구매자 자료실 `/me/library`
- 산출물: 단건 결제 → 권한 부여 → 다운로드 전체 흐름

## Step 6. 운영/전환
- [ ] 문의/상담 `/contact` + inquiries
- [ ] 뉴스레터 구독 + Resend 발송
- [ ] PostHog 이벤트 추적
- [ ] LINKMAP 서비스맵 공개 페이지
- 산출물: 리드·뉴스레터·분석·공개 사례

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

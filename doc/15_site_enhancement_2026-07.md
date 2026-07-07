# 15. 사이트 전면 고도화 (2026-07)

> 운영 시작 후 전체 사이트를 감사해 **관리자 데이터 허브 · SEO/내비 필수 · 기술 위생** 3갈래를 고도화한 기록.
> 관련: [`WORKLOG.md`](./WORKLOG.md) · [`13_vercel_deployment.md`](./13_vercel_deployment.md)

## 배경 (왜)

마이페이지·커피챗·문의·뉴스레터를 실동작화한 뒤, 3개 병렬 감사(UX/관리자·데이터/기술)로 다음을 확인했다.

1. **수집만 되고 안 보이는 데이터** — `contact_messages`·`newsletter_subscribers`·`activity_logs`·`profiles`가 쌓이지만 관리자 화면이 커피챗 하나뿐. 관리자 가드 중복.
2. **내비/SEO 기본 결여** — 내비가 홈 앵커(`/#about`)로만 연결, 모바일 햄버거 없음, Footer가 없는 `/terms`·`/privacy`로 연결(깨진 링크), `error/not-found/sitemap/robots` 전무, OG·favicon 없음.
3. **기술 부채** — `middleware→proxy` deprecation, Vercel 배포인데 Cloudflare 설정 잔재, `layout` Supabase 호출 무방비, 기본 svg 잔재.

## 적용 범위

### Track A — 관리자 데이터 허브
- `src/lib/admin.ts` 신규: `getAdminUserId()`·`requireAdmin()` 공용 가드(중복 통합).
- `src/app/admin/layout.tsx` 신규: 가드 1곳 + 관리자 내비(커피챗/문의/구독자/활동로그). 하위 페이지의 개별 가드 제거.
- `src/app/admin/contact/` — 문의 인박스(목록·상태 new/read/done 변경).
- `src/app/admin/subscribers/` — 뉴스레터 구독자 목록 + `export/route.ts` CSV(BOM 포함) 내보내기.
- `src/app/admin/logs/` — `activity_logs` 뷰어(level 필터, 최근 200건). 처음으로 가시화.
- **DB 스키마 변경 없음** — 모두 기존 컬럼 읽기(service_role). `admin_notes`·`assigned_to`·`scheduled_at` 등은 후속.

### Track B — 사이트/SEO 필수
- `src/lib/site.ts` — 내비·푸터를 **전용 페이지**로 연결(`/about`·`/posts`·`/projects`·`/products`·`/education`·`/contact`·`/coffee-chat`).
- `src/components/layout/Header.tsx` — 모바일 햄버거 + 드로어(라우트 이동 시 닫힘).
- `src/app/terms/`·`src/app/privacy/` — 플레이스홀더(깨진 Footer 링크 해소). **내용은 사용자 검토 후 정식화 필요.**
- `src/app/error.tsx`·`src/app/not-found.tsx` — 브랜드 톤 에러/404.
- `src/app/sitemap.ts`·`src/app/robots.ts` — 공개 라우트 sitemap(+posts/products 슬러그), `/admin`·`/me`·`/auth`·`/api` 차단.
- `src/app/layout.tsx` — `metadataBase`·OpenGraph·Twitter 카드. `src/app/icon.tsx`(파비콘)·`src/app/opengraph-image.tsx`(OG)를 `ImageResponse`로 동적 생성(바이너리 불필요).

### Track C — 기술 위생
- `src/middleware.ts` → `src/proxy.ts`(함수 `middleware`→`proxy`, matcher 유지). Next 16 규약. deprecation 경고 제거.
- Cloudflare 잔재 제거: `wrangler.jsonc`·`open-next.config.ts`·`public/_headers` 삭제, `next.config.ts` init 제거, `package.json`에서 `preview/deploy/upload/cf-typegen` 스크립트 + `@opennextjs/cloudflare`·`wrangler` 의존성 제거(`npm install`로 362패키지 정리), `scripts/ship.ps1` Vercel 안내로 수정.
- `src/app/layout.tsx` — `getUser()` try-catch(단, `unstable_rethrow`로 프레임워크 제어 에러는 재throw).
- 기본 svg 정리: `public/{next,vercel,window,file,globe}.svg` 삭제.

## 검증
- `npm run build` 통과: middleware 경고 없음, `Proxy` 인식, `/admin/*`·`/terms`·`/privacy`·`/sitemap.xml`·`/robots.txt`·`/icon`·`/opengraph-image` 생성.
- 배포: `main` push → Vercel 자동 배포(`vibe.habitree.io`).

## 후속(이번 제외)
- **이메일 알림(Resend)** — 키 미발급으로 보류. 커피챗·문의 접수 시 관리자 메일 발송.
- 관리자 데이터 모델 확장(`admin_notes`·`assigned_to`·`scheduled_at`·구독자 `status/source`).
- 콘텐츠 페이지 검색/필터/관련항목, 계정 설정·탈퇴, 정식 약관·개인정보 문구.

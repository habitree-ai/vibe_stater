# 작업·이슈·데이터 로그 (WORKLOG)

> 운영 중 발생한 변경/이슈/데이터 흐름을 간단히 기록해 이후 문제 발생 시 추적할 수 있게 한다.
> - **앱 런타임 로그**: `activity_logs` 테이블(Supabase) + 서버 콘솔(`[activity]` prefix). 기록 헬퍼 `src/lib/log.ts`.
> - **이 문서**: 사람이 읽는 변경/이슈 기록(상위 기록). 날짜 내림차순.

## 로그 레벨
- `info` — 정상 이벤트(로그인, 커피챗 신청 등)
- `issue` — 사용자/입력 오류 등 비정상이지만 예상된 흐름(로그인 실패 등)
- `error` — 시스템 오류(DB insert 실패 등). 서버 콘솔 `console.error`에도 남김.

## 기록되는 액션(action) 목록
| action | level | 위치 | 설명 |
|---|---|---|---|
| `auth.login` | info/issue | `auth/actions.ts` | 이메일 로그인 성공/실패 |
| `auth.signup` | info/issue | `auth/actions.ts` | 회원가입 성공/실패 |
| `auth.logout` | info | `auth/actions.ts` | 로그아웃 |
| `account.update_name` | info/issue | `auth/actions.ts` | (구) 표시 이름 변경 |
| `account.update_profile` | info/issue | `auth/actions.ts` | 내 정보(이름·아바타) 수정 |
| `coffee_chat.submit` | info/error | `coffee-chat/actions.ts` | 1:1 커피챗 신청 저장 |
| `coffee_chat.cancel` | info/issue | `coffee-chat/actions.ts` | 본인 커피챗 신청 취소 |
| `admin.coffee_chat.update_status` | info/error | `admin/coffee-chat/actions.ts` | 관리자 커피챗 상태 변경 |
| `admin.contact.update_status` | info/error | `admin/contact/actions.ts` | 관리자 문의 상태 변경 |
| `contact.submit` | info/error | `contact/actions.ts` | 문의 접수 저장 |
| `newsletter.subscribe` | info/error | `Newsletter.actions.ts` / `api/newsletter` | 뉴스레터 구독 |

---

## 변경/이슈 기록

### 2026-07-07 — 사이트 전면 고도화(관리자 허브·SEO/내비·기술 위생)
- **관리자 데이터 허브**: 공용 가드 `src/lib/admin.ts`(`requireAdmin`) + `admin/layout.tsx`(내비). 문의 인박스(`/admin/contact`), 뉴스레터 구독자+CSV(`/admin/subscribers`), 활동로그 뷰어(`/admin/logs`) 신설. `activity_logs`가 처음으로 UI에 노출. DB 스키마 변경 없음(service_role 읽기).
- **SEO/내비**: 내비·푸터를 전용 페이지로 연결(홈 앵커 폐지), 모바일 햄버거 메뉴, `/terms`·`/privacy` 플레이스홀더(깨진 링크 해소), `error.tsx`·`not-found.tsx`, `sitemap.ts`·`robots.ts`, `metadataBase`+OG/Twitter, `icon.tsx`·`opengraph-image.tsx`(ImageResponse 동적 생성).
- **기술 위생**: `middleware.ts`→`proxy.ts`(Next 16 규약, deprecation 해소). Cloudflare 잔재 제거(`wrangler.jsonc`·`open-next.config.ts`·`public/_headers`·`next.config` init·package 스크립트/의존성 `@opennextjs/cloudflare`·`wrangler`, `npm install`로 362패키지 정리), `ship.ps1` Vercel 안내로 수정. `layout`의 `getUser()` try-catch(`unstable_rethrow`로 프레임워크 에러 보존). 기본 svg 정리.
- **문서**: `doc/15_site_enhancement_2026-07.md` 신설.
- **후속(보류)**: 이메일 알림(Resend 키 미발급), 관리자 데이터모델 확장, 정식 약관 문구.

### 2026-06-28 — profiles 적용·내 정보 수정 강화·응원 프리셋 추가·Polar 결제 진단
- **profiles 테이블 적용(완료)**: 앱 프로젝트(`ofxzkwbqwpsjoeqjhrpl`)에 `0001_profiles`가 미적용 상태였음(테이블/가입 트리거 부재 → 마이페이지·정보수정 실패). Management API로 `0001` 적용 + 기존 사용자 백필(`0005_backfill_profiles.sql`, `habitree.ai@gmail.com`→admin). `on_auth_user_created` 트리거 생성 확인.
- **내 정보 수정 강화**: `updateDisplayName` → `updateProfile`로 확장(이름 + 프로필 이미지 URL, `auth.updateUser` + `profiles` 동기화, URL 형식 검증). `/me`에 아바타 표시 추가.
- **커피챗 내역 반영**: `/me`에 "내 커피챗 신청 내역" 섹션 추가(RLS `select_own`으로 본인 신청만 조회, 상태 배지). 인증/익명 insert 동작을 RLS 시뮬레이션으로 검증.
- **응원 프리셋 추가**: `supportMarkup.ts`·`sample.ts`에 `$5,000`·`$10,000` 칩 추가(총 10개). 최대 $10,000 그대로.
- **Polar 결제 진단(코드 아님)**: `/api/donate`는 정상(체크아웃 생성 성공). 원인은 조직 `vibe_habitree` 미승인 — `status=created`, `details_submitted_at=null`, `payout_account_id=null`, `capabilities.checkout_payments=false` → "Payments are currently unavailable". Polar 대시보드에서 사업자·정산정보 제출/승인 필요(테스트는 `POLAR_SERVER=sandbox`).

### 2026-06-25 — 로그인 상태 UI · 커피챗 Supabase 연결 · 로그 체계 도입
- **헤더 로그인 인식화**: `layout.tsx`(서버)에서 `getUser()`로 로그인 여부 판별 → `Header`에 `isAuthed` 전달. 로그인 시 `마이페이지` + `로그아웃`, 비로그인 시 `로그인` 노출.
- **계정 관리**: `/me`에 표시 이름 변경 폼 추가(`updateDisplayName` 서버 액션 — `auth.updateUser` + `profiles.name` 동기화). 성공/오류 메시지 표시.
- **1:1 커피챗 → Supabase**: `/coffee-chat` 신청 페이지 + `submitCoffeeChat` 서버 액션 신설. `coffee_chat_requests` 테이블에 저장(로그인 시 `user_id` 연결, 비로그인도 신청 가능). 홈의 "커피챗 신청 →" 카드 클릭 시 `/coffee-chat` 이동(`HomeEnhancer`).
- **로그 체계**: `activity_logs` 테이블 + `src/lib/log.ts`(`logActivity`, best-effort) 도입. 인증·계정·커피챗 이벤트 기록. 서버 전용 service_role 클라이언트 `src/lib/supabase/admin.ts` 추가.
- **마이그레이션 추가(사용자 적용 필요)**: `supabase/migrations/0002_coffee_chat.sql`, `0003_activity_logs.sql`.
  - ⚠️ Supabase MCP는 앱 프로젝트(`ofxzkwbqwpsjoeqjhrpl`)에 권한이 없어 자동 적용 불가 → **Supabase SQL Editor에서 두 파일을 직접 실행**해야 데이터 저장·로그가 작동.
  - `SUPABASE_SERVICE_ROLE_KEY` 환경변수가 있어야 `activity_logs` DB 기록이 동작(없으면 콘솔 로그만). 클라이언트 번들에 절대 노출 금지(서버 전용).

#### 알려진 이슈 / 후속
- service_role 키 미설정 시: 활동 로그는 서버 콘솔에만 남고 DB에는 기록되지 않음(가드 처리됨, 기능엔 영향 없음).
- 마이그레이션 미적용 시: 커피챗 신청은 "저장에 실패했습니다" 오류로 안내됨(콘솔/로그에 원인 기록).

### 2026-06-25 (2) — 마이그레이션 적용 완료 + RLS 보안 강화
- **MCP/적용 경로 정리**: 기존 연결 MCP는 `setlog-ntl's Org/linkmap`만 접근 가능 → Habitree 프로젝트(`ofxzkwbqwpsjoeqjhrpl`)엔 권한 없음을 확인. 프로젝트 폴더에 `.mcp.json`(`supabase-habitree`, `--project-ref=ofxzkwbqwpsjoeqjhrpl`, 토큰=`${SUPABASE_ACCESS_TOKEN}`) 추가. `.env.local`에 `SUPABASE_ACCESS_TOKEN`(PAT, gitignore) 자리 추가.
- **마이그레이션 적용(완료)**: PAT 기반 Supabase Management API(`/database/query`)로 `0002`·`0003` 적용 성공. 두 테이블 RLS 활성화 확인.
- **RLS 강화(`0004_coffee_chat_harden_rls.sql`)**: 보안 어드바이저가 `coffee_chat_insert_anyone`의 `with check (true)`(무제한 삽입)를 WARN으로 지적 → 제약 정책 `coffee_chat_insert_valid`로 교체. 조건: `status='pending'` 고정, `user_id is null or = auth.uid()`(사칭 차단), 이름/이메일 길이·이메일 형식·topic/message 길이 제한.
- **anon 키 실동작 검증(완료)**: 정상 익명 신청 삽입 ✓ / status 조작·user_id 사칭·이메일 형식 불량 삽입 모두 차단 ✓ / 익명 타인 조회 0건 ✓. 테스트 행 삭제 완료(현재 0건). 프로젝트 ERROR급 보안 경고 0건.
- `activity_logs`는 정책 없음(INFO) = 의도된 기본 차단(service_role 전용). 추가 조치 불필요.
- **앱 동작 메모**: `submitCoffeeChat`은 `.insert()`만 호출(재조회 없음, return=minimal)이라 익명 신청이 정상 저장됨. `.select()`를 붙이면 `select_own` 정책상 익명 행은 재조회 불가하니 주의.

### 2026-06-25 (3) — [이슈] 로그인 후 DNS 오류(`habitree.ai`) → Auth 리다이렉트 설정 수정
- **증상**: 로그인(특히 Google OAuth) 시 `DNS_PROBE_FINISHED_NXDOMAIN` — 브라우저가 존재하지 않는 `habitree.ai`로 이동.
- **원인**: Supabase Auth 설정 오타/누락.
  - `site_url = https://habitree.ai`(존재하지 않는 도메인, 실제는 `habitree.io`)
  - `uri_allow_list`에 운영 콜백 `https://vibe.habitree.io/auth/callback` 누락 → OAuth 복귀 시 허용 안 된 콜백으로 판단 → `site_url`(habitree.ai)로 폴백 → DNS 오류.
- **조치**(Management API PATCH `/config/auth`):
  - `site_url` → `https://vibe.habitree.io`
  - `uri_allow_list` → `https://vibe.habitree.io/**,http://localhost:3000/**`(와일드카드로 콜백·향후 경로 커버, 로컬 개발 유지)
- **영향 범위**: 앱 코드 변경 없음(Supabase 측 설정만). Google Cloud Console의 Authorized redirect URI(`…supabase.co/auth/v1/callback`)는 무관·정상.
- **재발 방지**: 도메인은 `habitree.io`(운영 호스트 `vibe.habitree.io`). `.ai` 아님.

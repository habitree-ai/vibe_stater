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
| `account.update_name` | info/issue | `auth/actions.ts` | 표시 이름 변경 |
| `coffee_chat.submit` | info/error | `coffee-chat/actions.ts` | 1:1 커피챗 신청 저장 |

---

## 변경/이슈 기록

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

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

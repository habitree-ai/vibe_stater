# 09. Supabase 인증/DB 연동 (로드맵 Step 3)

> ✅ **적용 완료 기록** — 프로젝트 `ofxzkwbqwpsjoeqjhrpl` 생성, 마이그레이션 0001~0015 적용,
> 관리자 role 지정까지 끝났다(WORKLOG 참조). 아래는 최초 셋업 절차 기록으로, 새 환경을 구성할 때만 참고한다.
> 키가 없어도 빌드/페이지는 깨지지 않도록 가드가 들어가 있다(미설정 시 /me·로그인은 안내 메시지).

---

## 완료된 코드 (에이전트)
| 파일 | 역할 |
|---|---|
| `src/lib/supabase/config.ts` | URL/Anon 키 + `isSupabaseConfigured` 플래그(placeholder fallback) |
| `src/lib/supabase/client.ts` | 브라우저용 클라이언트 |
| `src/lib/supabase/server.ts` | 서버(Server Component/Action)용 클라이언트 |
| `src/lib/supabase/middleware.ts` + `src/middleware.ts` | 요청마다 세션 토큰 갱신 |
| `src/app/auth/actions.ts` | `login` / `signup` / `logout` 서버 액션 |
| `src/app/login`·`signup`·`me` | 실제 Auth 연결 폼 + 마이페이지(role 분기) |
| `supabase/migrations/0001_profiles.sql` | `profiles` 테이블 + RLS + 가입 트리거 |
| `.env.example` | 환경변수 템플릿 |

---

## 사용자가 할 일

### 1) Supabase 프로젝트 생성 (직접)
- supabase.com → New project → 비밀번호·리전 설정.
- **Project Settings → API**에서 다음 값 확인:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 노출 금지)

### 2) 로컬 환경변수
```powershell
Copy-Item .env.example .env.local
# .env.local 에 위 3개 값 입력 (NEXT_PUBLIC_APP_URL은 http://localhost:3000)
```

### 3) 마이그레이션 적용 (둘 중 하나)
- **간단:** Supabase 대시보드 → SQL Editor → `supabase/migrations/0001_profiles.sql` 내용 붙여넣기 → Run.
- **CLI:** `npx supabase link` 후 `npx supabase db push`.

### 4) 인증 설정
- Authentication → Providers → **Email** 활성화.
- 로컬 테스트를 빠르게 하려면 Authentication → **Confirm email**을 잠시 꺼도 됨(운영은 켜기 권장).
- 첫 관리자 지정: 가입 후 SQL Editor에서
  ```sql
  update public.profiles set role = 'admin' where email = '본인이메일';
  ```

### 5) 배포(Vercel) 환경변수
- Vercel → 프로젝트 → Settings → **Environment Variables**에
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ 필요 시 `SUPABASE_SERVICE_ROLE_KEY`) 등록.
  (SSG가 빌드 타임에 `NEXT_PUBLIC_*`를 주입하므로 **빌드 환경에도 필요**) — 배포 정본 [`13_vercel_deployment.md`](./13_vercel_deployment.md)

---

## 검증 (수용 기준)
```powershell
npm install        # (의존성 동기화 — @supabase/* 포함)
npm run build      # 타입·정적 생성 통과 확인
npm run dev        # /signup → (이메일 확인) → /login → /me 동작
.\scripts\ship.ps1 "feat: Supabase Step 3 (auth/profiles) + Pretendard 셀프호스팅"
```

> 참고: 에이전트 샌드박스에서는 OneDrive 동기화·오프라인 SWC 제약으로 `npm run build` 전체 실행이 불가했고,
> 대신 **타입 체크(tsc) 0 오류**로 코드 정합성을 검증했다. 최종 빌드는 위 명령으로 로컬에서 확인할 것.

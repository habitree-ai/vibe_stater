# 00. 개발 환경 세팅 가이드

> Creator Link Hub 구축을 위한 로컬 개발 환경 및 외부 서비스 준비사항.
> 마스터 기획서: [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md)

---

## 1. 로컬 개발 도구

| 도구 | 버전 | 설치 방법 | 비고 |
|---|---|---|---|
| Node.js | LTS (20.x+) | `winget install OpenJS.NodeJS.LTS` | npm 포함 |
| Git | 최신 | `winget install Git.Git` | 버전 관리 |
| VS Code | 최신 | `winget install Microsoft.VisualStudioCode` | 권장 에디터 |

설치 후 **새 터미널**에서 확인:

```powershell
node -v   # v20.x 이상
npm -v
git --version
```

> PATH가 즉시 안 잡히면 터미널/VS Code를 재시작한다.

### VS Code 권장 확장
- ESLint, Prettier
- Tailwind CSS IntelliSense
- TypeScript

---

## 2. 작업 경로 — `C:\dev\habitree.ai`

작업 경로는 **`C:\dev\habitree.ai`** 다. OneDrive 동기화 폴더 밖이어야 한다(2026-07-23 이전).

- 과거에는 `OneDrive\dev\habitree.ai` 에서 작업했으나, `node_modules`(500MB)·`.next`·`.git` 이 전부 동기화되어
  대량 재동기화·파일 잠금·리포 사본 난립 문제가 있었다.
- **리포를 OneDrive 안에 두지 말 것.** 백업은 GitHub 원격(`habitree-ai/vibe_stater`)으로 충분하다.
- `.gitignore`에는 `node_modules`, `.next`, `.env*`, `local/` 이 포함됨.
- 리포 사본이 여러 개 생기면 어느 쪽에서 작업 중인지 혼동된다. 사본 발견 시
  `git log -1` · `git status` 로 최신본을 확인하고 나머지는 정리한다.

---

## 3. 외부 서비스 가입 체크리스트

UI 우선 단계에서는 불필요하나, 백엔드 연동 단계 전에 준비한다. (마스터 기획서 9장 LINKMAP 체크리스트 참조)

### Supabase (필수 — 인증/DB/스토리지)
- [ ] 계정 생성 및 프로젝트 생성
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 확보
- [ ] Auth URL/리다이렉트 설정
- [ ] `profiles` 테이블 + RLS
- [ ] Storage 버킷 생성

### Stripe (필수 — 결제)
- [ ] 계정 생성, 테스트 모드 키 확보
- [ ] Product/Price 생성
- [ ] Webhook endpoint + `checkout.session.completed`

### Resend (권장 — 이메일)
- [ ] 도메인 인증, API Key, 발신 이메일

### Vercel (필수 — 배포)
- [ ] GitHub 저장소 연결, Production/Preview 환경변수, 커스텀 도메인

### PostHog (권장 — 분석) / OpenAI (선택 — AI)
- [ ] 키 확보 후 환경변수 등록

---

## 4. 환경변수 템플릿

루트에 `.env.local` 생성(스캐폴딩 후). 마스터 기획서 10장 기준.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# OpenAI
OPENAI_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Linkmap
LINKMAP_PROJECT_ID=
LINKMAP_API_TOKEN=
```

> **현재(UI 우선) 단계에서는 위 키 없이도 메인페이지가 동작한다.** 샘플 데이터(`src/data/sample.ts`)로 렌더하기 때문.

---

## 5. 프로젝트 초기화 명령 (요약)

```powershell
# 1) Next.js 스캐폴딩 (현재 디렉토리)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2) shadcn/ui 초기화
npx shadcn@latest init

# 3) 컴포넌트 추가
npx shadcn@latest add button card badge separator navigation-menu

# 4) 개발 서버
npm run dev   # http://localhost:3000
```

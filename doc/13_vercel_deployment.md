# 13. Vercel 배포 가이드 (환경변수 정리)

> 배포 대상을 **Vercel**로 전환. Next.js는 Vercel에 네이티브로 배포되므로 Cloudflare(OpenNext) 설정은 필요 없습니다.
> 본 문서는 ① 실제 사용 환경변수 정리, ② Vercel 배포 절차, ③ Cloudflare 전용 파일 처리 안내.
> 전체 키 레지스트리: [`10_env_config_registry.md`](./10_env_config_registry.md) · 보드 `/linkmap/env-board.html`

---

## 1. 환경변수 — 코드 실사용 기준 정리

`🔑 = NEXT_PUBLIC_*`(빌드 타임, 클라이언트 노출) · `🔒 = 서버 전용 시크릿`(노출/커밋 금지)

### A. 지금 동작에 필요한 값 (기능별)

| 기능 | 변수 | 종류 | 코드 위치 | 비고 |
|---|---|---|---|---|
| **AI 챗봇** (`/api/chat`) | `ANTHROPIC_API_KEY` | 🔒 | `src/app/api/chat/route.ts` | console.anthropic.com → API Keys. 없으면 안내 메시지로 폴백 |
| | `ANTHROPIC_MODEL` | 일반 | 동일 | (선택) 기본 `claude-haiku-4-5` |
| **후원 결제** (`/api/donate`) | `POLAR_ACCESS_TOKEN` | 🔒 | `src/app/api/donate/route.ts` | polar.sh → Settings → Developers |
| | `POLAR_PRODUCT_ID` | 🔒 | 동일 | "Pay what you want" 상품 ID |
| | `POLAR_SERVER` | 일반 | 동일 | `sandbox` 또는 `production` |
| | `NEXT_PUBLIC_APP_URL` | 🔑 | 동일 | 결제 후 복귀 URL = **배포 도메인**(미설정 시 요청 origin) |
| **인증/DB** (login·signup·me) | `NEXT_PUBLIC_SUPABASE_URL` | 🔑 | `src/lib/supabase/config.ts` | Supabase → Project Settings → API |
| | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔑 | 동일 | 없으면 Auth 자동 비활성(가드) |

> 위 키가 없어도 **빌드·렌더는 정상**(가드 처리). 키를 넣으면 해당 기능이 실제로 동작합니다.

### B. 선언만 있고 아직 코드 미사용 (선택·후속)

`SUPABASE_SERVICE_ROLE_KEY`(서버 작업 도입 시) · `POLAR_WEBHOOK_SECRET`(결제 웹훅 도입 시) · `ADMIN_EMAIL` ·
`STRIPE_*` · `RESEND_*` · `NEXT_PUBLIC_POSTHOG_*` · `OPENAI_API_KEY` · `LINKMAP_*`
→ 지금은 **등록 불필요**. 해당 기능을 붙일 때 추가합니다.

---

## 2. Vercel 배포 절차

1. **vercel.com → Add New → Project → Import** `habitree-ai/vibe_stater` (GitHub 연동).
2. Framework: **Next.js**(자동 감지). Build/Output 기본값 그대로 — 별도 설정 불필요.
3. **Settings → Environment Variables** 에 위 **A 그룹**을 등록(Production, 필요 시 Preview/Development).
   - `🔑 NEXT_PUBLIC_*`는 빌드 타임에 주입되므로 반드시 배포 전에 등록.
   - `NEXT_PUBLIC_APP_URL` = 실제 배포 도메인(예: `https://vibe-stater.vercel.app` 또는 커스텀 도메인).
4. **Deploy** → 빌드 후 도메인 발급. 이후 `git push`마다 자동 재배포.

### 배포 후 필수 연동 설정
- **Supabase Auth**: Dashboard → Authentication → **URL Configuration** 에 배포 도메인을 **Site URL + Redirect URLs**로 추가(로그인 리다이렉트). 로컬도 `http://localhost:3000` 유지.
- **Polar**: `POLAR_SERVER=production`으로 전환, 상품/조직을 실거래 모드로. `NEXT_PUBLIC_APP_URL`을 배포 도메인으로.

---

## 3. Cloudflare 전용 파일 — Vercel에선 불필요

Vercel은 아래를 **무시**하므로 그대로 둬도 무해합니다. 다만 Vercel 전용으로 정리하려면 선택적으로 제거 가능:

| 파일/설정 | Vercel에서 | 조치 |
|---|---|---|
| `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars` | 사용 안 함 | 그대로 둬도 무해(원하면 제거) |
| `public/_headers` | 무시(Cloudflare Pages 규약) | 무해. Vercel은 정적 자산 캐싱 자동 |
| `next.config.ts`의 `initOpenNextCloudflareForDev()` | `next dev`에서만 동작, 빌드에선 no-op | 빌드 통과에 영향 없음(원하면 제거) |
| `package.json`의 `deploy`/`preview`(opennextjs) 스크립트 | 미사용 | 무해 |
| `src/middleware.ts`(Supabase 세션) | **네이티브 동작** | 유지 |

> 순수 Vercel 셋업을 원하시면 위 4개(설정/스크립트)를 제거해 드릴 수 있습니다. **기능에는 영향 없습니다.**

---

## 4. 체크리스트
- [ ] Vercel에 GitHub 저장소 Import (Next.js 자동 감지)
- [ ] 환경변수 A그룹 등록(`NEXT_PUBLIC_*` 포함, Production)
- [ ] `NEXT_PUBLIC_APP_URL` = 배포 도메인
- [ ] 첫 배포 성공 → 도메인 접속 확인
- [ ] Supabase Auth Redirect URL에 배포 도메인 추가
- [ ] (결제 실거래 시) `POLAR_SERVER=production` + 상품 production
- [ ] 이후 `git push` 자동 배포 확인

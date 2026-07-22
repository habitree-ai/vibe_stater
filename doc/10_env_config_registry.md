# 10. 환경변수 · 수동 설정 레지스트리 (LINKMAP 핵심)

> **LINKMAP 서비스의 가장 중요한 포인트**: AI/에이전트가 자동화할 수 **없고**, 사용자가 외부 서비스
> 페이지에서 **직접** 설정·발급·관리해야 하는 값들을 한곳에 모아 — *무엇인지 · 어디서 발급/설정 ·
> 어디에 적용 · 어디서 관리* 를 한눈에 보게 한다.
> 인터랙티브 보드(HTML): [`../public/linkmap/env-board.html`](../public/linkmap/env-board.html) (배포 시 `/linkmap/env-board.html`)

---

## 왜 이 표가 핵심인가
코드·빌드·배포 파이프라인은 자동화할 수 있지만, 다음은 **사람만** 할 수 있다:
- **계정 생성·로그인·OAuth 권한 부여** (보안상 대행 불가)
- **API 키·시크릿 발급** (외부 콘솔에서 본인이 생성)
- **결제·도메인·DNS 같은 책임이 따르는 설정**
- **대시보드 토글**(Redirect URL, Webhook, 빌드 변수 등)

LINKMAP은 이 "사람만 할 수 있는 것들"의 **체크리스트 + 위치 안내 + 적용처 매핑**을 제공한다.

## 범례 (종류)
| 기호 | 종류 | 비고 |
|---|---|---|
| 🔑 | 공개 변수 (`NEXT_PUBLIC_*`) | 빌드 타임에 번들로 주입. 비밀 아님 |
| 🔒 | 시크릿 | 서버 전용. **노출·커밋 금지** |
| ⚙️ | 대시보드 설정 | 외부 콘솔에서 입력/토글 |
| 🌐 | DNS | 도메인 레코드 |
| 🗄️ | SQL/마이그레이션 | DB에 적용 |
| 👤 | 계정/OAuth | 인증·권한 |

> 적용 위치 약어: **로컬** = `.env.local`(커밋 금지) · **Vercel** = Vercel → 프로젝트 → Settings → Environment Variables(Production/Preview) · **코드** = 저장소 파일.
>
> ⚠️ 이 표는 배포=Cloudflare 시기에 작성됐다. 현재 배포는 **Vercel**이며 배포 관련 항목은 모두 Vercel 기준으로 갱신됨. 배포 정본: [`13_vercel_deployment.md`](./13_vercel_deployment.md).

---

## A. GitHub  *(상태: 저장소 생성 완료)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정/조직 | 👤 | habitree-ai 조직 | github.com | — | GitHub |
| 저장소 | 👤 | `habitree-ai/vibe_stater` | github.com/new | 원격 `origin` | GitHub |
| 푸시 인증 | 👤 | OAuth/PAT (최초 1회) | Git Credential Manager 팝업 | 로컬 자격증명 | OS 자격증명 저장소 |

## B. Vercel (배포)  *(상태: 운영 중 — `vibe.habitree.io` 자동배포)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정 | 👤 | Vercel 계정(GitHub 연동) | vercel.com | — | Vercel |
| Git 연결 | 👤 | 저장소 Import(OAuth) | Add New → Project → Import `vibe_stater` | 프로젝트↔GitHub | Vercel |
| 빌드 | ⚙️ | 자동(Next.js 프리셋, `next build`) | 별도 설정 불필요 | 빌드 파이프라인 | Vercel |
| Production branch | ⚙️ | `main` (push 시 자동배포) | Settings → Git | 자동배포 트리거 | Vercel |
| 환경변수/시크릿 | ⚙️ | `NEXT_PUBLIC_*` + 서버 시크릿 | Settings → Environment Variables | Vercel | Vercel |
| 커스텀 도메인 | 🌐 | `vibe.habitree.io` 연결 | Settings → Domains | DNS | Vercel/도메인 등록기관 |

> 폐기: Cloudflare Workers/OpenNext 배포는 [`archive/`](./archive/)로 이관(06·07·08·11·12). `ship.ps1`(=`npm run ship`)은 `git push origin main`만 하고 배포는 Vercel이 자동 수행.

## C. Supabase (인증/DB · Step 3)  *(상태: ✅ 적용 완료 — 프로젝트 `ofxzkwbqwpsjoeqjhrpl`, 0001~0015 적용)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 프로젝트 | 👤 | Supabase 프로젝트 생성 | supabase.com/dashboard | — | Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | 🔑 | 프로젝트 API URL | Project Settings → API | 로컬 · Vercel / `src/lib/supabase/config.ts` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔑 | 공개(anon) 키 | Project Settings → API | 로컬 · Vercel / `config.ts` | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 | 서버 전용 관리 키 | Project Settings → API | 로컬 · Vercel | Supabase |
| Site URL / Redirect URLs | ⚙️ | 로그인 리다이렉트 허용 도메인 | Authentication → URL Configuration | Supabase Auth | Supabase |
| OAuth 공급자(선택) | 👤 | Google/GitHub 로그인 | Authentication → Providers | Supabase Auth | Supabase |
| `profiles` 테이블 + RLS | 🗄️ | 사용자 프로필/권한 | SQL Editor에 `supabase/migrations/0001_profiles.sql` 실행 (또는 `supabase db push`) | DB | Supabase |

## D. Polar (후원 결제)  *(상태: ✅ 실사용 — `/support`·`/api/donate`·`donations` 테이블)*
> 실제 결제는 **Polar**로 구현(SDK 없이 raw fetch). 기획 원안의 Stripe는 채택되지 않음.
> Polar는 순수 기부/후원을 허용하지 않아 **디지털 상품(pay-what-you-want)** 으로 등록해 운영한다.

| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정 | 👤 | Polar 계정 | polar.sh | — | Polar |
| `POLAR_ACCESS_TOKEN` | 🔒 | 액세스 토큰 | Settings → Developers | 로컬 · Vercel | Polar |
| `POLAR_PRODUCT_ID` | 🔒 | 후원 상품 ID(pay-what-you-want) | 상품 생성 후 | 로컬 · Vercel | Polar |
| `POLAR_SERVER` | ⚙️ | `sandbox` 또는 `production` | 직접 지정 | 로컬 · Vercel | 자체 |
| `POLAR_WEBHOOK_SECRET` | 🔒 | 웹훅 서명 시크릿(Standard Webhooks) | Settings → Webhooks | 로컬 · Vercel | Polar |
| Webhook endpoint | ⚙️ | `/api/polar-webhook` (결제 완료 → `donations` 기록) | Polar → Webhooks | 결제 후 처리 | Polar |
| `NEXT_PUBLIC_APP_URL` | 🔑 | 결제 후 복귀 URL(미설정 시 요청 origin) | 배포 도메인 | 로컬 · Vercel | 본인 |

## E. 문의 알림 — Resend(메일) + 카카오톡  *(상태: 코드 완료 · 키 등록 대기)*
> 문의 등록 시 운영자 알림. 절차·설계: [`18_contact_notifications.md`](./18_contact_notifications.md)

| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| `ADMIN_EMAIL` | ⚙️ | 알림 수신 주소 | 직접 지정(설정 완료) | 로컬 · Vercel | 자체 |
| `RESEND_API_KEY` | 🔒 | 발송 API 키 | resend.com → API Keys | 로컬 · Vercel | Resend |
| `RESEND_FROM_EMAIL` | ⚙️ | 발신 주소(선택) | 미설정 시 onboarding@resend.dev | 로컬 · Vercel | Resend |
| `KAKAO_REST_API_KEY` | 🔒 | 카카오 앱 REST API 키 | developers.kakao.com → 내 애플리케이션 | 로컬 · Vercel | Kakao |
| `KAKAO_CLIENT_SECRET` | 🔒 | 앱 Client Secret(사용 시) | 앱 설정 → 보안 | 로컬 · Vercel | Kakao |
| 카카오 토큰 | 🗄 | access/refresh | `node scripts/kakao-connect.mjs` 1회 실행 | DB `notification_tokens` | 자동 갱신 |
| 도메인 인증(DNS) | 🌐 | SPF/DKIM (선택) | Resend 안내 → DNS 추가 | 도메인 | DNS |

## F. OpenAI / 사이트 / (PostHog·LINKMAP 미도입)
> **OpenAI**: ✅ 실사용(AI 챗봇 `/api/chat`, 기본 `gpt-4o-mini`, 설정은 DB `chat_settings`). **PostHog·LINKMAP 연동**: 아직 미도입(계획).
> 참고: 문의·후원 알림용 Resend/Kakao 키는 위 **E** 섹션 참조.
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | 🔑 | 프로젝트 API 키 | PostHog → Project Settings | 로컬 · Vercel | PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | 🔑 | 인제스트 호스트 | PostHog | 로컬 · Vercel | PostHog |
| `OPENAI_API_KEY` | 🔒 | OpenAI 키 | platform.openai.com → API keys | 로컬 · Vercel | OpenAI |
| `NEXT_PUBLIC_APP_URL` | 🔑 | 배포된 사이트 URL | 첫 배포 후 확정 | 로컬 · Vercel | 본인 |
| `ADMIN_EMAIL` | ⚙️ | 관리자 권한 판별 이메일 | 본인 결정 | 로컬 · Vercel | 본인 |
| `LINKMAP_PROJECT_ID` / `LINKMAP_API_TOKEN` | 🔒 | LINKMAP 연동 | LINKMAP 서비스 | 로컬 · Vercel | LINKMAP |

---

## 적용 절차 요약
1. **로컬**: `.env.example`를 복사해 `.env.local` 생성 → 값 입력(커밋 금지).
2. **배포**: 같은 값을 Vercel → 프로젝트 → Settings → **Environment Variables**(Production/Preview)에 등록.
   - `NEXT_PUBLIC_*`는 빌드 타임에 번들로 주입되므로 반드시 등록.
   - 🔒 시크릿은 서버 전용으로 등록(클라이언트 노출 금지).
3. **Supabase Auth**: Site URL/Redirect에 `http://localhost:3000` + `https://vibe.habitree.io` 추가(도메인은 `.io`, `.ai` 금지).
4. **DB**: 마이그레이션은 이미 적용 완료(0001~0015). 새 환경 구성 시에만 `supabase db push`.

## LINKMAP 고도화 방향 (다음)
- 본 레지스트리를 **데이터(JSON)** 로 정규화 → 보드/문서/체크리스트를 단일 소스에서 생성.
- 항목별 **상태(미설정/설정됨/검증됨)** 추적 + 검증 훅(예: URL 형식, 키 존재 여부).
- 서비스별 셋업 가이드([`service-setup/`](./service-setup/))·배포 문서와 상호 링크.
- 궁극적으로 LINKMAP 서비스가 이 표를 **프로젝트별로 관리·점검**하는 대시보드 제공.

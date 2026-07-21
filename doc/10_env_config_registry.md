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

> 적용 위치 약어: **로컬** = `.env.local`(커밋 금지) · **CF빌드** = Cloudflare Workers → Settings → Build → Variables and secrets · **CF시크릿** = `wrangler secret put` 또는 런타임 Variables · **코드** = 저장소 파일.

---

## A. GitHub  *(상태: 저장소 생성 완료)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정/조직 | 👤 | habitree-ai 조직 | github.com | — | GitHub |
| 저장소 | 👤 | `habitree-ai/vibe_stater` | github.com/new | 원격 `origin` | GitHub |
| 푸시 인증 | 👤 | OAuth/PAT (최초 1회) | Git Credential Manager 팝업 | 로컬 자격증명 | OS 자격증명 저장소 |

## B. Cloudflare (배포)  *(상태: 연결/빌드 설정 진행 중)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정 + 2FA | 👤 | Cloudflare 계정 | dash.cloudflare.com | — | Cloudflare |
| Git 연결 | 👤 | 저장소 Import(OAuth) | Workers & Pages → Create → Connect to Git | 프로젝트↔GitHub | Cloudflare |
| Build command | ⚙️ | `npx opennextjs-cloudflare build` | 프로젝트 → Settings → Builds | 빌드 파이프라인 | Cloudflare |
| Deploy command | ⚙️ | `npx opennextjs-cloudflare deploy` | 프로젝트 → Settings → Builds | 빌드 파이프라인 | Cloudflare |
| Production branch | ⚙️ | `main` | Settings → Builds | 자동배포 트리거 | Cloudflare |
| 빌드 변수/시크릿 | ⚙️ | `NEXT_PUBLIC_*` 등 빌드 타임 값 | Settings → Build → Variables and secrets | CF빌드 | Cloudflare |
| 커스텀 도메인 | 🌐 | 서비스 도메인 연결 | Settings → Domains & Routes → Add | DNS(자동) | Cloudflare |

## C. Supabase (인증/DB · Step 3)  *(상태: 키 미등록 — 미설정 시 Auth 비활성)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 프로젝트 | 👤 | Supabase 프로젝트 생성 | supabase.com/dashboard | — | Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | 🔑 | 프로젝트 API URL | Project Settings → API | 로컬 · CF빌드 / `src/lib/supabase/config.ts` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🔑 | 공개(anon) 키 | Project Settings → API | 로컬 · CF빌드 / `config.ts` | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 | 서버 전용 관리 키 | Project Settings → API | 로컬 · CF시크릿 | Supabase |
| Site URL / Redirect URLs | ⚙️ | 로그인 리다이렉트 허용 도메인 | Authentication → URL Configuration | Supabase Auth | Supabase |
| OAuth 공급자(선택) | 👤 | Google/GitHub 로그인 | Authentication → Providers | Supabase Auth | Supabase |
| `profiles` 테이블 + RLS | 🗄️ | 사용자 프로필/권한 | SQL Editor에 `supabase/migrations/0001_profiles.sql` 실행 (또는 `supabase db push`) | DB | Supabase |

## D. Stripe (결제 · Phase: Step 5)  *(상태: 예정)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| 계정 | 👤 | Stripe 계정 | stripe.com | — | Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 🔑 | 공개 키 | Developers → API keys | 로컬 · CF빌드 | Stripe |
| `STRIPE_SECRET_KEY` | 🔒 | 비밀 키 | Developers → API keys | 로컬 · CF시크릿 | Stripe |
| `STRIPE_WEBHOOK_SECRET` | 🔒 | 웹훅 서명 시크릿 | Developers → Webhooks → endpoint 생성 | 로컬 · CF시크릿 | Stripe |
| Product/Price | ⚙️ | 판매 상품·가격 | Products | `products.stripe_price_id` | Stripe |
| Webhook endpoint | ⚙️ | `checkout.session.completed` 등 | Developers → Webhooks | 결제 후 처리 | Stripe |

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

## F. PostHog (분석 · Step 6) / OpenAI / 사이트 / LINKMAP  *(상태: 일부 예정)*
| 항목 | 종류 | 무엇 | 어디서(발급/설정) | 적용 위치 | 관리 |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | 🔑 | 프로젝트 API 키 | PostHog → Project Settings | 로컬 · CF빌드 | PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | 🔑 | 인제스트 호스트 | PostHog | 로컬 · CF빌드 | PostHog |
| `OPENAI_API_KEY` | 🔒 | OpenAI 키 | platform.openai.com → API keys | 로컬 · CF시크릿 | OpenAI |
| `NEXT_PUBLIC_APP_URL` | 🔑 | 배포된 사이트 URL | 첫 배포 후 확정 | 로컬 · CF빌드 | 본인 |
| `ADMIN_EMAIL` | ⚙️ | 관리자 권한 판별 이메일 | 본인 결정 | 로컬 · CF빌드 | 본인 |
| `LINKMAP_PROJECT_ID` / `LINKMAP_API_TOKEN` | 🔒 | LINKMAP 연동 | LINKMAP 서비스 | 로컬 · CF시크릿 | LINKMAP |

---

## 적용 절차 요약
1. **로컬**: `.env.example`를 복사해 `.env.local` 생성 → 값 입력(커밋 금지).
2. **배포**: 같은 값을 Cloudflare Workers → Settings → **Build → Variables and secrets**에 등록.
   - `NEXT_PUBLIC_*`는 빌드 타임에 필요하므로 **빌드 변수**로 반드시 등록.
   - 🔒 시크릿은 Secret으로 등록(또는 `npx wrangler secret put KEY`).
3. **Supabase Auth**: Site URL/Redirect에 `http://localhost:3000` + 배포 URL 추가.
4. **DB**: `supabase/migrations/0001_profiles.sql`를 SQL Editor에서 실행.

## LINKMAP 고도화 방향 (다음)
- 본 레지스트리를 **데이터(JSON)** 로 정규화 → 보드/문서/체크리스트를 단일 소스에서 생성.
- 항목별 **상태(미설정/설정됨/검증됨)** 추적 + 검증 훅(예: URL 형식, 키 존재 여부).
- 서비스별 셋업 가이드([`service-setup/`](./service-setup/))·배포 문서와 상호 링크.
- 궁극적으로 LINKMAP 서비스가 이 표를 **프로젝트별로 관리·점검**하는 대시보드 제공.

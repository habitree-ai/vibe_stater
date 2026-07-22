> ⚠️ **SUPERSEDED — Cloudflare 시기 이력입니다.** 현재 배포는 **Vercel**(`main` push 자동배포)이며, 배포 정본은 `doc/13_vercel_deployment.md`. 아래 내용은 참고 기록으로만 보존합니다.

# 06. Cloudflare 배포 세팅

> 이 Next.js 16 프로젝트(Creator Link Hub)를 **Cloudflare**에 배포하기 위한 세팅과 절차.
> 계정/도메인 기초 세팅은 [`service-setup/cloudflare/cloudflare_setup.md`](./service-setup/cloudflare/cloudflare_setup.md) 선행.
> 본 문서는 **준비/문서화**가 목적이며, 실제 적용은 이후 단계에서 진행한다.

---

## 1. 배포 방식 선택

| 방식 | 적합성 | 비고 |
|---|---|---|
| **OpenNext Cloudflare 어댑터 (`@opennextjs/cloudflare`) → Workers** | ✅ **권장** | Next.js 16 정식 지원. SSR·Route Handler·ISR 등 전체 기능. 향후 Supabase/Stripe 연동까지 호환 |
| 정적 export(`output: "export"`) → Workers Assets/Pages | 임시 대안 | 현재 사이트가 100% 정적/SSG라 가능하지만, 서버 기능 추가 시 한계 |

> 결론: 향후 인증·결제·API가 들어오므로 **처음부터 OpenNext(Workers)** 로 간다.
> 검증 기준: `@opennextjs/cloudflare`는 Next.js 16 전 마이너/패치 + 14·15 최신 마이너 지원. wrangler ≥ 3.99.0 필요.

---

## 2. 설치

```powershell
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
# 기존 레거시 어댑터가 있으면 제거
# npm remove @cloudflare/next-on-pages
```

---

## 3. 추가/수정할 파일

### 3.1 `wrangler.jsonc` (프로젝트 루트, 신규)
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "creator-link-hub",
  "compatibility_date": "2025-03-25",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    { "binding": "WORKER_SELF_REFERENCE", "service": "creator-link-hub" }
  ]
}
```

### 3.2 `open-next.config.ts` (루트, 신규)
```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// MVP: 캐시 오버라이드 없이 시작. 트래픽/ISR 늘면 R2 incremental cache 추가.
export default defineCloudflareConfig({});
```

> ISR/풀 라우트 캐시가 필요해지면:
> `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
> → `defineCloudflareConfig({ incrementalCache: r2IncrementalCache })` 및 `wrangler.jsonc`에 R2 버킷 바인딩 추가.

### 3.3 `next.config.ts` (기존 파일 하단에 추가)
```ts
// 파일 맨 아래
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

### 3.4 `.dev.vars` (루트, 신규 — 로컬 Workers 런타임용)
```
NEXTJS_ENV=development
```

### 3.5 `public/_headers` (정적 자산 캐시)
```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

### 3.6 `.gitignore` (추가)
```
.open-next
.dev.vars
```

### 3.7 `package.json` scripts (추가)
```json
{
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
}
```

---

## 4. 호환성 점검 (현재 코드 기준)

- [x] Edge 런타임 미사용 — `export const runtime = "edge"` 없음(Node.js 런타임 유지). OpenNext는 Node 런타임 필요.
- [x] 폰트: `next/font`(Geist/Space Grotesk/Instrument Serif) — 빌드 타임 처리, 호환.
- [ ] 외부 폰트 CDN: layout의 Pretendard `<link>`(jsdelivr) — 런타임 외부요청. 정상 동작하나, 추후 `next/font/local`로 셀프호스팅 권장.
- [ ] 이미지 최적화 사용 시 `wrangler.jsonc`에 `"images": { "binding": "IMAGES" }` 추가(현재 `next/image` 미사용).

---

## 5. 배포 절차

### 5.1 수동(로컬) 배포
```powershell
# 1) 로컬에서 Workers 런타임으로 프리뷰(프로덕션 유사)
npm run preview

# 2) Cloudflare 로그인 후 배포
npx wrangler login      # 브라우저 인증 (사용자 직접)
npm run deploy
```
- 최초 `wrangler login`은 브라우저 OAuth가 필요하므로 **사용자가 직접** 수행한다.
- 배포되면 `https://creator-link-hub.<account>.workers.dev` 형태 URL이 생성된다.

### 5.2 Git 연동(권장, CI/CD)
- **본 프로젝트의 기본 배포 방식.** 자체 서버/로컬 배포 대신 GitHub 푸시 → Cloudflare 자동 빌드·배포.
- 전용 단계별 가이드: **[`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md)**
- 요약: Workers & Pages → Connect to Git → build `npx opennextjs-cloudflare build` / deploy `npx opennextjs-cloudflare deploy` → 빌드 변수 등록 → `git push` 자동 배포.

### 5.3 커스텀 도메인 연결
- 도메인이 Cloudflare에 **Active**(네임서버 적용 완료, 셋업 1편) 상태여야 함.
- Workers 프로젝트 → **Settings → Domains & Routes → Add → Custom Domain** 에 원하는 도메인/서브도메인 지정.

---

## 6. 환경변수(Secrets) 운영

| 위치 | 용도 |
|---|---|
| `.dev.vars` | 로컬 Workers 프리뷰용(커밋 금지) |
| `npx wrangler secret put <KEY>` | 프로덕션 시크릿(예: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) |
| `wrangler.jsonc > vars` | 비민감 공개 변수 |
| 대시보드 → Workers → Settings → Variables | UI로 관리 |

> `NEXT_PUBLIC_*` 변수는 빌드 타임에 번들로 주입되므로, CI 빌드 환경에도 동일하게 제공해야 한다.
> 전체 환경변수 목록은 [`00_setup_guide.md`](./00_setup_guide.md) 4장 참고.

---

## 7. 배포 체크리스트
- [ ] `@opennextjs/cloudflare`·`wrangler` 설치
- [ ] `wrangler.jsonc`·`open-next.config.ts`·`.dev.vars`·`public/_headers` 생성
- [ ] `next.config.ts`에 `initOpenNextCloudflareForDev()` 추가
- [ ] `.gitignore`에 `.open-next`·`.dev.vars` 추가
- [ ] `package.json` scripts 추가
- [ ] `npm run preview` 로컬 검증
- [ ] `wrangler login`(사용자) → `npm run deploy`
- [ ] (선택) GitHub 연동 CI/CD
- [ ] 커스텀 도메인 연결(도메인 Active 상태)

## 참고 (검증 출처)
- OpenNext Cloudflare — Get Started: https://opennext.js.org/cloudflare/get-started
- Cloudflare Workers Next.js 가이드: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext Cloudflare 어댑터(GitHub): https://github.com/opennextjs/opennextjs-cloudflare

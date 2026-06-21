# 11. 배포 실패 진단 기록 (Workers Builds 클론·명령 오류)

> 2026-06-18 점검 기록. Cloudflare Workers Builds 첫 배포가 **계속 실패**하던 원인을 추적·확정한 실제 진단 로그 + 해결 절차.
> 관련: [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) · [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md) · [`08_deploy_record.md`](./08_deploy_record.md)
> 교육용 정리: [`12_workers_builds_guide.md`](./12_workers_builds_guide.md)

---

## 1. 한 줄 요약

GitHub 연결은 만들어졌으나 **권한 부여(grant)가 비어 있어 저장소 클론 단계에서 실패**, 게다가 **빌드/배포 명령이 OpenNext용이 아니어서** 클론을 고쳐도 배포가 안 되는 상태였다. Worker는 아직 대시보드 템플릿 placeholder(실배포 0회).

---

## 2. 점검 대상 / 환경

| 항목 | 값 |
|---|---|
| Cloudflare 계정 | `habitree.ai@gmail.com` |
| Account ID | `41610e7a867c4ab70a2413ae446f9479` |
| Worker(서비스) | `vibestater` (env: production) |
| script_tag | `6f13106104e349cca2093a58f9b1b3ef` |
| GitHub 저장소 | `habitree-ai/vibe_stater` (public, default `main`) |
| 저장소 상태 | 코드 정상 업로드됨(size ≈ 6.2MB, last push 2026-06-17 10:50 UTC) |
| 실패 빌드 | `4adbbfbd-4c00-4633-9c5d-47ac79ee6584` (outcome: **fail**) |

> 진단 시점에 Cloudflare 대시보드 SPA가 로딩 스플래시에서 멈춰(렌더 0) UI로 확인 불가 → **세션 쿠키 기반 내부 API(`/api/v4/...`)로 직접 조회**해 상태를 확정함(방법은 5장).

---

## 3. 핵심 발견 (근거 데이터)

### 3.1 Worker는 아직 "템플릿 placeholder" — 실배포 0회
```
deployment_id    : ""              ← 배포된 적 없음
last_deployed_from: "dash_template" ← 대시보드 템플릿으로 생성된 상태 그대로
has_assets       : false
handlers         : ["fetch"]
```

### 3.2 빌드 실패 지점 = 저장소 "클론" (빌드/배포 명령 이전)
빌드 로그:
```
Initializing build environment...
Success: Finished initializing build environment
Cloning repository...
Failed: error occurred while fetching repository   ← 여기서 중단
```

### 3.3 직접 원인 = repo 연결의 grant 누락
```
repo_connection:
  repo_name           : "vibe_stater"
  provider_type       : "github"
  provider_account_name: "habitree-ai"
  grant_id            : null        ← GitHub App 권한 부여가 비어 있음(핵심)
```
저장소가 public이어도 Workers Builds는 **GitHub App 설치 토큰으로 클론**하므로, grant가 없으면 "error occurred while fetching repository"로 실패한다.

### 3.4 2차 원인 = 빌드/배포 명령이 OpenNext용이 아님
| 항목 | 현재(잘못) | 올바른 값 |
|---|---|---|
| Build command | *(빈 값)* | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` | `npx opennextjs-cloudflare deploy` |

`wrangler.jsonc`의 `main`이 `.open-next/worker.js`인데, 이 파일은 `opennextjs-cloudflare build`로만 생성된다. 현재 설정은 빌드 없이 바로 `wrangler deploy`라 → 산출물이 없어 실패한다(클론을 고쳐도 재실패할 부분).

### 3.5 3차 위험 = Worker 이름 불일치
- 연결된 Worker: **`vibestater`**
- `wrangler.jsonc`의 `name`: **`creator-link-hub`**

배포 명령이 `wrangler.jsonc`의 `name`을 사용하므로, 그대로면 `creator-link-hub`라는 **다른 Worker로 배포**되어 `vibestater`는 영영 갱신되지 않는다. 둘 중 하나로 통일 필요(권장: `wrangler.jsonc`의 `name`을 `vibestater`로 변경, 또는 연결 Worker를 `creator-link-hub`로 재생성).

---

## 4. 해결 절차 (대시보드에서 직접 — 순서 중요)

> ①은 OAuth, ②③은 설정 변경이라 **사용자 직접 수행**이 필요/안전하다.

1. **GitHub 재연결(필수, 가장 먼저)**
   Workers & Pages → `vibestater` → **Settings → Build** → GitHub 연결 재인증(Manage/Reconnect) → `habitree-ai/vibe_stater`에 대한 접근 권한 부여.
   → `grant_id`가 채워져 클론이 가능해진다.

2. **빌드/배포 명령 수정**
   같은 Build 설정 화면에서:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
   - Root directory: `/` · Production branch: `main`

3. **Worker 이름 통일**
   `wrangler.jsonc`의 `name`을 `vibestater`로 변경 후 커밋·푸시(권장). 또는 연결을 `creator-link-hub` 이름의 Worker로 다시 만든다.

4. **빌드 환경변수 등록**
   Settings → Build → **Variables and secrets**:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, (Secret) `SUPABASE_SERVICE_ROLE_KEY`.
   → SSG/미들웨어가 빌드 타임에 필요로 하므로 없으면 빌드 실패.

5. **재배포**
   Builds 탭에서 Retry, 또는 새 커밋 push(`npm run ship "..."`). 성공 시 `deployment_id`가 채워지고 `*.workers.dev` URL로 접속 가능.

---

## 5. 재현 가능한 진단 방법 (대시보드가 멈췄을 때)

대시보드 UI가 안 뜰 때, 로그인된 세션 쿠키로 내부 API를 직접 호출해 상태를 확인할 수 있다(브라우저 콘솔/확장 도구에서, `dash.cloudflare.com` 출처에서 실행).

```js
const acc = '41610e7a867c4ab70a2413ae446f9479';
const bid = '<build_uuid>';

// 로그인 세션 확인
await (await fetch('/api/v4/user', {credentials:'include'})).json();

// 빌드 상세(상태·트리거·repo_connection)
await (await fetch(`/api/v4/accounts/${acc}/builds/builds/${bid}`, {credentials:'include'})).json();

// 빌드 로그(실패 지점)
await (await fetch(`/api/v4/accounts/${acc}/builds/builds/${bid}/logs`, {credentials:'include'})).json();

// Worker 배포 상태(deployment_id / last_deployed_from)
await (await fetch(`/api/v4/accounts/${acc}/workers/services/vibestater/environments/production/builds`, {credentials:'include'})).json();
```
- `build_outcome`, 로그의 마지막 `Failed:` 라인, `repo_connection.grant_id`, `script.deployment_id` 4개만 봐도 원인 대부분이 잡힌다.
- ⚠️ **트리거(빌드/배포 명령) 수정**은 대시보드 내부 전용 경로라 API로 안전하게 PATCH할 방법을 확인하지 못함 → UI에서 직접 수정 권장.

---

## 6. 교훈

- "GitHub 연결됨" ≠ "배포 가능". `grant_id`가 비면 **public 저장소도 클론 실패**한다.
- 빌드 실패는 **로그의 실패 지점부터** 본다(클론 vs 빌드 vs 배포). 지점에 따라 원인 카테고리가 갈린다.
- OpenNext 프로젝트는 **반드시** `opennextjs-cloudflare build/deploy`를 쓴다. 순수 `wrangler deploy`는 `.open-next` 산출물이 없어 실패.
- 연결 Worker 이름과 `wrangler.jsonc`의 `name`은 **일치**시켜야 같은 Worker가 갱신된다.

---

## 7. 처리 결과 (2026-06-18 실제 수행)

대시보드에서 직접 수행한 조치:

1. **GitHub 앱 권한 확인** — `github.com/settings/installations/140788606`에서 Cloudflare Workers and Pages 앱이 `habitree-ai/vibe_stater`에 접근 권한 보유 확인(이상 없음). → 문제는 GitHub이 아니라 Cloudflare 쪽 grant.
2. **Git 재연결(grant 복구)** — Build 설정에서 **Disconnect → Connect** 재실행. 계정 인증이 유효해 OAuth 재승인 없이 새 연결 생성. 결과: "You can now push a commit to start your first build" 배너 확인.
3. **빌드/배포 명령 수정** — 재연결 화면에서:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
4. **`wrangler.jsonc` 이름 통일** — 코드에서 `name`·`WORKER_SELF_REFERENCE.service`를 `creator-link-hub` → **`vibestater`** 로 변경(커밋·푸시 필요).

### 남은 사용자 작업 (값/시크릿 필요 — 직접)
- **빌드 환경변수 등록**: Settings → Build → Variables and secrets → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, (Secret) `SUPABASE_SERVICE_ROLE_KEY`. (실제 값은 Supabase/.env.local에서)
- **커밋·푸시로 첫 빌드 트리거**: `npm run ship "fix: wrangler name=vibestater + opennext build/deploy commands"` → main 푸시 시 자동 빌드.
- **검증**: Builds 탭에서 클론 단계 통과 + 빌드/배포 성공, `deployment_id` 채워짐, `*.workers.dev` 접속 확인.

## 참고 (검증 출처)
- Workers Builds(Git 연동): https://developers.cloudflare.com/workers/ci-cd/builds/
- OpenNext Cloudflare — Get Started: https://opennext.js.org/cloudflare/get-started

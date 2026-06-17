# 07. GitHub → Cloudflare 자동 배포 (Git 연동)

> 목표: **자체 서버 없이** 코드를 **GitHub**에 올리고, **Cloudflare Workers Builds**가
> 푸시를 감지해 자동으로 빌드·배포하도록 구성한다. (`git push` → 약 90초 후 전 세계 배포)
> 설정 파일 상세 내용은 [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) 참고.
> 본 문서는 **문서화/준비**이며 실제 적용은 이후 단계에서 진행한다.

---

## 전체 흐름

```
로컬 코드 ──(git push)──▶ GitHub 저장소 ──(연동/감지)──▶ Cloudflare Workers Builds
                                                              │  npx opennextjs-cloudflare build
                                                              │  npx opennextjs-cloudflare deploy
                                                              ▼
                                                  https://<app>.workers.dev  +  커스텀 도메인
```

- **배포 주체 = Cloudflare**(자체 서버/로컬에서 배포하지 않음).
- 코드 관리 = GitHub. 빌드/호스팅 = Cloudflare.
- 이후 모든 업데이트는 `git push` 한 번으로 자동 반영.

---

## 0. 선행 조건
- [ ] GitHub 계정 (없으면 생성 — 사용자 직접)
- [ ] Cloudflare 계정 + 도메인 Active (셋업 1편: [`service-setup/cloudflare/cloudflare_setup.md`](./service-setup/cloudflare/cloudflare_setup.md))
- [ ] 로컬에 Git 설치됨(완료) · Node 설치됨(완료)
- [ ] OpenNext 배포 파일 준비([`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) 2·3장)

---

## 1. 저장소 준비 (OpenNext 파일 + .gitignore)

배포가 CI에서 동작하려면 아래가 저장소에 포함/제외되어야 한다.

**포함(커밋)**: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`, `next.config.ts`(초기화 추가), `package.json`(scripts)
**제외(.gitignore)**: 아래를 추가
```
# OpenNext / Cloudflare
.open-next
.dev.vars
.wrangler
```
> `.env*`·`node_modules`·`.next`는 create-next-app 기본 `.gitignore`에 이미 포함.
> ⚠️ **시크릿 키(.env.local, .dev.vars)는 절대 커밋 금지.** 빌드 변수는 Cloudflare 대시보드에 등록(4장).

---

## 2. GitHub에 올리기

### 방법 A — GitHub CLI (`gh`) 사용 (권장, 가장 간단)
```powershell
# gh 미설치 시: winget install GitHub.cli  → 새 터미널에서 gh auth login (브라우저, 사용자 직접)
git init
git add .
git commit -m "chore: initial commit (Creator Link Hub)"
gh repo create creator-link-hub --private --source=. --remote=origin --push
```

### 방법 B — 웹에서 빈 저장소 생성 후 푸시
1. github.com → **New repository** → 이름 `creator-link-hub` → (README/.gitignore 추가 없이) **Create**.
2. 로컬에서:
```powershell
git init
git add .
git commit -m "chore: initial commit (Creator Link Hub)"
git branch -M main
git remote add origin https://github.com/<USERNAME>/creator-link-hub.git
git push -u origin main
```
> 푸시 시 GitHub 인증창(브라우저/PAT)이 뜨면 사용자가 직접 인증한다.

---

## 3. Cloudflare에 GitHub 저장소 연결 (Workers Builds)

1. Cloudflare 대시보드 → **Compute (Workers) → Workers & Pages** → **Create**.
2. **Import a repository** (Connect to Git) → **GitHub** 인증/권한 부여(사용자 직접) → `creator-link-hub` 선택.
3. 프로젝트(Worker) 이름: `creator-link-hub` (= `wrangler.jsonc`의 `name`과 일치 권장).

---

## 4. 빌드 설정 (Build configuration)

연결 화면 또는 프로젝트 **Settings → Builds**에서 지정:

| 항목 | 값 |
|---|---|
| Framework preset | Next.js (있으면 선택) |
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx opennextjs-cloudflare deploy` |
| Root directory | `/` (프로젝트 루트) |
| Production branch | `main` |

### 빌드 변수 & 시크릿 (중요)
**Settings → Build → Variables and secrets**(빌드 환경) 에 등록한다.
SSG 페이지가 빌드 시점에 값을 필요로 하므로 **CI 빌드 환경에도 반드시** 제공해야 한다.

- `NEXT_PUBLIC_*` (예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_APP_URL`) — 빌드 타임 번들 주입
- 비공개 키 (예: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`) — 빌드/런타임에서 필요한 경우
> 런타임 전용 시크릿은 **Settings → Variables (런타임)** 또는 `npx wrangler secret put <KEY>`로 별도 관리.
> 전체 변수 목록: [`00_setup_guide.md`](./00_setup_guide.md) 4장.

---

## 5. 첫 배포 & 확인
- 연결 직후 Cloudflare가 첫 빌드를 실행. **Builds** 탭에서 로그 확인.
- 성공 시 `https://creator-link-hub.<account>.workers.dev` 발급 → 접속 확인.
- 실패 시: 로그에서 누락된 빌드 변수/명령 오류 점검 후 재시도.

---

## 6. 커스텀 도메인 연결
- 도메인이 Cloudflare에 **Active** 상태여야 함(셋업 1편 완료).
- 프로젝트 → **Settings → Domains & Routes → Add → Custom domain** → 원하는 도메인/서브도메인 지정.
- DNS는 같은 Cloudflare 존이면 자동 구성.

---

## 7. 이후 업데이트 워크플로 (운영)
```powershell
# 코드 수정 후
git add .
git commit -m "feat: ..."
git push           # main 푸시 → Cloudflare가 자동 빌드·배포
```
- **Preview 배포**: `main`이 아닌 브랜치로 푸시하거나 PR을 열면 미리보기 URL이 생성됨(브랜치 빌드 활성화 시).
- 롤백: Builds/Deployments 목록에서 이전 성공 배포로 롤백 가능.

---

## 8. 체크리스트
- [ ] `.gitignore`에 `.open-next`·`.dev.vars`·`.wrangler` 추가, 시크릿 미커밋 확인
- [ ] OpenNext 파일 4종 커밋(06번 문서)
- [ ] GitHub 저장소 생성 + `main` 푸시
- [ ] Cloudflare에서 저장소 연결(Workers Builds)
- [ ] Build/Deploy command + 빌드 변수 등록
- [ ] 첫 배포 성공(`*.workers.dev` 접속)
- [ ] 커스텀 도메인 연결
- [ ] `git push` 자동 배포 동작 확인

## 참고 (검증 출처, 2026-06)
- Cloudflare Workers — Next.js 가이드: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext Cloudflare — Get Started: https://opennext.js.org/cloudflare/get-started
- Workers Builds(Git 연동): https://developers.cloudflare.com/workers/ci-cd/builds/

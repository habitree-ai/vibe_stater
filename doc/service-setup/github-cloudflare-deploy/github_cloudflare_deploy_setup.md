# GitHub → Cloudflare 자동 배포 연결 가이드 (배포편)

> 대상: 코드를 **GitHub**에 올리고 **Cloudflare Workers Builds**와 연결해,
> 이후 `git push`만으로 **자동 빌드·배포**되도록 만드는 9단계.
> 양식: [`../method_template.md`](../method_template.md) 기준. 화면 자막(STEP n/9)과 1:1 대응.
> 함께 보기: `github_cloudflare_deploy_manual.html`(매뉴얼), `github_cloudflare_deploy_walkthrough.mp4`(영상), `screens/`(캡처 9장).
> 실행 절차 상세: [`../../07_github_cloudflare_deploy.md`](../../07_github_cloudflare_deploy.md)

---

## 개요

| 항목 | 값 |
|---|---|
| 서비스 | GitHub + Cloudflare Workers (OpenNext) |
| 목적 | 자체 서버 없이 git push → 자동 빌드·배포 파이프라인 구성 |
| 단계 수 | 9 |
| 산출물 | 매뉴얼 HTML · 워크스루 영상(mp4) · 캡처 9장 · 본 문서 |
| 캡처 소스 | 로그인 대시보드는 보안상 **재현(representative)** — 실제 UI와 다를 수 있음 |
| 선행 조건 | OpenNext 배포 파일 구성([`../../06_deployment_cloudflare.md`](../../06_deployment_cloudflare.md)), Cloudflare 도메인 Active([`../cloudflare/cloudflare_setup.md`](../cloudflare/cloudflare_setup.md)) |
| 실제 저장소 | `https://github.com/habitree-ai/vibe_stater.git` |

> ⚠️ 안전 원칙: GitHub/Cloudflare **OAuth·권한 부여·시크릿 입력은 사용자가 직접** 수행. `.env*`·`.dev.vars`·시크릿은 커밋 금지(빌드 변수는 대시보드에 등록).

---

## 단계별 절차

### STEP 1/9 — 저장소에 올릴 파일 확인
- 화면: `screens/01_repo_files.png`
- 내용: 배포 설정 파일(`wrangler.jsonc`·`open-next.config.ts`·`public/_headers`·`next.config.ts`·`package.json`)이 포함되고, `.gitignore`에 `node_modules`·`.next`·`.open-next`·`.dev.vars`·`.env*`가 제외되는지 확인.

### STEP 2/9 — GitHub 새 저장소 생성
- 화면: `screens/02_gh_newrepo.png`
- URL: `https://github.com/new`
- 클릭 대상: 저장소 이름 입력 → **Create repository** (README/.gitignore 추가 없이 빈 저장소)

### STEP 3/9 — 로컬 → GitHub 푸시
- 화면: `screens/03_git_push.png`
- 명령:
  ```bash
  git init -b main
  git add -A
  git commit -m "chore: initial commit"
  git remote add origin https://github.com/habitree-ai/vibe_stater.git
  git push -u origin main
  ```
- 설명: 첫 푸시 시 인증창(브라우저/PAT)이 뜨면 **직접 인증**합니다.

### STEP 4/9 — Cloudflare에서 프로젝트 생성
- 화면: `screens/04_cf_create.png`
- URL: `https://dash.cloudflare.com` → **Workers & Pages → Create**
- 클릭 대상: **Import a repository**

### STEP 5/9 — GitHub 저장소 연결
- 화면: `screens/05_connect_git.png`
- 클릭 대상: **GitHub** 인증/권한 부여(직접) → `vibe_stater` 저장소 선택

### STEP 6/9 — 빌드/배포 명령 설정
- 화면: `screens/06_build_settings.png`
- 설정값:
  | 항목 | 값 |
  |---|---|
  | Build command | `npx opennextjs-cloudflare build` |
  | Deploy command | `npx opennextjs-cloudflare deploy` |
  | Production branch | `main` |

### STEP 7/9 — 빌드 변수 & 시크릿 등록
- 화면: `screens/07_build_vars.png`
- 위치: **Settings → Build → Variables and secrets**
- 설명: SSG가 빌드 타임에 값을 요구하므로 `NEXT_PUBLIC_*`는 변수로, 비공개 키는 시크릿으로 등록. (목록: [`../../00_setup_guide.md`](../../00_setup_guide.md) 4장)

### STEP 8/9 — 첫 배포 확인
- 화면: `screens/08_deployed.png`
- 설명: Builds 로그가 성공하면 `https://<project>.<account>.workers.dev`가 발급됩니다. 접속해 확인.

### STEP 9/9 — 커스텀 도메인 연결
- 화면: `screens/09_custom_domain.png`
- 위치: 프로젝트 → **Settings → Domains & Routes → Add → Custom domain**
- 설명: Cloudflare에 Active 상태인 도메인/서브도메인을 지정합니다.

---

## 완료 후 — 자동 배포 루프
연결이 끝나면 이후에는 **푸시만으로 자동 배포**됩니다.
```powershell
.\scripts\ship.ps1 "feat: 변경 내용"   # add + commit + push (→ Cloudflare 자동 빌드·배포)
```

## 완료 체크
- [ ] GitHub 저장소에 코드 푸시됨
- [ ] Cloudflare가 저장소와 연결됨(Workers Builds)
- [ ] Build/Deploy 명령 + 빌드 변수 등록
- [ ] 첫 배포 성공(`*.workers.dev`)
- [ ] (선택) 커스텀 도메인 연결
- [ ] `git push` → 자동 배포 동작 확인

## 참고
- 실행 가이드: [`../../07_github_cloudflare_deploy.md`](../../07_github_cloudflare_deploy.md)
- 처리 기록: [`../../08_deploy_record.md`](../../08_deploy_record.md)
- 재현 화면 안내: 로그인 대시보드는 보안·안전 원칙에 따라 재현했습니다.

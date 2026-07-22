> ⚠️ **SUPERSEDED — Cloudflare 시기 이력입니다.** 현재 배포는 **Vercel**(`main` push 자동배포)이며, 배포 정본은 `doc/13_vercel_deployment.md`. 아래 내용은 참고 기록으로만 보존합니다.

# 08. 배포 처리 기록 (GitHub 연결 · 자동 배포)

> 실제로 수행한 git/배포 처리의 **기록 + 재사용 가능한 방법론**. 같은 상황 재발 시 그대로 참고.
> 핸드오프 요약: [`service-setup/DEPLOY_HANDOFF.md`](./service-setup/DEPLOY_HANDOFF.md) · 실행 가이드: [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md)

---

## 1. 결과 요약

| 항목 | 값 |
|---|---|
| 원격 저장소 | `https://github.com/habitree-ai/vibe_stater.git` |
| 기본 브랜치 | `main` (origin/main 추적) |
| 최초 커밋 | `chore: initial commit — Creator Link Hub` (101개 파일, node_modules 제외) |
| 처리 일자 | 2026-06-17 |
| 자동 배포 | Cloudflare Workers Builds 연결 후 `git push` 시 자동 빌드·배포 |
| 자동 푸시 | `scripts/ship.ps1` (= `npm run ship`) |

---

## 2. 처리 중 발견한 문제와 해결 (중요 기록)

### 2.1 깨진 `.git` (init 중단)
- 증상: `Test-Path .git`는 True인데 `git status`는 *"not a git repository"*.
- 원인: `.git`에 **`objects/` 디렉터리가 없고 `config.lock`이 잔존** — `git init`이 중단된 불완전 상태.
- 해결:
  ```powershell
  Remove-Item .git -Recurse -Force
  git init -b main
  git config user.name "habitree-ai"
  git config user.email "<email>"
  git config core.autocrlf true
  ```
- 교훈: `.git/objects` 부재 = 깨진 repo. 히스토리가 없으면 `.git` 제거 후 재초기화가 가장 빠르다.

### 2.2 OneDrive 동기화 경로의 git 권한 문제
- 증상(병행 세션): 샌드박스에서 `.git` 조작이 `Operation not permitted`로 거부됨.
- 영향: 자동화 환경에서 git 커밋이 막힐 수 있음 → 사용자 셸/스크립트로 실행해 우회.
- 권장: 장기적으로 프로젝트를 **비동기 경로(`C:\dev\`)** 로 이전하거나, OneDrive에서 해당 폴더 동기화 제외.

### 2.3 CRLF 경고
- `warning: LF will be replaced by CRLF` 다수 → 무해. `core.autocrlf true`로 Windows 표준 처리.

### 2.4 첫 푸시 인증
- HTTPS 원격은 첫 푸시 시 **Git Credential Manager**가 브라우저 인증창을 띄움 → **사용자 직접** 완료.
- `gh` 미설치 환경이라 GCM 경로 사용. (대안: `gh auth login` 후 `gh repo create … --push`)

---

## 3. 재현 절차 (요약 명령)

```powershell
# 0) PATH 보정(필요 시)
$env:Path = "$env:ProgramFiles\Git\cmd;$env:Path"
# 1) (깨진 repo면) 정리 후 초기화
if (Test-Path .git) { Remove-Item .git -Recurse -Force }
git init -b main
git config user.name "habitree-ai"; git config user.email "<email>"
# 2) 커밋
git add -A
git commit -m "chore: initial commit"
# 3) 원격 연결 + 푸시(인증은 직접)
git remote add origin https://github.com/habitree-ai/vibe_stater.git
git push -u origin main
```

---

## 4. 자동 커밋·푸시 워크플로

```powershell
.\scripts\ship.ps1 "feat: 변경 내용"
# 또는
npm run ship -- "feat: 변경 내용"
```
- 동작: `git add -A` → 변경 없으면 종료 → `commit` → `push origin main`.
- 푸시 즉시 **Cloudflare Workers Builds**가 빌드(`npx opennextjs-cloudflare build`)·배포(`… deploy`)를 자동 수행.
- 전제: Cloudflare↔GitHub 연결 1회 완료(아래 5장).

---

## 5. 남은 직접 수행 단계 (인증 필요)
1. Cloudflare 대시보드 → **Workers & Pages → Create → Connect to Git** → `vibe_stater` Import.
2. Build `npx opennextjs-cloudflare build` / Deploy `npx opennextjs-cloudflare deploy` / 브랜치 `main`.
3. **빌드 변수·시크릿** 등록(`NEXT_PUBLIC_*` 등).
4. 첫 배포(`*.workers.dev`) 확인 → 이후 `ship.ps1`로 자동 배포.
- 화면별 안내: [`service-setup/github-cloudflare-deploy/`](./service-setup/github-cloudflare-deploy/) (매뉴얼·영상·캡처 9장) + [`service-setup/github-cloudflare-deploy/github_cloudflare_deploy_setup.md`](./service-setup/github-cloudflare-deploy/github_cloudflare_deploy_setup.md)

## 6. 관련 산출물
- 배포 설정 상세: [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md)
- 실행 가이드: [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md)
- 교육자료(캡처·영상): `service-setup/github-cloudflare-deploy/`
- 스크립트: `scripts/ship.ps1`, `deploy_push.ps1`(베이스), `deploy_update_guides.ps1`(가이드 반영 시연)

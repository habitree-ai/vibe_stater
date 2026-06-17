# 배포 핸드오프 & 작업 기록 (2026-06-17)

> Creator Link Hub를 **GitHub → Cloudflare 자동배포**로 올리기 위한 준비를 완료했습니다.
> 인증이 필요한 단계만 직접 진행하시면 됩니다. (기계 판독용: [`deploy_worklog.json`](./deploy_worklog.json))

---

## 제가 완료한 것 (코드/문서)

| 구분 | 내용 |
|---|---|
| 배포 설정 | `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars`, `public/_headers`, `next.config.ts`(초기화 추가), `.gitignore` 보강 |
| 의존성 | `@opennextjs/cloudflare ^1.19.11`, `wrangler ^4.101.0` 설치(package.json/lock 반영) |
| 가이드 자료(웹) | `src/data/guides.ts`, `src/components/sections/Guides.tsx`, `src/app/guides/page.tsx`, `public/guides/**`(매뉴얼 HTML·영상) |
| 배포 가이드(재현) | `doc/service-setup/github-cloudflare-deploy/` — 9단계 매뉴얼 HTML + 마우스포인터 영상 |
| 스크립트 | `deploy_push.ps1`(1단계), `deploy_update_guides.ps1`(2단계) |
| 작업 데이터 | `deploy_worklog.json` |

> ⚠ **git 커밋을 제가 직접 못 한 이유:** 작업 폴더가 OneDrive 동기화 경로라 샌드박스에서 `.git` 조작이 권한 거부(Operation not permitted)됩니다. 그래서 Windows에서 실행할 스크립트로 대체했습니다. (어차피 GitHub/Cloudflare 인증은 직접 하셔야 하는 부분과 동일한 맥락)

---

## 동혁님이 진행할 단계

### 1단계 — 베이스 배포 (현재 사이트, 가이드 제외)
PowerShell에서 프로젝트 루트(`habitree.ai`)에서:

```powershell
./deploy_push.ps1
```
- `.git` 정리 → `git init` → 가이드 파일 제외하고 첫 커밋.
- 이어서 안내되는 **GitHub 업로드**(둘 중 하나) 실행 — 인증창은 직접 로그인:
  - `gh auth login` 후 `gh repo create creator-link-hub --private --source=. --remote=origin --push`
  - 또는 웹에서 빈 저장소 생성 후 `git remote add origin … ; git push -u origin main`

### 2단계 — Cloudflare 연결 (직접)
1. Cloudflare 대시보드 → **Workers & Pages → Create → Connect to Git**
2. **GitHub 권한 부여(직접)** → `creator-link-hub` 저장소 Import
3. 빌드 설정: Build `npx opennextjs-cloudflare build` / Deploy `npx opennextjs-cloudflare deploy` / 브랜치 `main`
4. **빌드 변수 등록**(Settings → Build → Variables): `NEXT_PUBLIC_*` 등. 시크릿은 Secret으로.
5. 첫 배포 성공 → `https://creator-link-hub.<account>.workers.dev` 접속 확인

> 화면별 위치는 `doc/service-setup/github-cloudflare-deploy/`의 매뉴얼·영상을 참고하세요.

### 3단계 — 메인페이지에 가이드 반영 (자동배포 시연)
베이스 배포가 확인되면:

```powershell
./deploy_update_guides.ps1
```
- 홈에 **Guides 섹션** 추가 + 내비 '가이드' + `/guides` 페이지 자료를 커밋·푸시.
- `git push` 즉시 Cloudflare가 자동으로 빌드·배포 → 업데이트가 웹에 반영됩니다.

---

## 배포 전 로컬 점검(선택, 권장)
```powershell
npm run preview   # 로컬 Workers 런타임으로 프로덕션 유사 확인
```

## 안전 원칙
- 계정 인증·OAuth·시크릿 입력은 **직접** 진행(에이전트 대행 금지).
- `.env*`·`.dev.vars`·시크릿은 커밋 금지(이미 `.gitignore` 처리). 빌드 변수는 Cloudflare 대시보드에 등록.

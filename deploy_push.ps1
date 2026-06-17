# =====================================================================
#  [1단계] Creator Link Hub — 베이스 배포 (GitHub 업로드)
#  Windows PowerShell에서 프로젝트 루트(habitree.ai)에서 실행하세요.
#  · 가이드(/guides) 자료는 제외한 "현재 사이트 + 배포설정"만 커밋합니다.
#  · GitHub 인증은 본인이 직접 진행합니다 (안전 원칙).
#  상세: doc/07_github_cloudflare_deploy.md
# =====================================================================
$ErrorActionPreference = "Stop"
$RepoName = "creator-link-hub"   # 원하는 저장소 이름

Write-Host "1) 불완전한 .git 정리 (있으면)…" -ForegroundColor Cyan
if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" }

Write-Host "2) git 초기화…" -ForegroundColor Cyan
git init
git branch -M main
git add -A

Write-Host "3) 베이스 커밋 — 가이드 파일 제외…" -ForegroundColor Cyan
# /guides 관련 신규 파일은 2단계에서 반영하므로 베이스에서 제외
git reset -q -- src/data/guides.ts src/components/sections/Guides.tsx src/app/guides public/guides 2>$null
git commit -m "chore: initial commit — Creator Link Hub + Cloudflare(OpenNext) 배포 설정"

Write-Host ""
Write-Host "4) GitHub 업로드 — 아래 중 하나 (인증은 직접):" -ForegroundColor Yellow
Write-Host "   [A] gh auth login;  gh repo create $RepoName --private --source=. --remote=origin --push"
Write-Host "   [B] git remote add origin https://github.com/<USERNAME>/$RepoName.git;  git push -u origin main"
Write-Host ""
Write-Host "5) Cloudflare 연결(직접): Workers & Pages > Create > Connect to Git" -ForegroundColor Green
Write-Host "     Build:  npx opennextjs-cloudflare build"
Write-Host "     Deploy: npx opennextjs-cloudflare deploy"
Write-Host "   → 첫 배포(*.workers.dev) 확인되면 deploy_update_guides.ps1 실행(2단계)."
Write-Host "   상세: doc/service-setup/github-cloudflare-deploy/ 매뉴얼·영상"

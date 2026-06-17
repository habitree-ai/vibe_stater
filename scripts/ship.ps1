<#
  ship.ps1 — 변경사항을 한 번에 add + commit + push.
  푸시 즉시 Cloudflare Workers Builds가 자동으로 빌드·배포합니다.

  사용:
    .\scripts\ship.ps1 "feat: 변경 내용"
    .\scripts\ship.ps1            # 메시지 생략 시 타임스탬프 메시지 사용

  전제: GitHub 인증(최초 1회)과 Cloudflare↔GitHub 연결이 끝나 있어야 자동배포가 동작.
  상세: doc/07_github_cloudflare_deploy.md / doc/08_deploy_record.md
#>
param(
  [Parameter(Position = 0)]
  [string]$Message,
  [string]$Branch = "main"
)
$ErrorActionPreference = "Stop"

# 프로젝트 루트(이 스크립트의 상위)로 이동
Set-Location (Split-Path $PSScriptRoot -Parent)

# git PATH 보정(필요 시)
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  $env:Path = "$env:ProgramFiles\Git\cmd;$env:Path"
}

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "chore: update " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

Write-Host "1) staging…" -ForegroundColor Cyan
git add -A

# 변경이 없으면 종료
$pending = git status --porcelain
if ([string]::IsNullOrWhiteSpace($pending)) {
  Write-Host "변경사항이 없습니다. 종료합니다." -ForegroundColor Yellow
  exit 0
}

Write-Host "2) commit: $Message" -ForegroundColor Cyan
git commit -m $Message

Write-Host "3) push → origin/$Branch (→ Cloudflare 자동 배포)" -ForegroundColor Cyan
git push origin $Branch

Write-Host "완료. Cloudflare Builds 탭에서 배포 진행 상황을 확인하세요." -ForegroundColor Green

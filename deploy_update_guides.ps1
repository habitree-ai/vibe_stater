# =====================================================================
#  [2단계] 메인페이지에 셋업 가이드(/guides) 반영 → git push 자동배포
#  1단계(deploy_push.ps1)로 베이스 배포가 확인된 뒤 실행하세요.
#  이 스크립트는 홈에 Guides 섹션을 추가하고 가이드 자료를 커밋·푸시합니다.
# =====================================================================
$ErrorActionPreference = "Stop"

Write-Host "1) 홈 페이지에 Guides 섹션 연결…" -ForegroundColor Cyan
$page = @'
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Products } from "@/components/sections/Products";
import { Posts } from "@/components/sections/Posts";
import { Guides } from "@/components/sections/Guides";
import { EducationCTA } from "@/components/sections/EducationCTA";
import { Newsletter } from "@/components/sections/Newsletter";
import { Marquee } from "@/components/ui/Marquee";

const marqueeItems = [
  "AI 바이브코딩",
  "Next.js",
  "Supabase",
  "Stripe 결제",
  "Resend 이메일",
  "Vercel 배포",
  "독서 · 필사",
  "LINKMAP 연결",
  "1인 SaaS",
  "개인 브랜드",
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-y border-border/60 bg-card/50 py-4">
        <Marquee items={marqueeItems} />
      </div>
      <About />
      <Projects />
      <Products />
      <Posts />
      <Guides />
      <EducationCTA />
      <Newsletter />
    </>
  );
}
'@
Set-Content -Path "src/app/page.tsx" -Value $page -Encoding UTF8

Write-Host "2) 내비게이션에 '가이드' 추가…" -ForegroundColor Cyan
$site = Get-Content "src/lib/site.ts" -Raw
if ($site -notmatch '/guides') {
  $site = $site -replace '(\{ label: "교육", href: "/education" \},)', "`$1`r`n  { label: `"가이드`", href: `"/guides`" },"
  Set-Content -Path "src/lib/site.ts" -Value $site -Encoding UTF8
}

Write-Host "3) 가이드 자료 커밋 & 푸시…" -ForegroundColor Cyan
git add -A
git commit -m "feat: 메인페이지 셋업 가이드 섹션 + /guides (Cloudflare·배포)"
git push

Write-Host ""
Write-Host "완료 — Cloudflare가 자동으로 빌드·배포합니다. Builds 탭에서 진행 확인." -ForegroundColor Green

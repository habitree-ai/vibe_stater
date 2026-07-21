# Creator Link Hub — 문서 인덱스

> LINKMAP 부가서비스형 개인 브랜드 플랫폼. 기획 → 구현 → 배포 문서 모음.

## ⭐ LINKMAP 핵심 — 수동 설정 레지스트리
- [`10_env_config_registry.md`](./10_env_config_registry.md) — 사용자가 직접 설정해야 하는 변수/설정 총정리(무엇·발급처·적용처·관리)
- HTML 보드: [`../public/linkmap/env-board.html`](../public/linkmap/env-board.html) (배포 시 `/linkmap/env-board.html`) — 체크리스트·필터·진행률

## 👉 다음 작업 (핸드오프)
- [`CLAUDE_CODE_TASKS.md`](./CLAUDE_CODE_TASKS.md) — **다음 Claude Code 세션 작업 지시서**(현재 상태·우선순위·위험경고)

## 📒 작업·이슈 로그
- [`WORKLOG.md`](./WORKLOG.md) — 변경/이슈/데이터 로그(상위 기록). 런타임 로그는 `activity_logs` 테이블 + 서버 콘솔.

## 마스터 기획
- [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md) — 전체 기획서(IA·서비스맵·ERD·MVP)

## 실행 문서 (번호 순)
| # | 문서 | 내용 |
|---|---|---|
| 00 | [`00_setup_guide.md`](./00_setup_guide.md) | 개발 환경·외부 서비스·환경변수 |
| 01 | [`01_design_system.md`](./01_design_system.md) | 디자인 토큰·타이포·컬러 |
| 02 | [`02_main_page_plan.md`](./02_main_page_plan.md) | 메인페이지 섹션 기획 |
| 03 | [`03_sample_content.md`](./03_sample_content.md) | 샘플 데이터 명세 |
| 04 | [`04_roadmap.md`](./04_roadmap.md) | 단계별 실행 로드맵 |
| 05 | [`05_homepage_redesign.md`](./05_homepage_redesign.md) | 프리미엄 리디자인 기획 |
| 06 | [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) | Cloudflare 배포 세팅(설정 파일 상세) |
| 07 | [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md) | GitHub → Cloudflare 자동 배포(Git 연동) |
| 08 | [`08_deploy_record.md`](./08_deploy_record.md) | 배포 처리 기록·재현 방법론 |
| 09 | [`09_supabase_step3.md`](./09_supabase_step3.md) | Supabase 인증/DB(Step 3) |
| 10 | [`10_env_config_registry.md`](./10_env_config_registry.md) | ⭐ 수동 설정 레지스트리(LINKMAP 핵심) |
| 13 | [`13_vercel_deployment.md`](./13_vercel_deployment.md) | ⭐ Vercel 배포·환경변수 정리(현재 운영 배포) |
| 11 | [`11_deploy_troubleshooting_record.md`](./11_deploy_troubleshooting_record.md) | 배포 실패 진단 기록(클론·명령 오류, grant 누락) |
| 12 | [`12_workers_builds_guide.md`](./12_workers_builds_guide.md) | (교육용) Workers Builds 이해·배포 디버깅 |
| 15 | [`15_site_enhancement_2026-07.md`](./15_site_enhancement_2026-07.md) | 사이트 전면 고도화(관리자 허브·SEO/내비·기술 위생) |
| 16 | [`16_ebook_beginner_plan.md`](./16_ebook_beginner_plan.md) | 초보자용 무료 전자책 기획(A4 5쪽) |
| 17 | [`17_character_platform.md`](./17_character_platform.md) | ⭐ 캐릭터 자산 플랫폼 — HT-### 채번·고화질 분리·대시보드 |
| 18 | [`18_contact_notifications.md`](./18_contact_notifications.md) | ⭐ 문의 알림 — 메일(Resend)+카카오톡 나에게 보내기 |

## 서비스 셋업 가이드 시리즈
- [`service-setup/README.md`](./service-setup/README.md) — 시리즈 인덱스·추가 절차
- [`service-setup/method_template.md`](./service-setup/method_template.md) — HTML/영상 제작 방법론
- [`service-setup/_service_setup_template.md`](./service-setup/_service_setup_template.md) — 서비스별 markdown 표준 템플릿
- [`service-setup/cloudflare/cloudflare_setup.md`](./service-setup/cloudflare/cloudflare_setup.md) — 1편 Cloudflare(10단계)

## 현재 진행 상태
- ✅ 환경 세팅 · 메인페이지(프리미엄 리디자인) · 정적 하위 페이지(19 라우트)
- ✅ 서비스 셋업 문서화 체계(Cloudflare 1편) · Cloudflare 배포 문서
- ⬜ 다음: git/GitHub 연동 → Cloudflare 배포 → Supabase 인증/DB(로드맵 Step 3)

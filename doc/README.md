# Habitree — 문서 인덱스

> **Habitree**(vibe.habitree.io) — AI·바이브코딩·독서로 읽고 만들고 연결하는 개인 브랜드 플랫폼.
> 저장소 `habitree-ai/vibe_stater` · 배포 **Vercel**(`main` push 자동배포) · Next 16 / Supabase.
> (초기 기획 코드네임은 "Creator Link Hub" — 마스터 기획서 참조.)

## 마스터 기획
- [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md) — **Habitree 마스터 기획서**(통합본). Part Ⅰ=현재 정본(구현 반영), Part Ⅱ=상세 설계·계획(커머스 ERD·RLS·성공지표).
- [`_consolidation_plan.md`](./_consolidation_plan.md) — 통합 경위·문서 처분표·기획 vs 실제 괴리 13항목(작업 기록).

## ⭐ 정본 문서 (현재 진실)
| 문서 | 내용 |
|---|---|
| [`WORKLOG.md`](./WORKLOG.md) | 변경·이슈·데이터 로그(살아있는 기록). 런타임 로그는 `activity_logs` 테이블 |
| [`13_vercel_deployment.md`](./13_vercel_deployment.md) | **배포 정본** — Vercel 배포·환경변수 |
| [`10_env_config_registry.md`](./10_env_config_registry.md) | 환경변수·수동 설정 레지스트리 |
| [`14_homepage_v2_personality.md`](./14_homepage_v2_personality.md) | 메인페이지 디자인 정본(v2) |
| [`15_site_enhancement_2026-07.md`](./15_site_enhancement_2026-07.md) | 사이트 전면 고도화 기록 |
| [`16_ebook_beginner_plan.md`](./16_ebook_beginner_plan.md) | 초보자 무료 전자책(A4 5쪽) |
| [`17_character_platform.md`](./17_character_platform.md) | 캐릭터 자산 플랫폼(HT-### 채번) |
| [`18_contact_notifications.md`](./18_contact_notifications.md) | 문의·후원 알림(Resend + 카카오톡) |

## 실행 문서 (번호 순)
| # | 문서 | 내용 | 상태 |
|---|---|---|---|
| 00 | [`00_setup_guide.md`](./00_setup_guide.md) | 개발 환경·외부 서비스·env | 유지 |
| 01 | [`01_design_system.md`](./01_design_system.md) | 디자인 토큰 v0 | *14가 대체* |
| 02 | [`02_main_page_plan.md`](./02_main_page_plan.md) | 메인페이지 섹션 기획 | 유지 |
| 03 | [`03_sample_content.md`](./03_sample_content.md) | 샘플 데이터 명세 | 유지 |
| 04 | [`04_roadmap.md`](./04_roadmap.md) | 단계별 로드맵 | 갱신됨 |
| 05 | [`05_homepage_redesign.md`](./05_homepage_redesign.md) | 프리미엄 리디자인 v1 | *14가 대체* |
| 09 | [`09_supabase_step3.md`](./09_supabase_step3.md) | Supabase 인증/DB | **적용 완료**(기록) |
| 10 | [`10_env_config_registry.md`](./10_env_config_registry.md) | 환경변수 레지스트리 | 정본 |
| 13 | [`13_vercel_deployment.md`](./13_vercel_deployment.md) | Vercel 배포 | **정본** |
| 14~18 | 위 "정본 문서" 표 참조 | 디자인·고도화·기능 스펙 | 정본 |

## 🗄️ 아카이브 (폐기된 Cloudflare 배포 이력)
- [`archive/`](./archive/) — 06·07·08·11·12 이동. 배포는 Vercel(13)로 전환됨. → [`archive/README.md`](./archive/README.md)

## 서비스 셋업 가이드 시리즈
- [`service-setup/README.md`](./service-setup/README.md) — 시리즈 인덱스·제작 방법론
- [`service-setup/method_template.md`](./service-setup/method_template.md) · [`_service_setup_template.md`](./service-setup/_service_setup_template.md) — 제작 방법론·표준 템플릿
- ⚠️ Cloudflare 편(`cloudflare/`, `github-cloudflare-deploy/`, `DEPLOY_HANDOFF.md`)은 배포 전환으로 **SUPERSEDED**(미디어 보존 위해 원위치, 상단 배너 참조).

## 현재 진행 상태 (2026-07 기준)
- ✅ 메인페이지(디자인 v2) · 정적/동적 하위 페이지
- ✅ Supabase 인증·`profiles`·마이그레이션 0001~0015 적용 · 관리자 role
- ✅ 1:1 커피챗 · 문의(+메일·카카오 알림) · 뉴스레터 구독
- ✅ 후원 결제(**Polar**) · AI 챗봇(**OpenAI**) · 관리자 허브
- ✅ 캐릭터 자산 플랫폼(HT-001~105) · 초보자 전자책
- ✅ **Vercel** 자동배포(`vibe.habitree.io`) — Cloudflare에서 전환 완료
- ⬜ 다음: 문서 통합 마스터 확정 · 커머스(상품 판매) 파이프라인 · 분석 도구

# 문서 통합·정리본 (통합 실행 전 판단용)

> **성격**: "먼저 정리" 산출물. 이 문서는 파일을 **삭제·이동하지 않았다** — 아래 표를 기준으로 대표님이 판단해
> 통합/폐기를 직접(또는 지시로) 진행하기 위한 결정 자료다. 통합이 끝나면 이 문서 자체는 폐기 대상.
>
> **정본(=현재 진실) 소스**: 코드(`src/lib/site.ts`, `src/app/**`, `supabase/migrations/**`, `package.json`,
> `.vercel/repo.json`) + 최신 기록 문서(`WORKLOG` 2026-07-07 · `15` · `13` · `16` · `17`(07-22) · `18`).
> 오래된 기획/배포 문서보다 **코드와 최신 기록이 우선**한다.
>
> 작성 기준일: 2026-07-22

---

## 0. 한눈에 — 이 프로젝트의 실제 모습

| 항목 | 실제(정본) | 문서에 다르게 적힌 곳 |
|---|---|---|
| 브랜드명 | **Habitree** (약칭 HT), 태그라인 "바이브코딩 치트키" | 기획서·다수 문서 "Creator Link Hub" |
| 운영 도메인 | **vibe.habitree.io** (Vercel) | `habitree.ai`는 **미등록(NXDOMAIN)** — 계정·조직·폴더명일 뿐 |
| 저장소 | `github.com/habitree-ai/vibe_stater` | worker명 `creator-link-hub`(06/07, 무효) |
| 배포 | **Vercel** · `main` push 자동배포 | 06·07·08·11·12 = Cloudflare(폐기된 초기 시도) |
| 프레임워크 | **Next 16.2.9** / React 19 | (대부분 미표기 — AGENTS.md 근거) |
| 인증·DB | **Supabase** (프로젝트 `ofxzkwbqwpsjoeqjhrpl`, 마이그레이션 0001~0015 적용) | 09·10§C·CLAUDE_TASKS = "미적용" |
| 결제 | **Polar** (raw fetch · `polar-webhook` · `donations` 테이블) | 기획서·푸터·홈배지·sample.ts = "Stripe" |
| AI | **OpenAI `gpt-4o-mini`** (설정 DB `chat_settings`) | 기획서와 일치 ✅ |
| 이메일·알림 | **Resend + 카카오톡** 나에게 보내기 | 기획서엔 Resend만 |
| 분석 | **없음** | 기획서 "PostHog(권장)" |
| 커머스 코어 | **미구현** — 후원(Polar)+1:1 커피챗 모델로 운영 | 기획서 MVP P0 = products/orders/payments/entitlements |
| 실제 테이블(9) | profiles · coffee_chat_requests · activity_logs · contact_messages · newsletter_subscribers · chat_settings · character_assets · notification_tokens · donations | 기획서 ERD의 20+ 테이블 대부분 미생성 |

---

## 1. 통합 마스터 기획서 — 제안 목차 + 문서 매핑

기존 `linkmap_personal_platform_plan.md`를 **뼈대로 유지**하되, "계획"과 "현재 구현"을 분리하고
명칭·스택·배포를 정본으로 교체한다. 아래는 통합 마스터의 제안 목차와, 각 절에 흡수할 기존 문서다.

| 통합 마스터 절 | 내용 | 흡수·참조할 기존 문서 |
|---|---|---|
| 1. 프로젝트 정의 | 명칭(Habitree, 코드네임 Creator Link Hub 각주)·목적·포지션 | master §1 |
| 2. 브랜드·도메인 규칙 | habitree / `.io`(운영) vs `.ai`(계정·폴더) 구분, 정본 상수 위치 | `src/lib/site.ts` · WORKLOG 06-25 |
| 3. 서비스맵·스택 | 실제 스택(Vercel·Supabase·Polar·OpenAI·Resend·Kakao) | master §2·§3 (Stripe→Polar 교체, PostHog 강등) |
| 4. 정보구조(IA) | **구현된 라우트** + **계획 라우트** 2단 표기 | master §4 + 실제 `src/app/**` |
| 5. 데이터 모델 | 현재 9테이블(정본) + 계획 ERD(커머스) 분리 | master §5·§6 + `supabase/migrations/**` |
| 6. 기능 현황 | 구현됨 / 부분 / 계획 매트릭스 | 15·16·17·18 + WORKLOG |
| 7. 배포·운영 | Vercel 자동배포·env·트러블 | **13**(정본) + 10 |
| 8. 환경변수 | 단일 소스 링크 | **10**(정본), 나머지는 링크만 |
| 9. 로드맵 | 완료/진행/다음 재작성 | 04 재작성 + master §11 |
| 10. 디자인 기준 | v2 정본 | **14**(정본, 01·05 흡수) |
| 11. 하위 문서 인덱스 | 기능별 상세 문서 링크 | README 재작성 |

---

## 2. 문서 처분표 (보존 / 개정 / 흡수 / 아카이브)

28개 문서 전체. **처분은 제안일 뿐 — 실행은 대표님 판단.**

### ✅ 보존 (현재 진실 · 계속 참조)
| 문서 | 역할 | 비고 |
|---|---|---|
| `WORKLOG.md` | 변경·이슈 로그 | 살아있는 문서. 유지 |
| `13_vercel_deployment.md` | 배포 정본 | 06/07의 배포 역할을 대체·승격 |
| `10_env_config_registry.md` | 환경변수 정본 | 단, §B(Cloudflare)·§C(Supabase 미등록) **개정 필요** |
| `15_site_enhancement_2026-07.md` | 고도화 기록 | 유지 |
| `16_ebook_beginner_plan.md` | 전자책 기능 스펙 | 유지 |
| `17_character_platform.md` | 캐릭터 자산 스펙 | 유지(최신 07-22) |
| `18_contact_notifications.md` | 문의·후원 알림 스펙 | 유지 |
| `14_homepage_v2_personality.md` | 디자인 v2 정본 | 01·05 흡수 |
| `02_main_page_plan.md` · `03_sample_content.md` | 페이지·샘플 데이터 스펙 | 마스터 §4/§5로 흡수 검토 |

### ✏️ 개정 (상태가 stale — 정본 기준 갱신)
| 문서 | 문제 | 조치 |
|---|---|---|
| `README.md` | "다음=Cloudflare 배포→Step3" — 가장 심하게 stale | 인덱스+현재상태 전면 재작성 |
| `04_roadmap.md` | 커서가 Step2, 배포=Cloudflare | 완료 Step 반영·Vercel로 |
| `CLAUDE_CODE_TASKS.md` | 완료된 작업을 미완으로 지시(2026-06-17) | 재작성 또는 은퇴 |
| `09_supabase_step3.md` | "Supabase 미생성" 전제 | 아카이브 또는 "적용 완료"로 갱신 |
| `00_setup_guide.md` | env 블록이 10과 중복 | env는 10 링크로 축약 |
| `01_design_system.md`·`05_homepage_redesign.md` | 14가 부분 대체 | 14로 흡수 후 아카이브 |

### 📦 아카이브 (폐기된 Cloudflare 이력 — `doc/archive/`로 이동 제안)
| 문서 | 사유 |
|---|---|
| `06_deployment_cloudflare.md` | Cloudflare 배포 세팅 — 13이 대체 |
| `07_github_cloudflare_deploy.md` | GitHub→CF 자동배포 — 폐기 경로 |
| `08_deploy_record.md` | CF 배포 처리 기록 — 이력 |
| `11_deploy_troubleshooting_record.md` | CF Workers 첫배포 진단 — 이력 |
| `12_workers_builds_guide.md` | CF 교육용 — 폐기 경로 |
| `service-setup/DEPLOY_HANDOFF.md` | `deploy_push.ps1` 실행 지시(위험) — CLAUDE_TASKS가 이미 금지로 뒤집음 |
| `service-setup/cloudflare/cloudflare_setup.md` | CF 가입 가이드 — 폐기 경로 |
| `service-setup/github-cloudflare-deploy/…setup.md` | GitHub→CF 연결 가이드 — 폐기 경로 |

> 아카이브 시 각 문서 상단에 `> ⚠️ SUPERSEDED — 배포는 Vercel(13). 이 문서는 Cloudflare 시기 이력.` 배너 1줄 추가 권장.

### 🔁 통합의 씨앗 (마스터로 합쳐진 뒤 폐기 가능)
| 문서 | 편입처 |
|---|---|
| `linkmap_personal_platform_plan.md` | → 통합 마스터의 뼈대(재작성) |
| `04_roadmap.md` | → 마스터 §9 로드맵 |

### 🧩 셋업 시리즈(방법론) — 유지하되 상태 주석
`service-setup/README.md` · `method_template.md` · `_service_setup_template.md` — HTML/영상 제작 방법론이라 유지.
단 "GitHub/Supabase/Stripe/Resend ⬜예정" 표기가 **기능 미구현으로 오독**될 수 있음(실제 기능은 구현됨,
'가입 가이드 콘텐츠'만 미작성). "가이드 콘텐츠 미작성"으로 문구 명확화. Stripe편 계획은 **Polar편**으로 교체.

---

## 3. 배포 정리 — Vercel 현행 확정

**사실(근거 파일):**
- `.vercel/repo.json` — Vercel 프로젝트 `vibe-stater`(`prj_B08Sub…`)에 링크됨
- `scripts/ship.ps1` — `git add→commit→push origin main`만. 주석: "push 즉시 Vercel 자동 빌드·배포(vibe.habitree.io)"
- `next.config.ts` — 순수 Next 설정. **OpenNext/Cloudflare 어댑터 없음**
- **없는 파일**: `vercel.json`, `wrangler.jsonc/toml`, `open-next.config.ts`, `.github/workflows/`
- Cloudflare 잔재: `.wrangler/state/`(빈 폴더), `.dev.vars`(`NEXTJS_ENV=development` 한 줄), `.gitignore` 항목 — **모두 비활성 이력**

**정리안:**
1. 배포 정본 문서 = `13_vercel_deployment.md`. README/04/CLAUDE_TASKS의 배포 서술을 여기로 통일.
2. 06·07·08·11·12 = §2 아카이브 처리(배너 + `doc/archive/`).
3. `10_env_config_registry.md` §B(Cloudflare "연결 진행 중") 삭제, 적용처를 Vercel로 일원화.
4. (선택) `.wrangler/`·`.dev.vars`·`deploy_push.ps1`·`deploy_update_guides.ps1` 등 잔재 파일 정리 — **별도 판단**.

---

## 4. 괴리 목록 (기획/문서 vs 실제) + 권고

| # | 항목 | 문서 표기 | 실제(정본) | 근거 | 권고 |
|---|---|---|---|---|---|
| 1 | 프로젝트명 | Creator Link Hub | **Habitree(HT)** | `src/lib/site.ts` | 마스터 명칭=Habitree, Creator Link Hub는 기획 코드네임 각주 |
| 2 | 배포 | Cloudflare(06~12) | **Vercel** main-push | `.vercel/repo.json`·`ship.ps1`·13·15 | CF 문서 아카이브, 13 정본화 |
| 3 | 결제 | Stripe | **Polar** | `api/donate`·`api/polar-webhook`·mig 0015 | 스택·카피 Polar로. 푸터·홈배지·sample.ts "Stripe" 수정 |
| 4 | AI | OpenAI | OpenAI `gpt-4o-mini` | `api/chat`·`chat_settings` | **일치** — 모델 카탈로그만 최신화 |
| 5 | 커머스 코어 | products/orders/payments/entitlements = MVP P0 | **미구현**, 후원+커피챗으로 대체 | migrations엔 `donations`만 | 마스터에서 커머스=계획(Phase 2)로 강등, 현재=후원 모델 명시 |
| 6 | 분석 | PostHog(권장) | **미사용**(코드 0건) | grep 0 | "계획" 표기 또는 제거 |
| 7 | 알림 | Resend | Resend + **Kakao** | `src/lib/notify.ts` | Kakao 채널 마스터에 추가 |
| 8 | 도메인 | `habitree.ai` 다수 | 운영 **`vibe.habitree.io`**(.io), `.ai`=NXDOMAIN | `site.ts`·WORKLOG 06-25 | `.io`=운영 / `.ai`=계정·폴더 명시, 코드 `.ai` 금지 |
| 9 | repo/worker | `creator-link-hub`(06/07) | repo `vibe_stater` / Vercel `vibe-stater` | 08·11·`.vercel/repo.json` | worker명 폐기, repo=vibe_stater 통일 |
| 10 | 진행 상태 | README/04/CLAUDE_TASKS: Step3 이전·CF 예정 | 인증·커피챗·문의·뉴스레터·관리자·캐릭터·전자책·Vercel **완료** | WORKLOG·15·16·17·18 | 3개 문서 상태 재작성 |
| 11 | Next 버전 | (미표기) | **Next 16.2.9** / React 19 | `package.json` | AGENTS.md 근거로 명시 |
| 12 | Supabase | 09/10§C: 미적용 | 프로젝트 생성·0001~0015 적용 | migrations·WORKLOG | 09 아카이브, 10§C 갱신 |
| 13 | 핸드오프 충돌 | DEPLOY_HANDOFF: `deploy_push.ps1` 실행 | CLAUDE_TASKS: 실행 금지(.git 삭제 위험) | 두 문서 | DEPLOY_HANDOFF 아카이브, 위험 스크립트 정리 |

**⚠️ 사용자 대면 영향(우선 처리 권장):** #3 — 푸터 "Built with Next.js · Supabase · **Stripe** · Vercel"(`src/components/layout/Footer.tsx:68`),
홈 기술 배지(`src/generated/homeMarkup.ts`), `src/data/sample.ts:542`가 실제와 다른 결제사(Stripe)를 방문자에게 노출 중.

---

## 5. 명칭 3층 — 한 번에 정리

| 층위 | 값 | 쓰이는 곳 | 규칙 |
|---|---|---|---|
| 기획 코드네임 | Creator Link Hub | 초기 기획서 | 마스터에 "코드네임"으로만 1회 각주, 신규 사용 금지 |
| 저장소/프로젝트 | `vibe_stater`(repo) · `vibe-stater`(Vercel) | GitHub·Vercel | 기술 식별자로 유지 |
| 운영 브랜드 | **Habitree** / `vibe.habitree.io` | 사용자 대면 전체 | 모든 카피·문서의 표준 |

- `.ai` vs `.io`: 계정·조직(`habitree-ai`)·OneDrive 폴더·이메일은 `.ai` 계열, **운영 도메인은 `.io`**. 코드/문서에서 `habitree.ai`를 도메인으로 쓰면 실장애(로그인 DNS 오류, WORKLOG 06-25 실제 발생).

---

## 6. 실행 순서 — 진행 현황 (2026-07-22)

1. ✅ **통합 마스터 확정** — [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md)로 통합(Part Ⅰ 정본 + Part Ⅱ 설계 보존). 초안 파일은 제거.
2. ✅ **아카이브** — CF 문서 5개 `doc/archive/` 이동 + 배너, service-setup CF 가이드 3개 제자리 배너.
3. ✅ **개정** — README·04·CLAUDE_TASKS·09·10(§B/C/D/F) 상태 갱신.
4. ✅ **카피 수정** — Footer/홈 마퀴/sample.ts의 Stripe→Polar, Footer 워드마크 LINK HUB→HABITREE.
5. ⬜ **디자인 통합(잔여)** — `01`·`05` → `14`로 물리적 흡수는 미실행(현재는 README/마스터에서 `14`를 정본으로 표기만).
6. ⬜ **커머스 파이프라인** — Part Ⅱ §B 설계 기준으로 상품 판매(Polar) 구현(향후).

> 이 문서는 통합 경위·괴리 근거 기록으로 보존한다(필요 없어지면 폐기).

# Claude Code 작업 지시서 (핸드오프)

> 다음 Claude Code 세션이 이어받아 진행할 **남은 작업 목록**. 최신 상태 기준(2026-06-17).
> 이 문서가 [`service-setup/DEPLOY_HANDOFF.md`](./service-setup/DEPLOY_HANDOFF.md)의 staged 계획을 **대체**한다(아래 ⚠️ 참고).

---

## 0. 현재 상태 스냅샷 (이미 완료 — 다시 하지 말 것)

| 항목 | 상태 |
|---|---|
| 저장소 | `https://github.com/habitree-ai/vibe_stater.git` (브랜치 `main`, origin 추적) |
| 푸시 | ✅ 전체 코드+문서 푸시 완료 (가이드/guides 포함) — 커밋 `1cf7ec9`, `4d94b97` |
| 자동 푸시 | ✅ `scripts/ship.ps1` (= `npm run ship`) 동작 검증됨 |
| 배포 설정 | ✅ `wrangler.jsonc`·`open-next.config.ts`·`.dev.vars`·`public/_headers`·`next.config.ts`·`.gitignore` |
| 의존성 | ✅ `@opennextjs/cloudflare ^1.19.11`, `wrangler ^4.101.0` 설치됨 |
| 빌드 | ✅ `npm run build` 통과(19 라우트), dev 서버 정상 |
| 문서 | ✅ `doc/00~08`, `doc/service-setup/**`(Cloudflare 가입·GitHub→CF 배포 가이드+영상) |

### ⚠️ 절대 하지 말 것
- **`deploy_push.ps1` 실행 금지.** 내부에서 `Remove-Item -Recurse -Force .git`로 **git 히스토리를 삭제하고 재초기화**한다. 이미 푸시된 상태이므로 실행하면 원격 추적/히스토리가 깨진다.
- `deploy_update_guides.ps1`(가이드 단계 시연)도 **불필요** — 가이드는 이미 커밋/푸시됨.
- `.env*`·`.dev.vars`·시크릿 **커밋 금지**(이미 `.gitignore` 처리). 계정 인증·OAuth·시크릿 입력은 **사용자 직접**.

### 작업 규칙
- 변경 후 푸시는 **`.\scripts\ship.ps1 "메시지"`** 사용(= 자동 배포 트리거).
- 셸 PATH 보정 필요 시: `$env:Path = "$env:ProgramFiles\nodejs;$env:ProgramFiles\Git\cmd;$env:Path"`.
- 푸시/빌드 전 `npm run build`로 타입·정적 생성 확인.
- OneDrive 동기화 경로라 `.git` 권한 이슈 가능 — 막히면 [`08_deploy_record.md`](./08_deploy_record.md) 2장 참고.

---

## 1. [사용자 1회 인증] Cloudflare ↔ GitHub 연결
에이전트가 대행 불가. 사용자가 직접:
1. Cloudflare → **Workers & Pages → Create → Connect to Git** → `vibe_stater` Import
2. Build `npx opennextjs-cloudflare build` / Deploy `npx opennextjs-cloudflare deploy` / 브랜치 `main`
3. **빌드 변수**(`NEXT_PUBLIC_*` 등) 등록 → 첫 배포(`*.workers.dev`) 확인
- 화면 안내: [`service-setup/github-cloudflare-deploy/github_cloudflare_deploy_setup.md`](./service-setup/github-cloudflare-deploy/github_cloudflare_deploy_setup.md)
- **에이전트 역할**: 연결 후 사용자가 배포 URL을 주면 접속 확인을 돕고, 실패 시 빌드 로그 원인(누락 변수/명령) 진단.

## 2. [에이전트] Pretendard 폰트 셀프호스팅
- 목적: `src/app/layout.tsx`의 외부 CDN `<link>`(jsdelivr Pretendard) 의존 제거 → 배포 안정성·성능.
- 작업: `next/font/local`(또는 `next/font/google` 대체)로 전환, `--font-sans` 변수 연결, CDN link 삭제.
- 수용 기준: `npm run build` 통과 + 한글 폰트가 CDN 없이 렌더.

## 3. [에이전트] 로드맵 Step 3 — Supabase 인증/DB
참고: [`04_roadmap.md`](./04_roadmap.md) Step 3, [`linkmap_personal_platform_plan.md`](./linkmap_personal_platform_plan.md) 6·13장.
1. `@supabase/supabase-js`·`@supabase/ssr` 설치, `src/lib/supabase/{client,server}.ts` 생성.
2. `.env.local` + Cloudflare 빌드변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. `profiles` 테이블 + RLS(기획서 6.1/13장) — 마이그레이션 SQL을 `supabase/migrations/`에 작성.
4. `/login`·`/signup` 폼을 실제 Supabase Auth로 연결(현재는 정적 placeholder), `/me` 마이페이지 골격.
5. 관리자 role 분기.
- 수용 기준: 로컬에서 회원가입→로그인→`/me` 동작, 빌드 통과.
- ⚠️ Supabase 프로젝트 생성·키 발급은 **사용자**. (셋업 시리즈 4편 문서화 대상)

## 4. [에이전트, 선택] 저장소/CI 정비
- 루트의 `deploy_push.ps1`(위험)·`deploy_update_guides.ps1`(불필요)을 `scripts/legacy/`로 이동하거나 헤더에 "사용 안 함" 경고 추가.
- README(루트)에 프로젝트 소개·실행/배포 요약 추가.
- (선택) GitHub 기본 브랜치 보호·PR 템플릿.

## 5. [에이전트, 후속] 서비스 셋업 시리즈 확장
- `_service_setup_template.md` 기반으로 **Supabase·Stripe·Resend·GitHub** 가입 편 추가.
- 영상/캡처 렌더 파이프라인(Python+cairosvg+ffmpeg)은 현재 미설치 → 필요 시 설치 후 진행([`service-setup/method_template.md`](./service-setup/method_template.md) 3장).

---

## 우선순위 요약
1. (사용자) Cloudflare 연결 → 첫 배포 — **가장 먼저**
2. (에이전트) Pretendard 셀프호스팅 — 빠른 안정화
3. (에이전트) Supabase Step 3 — 핵심 기능 전진
4. 정비/확장(선택)

## 참고 문서
- 배포: [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) · [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md) · [`08_deploy_record.md`](./08_deploy_record.md)
- 전체 인덱스: [`README.md`](./README.md)

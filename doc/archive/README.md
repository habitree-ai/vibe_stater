# 아카이브 — 폐기·대체된 문서

> **새 작업의 근거로 쓰지 말 것.** 각 문서를 대체한 정본은 아래에 표기.

## 1. Cloudflare 배포 시기 이력
현재 운영 배포는 **Vercel**(`main` push 자동배포, `vibe.habitree.io`) — 배포 정본은 [`../13_vercel_deployment.md`](../13_vercel_deployment.md).
남긴 이유: 당시 트러블슈팅 기록·"GitHub↔배포 자동화" 방법론의 참고 가치.

| 문서 | 원위치 | 내용 |
|---|---|---|
| `06_deployment_cloudflare.md` | doc/06 | Cloudflare/OpenNext 배포 세팅 상세 |
| `07_github_cloudflare_deploy.md` | doc/07 | GitHub→Cloudflare 자동배포 흐름 |
| `08_deploy_record.md` | doc/08 | git 초기화·최초 배포 처리 기록 |
| `11_deploy_troubleshooting_record.md` | doc/11 | Workers Builds 첫 배포 실패 진단 |
| `12_workers_builds_guide.md` | doc/12 | (교육용) Workers Builds 이해·디버깅 |

## 2. 이전 세대 디자인 문서
디자인 정본은 [`../14_homepage_v2_personality.md`](../14_homepage_v2_personality.md)(v2) + `src/app/globals.css`. 계보·승계 토큰은 14 상단 참조.

| 문서 | 원위치 | 세대 |
|---|---|---|
| `01_design_system.md` | doc/01 | v0 토큰(emerald/sky·HSL·Inter) |
| `05_homepage_redesign.md` | doc/05 | v1 "Editorial × Tech"(Space Grotesk·violet aurora) |

관련 셋업 가이드(스크린샷·영상 포함)는 미디어 보존을 위해 원위치에 두되 상단에 SUPERSEDED 배너를 달았다:
`doc/service-setup/DEPLOY_HANDOFF.md`, `doc/service-setup/cloudflare/`, `doc/service-setup/github-cloudflare-deploy/`.

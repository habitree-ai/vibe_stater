# 아카이브 — Cloudflare 배포 시기 이력

> 이 폴더의 문서는 **폐기된 초기 배포 방식(Cloudflare Workers / OpenNext)** 의 기록이다.
> 현재 운영 배포는 **Vercel**(`main` push 자동배포, 운영 도메인 `vibe.habitree.io`)이며,
> **배포 정본 문서는 [`../13_vercel_deployment.md`](../13_vercel_deployment.md)** 이다.
>
> 삭제하지 않고 남겨 둔 이유: 당시 트러블슈팅 기록(빌드 실패 원인·grant 누락 등)과
> "GitHub↔배포 자동화" 방법론이 이후에도 참고 가치가 있기 때문. **새 작업의 근거로 쓰지 말 것.**

| 문서 | 원위치 | 내용 |
|---|---|---|
| `06_deployment_cloudflare.md` | doc/06 | Cloudflare/OpenNext 배포 세팅 상세 |
| `07_github_cloudflare_deploy.md` | doc/07 | GitHub→Cloudflare 자동배포 흐름 |
| `08_deploy_record.md` | doc/08 | git 초기화·최초 배포 처리 기록 |
| `11_deploy_troubleshooting_record.md` | doc/11 | Workers Builds 첫 배포 실패 진단 |
| `12_workers_builds_guide.md` | doc/12 | (교육용) Workers Builds 이해·디버깅 |

관련 셋업 가이드(스크린샷·영상 포함)는 미디어 보존을 위해 원위치에 두되 상단에 SUPERSEDED 배너를 달았다:
`doc/service-setup/DEPLOY_HANDOFF.md`, `doc/service-setup/cloudflare/`, `doc/service-setup/github-cloudflare-deploy/`.

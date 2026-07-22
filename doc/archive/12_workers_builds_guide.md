> ⚠️ **SUPERSEDED — Cloudflare 시기 이력입니다.** 현재 배포는 **Vercel**(`main` push 자동배포)이며, 배포 정본은 `doc/13_vercel_deployment.md`. 아래 내용은 참고 기록으로만 보존합니다.

# 12. (교육용) Cloudflare Workers Builds 이해와 배포 디버깅

> 비개발자/입문자 교육용 정리. "왜 배포가 안 되는가"를 스스로 진단할 수 있게 **흐름 → 실패 지점 → 점검법** 순으로 설명한다.
> 실제 사례 기록: [`11_deploy_troubleshooting_record.md`](./11_deploy_troubleshooting_record.md)

---

## 1. 큰 그림 — 코드가 사이트가 되기까지

```
내 PC                GitHub                  Cloudflare Workers Builds            전 세계
─────              ────────                 ───────────────────────            ────────
코드 작성  ─push→  저장소(main)  ─감지→   ① 클론(코드 가져오기)
                                          ② 빌드(opennextjs-cloudflare build)
                                          ③ 배포(opennextjs-cloudflare deploy)  ─→  *.workers.dev
```

핵심 개념 세 가지:
- **배포 주체는 Cloudflare다.** 내 PC가 아니라 Cloudflare 서버가 빌드·배포한다. 나는 `git push`만 하면 된다.
- **GitHub은 "코드 창고", Cloudflare는 "공장+가게".** 창고(GitHub)에 물건을 넣어두면, 공장(Workers Builds)이 가져다 가공해서 가게(workers.dev)에 진열한다.
- **연결되었다 ≠ 권한이 있다.** 창고 주소를 등록해도, 창고 문 열쇠(권한 grant)가 없으면 공장이 물건을 못 꺼낸다.

---

## 2. 이 프로젝트가 "특별한" 이유 — OpenNext

이 사이트는 **Next.js**다. Next.js는 그냥 Cloudflare에 올릴 수 없고, **OpenNext 어댑터**가 Cloudflare Workers용으로 변환해줘야 한다.

| 일반 정적 사이트 | 이 프로젝트(Next.js + OpenNext) |
|---|---|
| 그냥 파일 업로드 | `opennextjs-cloudflare build`로 **변환** 후 배포 |
| `wrangler deploy`로 충분 | `opennextjs-cloudflare deploy` 사용해야 함 |

→ 그래서 빌드/배포 명령을 반드시 OpenNext 명령으로 맞춰야 한다. 순수 `wrangler deploy`만 쓰면 "변환 결과물(`.open-next/worker.js`)"이 없어서 실패한다.

---

## 3. 배포가 실패하는 3대 지점 (그리고 증상)

빌드 로그를 보면 **어디서** 멈췄는지로 원인을 좁힐 수 있다.

| 멈춘 지점 | 로그에 보이는 신호 | 흔한 원인 | 해결 |
|---|---|---|---|
| ① 클론 | `Cloning repository... Failed: error occurred while fetching repository` | GitHub **권한(grant) 누락**, 저장소/브랜치 없음 | GitHub 재인증, 저장소·`main` 브랜치 확인 |
| ② 빌드 | `npm error`, `Module not found`, `Missing env` 등 | **환경변수 미등록**, 코드 오류, 잘못된 빌드 명령 | 빌드 변수 등록, 명령 `opennextjs-cloudflare build`로 |
| ③ 배포 | `worker.js not found`, 이름/권한 오류 | 빌드 산출물 없음, **Worker 이름 불일치**, 배포 명령 오류 | 배포 명령 `opennextjs-cloudflare deploy`, 이름 통일 |

> 우리 사례(11번 문서)는 **①에서 실패**했고, 고쳐도 **②③ 설정도 틀려** 있던 복합 케이스였다.

---

## 4. "연결됐는데 왜 안 되지?" — grant의 의미

GitHub 연결은 두 단계다:
1. **저장소 등록** — "이 저장소를 쓸게요" (주소 적기)
2. **권한 부여(grant)** — "Cloudflare가 내 저장소를 읽어도 돼요" (열쇠 주기, GitHub에서 OAuth로 승인)

`grant_id`가 `null`이면 2단계가 안 된 것. 1단계만 되어 있으면 목록엔 보이지만 **클론은 실패**한다. → GitHub App을 다시 인증(Reconnect)해서 열쇠를 줘야 한다. **이 단계는 본인 GitHub 계정 로그인이 필요하므로 반드시 직접 한다.**

---

## 5. 스스로 점검하는 순서 (체크리스트)

1. **로그 먼저** — Builds 탭에서 실패 빌드의 로그를 열어 마지막 `Failed:` 줄을 본다. → 3장 표로 지점 판별.
2. **저장소 확인** — GitHub에 코드가 올라가 있나? `main` 브랜치 맞나?
3. **권한 확인** — 빌드가 클론에서 실패하면 GitHub 연결(권한) 재인증.
4. **명령 확인** — Build = `npx opennextjs-cloudflare build`, Deploy = `npx opennextjs-cloudflare deploy`.
5. **환경변수 확인** — `NEXT_PUBLIC_*`, Supabase 키 등이 빌드 환경에 등록돼 있나?
6. **이름 확인** — 연결된 Worker 이름 = `wrangler.jsonc`의 `name`?
7. **재시도** — 고친 뒤 Retry 또는 새 커밋 push.

---

## 6. 대시보드가 안 뜰 때의 우회 (고급)

화면(대시보드)이 로딩에서 멈춰도, **로그인된 상태라면** 브라우저에서 Cloudflare 내부 API로 상태를 직접 조회할 수 있다. 구체적 호출 예시는 [`11_deploy_troubleshooting_record.md`](./11_deploy_troubleshooting_record.md) 5장 참고. (읽기 조회는 안전, 설정 변경은 UI에서 하는 게 안전)

---

## 7. 용어 미니 사전

| 용어 | 쉬운 설명 |
|---|---|
| Worker | Cloudflare에서 내 코드가 돌아가는 "실행 단위(가게)" |
| Workers Builds | GitHub 푸시를 감지해 자동 빌드·배포하는 "공장 자동화" |
| 클론(clone) | 공장이 창고(GitHub)에서 코드를 복제해 가져오는 것 |
| grant | Cloudflare가 내 GitHub를 읽도록 준 "열쇠(권한)" |
| OpenNext | Next.js를 Cloudflare용으로 변환해주는 어댑터 |
| 환경변수/시크릿 | 빌드·실행에 필요한 설정값/비밀키 |
| deployment_id | "실제로 배포된 버전" 식별자. 비어 있으면 배포 0회 |

## 참고
- Workers Builds: https://developers.cloudflare.com/workers/ci-cd/builds/
- OpenNext Cloudflare: https://opennext.js.org/cloudflare/get-started
- 프로젝트 배포 설정: [`06_deployment_cloudflare.md`](./06_deployment_cloudflare.md) · [`07_github_cloudflare_deploy.md`](./07_github_cloudflare_deploy.md)

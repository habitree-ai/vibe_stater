# 서비스 셋업 가이드 시리즈

> 외부 서비스의 **회원가입 → 기초 설정**을, 보면서 따라 할 수 있게
> **마크다운 문서 + HTML 매뉴얼 + 워크스루 영상 + 캡처**로 제작하는 시리즈.
>
> ⚠️ **"상태" 컬럼은 가이드 콘텐츠(영상·캡처) 제작 여부**를 뜻한다 — 기능 구현 여부가 아니다.
> (예: Supabase·Resend는 **기능은 이미 구현**됐고, '가입 가이드 콘텐츠'만 미작성이다.)
> 또한 **Cloudflare 편은 배포 전환으로 SUPERSEDED**(현재 배포=Vercel). 결제 가이드 대상도 Stripe → **Polar**.

---

## 폴더 구조

```
service-setup/
├─ README.md                     # (본 문서) 시리즈 인덱스
├─ method_template.md            # 제작 방법론(HTML/영상 파이프라인) — 공유
├─ _service_setup_template.md    # 서비스별 markdown 표준 템플릿 — 복사해서 사용
└─ <service>/                    # 서비스별 폴더
   ├─ <service>_setup.md         # 단계별 문서 (템플릿 기반)
   ├─ <service>_setup_manual.html
   ├─ <service>_setup_walkthrough.mp4
   └─ screens/                   # 01_*.png 부터 순번 캡처
```

## 시리즈 현황

### 가입·기초설정 편
| 편 | 서비스 | 단계 | 문서 | 상태(가이드 콘텐츠) |
|---|---|---|---|---|
| 1 | ~~Cloudflare~~ | 10 | [`cloudflare/cloudflare_setup.md`](./cloudflare/cloudflare_setup.md) | ⚠️ SUPERSEDED(배포=Vercel 전환) |
| 2 | GitHub | – | – | ⬜ 예정 |
| 3 | Google Cloud | – | – | ⬜ 예정 |
| 4 | Supabase *(기능은 구현됨)* | – | – | ⬜ 콘텐츠 예정 |
| 5 | Polar *(결제 구현됨)* | – | – | ⬜ 콘텐츠 예정 |
| 6 | Resend *(알림 구현됨)* | – | – | ⬜ 콘텐츠 예정 |
| 7 | Vercel *(배포 운영 중)* | – | – | ⬜ 콘텐츠 예정 |

### 연결·배포 편 (프로세스 가이드)
| 편 | 주제 | 단계 | 문서 | 자산 | 상태 |
|---|---|---|---|---|---|
| D1 | ~~GitHub → Cloudflare 자동 배포~~ | 9 | [`github-cloudflare-deploy/github_cloudflare_deploy_setup.md`](./github-cloudflare-deploy/github_cloudflare_deploy_setup.md) | 매뉴얼 HTML · 영상 · 캡처 9장 | ⚠️ SUPERSEDED(Vercel 전환) |

> 처리 기록(실제 git/배포 수행 로그): [`../archive/08_deploy_record.md`](../archive/08_deploy_record.md) *(아카이브)*

> 본 플랫폼이 사용하는 외부 서비스 전체 목록·환경변수는 [`../00_setup_guide.md`](../00_setup_guide.md) 참고.

## 새 서비스 추가 절차 (요약)

1. `_service_setup_template.md`를 `<service>/<service>_setup.md`로 복사.
2. 공식 문서(`developers.<service>.com`)에서 가입·기초설정 단계 수집.
3. 캡처 소스 결정([`method_template.md`](./method_template.md) 2장) → `screens/`에 01부터 저장.
4. 문서의 STEP과 캡처 자막을 1:1로 맞춰 작성.
5. (선택) `method_template.md` 3장 파이프라인으로 HTML 매뉴얼·영상 생성.
6. 본 README의 **시리즈 현황** 표 갱신.

## 핵심 원칙
- 정확도는 **공식 문서**에서, 시각화는 **실캡처 또는 재현**으로.
- 계정 생성·비밀번호·결제·2FA는 **사용자 직접 수행**(에이전트 대행 금지).
- CAPTCHA·봇 차단 **우회 금지**, 개인정보 **마스킹**.

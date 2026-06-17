# 서비스 셋업 가이드 시리즈

> 외부 서비스의 **회원가입 → 기초 설정**을, 보면서 따라 할 수 있게
> **마크다운 문서 + HTML 매뉴얼 + 워크스루 영상 + 캡처**로 제작하는 시리즈.

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

| 편 | 서비스 | 단계 | 문서 | 상태 |
|---|---|---|---|---|
| 1 | **Cloudflare** | 10 | [`cloudflare/cloudflare_setup.md`](./cloudflare/cloudflare_setup.md) | ✅ 완료 |
| 2 | GitHub | – | – | ⬜ 예정 |
| 3 | Google Cloud | – | – | ⬜ 예정 |
| 4 | Supabase | – | – | ⬜ 예정 |
| 5 | Stripe | – | – | ⬜ 예정 |
| 6 | Resend | – | – | ⬜ 예정 |

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

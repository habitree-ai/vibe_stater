# 18. 문의 알림 파이프라인 — 메일 + 카카오톡 '나에게 보내기'

> 문의(/contact) 등록 시 운영자에게 **① 이메일(Resend)** 과 **② 카카오톡(나에게 보내기)** 로
> 즉시 알림을 보낸다. 두 채널 모두 **best-effort** — 실패해도 문의 접수(DB 저장)는 막지 않는다.

---

## 1. 흐름

```
방문자 폼 제출 (/contact)
  └─ submitContact (서버 액션)
      ├─ 허니팟 검사 → 봇이면 저장 없이 성공 화면
      ├─ IP 해시 + 최근 60초 제출 횟수 조회 (10건↑ 거절)
      ├─ contact_messages INSERT  ← 진실원본(유실 없음)
      ├─ redirect(성공 안내)      ← 사용자는 여기서 바로 응답을 받는다
      └─ after(): notifyContact() ← 응답 뒤 실행 (Promise.allSettled, 각 fetch 5초 타임아웃)
           ├─ 이메일: Resend API → ADMIN_EMAIL
           └─ 카카오: 토큰 갱신 → /v2/api/talk/memo/default/send
                (실패·미설정 시 activity_logs 에 기록하고 조용히 건너뜀)
```

- 구현: `src/lib/notify.ts` (발송) · `src/app/contact/actions.ts` (호출)
- 카카오 토큰 저장: `notification_tokens` 테이블(0013) — RLS 정책 없음 = **service_role 전용**
  (access 토큰 6시간 만료 → 서버가 자동 갱신·회전분 저장. env에는 토큰을 두지 않는다)
- 테스트: `/admin/settings` → **알림 테스트 발송** 버튼 (채널별 성공/실패 표시)

## 2. 환경변수

| 키 | 종류 | 값 | 비고 |
|---|---|---|---|
| `ADMIN_EMAIL` | ⚙️ | 알림 받을 주소 | 설정돼 있음 (habitree.ai@gmail.com) |
| `RESEND_API_KEY` | 🔒 | resend.com → API Keys | 미설정 시 메일 채널 건너뜀 |
| `RESEND_FROM_EMAIL` | ⚙️ | 발신 주소 | 선택. 기본 `habitree <onboarding@resend.dev>` — 도메인 인증 전에는 **자기 계정 메일로만** 발송 가능(우리 용도에 충분) |
| `KAKAO_REST_API_KEY` | 🔒 | developers.kakao.com 앱 REST API 키 | 미설정 시 카카오 채널 건너뜀 |
| `KAKAO_CLIENT_SECRET` | 🔒 | 앱 보안 > Client Secret | 카카오 앱에서 사용함으로 설정한 경우만 |

로컬 `.env.local` 과 Vercel(Production) 양쪽에 등록한다.

## 3. 카카오 최초 연동 (1회, 약 10분)

1. **앱 만들기**: [developers.kakao.com](https://developers.kakao.com) → 내 애플리케이션 → 앱 추가
   (앱 이름 예: habitree-notify).
2. **REST API 키 복사** → `KAKAO_REST_API_KEY` 로 저장.
3. **플랫폼 등록**: 앱 설정 > 플랫폼 > Web → `https://vibe.habitree.io` 등록.
4. **Redirect URI**: 제품 설정 > 카카오 로그인 활성화 → Redirect URI에
   `https://vibe.habitree.io/kakao-oauth` 등록 (페이지가 실제로 없어도 된다 — 주소창의 code만 쓴다).
5. **동의항목**: 카카오 로그인 > 동의항목 → **카카오톡 메시지 전송(talk_message)** 을 '선택 동의'로 설정.
6. **토큰 발급·저장**: 리포 루트에서

   ```bash
   node scripts/kakao-connect.mjs          # 1) 인증 URL 출력 → 브라우저에서 열어 동의
   node scripts/kakao-connect.mjs <code>   # 2) 리다이렉트 주소의 ?code= 값으로 실행
   ```

   스크립트가 토큰을 발급받아 `notification_tokens` 테이블에 저장한다(Management API 사용).
7. `/admin/settings` → **알림 테스트 발송** 으로 카카오톡 수신 확인.

> 갱신 토큰은 약 2개월 유효하며, 만료 1개월 전부터 서버가 매 발송 시 자동 연장·저장한다.
> 두 달 넘게 문의가 한 건도 없어 토큰이 완전히 만료되면 6번만 다시 실행하면 된다.

## 4. 메일 채널 (Resend)

1. [resend.com](https://resend.com) 가입(무료: 월 3,000통) → API Key 발급 → `RESEND_API_KEY`.
2. 기본 발신자 `onboarding@resend.dev` 는 **가입 계정의 메일 주소로만** 발송 가능 —
   ADMIN_EMAIL과 Resend 가입 메일을 같게 하면 도메인 인증 없이 바로 쓸 수 있다.
3. (선택) `vibe.habitree.io` 도메인 인증 후 `RESEND_FROM_EMAIL=habitree <no-reply@vibe.habitree.io>`.

## 5. 운영 원칙 · 방어 장치

- **비차단**: 알림은 `after()` 로 응답 이후에 실행된다 — 외부 API가 느려도 폼 응답이 지연되지 않는다.
  모든 외부 fetch에 5초 타임아웃을 걸었고, 실패는 `activity_logs` 의 `notify.*` 로만 남는다.
- **알림 폭탄 방지**(0014): 접속 IP를 서버 전용 솔트로 해시해 `contact_messages.ip_hash` 에 저장하고,
  같은 IP가 60초에 3건을 넘기면 **접수는 받되 알림만 생략**, 10건을 넘기면 접수를 거절한다.
  폼에는 사람 눈에 안 보이는 허니팟 필드(`website`)가 있어 봇 제출은 저장 없이 성공 화면만 보여준다.
- **개인정보**: 카카오 메시지는 본문 앞 80자 + **마스킹된 이메일**(ab***@도메인)만 담는다.
  원문 IP는 저장하지 않는다. 수집·위탁·국외이전 고지는 `/privacy` 와 문의 폼 하단에 명시.
- **토큰 보존**: refresh 토큰 회전분 저장이 실패하면 `notify.kakao.token_persist`(error)로 남겨
  재연동이 필요한 상황을 놓치지 않는다.
- **확장**: `notifyContact` 와 같은 패턴으로 커피챗 신청·뉴스레터 구독 알림도 붙일 수 있다
  (notify.ts 에 채널 함수가 분리되어 있음).

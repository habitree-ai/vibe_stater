# 18. 운영자 알림 파이프라인 — 메일 + 카카오톡 '나에게 보내기'

> **문의(/contact) 접수**와 **후원 결제 완료** 시 운영자에게 **① 이메일(Resend)** 과
> **② 카카오톡(나에게 보내기)** 로 알림을 보낸다.
> 두 채널 모두 **best-effort** — 실패해도 접수·결제 처리는 막지 않는다.

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
4. **카카오 로그인 활성화**: 제품 설정 > 카카오 로그인 > 활성화 설정 **ON**
   (꺼져 있으면 동의 화면에서 `KOE004`가 뜬다). 이어서 Redirect URI에
   `https://vibe.habitree.io/kakao-oauth` 등록 — 이 주소에는 실제 착지 페이지가 있어
   인가 코드와 실행할 명령을 복사 버튼과 함께 보여준다(오류 코드도 한국어로 해설).
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

## 6. 후원 알림 (Polar 웹훅)

후원 결제가 완료되면 Polar가 웹훅을 보내고, 금액·후원자·상품을 카카오톡과 메일로 알린다.

| 구성 | 위치 |
|---|---|
| 엔드포인트 | `src/app/api/polar-webhook/route.ts` → `https://vibe.habitree.io/api/polar-webhook` |
| 발송 | `notifyDonation()` (notify.ts) — 문의 알림과 같은 채널 함수를 공유 |
| 기록 | `donations` 테이블(0015) — service_role 전용. `order_id` unique 로 중복 알림 차단 |

**Polar 대시보드 설정 (1회)**
1. Polar → Settings → Webhooks → **Add Endpoint**
2. URL: `https://vibe.habitree.io/api/polar-webhook`
3. Secret: `.env.local`·Vercel의 `POLAR_WEBHOOK_SECRET` 과 **같은 값**
4. 이벤트: `order.created` (있으면 `order.paid` 도 함께 — 둘 다 처리하되 중복은 무시)

**서명 검증**: Polar는 Standard Webhooks 규격을 쓴다.
`webhook-id`·`webhook-timestamp`·`webhook-signature` 헤더를 받아
`base64(HMAC-SHA256(secret, "id.timestamp.body"))` 와 대조하고, 5분이 지난 서명은 거절한다(replay 방지).
검증 실패는 401, 정상·무시 대상은 202를 돌려준다.

**카카오 메시지 예시**
```
💚 새 후원이 도착했어요
금액: $15
후원자: 홍길동 (ho***@example.com)
상품: 응원 키트
주문번호: ord_abc123…
```

## 7. 문의 관리 (관리자)

- `/admin/contact` 에서 상태 변경(신규·확인·완료)과 **삭제**가 가능하다.
- 삭제는 되돌릴 수 없으므로 확인 창을 거치고, 지운 내용 요약을 `admin.contact.delete`(issue) 로 남긴다.
- 문의 폼의 **연락처는 선택 입력**(최대 30자)이며, 입력되면 메일 본문과 카카오 메시지(☎)에 함께 표시된다.

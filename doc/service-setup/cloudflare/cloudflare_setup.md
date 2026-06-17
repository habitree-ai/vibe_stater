# Cloudflare 기초 세팅 가이드 (1편)

> 대상: Cloudflare **회원가입 → 이메일 인증 → 도메인 연결 → 네임서버 교체 → 2FA**까지의 기초 세팅.
> 양식: [`../method_template.md`](../method_template.md) 표준 절차 기준. 화면 자막(STEP n/10)과 1:1 대응.
> 함께 보기: `cloudflare_setup_manual.html`(자체 완결형 매뉴얼), `cloudflare_setup_walkthrough.mp4`(워크스루 영상), `screens/`(단계별 캡처).

---

## 개요

| 항목 | 값 |
|---|---|
| 서비스 | Cloudflare (DNS·CDN·보안·배포 플랫폼) |
| 목적 | 도메인을 Cloudflare에 연결하고 배포(Workers/Pages) 기반 마련 |
| 단계 수 | 10 |
| 산출물 | HTML 매뉴얼 · 워크스루 영상(mp4) · 캡처 10장 · 본 문서 |
| 캡처 소스 | 가입 폼은 봇 차단으로 **재현(representative)**, 대시보드 이후는 표준 온보딩 화면 |
| 선행 조건 | 보유 도메인 1개(타 등록기관에서 구매한 도메인) |

> ⚠️ 안전 원칙: **계정 생성·비밀번호 입력·2FA 등록·결제는 사용자가 직접 수행**한다(에이전트 대행 금지). 봇 차단·CAPTCHA는 우회하지 않는다.

---

## 단계별 절차

각 단계: **STEP n/10 · 화면 · URL · 클릭 대상 · 설명**. 화면은 `screens/<파일>`.

### STEP 1/10 — Cloudflare 홈페이지 접속
- 화면: `screens/01_homepage.png`
- URL: `https://www.cloudflare.com`
- 클릭 대상: 우측 상단 **Sign Up**
- 설명: Cloudflare 홈페이지에서 회원가입을 시작합니다.

### STEP 2/10 — 회원가입
- 화면: `screens/02_signup.png`
- URL: `https://dash.cloudflare.com/sign-up`
- 클릭 대상: 이메일·비밀번호 입력 후 **Sign Up**
- 설명: 업무용 이메일과 강력한 비밀번호를 입력해 계정을 만듭니다. (직접 입력)

### STEP 3/10 — 이메일 인증
- 화면: `screens/03_verify_email.png`
- 설명: 가입한 이메일로 전송된 인증 메일의 링크를 클릭해 계정을 활성화합니다.

### STEP 4/10 — 대시보드 진입
- 화면: `screens/04_dashboard.png`
- URL: `https://dash.cloudflare.com`
- 설명: 인증 후 대시보드에 진입합니다. 여기서 도메인/Workers/Pages를 관리합니다.

### STEP 5/10 — Domains에서 'Onboard a domain' 클릭
- 화면: `screens/05_add_site.png`
- URL: `https://dash.cloudflare.com/?to=/:account/domains`
- 클릭 대상: 우측 상단 **Onboard a domain**
- 설명: 대시보드 Domains 페이지에서 Onboard a domain을 눌러 보유한 도메인을 추가합니다.

### STEP 6/10 — 도메인 입력
- 화면: `screens/06_enter_domain.png`
- 클릭 대상: 도메인 입력(예: `example.com`) 후 **Continue**
- 설명: 연결할 도메인을 입력합니다. `http://`·`www` 없이 루트 도메인만 입력합니다.

### STEP 7/10 — 플랜 선택
- 화면: `screens/07_plan.png`
- 클릭 대상: **Free** 플랜 선택 후 **Continue**
- 설명: 개인 플랫폼은 Free 플랜으로 충분합니다. 필요 시 추후 업그레이드합니다.

### STEP 8/10 — DNS 레코드 검토
- 화면: `screens/08_dns.png`
- 클릭 대상: 자동 스캔된 레코드 확인 후 **Continue**
- 설명: Cloudflare가 기존 DNS 레코드를 자동 스캔합니다. 누락된 레코드가 있으면 직접 추가한 뒤 진행합니다.

### STEP 9/10 — 등록기관에서 Cloudflare 네임서버로 교체
- 화면: `screens/09_nameservers.png`
- URL: `https://dash.cloudflare.com/onboarding/ns`
- 클릭 대상: 제공된 네임서버 2개 **복사** → 등록기관에 입력 → **Done, check nameservers**
- 설명: 제공된 네임서버(예: `alice.ns.cloudflare.com`, `bob.ns.cloudflare.com`)를 도메인 등록기관 관리 페이지에 입력합니다.
- 주의: **DNSSEC가 켜져 있으면 먼저 끈 뒤** 교체합니다. 적용까지 최대 24시간 소요될 수 있습니다.

### STEP 10/10 — 2단계 인증(2FA) 설정
- 화면: `screens/10_2fa.png`
- URL: `https://dash.cloudflare.com/profile/authentication`
- 설명: My Profile → Authentication에서 2FA(인증 앱 TOTP)를 활성화해 계정을 보호합니다. (직접 등록)

---

## 완료 후 체크
- [ ] 도메인 상태가 **Active**로 표시됨(네임서버 적용 완료)
- [ ] DNS 레코드가 의도대로 들어가 있음
- [ ] 2FA 활성화됨
- [ ] (배포 준비) Workers/Pages 연결은 [`../../06_deployment_cloudflare.md`](../../06_deployment_cloudflare.md) 참고

## 참고
- 공식 문서: https://developers.cloudflare.com/dns/zone-setups/full-setup/
- 본 가이드의 가입 화면은 봇 차단 회피 없이 **재현**한 화면이며, 실제 UI와 다를 수 있습니다.

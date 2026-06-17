# 03. 샘플 콘텐츠 정의

> 메인페이지를 채울 목업 데이터 명세. `src/data/sample.ts`에 타입과 함께 구현한다.
> 타입은 추후 Supabase 응답과 호환되도록 마스터 기획서 6장(테이블 상세)을 따른다.

---

## 1. 프로필 (Profile)

| 필드 | 값 |
|---|---|
| name | 최동혁 |
| tagline | AI 시대, 읽고 만들고 연결하는 사람 |
| bio | AI·바이브코딩·독서를 결합해 개인이 직접 서비스를 만들고 운영하는 방법을 연구하고 가르칩니다. |
| keywords | ["AI", "바이브코딩", "독서", "서비스 기획", "LINKMAP"] |
| stats | 누적 독자 12,000+ · 뉴스레터 구독 2,300+ · 제작 사례 8건 |
| socials | youtube, github, readtree, linkmap |

---

## 2. 프로젝트 (Project) — 3종

| id | name | category | summary | tags | url |
|---|---|---|---|---|---|
| linkmap | LINKMAP | 서비스 | 서비스 연결·환경변수·체크리스트를 한 곳에서 관리하는 바이브코딩 온보딩 도구 | ["환경관리","온보딩"] | (내부 #) |
| readtree | ReadTree | 서비스 | 읽고 필사하며 생각을 키우는 독서 기반 성장 서비스 | ["독서","필사"] | (내부 #) |
| youtube | YouTube 채널 | 콘텐츠 | AI·바이브코딩·독서 인사이트를 영상으로 정리하는 채널 | ["영상","AI"] | https://youtube.com |

---

## 3. 상품 (Product) — 4종

| id | name | type | price(KRW) | summary |
|---|---|---|---|---|
| ebook-vibe | 바이브코딩으로 시작하는 1인 SaaS | ebook | 19000 | 기획부터 배포까지, 코드를 몰라도 서비스를 만드는 전자책 |
| course-linkmap | LINKMAP 실전 강의 | course | 89000 | Supabase·Stripe·Resend를 LINKMAP으로 연결하는 영상 강의 |
| template-creator | Creator Platform 템플릿 | template | 49000 | 이 사이트의 기반이 된 Next.js 개인 플랫폼 템플릿 |
| consulting-1on1 | 1:1 서비스 빌드 컨설팅 | consulting | 150000 | 당신의 아이디어를 함께 설계하고 출시까지 돕는 60분 세션 |

> 유형 뱃지 라벨: ebook→전자책, course→강의, template→템플릿, consulting→컨설팅

---

## 4. 콘텐츠 글 (Post) — 4종

| id | title | tag | excerpt | date |
|---|---|---|---|---|
| p1 | 코드를 몰라도 서비스를 만드는 법 | 바이브코딩 | AI와 함께라면 비개발자도 실서비스를 출시할 수 있습니다. 첫 단계를 정리했습니다. | 2026-06-01 |
| p2 | 환경변수 때문에 배포가 막힐 때 | LINKMAP | 가장 흔한 배포 실패 원인과 LINKMAP으로 해결하는 방법. | 2026-05-20 |
| p3 | 매일 10분 필사가 바꾼 것들 | 독서 | ReadTree로 3개월간 필사하며 얻은 변화 기록. | 2026-05-08 |
| p4 | Stripe 결제, 30분이면 붙입니다 | 결제 | 전자책 판매를 위한 Stripe Checkout 연동 최소 구성. | 2026-04-25 |

---

## 5. 정적 문구

- **뉴스레터:** 제목 "새 소식을 가장 먼저" / 설명 "새 글·자료·강의 소식을 이메일로 보내드립니다. 스팸 없이, 언제든 구독 해지 가능." / 버튼 "구독하기"
- **교육 CTA:** 제목 "바이브코딩으로 나만의 서비스를 만들어보세요" / 설명 "LINKMAP 템플릿으로 Supabase·Stripe·Resend까지 직접 연결하는 실습 과정." / 버튼 "교육 과정 보기"
- **푸터 카피:** "Creator Link Hub — LINKMAP으로 만드는 나만의 서비스형 개인 플랫폼"

---

## 6. 타입 설계 메모 (sample.ts)

```ts
export type Project = {
  id: string; name: string; category: string;
  summary: string; tags: string[]; url: string;
};
export type ProductType = 'ebook' | 'course' | 'template' | 'consulting';
export type Product = {
  id: string; name: string; type: ProductType;
  price: number; currency: 'KRW'; summary: string;
};
export type Post = {
  id: string; title: string; tag: string;
  excerpt: string; date: string; // ISO
};
export type Profile = {
  name: string; tagline: string; bio: string;
  keywords: string[];
  stats: { label: string; value: string }[];
  socials: { label: string; href: string }[];
};
```

> 이미지 필드는 placeholder(그라데이션/이니셜)로 대체하고, 실데이터 연동 시 `cover_image_url` 등 추가.

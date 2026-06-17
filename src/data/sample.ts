// 메인페이지 + 하위 페이지용 샘플(목업) 데이터.
// 타입은 추후 Supabase 응답과 호환되도록 설계한다. (doc/03_sample_content.md 참조)
// 백엔드 연동 단계에서는 이 파일의 export만 데이터 소스로 교체하면 된다.

export type Stat = { label: string; value: string };
export type Social = { label: string; href: string };

export type Profile = {
  name: string;
  tagline: string;
  bio: string;
  keywords: string[];
  stats: Stat[];
  socials: Social[];
};

export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  tags: string[];
  url: string;
  external: boolean;
};

export type ProductType = "ebook" | "course" | "template" | "consulting";

export type FaqItem = { q: string; a: string };

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  price: number; // 0 = 무료
  currency: "KRW";
  summary: string;
  slug: string;
  // 상세 페이지(기획서 8.2)용 필드
  outcome: string; // 핵심 결과물
  forWhom: string[];
  includes: string[];
  howToUse: string;
  faq: FaqItem[];
};

export type Post = {
  id: string;
  title: string;
  tag: string;
  excerpt: string;
  date: string; // ISO (YYYY-MM-DD)
  slug: string;
  body: string; // 문단은 빈 줄(\n\n)로 구분
};

export type CareerItem = { period: string; title: string; desc: string };
export type EducationModule = { step: string; title: string; desc: string };

export const productTypeLabel: Record<ProductType, string> = {
  ebook: "전자책",
  course: "강의",
  template: "템플릿",
  consulting: "컨설팅",
};

export function formatPrice(price: number, currency: "KRW" = "KRW"): string {
  if (price === 0) return "무료";
  if (currency === "KRW") return `₩${price.toLocaleString("ko-KR")}`;
  return `${price.toLocaleString()}`;
}

export function formatDate(iso: string): string {
  // ISO 문자열을 'YYYY.MM.DD'로 변환 (로케일 비의존)
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export const profile: Profile = {
  name: "최동혁",
  tagline: "AI 시대, 읽고 만들고 연결하는 개인 플랫폼",
  bio: "AI·바이브코딩·독서를 결합해 개인이 직접 서비스를 만들고 운영하는 방법을 연구하고 가르칩니다. 코드를 몰라도 시작할 수 있도록, 기획부터 배포까지의 과정을 콘텐츠와 템플릿으로 정리합니다.",
  keywords: ["AI", "바이브코딩", "독서", "서비스 기획", "LINKMAP"],
  stats: [
    { label: "누적 독자", value: "12,000+" },
    { label: "뉴스레터 구독", value: "2,300+" },
    { label: "제작 사례", value: "8건" },
  ],
  socials: [
    { label: "YouTube", href: "https://youtube.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "ReadTree", href: "#projects" },
    { label: "LINKMAP", href: "#projects" },
  ],
};

export const career: CareerItem[] = [
  {
    period: "2024 – 현재",
    title: "LINKMAP · ReadTree 제작/운영",
    desc: "서비스 연결과 독서 습관 도구를 직접 만들고 운영하며, 그 과정을 교육 콘텐츠로 전환합니다.",
  },
  {
    period: "2022 – 2024",
    title: "콘텐츠 크리에이터 · 바이브코딩 강사",
    desc: "YouTube와 뉴스레터로 AI·생산성·독서 인사이트를 전하고, 비개발자의 서비스 제작을 돕습니다.",
  },
  {
    period: "~ 2022",
    title: "기획 · 운영",
    desc: "다양한 디지털 프로덕트의 기획과 운영을 경험하며 문제 정의와 실행을 익혔습니다.",
  },
];

export const projects: Project[] = [
  {
    id: "linkmap",
    name: "LINKMAP",
    category: "서비스",
    summary:
      "서비스 연결·환경변수·체크리스트를 한 곳에서 관리하는 바이브코딩 온보딩 도구.",
    tags: ["환경관리", "온보딩"],
    url: "#projects",
    external: false,
  },
  {
    id: "readtree",
    name: "ReadTree",
    category: "서비스",
    summary: "읽고 필사하며 생각을 키우는 독서 기반 성장 서비스.",
    tags: ["독서", "필사"],
    url: "#projects",
    external: false,
  },
  {
    id: "youtube",
    name: "YouTube 채널",
    category: "콘텐츠",
    summary: "AI·바이브코딩·독서 인사이트를 영상으로 정리하는 채널.",
    tags: ["영상", "AI"],
    url: "https://youtube.com",
    external: true,
  },
];

export const products: Product[] = [
  {
    id: "ebook-vibe",
    name: "바이브코딩으로 시작하는 1인 SaaS",
    type: "ebook",
    price: 19000,
    currency: "KRW",
    summary: "기획부터 배포까지, 코드를 몰라도 서비스를 만드는 전자책.",
    slug: "vibe-1in-saas",
    outcome: "나만의 서비스 아이디어를 실제 배포 가능한 형태로 설계하는 능력",
    forWhom: [
      "코드는 모르지만 서비스를 만들고 싶은 분",
      "AI 도구로 빠르게 프로토타입을 만들고 싶은 분",
      "사이드 프로젝트를 끝까지 출시해본 적 없는 분",
    ],
    includes: ["PDF 전자책 180p", "예제 프롬프트 모음", "체크리스트 템플릿"],
    howToUse: "구매 후 마이페이지 > 내 자료실에서 PDF를 즉시 다운로드할 수 있습니다.",
    faq: [
      { q: "개발 지식이 필요한가요?", a: "아니요. 비개발자 기준으로 단계별로 설명합니다." },
      { q: "환불이 가능한가요?", a: "디지털 상품 특성상 다운로드 전에 한해 환불 가능합니다." },
    ],
  },
  {
    id: "course-linkmap",
    name: "LINKMAP 실전 강의",
    type: "course",
    price: 89000,
    currency: "KRW",
    summary: "Supabase·Stripe·Resend를 LINKMAP으로 연결하는 영상 강의.",
    slug: "linkmap-course",
    outcome: "외부 서비스를 연결한 동작하는 개인 플랫폼 한 개",
    forWhom: [
      "Supabase·Stripe 연동에서 매번 막히는 분",
      "환경변수·배포가 두려운 분",
      "이 사이트 같은 플랫폼을 직접 만들고 싶은 분",
    ],
    includes: ["영상 강의 12강", "LINKMAP 체크리스트", "질문 게시판 접근"],
    howToUse: "구매 후 마이페이지 > 수강 가능한 교육에서 바로 시청할 수 있습니다.",
    faq: [
      { q: "수강 기간 제한이 있나요?", a: "구매 후 무제한으로 다시 볼 수 있습니다." },
      { q: "실습 환경이 필요한가요?", a: "무료 등급의 Supabase·Vercel 계정이면 충분합니다." },
    ],
  },
  {
    id: "template-creator",
    name: "Creator Platform 템플릿",
    type: "template",
    price: 49000,
    currency: "KRW",
    summary: "이 사이트의 기반이 된 Next.js 개인 플랫폼 템플릿.",
    slug: "creator-platform-template",
    outcome: "랜딩·콘텐츠·상품·결제 구조를 갖춘 Next.js 프로젝트 코드",
    forWhom: [
      "처음부터 만들기보다 검증된 구조에서 시작하고 싶은 분",
      "개인 브랜드/판매 플랫폼이 필요한 분",
    ],
    includes: ["Next.js 프로젝트 소스", "Supabase 스키마 SQL", "환경변수 가이드"],
    howToUse: "구매 후 제공되는 저장소 링크에서 코드를 내려받아 사용합니다.",
    faq: [
      { q: "상업적 사용이 가능한가요?", a: "네, 본인 프로젝트에 자유롭게 사용할 수 있습니다." },
      { q: "업데이트가 제공되나요?", a: "주요 업데이트는 동일 저장소로 무료 제공됩니다." },
    ],
  },
  {
    id: "consulting-1on1",
    name: "1:1 서비스 빌드 컨설팅",
    type: "consulting",
    price: 150000,
    currency: "KRW",
    summary: "당신의 아이디어를 함께 설계하고 출시까지 돕는 60분 세션.",
    slug: "1on1-consulting",
    outcome: "구체적인 실행 로드맵과 다음 2주 액션 플랜",
    forWhom: [
      "아이디어는 있지만 어디서 시작할지 막막한 분",
      "기술 스택/우선순위 결정에 도움이 필요한 분",
    ],
    includes: ["60분 화상 세션", "세션 요약 노트", "후속 질문 1회"],
    howToUse: "구매 후 문의 페이지로 일정을 조율해 드립니다.",
    faq: [
      { q: "어떤 방식으로 진행되나요?", a: "화상 회의로 진행하며 녹화본을 공유합니다." },
      { q: "준비할 게 있나요?", a: "사전 질문지를 보내드리니 간단히 답변만 주시면 됩니다." },
    ],
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "코드를 몰라도 서비스를 만드는 법",
    tag: "바이브코딩",
    excerpt:
      "AI와 함께라면 비개발자도 실서비스를 출시할 수 있습니다. 그 첫 단계를 정리했습니다.",
    date: "2026-06-01",
    slug: "build-without-code",
    body: "예전에는 서비스를 만들려면 먼저 프로그래밍 언어부터 배워야 했습니다. 하지만 지금은 순서가 달라졌습니다.\n\n가장 먼저 할 일은 '무엇을 만들지'를 한 문장으로 정의하는 것입니다. 그다음 AI에게 작은 단위로 요청하며 화면 하나, 기능 하나씩 쌓아갑니다.\n\n중요한 것은 완성이 아니라 배포입니다. 일단 세상에 내놓고, 피드백을 받아 고쳐나가는 과정에서 진짜 실력이 붙습니다.",
  },
  {
    id: "p2",
    title: "환경변수 때문에 배포가 막힐 때",
    tag: "LINKMAP",
    excerpt: "가장 흔한 배포 실패 원인과 LINKMAP으로 해결하는 방법.",
    date: "2026-05-20",
    slug: "env-deploy-fix",
    body: "배포가 실패하는 이유의 절반은 환경변수입니다. 로컬에서는 잘 되는데 프로덕션에서 깨지는 전형적인 패턴이죠.\n\n키 이름 오타, 미등록, Preview/Production 환경 불일치가 대표적인 원인입니다.\n\nLINKMAP은 어떤 서비스가 어떤 키를 요구하는지 체크리스트로 관리해, 누락을 배포 전에 잡아냅니다.",
  },
  {
    id: "p3",
    title: "매일 10분 필사가 바꾼 것들",
    tag: "독서",
    excerpt: "ReadTree로 3개월간 필사하며 얻은 변화 기록.",
    date: "2026-05-08",
    slug: "10min-copywriting",
    body: "필사는 단순히 베껴 쓰는 행위가 아닙니다. 좋은 문장의 호흡과 구조를 몸으로 익히는 훈련입니다.\n\n매일 10분, 인상 깊은 문단 하나를 옮겨 적는 것만으로 생각의 밀도가 달라졌습니다.\n\nReadTree로 기록을 쌓으니, 흩어졌던 메모가 나만의 문장 라이브러리가 되었습니다.",
  },
];

export const educationModules: EducationModule[] = [
  {
    step: "01",
    title: "기획과 정보구조(IA)",
    desc: "만들 서비스를 정의하고 화면과 데이터 구조를 설계합니다.",
  },
  {
    step: "02",
    title: "Next.js로 화면 만들기",
    desc: "샘플 데이터로 랜딩과 콘텐츠 페이지를 빠르게 구현합니다.",
  },
  {
    step: "03",
    title: "Supabase로 인증·DB 연결",
    desc: "회원가입/로그인과 데이터베이스, RLS 권한을 붙입니다.",
  },
  {
    step: "04",
    title: "Stripe로 결제 붙이기",
    desc: "Checkout과 Webhook으로 판매와 권한 부여까지 완성합니다.",
  },
  {
    step: "05",
    title: "LINKMAP으로 연결·배포",
    desc: "환경변수와 서비스 연결을 정리하고 Vercel에 배포합니다.",
  },
];

export const newsletter = {
  title: "새 소식을 가장 먼저",
  description:
    "새 글·자료·강의 소식을 이메일로 보내드립니다. 스팸 없이, 언제든 구독 해지 가능.",
  cta: "구독하기",
};

export const education = {
  title: "바이브코딩으로 나만의 서비스를 만들어보세요",
  description:
    "LINKMAP 템플릿으로 Supabase·Stripe·Resend까지 직접 연결하는 실습 과정. 코드를 몰라도, 출시까지 함께합니다.",
  cta: "교육 과정 보기",
};

// 조회 헬퍼 (추후 DB 쿼리로 대체)
export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

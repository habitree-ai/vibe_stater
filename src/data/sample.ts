// 메인페이지 + 하위 페이지용 샘플(목업) 데이터.
// 타입은 추후 Supabase 응답과 호환되도록 설계한다. (doc/03_sample_content.md 참조)
// 백엔드 연동 단계에서는 이 파일의 export만 데이터 소스로 교체하면 된다.

export type Social = { label: string; href: string };

export type Profile = {
  name: string;
  tagline: string;
  bio: string;
  keywords: string[];
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

// 자료 상태: ready(바로 이용) · soon(준비중) · inquiry(별도 문의)
export type ProductStatus = "ready" | "soon" | "inquiry";

// 상세 페이지 주요 버튼(외부 배포/유튜브/문의 등으로 연결)
export type ProductAction = { label: string; href: string; external?: boolean };

export type FaqItem = { q: string; a: string };

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  price: number; // 0 = 무료
  currency: "KRW";
  summary: string;
  slug: string;
  status: ProductStatus;
  statusNote?: string; // 준비중/문의 안내 문구
  action?: ProductAction; // 상세 페이지 주요 버튼(없으면 준비중 안내만 노출)
  // 상세 페이지(기획서 8.2)용 필드
  outcome: string; // 핵심 결과물
  forWhom: string[];
  includes: string[];
  howToUse: string;
  faq: FaqItem[];
};

// 교육 자료 상태별 외부 연결 (강의=유튜브 재생목록, 템플릿=LINKMAP 원클릭 배포)
export const YOUTUBE_PLAYLISTS_URL =
  "https://www.youtube.com/channel/UCmlOkbbqe6Tl0S1F0NEDIrQ/playlists";
export const LINKMAP_DEPLOY_URL = "https://linkmap.biz";

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

export const productStatusLabel: Record<ProductStatus, string> = {
  ready: "바로 시작",
  soon: "준비중",
  inquiry: "별도 문의",
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
  name: "Habitree",
  tagline: "AI 시대, 읽고 만들고 연결하는 우리의 공간",
  bio: "제조기업 ERP PM이자 AX(AI 전환) 담당자로 일하며, 곁에서 AI·바이브코딩·독서를 함께 공부합니다. 가르치기보다, 직접 읽고 만들어 본 과정을 기록하고 나누는 사람입니다.",
  keywords: ["AI", "바이브코딩", "독서", "서비스 기획", "LINKMAP"],
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/channel/UCmlOkbbqe6Tl0S1F0NEDIrQ" },
    { label: "ReadTree", href: "https://read.habitree.io" },
    { label: "LINKMAP", href: "https://linkmap.biz" },
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
    url: "https://www.youtube.com/channel/UCmlOkbbqe6Tl0S1F0NEDIrQ",
    external: true,
  },
];

export const products: Product[] = [
  {
    id: "ebook-vibe",
    name: "바이브코딩으로 시작하는 1인 SaaS",
    type: "ebook",
    price: 0,
    currency: "KRW",
    summary: "기획부터 배포까지, 코드를 몰라도 서비스를 만드는 전자책. (준비중)",
    slug: "vibe-1in-saas",
    status: "soon",
    statusNote: "전자책을 집필하고 있어요. 완성되면 이곳에서 무료로 가장 먼저 공개할게요.",
    outcome: "나만의 서비스 아이디어를 실제 배포 가능한 형태로 설계하는 능력",
    forWhom: [
      "코드는 모르지만 서비스를 만들고 싶은 분",
      "AI 도구로 빠르게 프로토타입을 만들고 싶은 분",
      "사이드 프로젝트를 끝까지 출시해본 적 없는 분",
    ],
    includes: ["PDF 전자책 (준비중)", "예제 프롬프트 모음", "체크리스트 템플릿"],
    howToUse: "완성되면 마이페이지 > 내 자료실에서 바로 내려받을 수 있도록 준비하고 있어요.",
    faq: [
      { q: "개발 지식이 필요한가요?", a: "아니요. 비개발자 기준으로 단계별로 설명합니다." },
      { q: "언제 공개되나요?", a: "집필이 끝나는 대로 이 페이지에서 무료로 공개할 예정이에요." },
    ],
  },
  {
    id: "course-linkmap",
    name: "LINKMAP 실전 강의",
    type: "course",
    price: 0,
    currency: "KRW",
    summary:
      "LINKMAP으로 서비스를 연결하는 영상 강의. (준비중 · 유튜브 재생목록에 순차 공개)",
    slug: "linkmap-course",
    status: "soon",
    statusNote:
      "강의 영상을 제작하고 있어요. 완성되는 영상부터 유튜브 재생목록에 순차 업데이트됩니다.",
    action: { label: "유튜브에서 미리 보기", href: YOUTUBE_PLAYLISTS_URL, external: true },
    outcome: "외부 서비스를 연결한, 동작하는 나만의 홈페이지 한 개",
    forWhom: [
      "서비스 연결에서 매번 막히는 분",
      "환경변수·배포가 두려운 분",
      "이 사이트 같은 홈페이지를 직접 만들고 싶은 분",
    ],
    includes: ["영상 강의 (제작 시 순차 업데이트)", "LINKMAP 체크리스트", "질문 게시판 접근"],
    howToUse: "강의는 유튜브 재생목록으로 공개돼요. 제작되는 대로 이 페이지와 재생목록에 순차 반영됩니다.",
    faq: [
      { q: "어디서 볼 수 있나요?", a: "유튜브 재생목록으로 공개하며, 제작되는 영상부터 순차 업데이트됩니다." },
      { q: "실습 환경이 필요한가요?", a: "무료 등급의 계정이면 충분합니다. 강의에서 함께 준비합니다." },
    ],
  },
  {
    id: "template-creator",
    name: "Creator Platform 템플릿",
    type: "template",
    price: 0,
    currency: "KRW",
    summary: "LINKMAP 원클릭 배포로 3분 만에 내 홈페이지를 시작하는 템플릿.",
    slug: "creator-platform-template",
    status: "ready",
    action: { label: "LINKMAP으로 원클릭 배포", href: LINKMAP_DEPLOY_URL, external: true },
    outcome: "랜딩·콘텐츠·상품 구조를 갖춘 내 홈페이지 한 개 (배포까지 완료)",
    forWhom: [
      "처음부터 만들기보다 검증된 구조에서 시작하고 싶은 분",
      "개인 브랜드/판매 홈페이지가 필요한 분",
    ],
    includes: ["LINKMAP 원클릭 배포 템플릿", "홈페이지 기본 구조", "이후 수정 가이드"],
    howToUse:
      "LINKMAP에 구글 계정으로 로그인 → 템플릿 선택 → 원클릭 배포하면, 내 주소로 홈페이지가 바로 만들어져요.",
    faq: [
      { q: "코드를 몰라도 되나요?", a: "네. LINKMAP에서 템플릿을 고르고 버튼 한 번이면 배포됩니다." },
      { q: "배포한 뒤에 고칠 수 있나요?", a: "네, 글·사진·색을 자유롭게 바꿔 내 것으로 만들 수 있어요." },
    ],
  },
  {
    id: "consulting-1on1",
    name: "1:1 서비스 빌드 컨설팅",
    type: "consulting",
    price: 0,
    currency: "KRW",
    summary: "아이디어를 함께 설계하고 출시까지 돕는 1:1 세션. 일정·방식은 별도 문의로 정해요.",
    slug: "1on1-consulting",
    status: "inquiry",
    statusNote: "정해진 상품이 아니라, 필요에 맞춰 진행해요. 아래 버튼으로 편하게 문의해 주세요.",
    action: {
      label: "별도 문의하기",
      href: `/contact?type=${encodeURIComponent("컨설팅 문의")}`,
      external: false,
    },
    outcome: "구체적인 실행 로드맵과 다음 2주 액션 플랜",
    forWhom: [
      "아이디어는 있지만 어디서 시작할지 막막한 분",
      "무엇부터 할지 우선순위 결정에 도움이 필요한 분",
    ],
    includes: ["1:1 세션(온라인)", "세션 요약 노트", "후속 질문 1회"],
    howToUse: "문의를 남겨 주시면 일정과 방식을 함께 조율해 진행합니다.",
    faq: [
      { q: "어떻게 진행되나요?", a: "문의 후 일정을 잡아 온라인으로 진행하며 요약 노트를 드려요." },
      { q: "비용이 있나요?", a: "내용과 범위에 따라 달라 별도 문의로 안내드립니다." },
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

// 초보자 눈높이 커리큘럼 — '무작정 따라하기' 컨셉(어려운 용어 없이 클릭으로 따라오기)
export const educationModules: EducationModule[] = [
  {
    step: "01",
    title: "구글 계정 만들기",
    desc: "모든 것의 시작이에요. 구글 계정 하나면 앞으로 쓸 서비스에 전부 로그인할 수 있어요. 이미 있다면 이 단계는 건너뛰어도 됩니다.",
  },
  {
    step: "02",
    title: "AI 서비스에 가입하기",
    desc: "ChatGPT·Claude 같은 AI 도구에 가입해요. 앞으로 '무엇을 만들지'만 말하면 AI가 옆에서 도와줍니다.",
  },
  {
    step: "03",
    title: "내 홈페이지 만들기",
    desc: "LINKMAP에서 템플릿을 고르고 버튼 한 번(원클릭 배포)이면, 세상에 공개되는 내 홈페이지가 생겨요. 코드는 몰라도 됩니다.",
  },
  {
    step: "04",
    title: "내 마음대로 고치기",
    desc: "글·사진·색을 바꿔 내 것으로 만들어요. AI에게 '이 부분 이렇게 바꿔줘'라고 말하듯 요청하면 됩니다.",
  },
  {
    step: "05",
    title: "내 정보 담아두기 (데이터 연결)",
    desc: "방문자가 남긴 신청·문의 같은 정보를 저장하는 '창고'를 연결해요. 어려운 말 같지만, 클릭 몇 번이면 됩니다.",
  },
  {
    step: "06",
    title: "결제 받기 (결제 연동)",
    desc: "내가 만든 걸 팔고 싶다면 카드 결제를 붙여요. 손님이 결제하면 나에게 자동으로 알림이 오도록 연결합니다.",
  },
];

export const newsletter = {
  title: "새 소식을 가장 먼저",
  description:
    "새 글·자료·강의 소식을 이메일로 보내드립니다. 스팸 없이, 언제든 구독 해지 가능.",
  cta: "구독하기",
};

export const education = {
  title: "코딩을 몰라도, 내 홈페이지를 직접 만들어요",
  description:
    "구글 계정 만들기부터 내 홈페이지 공개까지, 하나씩 무작정 따라 하기. 어려운 용어 없이, 클릭으로 따라오면 됩니다.",
  cta: "무작정 따라하기 보기",
};

// 조회 헬퍼 (추후 DB 쿼리로 대체)
export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// ==================================================
// ============================================================
//  메인 페이지(리디자인) 전용 데이터 — Home.dc.html 기준
// ============================================================

// 히어로 하단 마퀴 키워드
export const marqueeItems: string[] = [
  "1인 SaaS",
  "개인 브랜드",
  "AI 바이브코딩",
  "Next.js",
  "Supabase",
  "Stripe 결제",
  "Resend 이메일",
  "Vercel 배포",
  "독서 · 필사",
  "LINKMAP 연결",
];

// 소개(About) 섹션
export type AboutTimelineItem = { period: string; title: string; desc: string };

export const aboutInfo = {
  eyebrow: "About",
  badges: ["독서", "바이브코딩", "제조 ERP PM", "AX · AI 전환", "LINKMAP"],
  quote:
    "AI가 답을 대신 써주는 시대일수록, 저는 더 많이 읽고 직접 만들어 봅니다. 가르치기보다, 같이 공부하며 배운 걸 나눕니다.",
  timeline: [
    {
      period: "본업 · 현재",
      title: "제조기업 ERP PM · AX 담당자",
      desc: "제조 현장의 데이터와 프로세스를 설계하는 ERP 프로젝트를 이끌고, AI 전환(AX)으로 일하는 방식을 바꿔갑니다.",
    },
    {
      period: "2024 – 현재",
      title: "LINKMAP · ReadTree 제작 · 운영",
      desc: "필요한 도구를 직접 만들어 쓰고 공개합니다. 서비스 연결·독서 습관 도구를 운영하며 배운 과정을 기록합니다.",
    },
    {
      period: "기록 · 공유",
      title: "바이브코딩, 같이 공부하는 사람",
      desc: "가르치는 사람이 아니라, 읽고 만들어 본 과정을 나누는 동료입니다. 혼자보다 같이 더 멀리 갑니다.",
    },
  ] as AboutTimelineItem[],
};

// 서비스(Services) 섹션 — 운영 중인 실제 라이브 서비스
export type LiveService = {
  id: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  features: string[];
  tags: string[];
};

export const liveServices: LiveService[] = [
  {
    id: "linkmap",
    name: "LINKMAP",
    url: "https://linkmap.biz",
    domain: "linkmap.biz",
    description:
      "초보자부터 개발자까지, 구글 계정 하나로 3분 만에 배포하는 바이브 코딩 플랫폼. 서비스 맵·연결 체크리스트·환경변수(AES-256 암호화)를 한 곳에서 관리합니다.",
    features: [
      "서비스 맵 시각화 & 연결 체크리스트",
      "환경변수 안전 관리 (AES-256)",
      "30+ 서비스 · 프로젝트 템플릿",
    ],
    tags: ["환경관리", "온보딩", "배포"],
  },
  {
    id: "readtree",
    name: "ReadTree",
    url: "https://read.habitree.io",
    domain: "read.habitree.io",
    description:
      "읽고 기록하면 독서나무가 자라는 독서 습관 플랫폼. 읽은 모든 페이지가 자산이 됩니다.",
    features: [
      "독서 기록 & 통계 · 독서나무 성장",
      "AI 채팅 · OCR 필사 · AI 리포트",
      "독서 그룹 · 독서 달력",
    ],
    tags: ["독서", "필사", "습관"],
  },
];

export const youtubeChannel = {
  name: "YouTube 채널",
  category: "콘텐츠",
  description: "AI·바이브코딩·독서 인사이트를 영상으로 정리하는 채널.",
  url: "https://www.youtube.com/channel/UCmlOkbbqe6Tl0S1F0NEDIrQ",
};

// 자료(Resources) 섹션 — 모두 무료 · 교육용
export type Resource = {
  id: string;
  type: string;
  name: string;
  summary: string;
  tag: string;
  cta: string;
  href: string;
  status?: "soon"; // 준비중(실제 자료가 아직 없는 항목)
  external?: boolean; // 외부 링크(유튜브 등)로 이동
  signup?: { current: number; total: number; note: string };
};

export const resources: Resource[] = [
  {
    id: "ebook",
    type: "전자책",
    name: "바이브코딩으로 시작하는 1인 SaaS",
    summary: "기획부터 배포까지, 코드를 몰라도 서비스를 만드는 전자책. 완성되면 무료로 공개해요.",
    tag: "준비중",
    status: "soon",
    cta: "준비중",
    href: "/products/vibe-1in-saas",
  },
  {
    id: "course",
    type: "강의",
    name: "LINKMAP 실전 강의",
    summary: "LINKMAP으로 서비스를 연결하는 영상 강의. 제작되는 대로 유튜브 재생목록에 순차 공개해요.",
    tag: "준비중 · 유튜브",
    status: "soon",
    cta: "유튜브 재생목록 보기",
    href: YOUTUBE_PLAYLISTS_URL,
    external: true,
  },
  {
    id: "coffeechat",
    type: "1:1 커피챗",
    name: "1:1 커피챗 · 추첨 무료 세션",
    summary:
      "신청자 100명이 모이면 추첨을 통해, 원하시는 방식(온라인·오프라인)으로 세션을 무료로 진행합니다.",
    tag: "무료 · 추첨",
    cta: "커피챗 신청",
    href: "/contact",
    signup: { current: 37, total: 100, note: "63명 더 모이면 추첨이 시작돼요" },
  },
];

export const supportBanner = {
  title: "모든 자료와 서비스는 교육 목적의 무료 공개입니다",
  description:
    "도움이 되었다면 원하는 만큼 응원해 주세요. 응원은 100% 선택이며, 자료 이용에 전혀 영향을 주지 않습니다.",
  cta: "응원하기",
  href: "/support",
};

// 응원(Support) 페이지
export const support = {
  badge: "교육 목적 · 응원",
  title: "함께 만들어 주셔서",
  titleAccent: "감사합니다",
  description:
    "이곳의 모든 자료와 서비스는 누구나 무료로 쓸 수 있는 교육 자원입니다. 응원은 전적으로 선택이에요 — 부담 없이, 마음이 닿는 만큼만.",
  presets: [1, 5, 10, 30, 50, 100, 500, 1000, 5000, 10000],
  min: 1,
  max: 10000,
  defaultAmount: 10,
  currency: "USD",
  assurances: ["강요 없음", "1회 결제", "자료는 항상 무료"],
  share: {
    title: "함께 응원할 친구에게 공유해 주세요",
    description: "응원보다 더 큰 힘은, 이 자료가 필요한 사람에게 닿는 거예요.",
  },
};

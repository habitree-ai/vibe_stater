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
  cover?: Cover; // 서비스 실제 화면(스크린샷)
};

// 카드 상단 비주얼. 실제 자료/서비스 화면이 있으면 그 이미지를, 없으면 브랜드 캐릭터를 쓴다.
// fit: "cover"=화면 캡처(꽉 채움) · "contain"=일러스트(여백 유지) · kicker=이미지 위 한 줄 설명
export type Cover = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string; // object-position (기본 center)
  kicker?: string;
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
  cover?: Cover; // 카드 상단 비주얼
  statusNote?: string; // 준비중/문의 안내 문구
  action?: ProductAction; // 상세 페이지 주요 버튼(없으면 준비중 안내만 노출)
  // 상세 페이지(기획서 8.2)용 필드
  outcome: string; // 핵심 결과물
  forWhom: string[];
  includes: string[];
  howToUse: string;
  faq: FaqItem[];
};

// 유튜브 채널·재생목록 (교육 콘텐츠의 실제 출처)
export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/channel/UCmlOkbbqe6Tl0S1F0NEDIrQ";
export const YOUTUBE_PLAYLISTS_URL = `${YOUTUBE_CHANNEL_URL}/playlists`;
// '바이브코딩 무작정 따라하기' 재생목록(교육 시리즈 정본). 3편 공개 · 순차 추가.
export const FOLLOW_ALONG_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL";
export const LINKMAP_DEPLOY_URL = "https://linkmap.biz";
// 전자책 본문(정적 HTML). 화면에서 읽고, 인쇄하면 A4 5쪽 PDF가 된다.
export const EBOOK_VIBE_URL = "/ebook/vibe-1in-saas.html";

export type Post = {
  id: string;
  title: string;
  tag: string;
  excerpt: string;
  date: string; // ISO (YYYY-MM-DD)
  slug: string;
  cover?: Cover; // 카드 상단 비주얼
  body: string; // 문단은 빈 줄(\n\n)로 구분
};

export type CareerItem = { period: string; title: string; desc: string };
// 로드맵 단계 — status로 실제 공개 여부를 정직하게 표시(done=영상 공개됨, planned=다음 편 예정)
export type EducationModule = {
  step: string;
  title: string;
  desc: string;
  status: "done" | "planned";
};

// '무작정 따라하기' 실제 공개 영상 한 편.
export type FollowAlongEpisode = {
  no: string; // EP 번호(학습 순서 = 공개 오래된→최신)
  role: string; // 역할 배지: 동기 · 개요 · 실습
  title: string; // 실제 유튜브 제목
  short: string; // 초보자 눈높이 한 줄 요약
  videoId: string;
  url: string;
};

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

// 소개(About) 페이지 문구.
// 원칙: 확인할 수 없는 수치·성과는 쓰지 않는다. 신뢰는 '확인 가능한 사실'(실제 운영 중인
// 서비스, 무료 공개 정책, 본업 이력)과 '지키는 약속'으로 만든다.
export const aboutPage = {
  intro: {
    paragraphs: [
      "낮에는 제조기업에서 ERP 프로젝트를 이끌고, AI 전환(AX) 업무를 맡고 있습니다. 현장의 데이터와 프로세스를 어떻게 바꿔야 사람들이 실제로 일을 더 잘하게 되는지 고민하는 게 본업이에요.",
      "퇴근 후에는 필요한 도구를 직접 만듭니다. 서비스 연결이 매번 막혀서 LINKMAP을 만들었고, 읽은 걸 자꾸 잊어버려서 ReadTree를 만들었어요. 둘 다 지금 운영 중이고, 저부터 매일 씁니다.",
      "그 과정에서 막혔던 지점, 돌아간 길, 결국 통했던 방법을 글과 영상으로 남깁니다. 전문가라서가 아니라 같은 자리에서 헤매 본 사람이라, 그 기록이 도움이 될 거라고 믿어요.",
    ],
    bubble: "오늘도 함께 성장해요!",
  },
  makes: {
    eyebrow: "What I do",
    title: "읽고, 만들고, 나눕니다",
    description: "거창한 계획보다, 오늘 하나 만들고 하나 기록하는 쪽을 택합니다.",
    items: [
      {
        img: "/img/about/man-code.png",
        w: 301,
        h: 288,
        alt: "모니터 앞에서 코딩하는 메이커 캐릭터",
        title: "만들어요",
        desc: "코드를 몰라도 시작할 수 있는 도구를 직접 만들고 운영합니다. LINKMAP과 ReadTree는 제가 매일 쓰는 서비스예요.",
      },
      {
        img: "/img/about/man-read.png",
        w: 342,
        h: 288,
        alt: "책을 읽는 메이커 캐릭터",
        title: "읽어요",
        desc: "AI가 답을 대신 써주는 시대일수록 더 많이 읽습니다. 읽은 것을 필사하고 정리해 생각의 재료로 쌓아둡니다.",
      },
      {
        img: "/img/about/man-record.png",
        w: 256,
        h: 288,
        alt: "카메라 앞에서 영상을 녹화하는 메이커 캐릭터",
        title: "나눠요",
        desc: "잘된 결과만이 아니라 헤맨 과정까지 영상과 글로 남깁니다. 같은 자리에서 막힌 분이 시간을 아끼도록.",
      },
    ],
  },
  promises: {
    eyebrow: "Promise",
    title: "이 네 가지는 지킵니다",
    description: "숫자로 증명하는 대신, 지킬 수 있는 약속을 적어 둡니다.",
    items: [
      {
        title: "모든 자료는 무료로 공개합니다",
        desc: "전자책·강의·템플릿은 교육 목적으로 누구나 무료로 쓸 수 있어요. 응원은 100% 선택이고, 자료 이용에 전혀 영향을 주지 않습니다.",
      },
      {
        title: "직접 만들어 쓰는 것만 소개합니다",
        desc: "제가 쓰지 않는 도구는 추천하지 않아요. 여기 소개하는 서비스는 전부 제가 만들고 지금도 운영 중인 것들입니다.",
      },
      {
        title: "과장된 수치 대신 과정을 공개합니다",
        desc: "구독자 수나 성과를 부풀려 적지 않습니다. 대신 어디서 막혔고 어떻게 풀었는지를 그대로 적어요.",
      },
      {
        title: "문의에는 제가 직접 답장합니다",
        desc: "자동 응답이 아니라 제가 읽고 답합니다. 답이 조금 늦어질 수는 있어도, 빠뜨리지는 않아요.",
      },
    ],
  },
  proof: {
    eyebrow: "Proof",
    title: "직접 만들어, 지금 운영 중입니다",
    description: "말보다 확인이 빠릅니다. 아래 서비스는 지금 접속해 바로 써 볼 수 있어요.",
  },
  careerSection: {
    eyebrow: "Career",
    title: "지나온 길",
    description: "화려한 이력은 아니지만, 한 줄씩 직접 겪은 시간입니다.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "자주 받는 질문",
    note: "여기에 없는 질문은 언제든 문의로 보내 주세요. 제가 직접 읽고 답장드립니다.",
    items: [
      {
        q: "개발자세요?",
        a: "아니요. 본업은 제조기업 ERP PM이고, 개발은 필요해서 배웠습니다. 그래서 비개발자가 어디서 막히는지를 잘 압니다.",
      },
      {
        q: "왜 전부 무료인가요?",
        a: "제가 배운 것도 대부분 누군가 먼저 공개해 준 자료 덕분이었어요. 그래서 교육 목적으로 공개하고, 응원은 원하는 분만 하시면 됩니다.",
      },
      {
        q: "연락은 어떻게 하나요?",
        a: "문의 폼으로 남겨 주시면 제가 직접 읽고 답장드려요. 1:1 커피챗도 신청받고 있습니다.",
      },
    ],
  },
  cta: {
    title: "궁금한 게 있으면 편하게 물어보세요",
    desc: "거창한 질문이 아니어도 괜찮아요. “이건 어디서부터 시작해요?” 한 줄이면 충분합니다.",
    primary: { label: "문의하기", href: "/contact" },
    secondary: { label: "응원하기", href: "/support" },
  },
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
    url: LINKMAP_DEPLOY_URL,
    external: true,
    cover: {
      src: "/img/linkmap-main.png",
      alt: "LINKMAP 메인 화면 — 한 플랫폼에서 3분 만에 배포",
      position: "left top",
      kicker: "지금 운영 중 · 라이브",
    },
  },
  {
    id: "readtree",
    name: "ReadTree",
    category: "서비스",
    summary: "읽고 필사하며 생각을 키우는 독서 기반 성장 서비스.",
    tags: ["독서", "필사"],
    url: "https://read.habitree.io",
    external: true,
    cover: {
      src: "/img/readtree-main.png",
      alt: "ReadTree 대시보드 — 독서 기록으로 자라는 독서나무",
      position: "left top",
      kicker: "지금 운영 중 · 라이브",
    },
  },
];

export const products: Product[] = [
  {
    id: "ebook-vibe",
    name: "바이브코딩으로 시작하는 1인 SaaS",
    type: "ebook",
    price: 0,
    currency: "KRW",
    summary: "코드를 몰라도 괜찮아요. 아이디어 한 문장에서 배포까지, 15분이면 읽는 입문 전자책.",
    slug: "vibe-1in-saas",
    status: "ready",
    cover: {
      src: "/img/covers/ebook-vibe.png",
      alt: "전자책 표지 — 바이브코딩으로 시작하는 1인 SaaS",
    },
    action: { label: "전자책 읽기 (무료)", href: EBOOK_VIBE_URL, external: true },
    outcome: "내 아이디어를 한 문장으로 정리한 기획 + AI에게 그대로 붙여넣을 첫 프롬프트",
    forWhom: [
      "코드는 모르지만 서비스를 만들고 싶은 분",
      "AI 도구로 빠르게 프로토타입을 만들고 싶은 분",
      "사이드 프로젝트를 끝까지 출시해본 적 없는 분",
    ],
    includes: [
      "본문 5장 (바이브코딩 입문 → 기획 → 프롬프트 → 배포)",
      "복붙용 프롬프트 4단 공식 · 예시 3종",
      "한 문장 기획 템플릿 · 공개 전 체크리스트 10",
    ],
    howToUse:
      "브라우저에서 바로 읽을 수 있어요. 인쇄(Ctrl+P)하면 A4 5쪽 PDF로 저장되니, 빈칸은 손으로 채워보세요.",
    faq: [
      { q: "개발 지식이 필요한가요?", a: "아니요. 비개발자 기준으로 용어부터 풀어서 설명합니다." },
      { q: "얼마나 걸리나요?", a: "A4 5쪽 분량으로, 15분이면 끝까지 읽을 수 있습니다." },
      { q: "정말 무료인가요?", a: "네. 교육 목적으로 공개하며, 후원은 전적으로 선택입니다." },
    ],
  },
  {
    id: "course-linkmap",
    name: "바이브코딩 무작정 따라하기 (영상 강의)",
    type: "course",
    price: 0,
    currency: "KRW",
    summary:
      "코딩 몰라도 오늘 내 사이트를 인터넷에. 유튜브 재생목록에 3편 공개, 다음 편 순차 추가.",
    slug: "linkmap-course",
    status: "ready",
    cover: {
      src: "/img/about/man-record.png",
      alt: "카메라 앞에서 강의 영상을 촬영하는 모습",
      fit: "contain",
      kicker: "3편 공개 · 순차 추가",
    },
    action: { label: "재생목록 보기 (무료)", href: FOLLOW_ALONG_PLAYLIST_URL, external: true },
    outcome: "구글 계정·AI·원클릭 배포로 인터넷에 올라간 나만의 사이트 한 개",
    forWhom: [
      "완전 왕초보 · 비개발자로 처음 시작하는 분",
      "환경변수·배포가 두려운 분",
      "이 사이트 같은 홈페이지를 직접 만들고 싶은 분",
    ],
    includes: [
      "EP1 AI 시대에 끝까지 필요한 단 하나의 능력 (동기)",
      "EP2 비개발자도 진짜 될까? (개요)",
      "EP3 3분 만에 내 사이트 배포하기 (실습)",
    ],
    howToUse:
      "유튜브 재생목록을 순서대로 따라 보면 됩니다. 새 편이 나오면 재생목록에 자동으로 이어져요.",
    faq: [
      { q: "정말 무료인가요?", a: "네. 교육 목적으로 유튜브에 무료 공개합니다. 응원은 전적으로 선택이에요." },
      { q: "실습 환경이 필요한가요?", a: "구글 계정과 무료 등급 AI면 충분합니다. 영상에서 함께 준비합니다." },
      { q: "다음 편은 언제 나오나요?", a: "고치기·데이터 연결·결제 받기 편을 순서대로 제작 중이며, 재생목록에 순차 추가됩니다." },
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
    cover: {
      src: "/img/linkmap-main.png",
      alt: "LINKMAP 원클릭 배포 화면",
      position: "left top",
      kicker: "원클릭 배포 3분",
    },
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
    cover: {
      src: "/img/about/otter-coffee.png",
      alt: "커피잔을 든 하비트리 캐릭터",
      fit: "contain",
      kicker: "온라인 1:1 세션",
    },
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
    cover: {
      src: "/img/about/otter-idea.png",
      alt: "아이디어 전구를 든 하비트리 캐릭터",
      fit: "contain",
      kicker: "아이디어 한 문장에서 시작",
    },
    body: "예전에는 서비스를 만들려면 먼저 프로그래밍 언어부터 배워야 했습니다. 하지만 지금은 순서가 달라졌습니다.\n\n가장 먼저 할 일은 '무엇을 만들지'를 한 문장으로 정의하는 것입니다. 그다음 AI에게 작은 단위로 요청하며 화면 하나, 기능 하나씩 쌓아갑니다.\n\n중요한 것은 완성이 아니라 배포입니다. 일단 세상에 내놓고, 피드백을 받아 고쳐나가는 과정에서 진짜 실력이 붙습니다.",
  },
  {
    id: "p2",
    title: "환경변수 때문에 배포가 막힐 때",
    tag: "LINKMAP",
    excerpt: "가장 흔한 배포 실패 원인과 LINKMAP으로 해결하는 방법.",
    date: "2026-05-20",
    slug: "env-deploy-fix",
    cover: {
      src: "/img/linkmap-main.png",
      alt: "LINKMAP 서비스 화면 — 환경변수와 연결 체크리스트",
      position: "left top",
      kicker: "LINKMAP 연결 체크리스트",
    },
    body: "배포가 실패하는 이유의 절반은 환경변수입니다. 로컬에서는 잘 되는데 프로덕션에서 깨지는 전형적인 패턴이죠.\n\n키 이름 오타, 미등록, Preview/Production 환경 불일치가 대표적인 원인입니다.\n\nLINKMAP은 어떤 서비스가 어떤 키를 요구하는지 체크리스트로 관리해, 누락을 배포 전에 잡아냅니다.",
  },
  {
    id: "p3",
    title: "매일 10분 필사가 바꾼 것들",
    tag: "독서",
    excerpt: "ReadTree로 3개월간 필사하며 얻은 변화 기록.",
    date: "2026-05-08",
    slug: "10min-copywriting",
    cover: {
      src: "/img/readtree-main.png",
      alt: "ReadTree 화면 — 필사 기록으로 자라는 독서나무",
      position: "left top",
      kicker: "ReadTree 3개월 기록",
    },
    body: "필사는 단순히 베껴 쓰는 행위가 아닙니다. 좋은 문장의 호흡과 구조를 몸으로 익히는 훈련입니다.\n\n매일 10분, 인상 깊은 문단 하나를 옮겨 적는 것만으로 생각의 밀도가 달라졌습니다.\n\nReadTree로 기록을 쌓으니, 흩어졌던 메모가 나만의 문장 라이브러리가 되었습니다.",
  },
];

// '무작정 따라하기' 재생목록의 실제 공개 영상 3편 (학습 순서: 동기 → 개요 → 실습)
export const followAlong = {
  seriesTitle: "바이브코딩 무작정 따라하기",
  tagline: "코딩 몰라도, 오늘 내 사이트를 인터넷에",
  description:
    "왜 지금 시작해야 하는지부터 3분 만에 내 사이트를 배포하기까지. 어려운 용어 없이, 영상을 그대로 따라오면 됩니다. 유튜브에 무료 공개하고, 다음 편을 순차 추가해요.",
  playlistUrl: FOLLOW_ALONG_PLAYLIST_URL,
  channelUrl: YOUTUBE_CHANNEL_URL,
  episodes: [
    {
      no: "EP1",
      role: "동기",
      title: "AI 시대, 끝까지 살아남는 사람은 결국 이 능력 하나가 달랐습니다",
      short: "AI 잘 쓰는 법부터 사고력·문해력·질문력까지, AI보다 앞서가는 사람들의 공통점.",
      videoId: "c5RdemFfZZU",
      url: "https://www.youtube.com/watch?v=c5RdemFfZZU&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL",
    },
    {
      no: "EP2",
      role: "개요",
      title: "바이브코딩 무작정 따라하기, 비개발자도 진짜 될까?",
      short: "코드 한 줄 몰라도 되는지, 전체 그림을 먼저 봅니다.",
      videoId: "zJDF2e4dYKU",
      url: "https://www.youtube.com/watch?v=zJDF2e4dYKU&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL",
    },
    {
      no: "EP3",
      role: "실습",
      title: "3분 만에 오늘 내 사이트를 인터넷에 올리기",
      short: "구글 계정·AI·원클릭 배포로, 진짜 내 사이트를 공개해요.",
      videoId: "he2_I9LCmQU",
      url: "https://www.youtube.com/watch?v=he2_I9LCmQU&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL",
    },
  ] as FollowAlongEpisode[],
};

// 전체 커리큘럼 로드맵 — 무엇을 배우는지 한눈에.
// 앞 3단계(계정·AI·배포)는 EP3에서 이미 다뤄 status: "done", 나머지는 다음 편 예정.
export const educationModules: EducationModule[] = [
  {
    step: "01",
    title: "구글 계정 만들기",
    desc: "모든 것의 시작이에요. 구글 계정 하나면 앞으로 쓸 서비스에 전부 로그인할 수 있어요.",
    status: "done",
  },
  {
    step: "02",
    title: "AI 서비스에 가입하기",
    desc: "ChatGPT·Claude 같은 AI 도구에 가입해요. '무엇을 만들지'만 말하면 AI가 옆에서 도와줍니다.",
    status: "done",
  },
  {
    step: "03",
    title: "내 홈페이지 만들기",
    desc: "LINKMAP에서 템플릿을 고르고 버튼 한 번(원클릭 배포)이면, 세상에 공개되는 내 홈페이지가 생겨요.",
    status: "done",
  },
  {
    step: "04",
    title: "내 마음대로 고치기",
    desc: "글·사진·색을 바꿔 내 것으로 만들어요. AI에게 '이 부분 이렇게 바꿔줘'라고 말하듯 요청하면 됩니다.",
    status: "planned",
  },
  {
    step: "05",
    title: "내 정보 담아두기 (데이터 연결)",
    desc: "방문자가 남긴 신청·문의 같은 정보를 저장하는 '창고'를 연결해요. 어려운 말 같지만, 클릭 몇 번이면 됩니다.",
    status: "planned",
  },
  {
    step: "06",
    title: "결제 받기 (결제 연동)",
    desc: "내가 만든 걸 팔고 싶다면 카드 결제를 붙여요. 손님이 결제하면 나에게 자동으로 알림이 오도록 연결합니다.",
    status: "planned",
  },
];

export const newsletter = {
  title: "새 소식을 가장 먼저",
  description:
    "새 글·자료·강의 소식을 이메일로 보내드립니다. 스팸 없이, 언제든 구독 해지 가능.",
  cta: "구독하기",
};

export const education = {
  title: "바이브코딩 무작정 따라하기",
  description:
    "코딩 몰라도, 오늘 내 사이트를 인터넷에. 왜 시작해야 하는지부터 3분 배포까지, 유튜브 영상을 그대로 따라오면 됩니다. 지금 3편 공개 · 다음 편 순차 추가.",
  cta: "재생목록 전체 보기",
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
  "Polar 결제",
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
  cover?: Cover; // 카드 상단 비주얼
  status?: "soon"; // 준비중(실제 자료가 아직 없는 항목)
  external?: boolean; // 외부 링크(유튜브 등)로 이동
  signup?: { current: number; total: number; note: string };
};

export const resources: Resource[] = [
  {
    id: "ebook",
    type: "전자책",
    name: "바이브코딩으로 시작하는 1인 SaaS",
    summary:
      "코드를 몰라도 괜찮아요. 아이디어 한 문장에서 배포까지, 15분이면 읽는 입문서 (A4 5쪽).",
    tag: "무료 · 바로 읽기",
    cta: "전자책 읽기",
    cover: {
      src: "/img/covers/ebook-vibe.png",
      alt: "전자책 표지 — 바이브코딩으로 시작하는 1인 SaaS",
    },
    href: EBOOK_VIBE_URL,
    external: true,
  },
  {
    id: "course",
    type: "강의",
    name: "LINKMAP 실전 강의",
    summary: "LINKMAP으로 서비스를 연결하는 영상 강의. 제작되는 대로 유튜브 재생목록에 순차 공개해요.",
    tag: "준비중 · 유튜브",
    status: "soon",
    cta: "유튜브 재생목록 보기",
    cover: {
      src: "/img/about/man-record.png",
      alt: "카메라 앞에서 강의 영상을 촬영하는 모습",
      fit: "contain",
      kicker: "영상 제작 중 · 순차 공개",
    },
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
    cover: {
      src: "/img/about/otter-coffee.png",
      alt: "커피잔을 든 하비트리 캐릭터",
      fit: "contain",
      kicker: "추첨 무료 · 온라인/오프라인",
    },
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

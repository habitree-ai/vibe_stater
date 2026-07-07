// 사이트 전역 상수 (브랜드/내비게이션). doc/02_main_page_plan.md 참조.

export const site = {
  name: "Habitree",
  brandShort: "HT",
  description:
    "코딩을 몰라도 직접 만드는 우리의 온라인 공간 — AI·바이브코딩·독서로 읽고 만들고 연결합니다.",
  owner: "바이브코딩 치트키",
  // 운영 정본 도메인. habitree.ai는 미등록(NXDOMAIN)이므로 절대 사용 금지.
  // canonical/sitemap/robots/OG의 단일 출처(잘못 설정된 env에 의존하지 않음).
  url: "https://vibe.habitree.io",
};

// 내비게이션은 전용 페이지로 직접 연결 — 발견성을 높인다(홈 앵커 대신 실제 라우트).
export const navItems = [
  { label: "소개", href: "/about" },
  { label: "콘텐츠", href: "/posts" },
  { label: "서비스", href: "/projects" },
  { label: "자료", href: "/products" },
  { label: "교육", href: "/education" },
  { label: "문의", href: "/contact" },
] as const;

export const footerColumns = [
  {
    title: "둘러보기",
    links: [
      { label: "소개", href: "/about" },
      { label: "콘텐츠", href: "/posts" },
      { label: "서비스", href: "/projects" },
    ],
  },
  {
    title: "자료",
    links: [
      { label: "전자책·강의", href: "/products" },
      { label: "1:1 커피챗", href: "/coffee-chat" },
      { label: "응원하기", href: "/support" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "문의", href: "/contact" },
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
] as const;

// 사이트 전역 상수 (브랜드/내비게이션). doc/02_main_page_plan.md 참조.

export const site = {
  name: "Creator Link Hub",
  brandShort: "CLH",
  description:
    "LINKMAP으로 만드는 나만의 서비스형 개인 플랫폼 — 전자책·강의·템플릿·컨설팅을 한 곳에서.",
  owner: "최동혁",
};

export const navItems = [
  { label: "소개", href: "/about" },
  { label: "콘텐츠", href: "/posts" },
  { label: "서비스", href: "/projects" },
  { label: "상품", href: "/products" },
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
    title: "상품",
    links: [
      { label: "전자책", href: "/products" },
      { label: "강의", href: "/products" },
      { label: "템플릿", href: "/products" },
      { label: "컨설팅", href: "/products" },
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

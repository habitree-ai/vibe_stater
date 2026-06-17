// 서비스 셋업/배포 가이드 자료 메타데이터.
// 실제 매뉴얼(HTML)·영상(mp4)은 public/guides/* 에 위치하며 정적 제공된다.
// (제작 방법론: doc/service-setup/method_template.md)

export type Guide = {
  id: string;
  title: string;
  service: string;
  summary: string;
  badge: string;
  steps: number;
  duration: string;
  manualHref: string;
  videoHref: string;
};

export const guides: Guide[] = [
  {
    id: "cloudflare-setup",
    title: "Cloudflare 가입 & 기본 설정",
    service: "Cloudflare",
    summary:
      "회원가입 · 이메일 인증 · 도메인 연결 · 네임서버 변경 · 2단계 인증까지, 마우스 포인터로 따라 하는 온보딩 가이드.",
    badge: "온보딩",
    steps: 10,
    duration: "약 39초",
    manualHref: "/guides/cloudflare/manual.html",
    videoHref: "/guides/cloudflare/walkthrough.mp4",
  },
  {
    id: "github-cloudflare-deploy",
    title: "GitHub → Cloudflare 자동 배포",
    service: "GitHub · Cloudflare",
    summary:
      "git push 한 번으로 전 세계에 배포하는 CI/CD 구성. 저장소 준비부터 Workers Builds 연결·빌드 변수·커스텀 도메인까지.",
    badge: "배포",
    steps: 9,
    duration: "약 30초",
    manualHref: "/guides/deploy/manual.html",
    videoHref: "/guides/deploy/walkthrough.mp4",
  },
];

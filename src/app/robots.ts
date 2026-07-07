import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 정본 도메인은 site.url(vibe.habitree.io). 잘못 설정된 env에 의존하지 않는다.
const BASE = site.url;

// 크롤러 규칙 — 공개 페이지 허용, 관리자/개인/인증 경로 차단.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/me", "/auth", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}

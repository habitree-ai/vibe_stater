import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://vibe.habitree.io";

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

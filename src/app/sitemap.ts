import type { MetadataRoute } from "next";
import { posts, products } from "@/data/sample";
import { site } from "@/lib/site";

// 정본 도메인은 site.url(vibe.habitree.io). env(NEXT_PUBLIC_APP_URL)는 잘못된 도메인이 설정돼 있어 신뢰하지 않는다.
const BASE = site.url;

// 공개 라우트 사이트맵. 관리자(/admin)·개인(/me)·인증 콜백은 제외.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/posts",
    "/projects",
    "/products",
    "/education",
    "/guides",
    "/contact",
    "/coffee-chat",
    "/support",
    "/terms",
    "/privacy",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/posts/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...productEntries];
}

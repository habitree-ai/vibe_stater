import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Cloudflare (OpenNext) 로컬 개발 통합 — `next dev`에서 Workers 바인딩 접근.
// (doc/06_deployment_cloudflare.md 3.3 참고)
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

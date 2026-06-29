import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 개발 전용: 다른 기기(LAN)에서 dev 서버에 접속해 테스트할 때 교차 출처 차단 해제.
  allowedDevOrigins: ["172.20.2.31"],
};

export default nextConfig;

// Cloudflare (OpenNext) 로컬 개발 통합 — `next dev`에서 Workers 바인딩 접근.
// (doc/06_deployment_cloudflare.md 3.3 참고)
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

// 개발 환경에서만 React가 eval을 사용(디버깅용). 프로덕션은 불필요.
const isDev = process.env.NODE_ENV !== "production";

// 외부로 허용할 유일한 오리진은 Supabase(인증·DB·스토리지). URL은 env에서 파생하고,
// 값이 없거나 형식이 틀리면 알려진 프로젝트 오리진으로 폴백한다.
const SUPABASE_FALLBACK = "https://ofxzkwbqwpsjoeqjhrpl.supabase.co";
const supabaseOrigin = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : SUPABASE_FALLBACK;
  } catch {
    return SUPABASE_FALLBACK;
  }
})();
const supabaseWss = supabaseOrigin.replace(/^https:/, "wss:");

// Content-Security-Policy.
// - script/style에 'unsafe-inline': Next.js 앱 라우터가 하이드레이션용 인라인 스크립트를 주입하는데,
//   nonce 방식은 전 페이지 동적 렌더를 강제(정적 생성 무력화)하므로 호환성 우선으로 인라인 허용.
// - img-src에 https: 허용: 프로필 아바타가 Supabase Storage·Google·사용자 임의 https URL일 수 있음(me 페이지).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${supabaseOrigin} ${supabaseWss}`,
  `media-src 'self'`,
  `frame-src 'self'`,
  `worker-src 'self' blob:`,
  `manifest-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

// 항상 안전한 표준 보안 헤더 + 위 CSP. 모든 경로에 적용한다.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HSTS는 https에서만 적용되고 http(로컬)에서는 브라우저가 무시하므로 항상 전송해도 안전.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // 팝업 기반 OAuth 등을 막지 않도록 allow-popups. 그래도 교차출처 문서로부터 창을 격리한다.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  // 서버 소프트웨어 노출 제거.
  poweredByHeader: false,
  // 개발 전용: 다른 기기(LAN)에서 dev 서버에 접속해 테스트할 때 교차 출처 차단 해제.
  allowedDevOrigins: ["172.20.2.31"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// MVP: 캐시 오버라이드 없이 시작. 트래픽/ISR이 늘면 R2 incremental cache 추가.
// (doc/06_deployment_cloudflare.md 3.2 참고)
export default defineCloudflareConfig({});

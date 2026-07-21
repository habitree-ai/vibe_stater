// 카카오 '나에게 보내기' 최초 연동 — 토큰 발급 후 Supabase(notification_tokens)에 저장.
// 문의 알림 파이프라인 문서: doc/18_contact_notifications.md
//
//   node scripts/kakao-connect.mjs           # 1단계: 동의 URL 출력
//   node scripts/kakao-connect.mjs <code>    # 2단계: 리다이렉트 주소의 ?code= 값으로 토큰 저장
//   node scripts/kakao-connect.mjs --test    # 저장된 토큰으로 테스트 메시지 발송
//
// 필요한 값(.env.local): KAKAO_REST_API_KEY, (선택) KAKAO_CLIENT_SECRET,
//                       SUPABASE_ACCESS_TOKEN (Management API로 DB 접근)

import { readFileSync } from "node:fs";

const PROJECT_REF = "ofxzkwbqwpsjoeqjhrpl";
const REDIRECT_URI = "https://vibe.habitree.io/kakao-oauth";

function env(key) {
  const raw = readFileSync(".env.local", "utf8");
  const m = raw.match(new RegExp(`^${key}=(.*)$`, "m"));
  return m ? m[1].trim() : null;
}

// Supabase Management API 로 SQL 실행 (memory: supabase-project 참조)
async function sql(query) {
  const token = env("SUPABASE_ACCESS_TOKEN");
  if (!token) throw new Error(".env.local 에 SUPABASE_ACCESS_TOKEN 이 필요합니다.");
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`DB 오류 ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

const clientId = env("KAKAO_REST_API_KEY");
const clientSecret = env("KAKAO_CLIENT_SECRET");
const arg = process.argv[2];

if (!clientId) {
  console.error("✗ .env.local 에 KAKAO_REST_API_KEY 가 없습니다. doc/18 §3 참조.");
  process.exit(1);
}

// ---------------------------------------------------------------- 테스트 발송
if (arg === "--test") {
  const rows = await sql(
    `select access_token, refresh_token, access_expires_at from public.notification_tokens where id='kakao';`
  );
  const row = rows[0];
  if (!row?.refresh_token) {
    console.error("✗ 저장된 카카오 토큰이 없습니다. 먼저 1·2단계를 실행하세요.");
    process.exit(1);
  }

  // 만료 여유가 없으면 갱신
  let access = row.access_token;
  const exp = row.access_expires_at ? Date.parse(row.access_expires_at) : 0;
  if (!access || exp - Date.now() < 60_000) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: row.refresh_token,
    });
    if (clientSecret) body.set("client_secret", clientSecret);
    const r = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body,
    });
    const t = await r.json();
    if (!r.ok) {
      console.error("✗ 토큰 갱신 실패:", JSON.stringify(t));
      process.exit(1);
    }
    access = t.access_token;
    await sql(
      `update public.notification_tokens set
         access_token='${access}',
         access_expires_at=now() + interval '${t.expires_in} seconds',
         ${t.refresh_token ? `refresh_token='${t.refresh_token}',` : ""}
         updated_at=now()
       where id='kakao';`
    );
    console.log("· access 토큰 갱신 완료");
  }

  const res = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      template_object: JSON.stringify({
        object_type: "text",
        text: "✅ habitree 알림 연동 테스트\n문의가 등록되면 이렇게 알려드릴게요.",
        link: {
          web_url: "https://vibe.habitree.io/admin/contact",
          mobile_web_url: "https://vibe.habitree.io/admin/contact",
        },
        button_title: "관리자에서 보기",
      }),
    }),
  });
  console.log(res.ok ? "✓ 카카오톡 테스트 메시지 발송" : `✗ 발송 실패 ${res.status}: ${await res.text()}`);
  process.exit(res.ok ? 0 : 1);
}

// ------------------------------------------------------------ 1단계: 동의 URL
if (!arg) {
  const url =
    `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=talk_message`;
  console.log("1) 아래 주소를 브라우저에서 열어 동의하세요:\n");
  console.log(url);
  console.log(
    `\n2) 동의 후 이동한 주소(${REDIRECT_URI}?code=XXXX)의 code 값을 복사해:\n` +
      "   node scripts/kakao-connect.mjs <code>"
  );
  process.exit(0);
}

// ------------------------------------------------------- 2단계: 토큰 발급·저장
const body = new URLSearchParams({
  grant_type: "authorization_code",
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  code: arg,
});
if (clientSecret) body.set("client_secret", clientSecret);

const res = await fetch("https://kauth.kakao.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
  body,
});
const tok = await res.json();
if (!res.ok) {
  console.error("✗ 토큰 발급 실패:", JSON.stringify(tok));
  console.error("  (code는 1회용이라 이미 썼다면 1단계부터 다시 하세요)");
  process.exit(1);
}

await sql(`
insert into public.notification_tokens (id, access_token, refresh_token, access_expires_at, updated_at)
values ('kakao', '${tok.access_token}', '${tok.refresh_token}',
        now() + interval '${tok.expires_in} seconds', now())
on conflict (id) do update set
  access_token = excluded.access_token,
  refresh_token = excluded.refresh_token,
  access_expires_at = excluded.access_expires_at,
  updated_at = now();`);

console.log("✓ 카카오 토큰 저장 완료 (notification_tokens)");
console.log(`  access 만료: ${tok.expires_in}초 후 · refresh 만료: ${tok.refresh_token_expires_in}초 후`);
console.log("\n확인: node scripts/kakao-connect.mjs --test");

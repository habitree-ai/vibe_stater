import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// 소셜 공유용 기본 OG 이미지 — 전 라우트 기본값(개별 페이지가 덮어쓰지 않는 한).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.owner}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b3d2e 0%, #16a34a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.9 }}>{site.name}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 800,
            marginTop: 20,
            lineHeight: 1.15,
          }}
        >
          <span>코딩 몰라도 직접 만드는</span>
          <span>우리의 온라인 공간</span>
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.85 }}>
          AI · 바이브코딩 · 독서로 읽고 만들고 연결합니다
        </div>
      </div>
    ),
    size
  );
}

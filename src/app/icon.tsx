import { ImageResponse } from "next/og";

// 브랜드 파비콘 — "HT" 마크를 동적 생성(바이너리 파일 불필요).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16a34a",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        HT
      </div>
    ),
    size
  );
}

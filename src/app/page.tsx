import type { Metadata } from "next";
import { homeMarkup } from "@/generated/homeMarkup";
import { HomeEnhancer } from "@/components/HomeEnhancer";

export const metadata: Metadata = {
  title: "Habitree — 코딩 몰라도 직접 만든 우리의 공간",
  description:
    "AI 시대, 읽고 만들고 연결하는 우리의 공간. LINKMAP·ReadTree와 무료 교육 자료를 한곳에서.",
};

// 메인 화면은 v2 시안(doc/mockups/home-v2.html)을 반영한다.
// 마크업은 src/generated/homeMarkup.ts, 인터랙션은 HomeEnhancer, 스타일은 globals.css의 `.home-v2`.
export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: homeMarkup }} />
      <HomeEnhancer />
    </>
  );
}

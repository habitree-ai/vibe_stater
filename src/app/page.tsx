import type { Metadata } from "next";
import { homeMarkup } from "@/generated/homeMarkup";
import { HomeEnhancer } from "@/components/HomeEnhancer";

export const metadata: Metadata = {
  title: "Creator Link Hub — 코딩 몰라도 직접 만든 우리의 공간",
  description:
    "AI 시대, 읽고 만들고 연결하는 우리의 공간. LINKMAP·ReadTree와 무료 교육 자료를 한곳에서.",
};

// 메인 화면은 참조 디자인('Creator Link Hub.html')을 그대로 반영한다.
// 마크업은 src/generated/homeMarkup.ts(자동 생성). 인터랙션은 HomeEnhancer.
export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: homeMarkup }} />
      <HomeEnhancer />
    </>
  );
}

import type { Metadata } from "next";
import { supportMarkup } from "@/generated/supportMarkup";
import { SupportEnhancer } from "@/components/SupportEnhancer";

export const metadata: Metadata = {
  title: "응원 키트 받기 — Creator Link Hub",
  description:
    "모든 자료와 서비스는 무료 교육 자원입니다. 응원 키트는 100% 선택이에요 — 마음이 닿는 만큼만.",
};

// 응원 키트 페이지는 참조 디자인('응원 키트 받기 - Support.html')을 그대로 반영한다.
// 마크업은 src/generated/supportMarkup.ts(자동 생성). 인터랙션은 SupportEnhancer.
export default function SupportPage() {
  return (
    <>
      <div className="pt-8" dangerouslySetInnerHTML={{ __html: supportMarkup }} />
      <SupportEnhancer />
    </>
  );
}

"use client";

import { useEffect } from "react";

// 주입된 홈 마크업의 가벼운 인터랙션(뉴스레터 폼)을 연결한다.
export function HomeEnhancer() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("#nl-email")?.closest("form");
    if (!form) return;
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const input = document.getElementById("nl-email") as HTMLInputElement | null;
      const msg = document.getElementById("nl-msg");
      if (input?.value.trim() && msg) {
        msg.textContent = "구독 신청이 완료되었습니다. 감사합니다! ✦";
        input.value = "";
      }
    };
    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, []);

  return null;
}

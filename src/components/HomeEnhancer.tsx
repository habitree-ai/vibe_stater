"use client";

import { useEffect } from "react";

// 주입된 홈 마크업의 가벼운 인터랙션(뉴스레터 폼, 커피챗 카드 링크)을 연결한다.
export function HomeEnhancer() {
  useEffect(() => {
    // 뉴스레터 폼
    const form = document.querySelector<HTMLFormElement>("#nl-email")?.closest("form");
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const input = document.getElementById("nl-email") as HTMLInputElement | null;
      const msg = document.getElementById("nl-msg");
      if (input?.value.trim() && msg) {
        msg.textContent = "구독 신청이 완료되었습니다. 감사합니다! ✦";
        input.value = "";
      }
    };
    form?.addEventListener("submit", onSubmit);

    // "커피챗 신청 →" 카드 → /coffee-chat 이동
    const ctas = Array.from(document.querySelectorAll<HTMLElement>("span")).filter((el) =>
      el.textContent?.includes("커피챗 신청")
    );
    const cleanups: Array<() => void> = [];
    for (const cta of ctas) {
      const card = cta.closest<HTMLElement>("div");
      const target = card ?? cta;
      target.style.cursor = "pointer";
      const go = () => {
        window.location.href = "/coffee-chat";
      };
      target.addEventListener("click", go);
      cleanups.push(() => target.removeEventListener("click", go));
    }

    return () => {
      form?.removeEventListener("submit", onSubmit);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

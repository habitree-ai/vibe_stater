"use client";

import { useEffect } from "react";

// 주입된 홈 v2 마크업의 인터랙션을 연결한다.
// - 스크롤 진입 reveal(.rv → .in)
// - 커스텀 커서 라벨(#hv-cursor, [data-cursor] hover)
// - 뉴스레터 폼(#nl-email)
// 서비스/자료/저널 카드는 마크업에서 <a href>로 이동을 처리한다.
export function HomeEnhancer() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // 스크롤 진입 reveal
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".home-v2 .rv"));
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // 커스텀 커서 라벨 (장식) — reduced-motion 시 비활성
    const cursor = document.getElementById("hv-cursor");
    if (cursor && !reduceMotion) {
      const onMove = (e: MouseEvent) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      };
      window.addEventListener("mousemove", onMove);
      cleanups.push(() => window.removeEventListener("mousemove", onMove));

      const targets = Array.from(document.querySelectorAll<HTMLElement>(".home-v2 [data-cursor]"));
      for (const el of targets) {
        const on = () => cursor.classList.add("on");
        const off = () => cursor.classList.remove("on");
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", on);
          el.removeEventListener("mouseleave", off);
        });
      }
    }

    // 뉴스레터 폼 — 실제 구독 저장(newsletter_subscribers)으로 연결.
    const form = document.querySelector<HTMLFormElement>("#nl-email")?.closest("form");
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const input = document.getElementById("nl-email") as HTMLInputElement | null;
      const msg = document.getElementById("nl-msg");
      const button = form?.querySelector<HTMLButtonElement>("button[type=submit]");
      const email = input?.value.trim();
      if (!email || !msg) return;

      if (button) button.disabled = true;
      msg.textContent = "구독 중…";

      fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.json())
        .then((res: { ok?: boolean; message?: string }) => {
          msg.textContent = res?.message ?? "잠시 후 다시 시도해 주세요.";
          if (res?.ok && input) input.value = "";
        })
        .catch(() => {
          msg.textContent = "구독에 실패했어요. 잠시 후 다시 시도해 주세요.";
        })
        .finally(() => {
          if (button) button.disabled = false;
        });
    };
    form?.addEventListener("submit", onSubmit);
    cleanups.push(() => form?.removeEventListener("submit", onSubmit));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

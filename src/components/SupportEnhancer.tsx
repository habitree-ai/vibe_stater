"use client";

import { useEffect } from "react";

// 주입된 후원 마크업의 인터랙션(금액 칩/슬라이더/커스텀 입력/후원/공유)을 연결한다.
// 원본 디자인의 DCLogic을 동일 동작으로 재구현.
export function SupportEnhancer() {
  useEffect(() => {
    const gid = (id: string) => document.getElementById(id);
    const clamp = (n: number) => {
      n = Math.round(Number(n) || 0);
      if (n < 1) n = 1;
      if (n > 10000) n = 10000;
      return n;
    };
    const fmt = (n: number) => "$" + n.toLocaleString("en-US");
    let amount = 10;

    const chips = gid("sup-chips");
    const slider = gid("sup-slider") as HTMLInputElement | null;
    const custom = gid("sup-custom") as HTMLInputElement | null;
    const form = gid("sup-form");
    const thank = gid("sup-thank");

    const syncUI = (updateCustom: boolean) => {
      const lbl = gid("sup-btn-label");
      if (lbl) lbl.textContent = fmt(amount) + " 후원하기";
      if (slider) {
        slider.value = String(amount);
        const pct = ((amount - 1) / 9999) * 100;
        slider.style.background =
          "linear-gradient(to right, oklch(0.62 0.14 163) 0%, oklch(0.62 0.14 163) " +
          pct +
          "%, oklch(0.9 0.01 160) " +
          pct +
          "%, oklch(0.9 0.01 160) 100%)";
      }
      if (custom && updateCustom) custom.value = String(amount);
      if (chips) {
        Array.from(chips.children).forEach((btn) => {
          const b = btn as HTMLElement;
          const active = Number(b.dataset.amt) === amount;
          b.style.background = active ? "oklch(0.62 0.14 163)" : "#fff";
          b.style.color = active ? "#fff" : "oklch(0.16 0.012 160)";
          b.style.borderColor = active ? "oklch(0.62 0.14 163)" : "oklch(0.9 0.01 160)";
          b.style.boxShadow = active ? "0 0 24px -8px oklch(0.62 0.14 163)" : "none";
        });
      }
    };

    const onPick = (e: Event) => {
      const t = (e.target as HTMLElement).closest("[data-amt]") as HTMLElement | null;
      if (!t) return;
      amount = clamp(Number(t.dataset.amt));
      syncUI(true);
    };
    const onSlider = (e: Event) => {
      amount = clamp(Number((e.target as HTMLInputElement).value));
      syncUI(true);
    };
    const onCustom = (e: Event) => {
      amount = clamp(Number((e.target as HTMLInputElement).value));
      syncUI(false);
    };
    const donate = () => {
      const t = gid("sup-thank-amt");
      if (t) t.textContent = fmt(amount);
      if (form) form.style.display = "none";
      if (thank) thank.style.display = "block";
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {}
    };
    const reset = () => {
      if (thank) thank.style.display = "none";
      if (form) form.style.display = "block";
      syncUI(true);
    };
    const copyLink = (btn: HTMLElement) => {
      const url = location?.href || "https://creator-link-hub.dev";
      const done = () => {
        const l = gid("sup-copy-label");
        if (l) {
          l.textContent = "복사됨!";
          setTimeout(() => {
            const l2 = gid("sup-copy-label");
            if (l2) l2.textContent = "링크 복사";
          }, 1600);
        }
      };
      navigator.clipboard ? navigator.clipboard.writeText(url).then(done).catch(done) : done();
    };

    chips?.addEventListener("click", onPick);
    slider?.addEventListener("input", onSlider);
    custom?.addEventListener("input", onCustom);

    const donateBtn = gid("sup-btn-label")?.closest("button");
    const onDonate = () => donate();
    donateBtn?.addEventListener("click", onDonate);

    const resetBtn = thank?.querySelector("button") as HTMLButtonElement | null;
    const onReset = () => reset();
    resetBtn?.addEventListener("click", onReset);

    const copyBtn = gid("sup-copy-label")?.closest("button");
    const onCopy = () => copyLink(copyBtn as HTMLElement);
    copyBtn?.addEventListener("click", onCopy);

    syncUI(true);

    return () => {
      chips?.removeEventListener("click", onPick);
      slider?.removeEventListener("input", onSlider);
      custom?.removeEventListener("input", onCustom);
      donateBtn?.removeEventListener("click", onDonate);
      resetBtn?.removeEventListener("click", onReset);
      copyBtn?.removeEventListener("click", onCopy);
    };
  }, []);

  return null;
}

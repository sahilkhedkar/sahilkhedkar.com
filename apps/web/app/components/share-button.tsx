"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [label, setLabel] = useState("Share");

  async function share() {
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setLabel("Copied");
      window.setTimeout(() => setLabel("Share"), 1600);
    } catch {
      setLabel("Share");
    }
  }

  return (
    <button type="button" className="share" onClick={share}>
      {label}
    </button>
  );
}

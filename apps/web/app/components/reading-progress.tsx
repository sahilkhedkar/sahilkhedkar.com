"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [section, setSection] = useState("");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const article = document.querySelector(".essay");
    if (!article) return;
    const headings = Array.from(article.querySelectorAll<HTMLElement>("h2, h3"));
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `reading-section-${index}`;
    });
    setSection(headings[0]?.innerText ?? "");

    const observer = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0];
      if (active) setSection((active.target as HTMLElement).innerText);
    }, { rootMargin: "-18% 0px -72% 0px" });
    headings.forEach((heading) => observer.observe(heading));

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = article.getBoundingClientRect();
        const total = article.scrollHeight - window.innerHeight;
        const walked = Math.max(0, -rect.top);
        setProgress(total > 0 ? Math.min(1, walked / total) : 0);
        setVisible(rect.top < -180 && rect.bottom > 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const circumference = 2 * Math.PI * 16;
  return (
    <div className={`reading-progress${visible ? " is-visible" : ""}`} aria-live="polite" aria-label={`Reading progress: ${Math.round(progress * 100)} percent`}>
      <span className="reading-progress-dot" />
      <span className="reading-progress-title" key={section}>{section}</span>
      <svg className="reading-progress-ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16" className="reading-progress-track" />
        <circle cx="18" cy="18" r="16" className="reading-progress-value" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
      </svg>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  })
    .format(count)
    .replaceAll("K", "k")
    .replaceAll("M", "m");
}

export function ViewCounter() {
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);
  const lastPath = useRef<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    const currentRequest = ++requestId.current;

    fetch("/api/views", { method: "POST", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Page view count unavailable");
        return response.json() as Promise<{ count: number }>;
      })
      .then(({ count: nextCount }) => {
        if (currentRequest === requestId.current && Number.isSafeInteger(nextCount)) {
          setCount(nextCount);
        }
      })
      .catch(() => {
        if (currentRequest === requestId.current) setCount(null);
      });
  }, [pathname]);

  const formattedCount = count === null ? "—" : formatCount(count);
  const tooltip = count === null ? "Page views" : `${count.toLocaleString()} page views`;

  return (
    <div
      className="view-counter"
      role="group"
      tabIndex={0}
      aria-label={`Page views: ${formattedCount}`}
    >
      <span className="social-tip" aria-hidden="true">
        {tooltip}
      </span>
      <svg
        viewBox="0 0 16 16"
        width="17"
        height="17"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
      </svg>
      <span className="view-counter-count">{formattedCount}</span>
    </div>
  );
}

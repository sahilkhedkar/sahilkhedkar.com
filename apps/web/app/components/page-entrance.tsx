"use client";

import { stagger, useAnimate } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

const entranceTargets = [
  ".site-nav > a",
  ".header-actions > *",
  ".main-frame > .profile > *",
  ".main-frame > .section > *",
  ".main-frame > .quote",
  ".main-frame > .essay > *:not(.reading-progress):not(.post-meta)",
  ".main-frame > .essay > .post-meta > *",
  ".main-frame > .essay > .post-meta .share",
  ".main-frame > .subpage:not(.blogs-page) > *",
  ".blogs-page-header",
  ".blog-filter-row > *",
  ".blogs-list-item",
  ".site-footer .footer-grid > *",
  ".site-footer .footer-bottom",
].join(",");

const entranceEase = [0.22, 1, 0.36, 1] as const;

export function PageEntrance({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scope, animate] = useAnimate();

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    // Client-side navigation swaps in the new route before effects run. A layout
    // effect applies the hidden starting state before that new route is painted.
    document.documentElement.classList.add("page-loading");

    const targets = Array.from(
      root.querySelectorAll(entranceTargets) as NodeListOf<HTMLElement>,
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (targets.length) {
      // Set the starting state while the pre-paint loading class still hides the page.
      animate(
        targets,
        reducedMotion ? { opacity: 0 } : { opacity: 0, y: 26 },
        { duration: 0 },
      );
    }

    document.documentElement.classList.remove("page-loading");

    if (targets.length) {
      animate(
        targets,
        reducedMotion ? { opacity: [0, 1] } : { opacity: [0, 1], y: [26, 0] },
        {
          duration: reducedMotion ? 0.34 : 0.95,
          delay: reducedMotion ? 0 : stagger(0.05, { startDelay: 0.04 }),
          ease: entranceEase,
        },
      );
    }
  }, [animate, pathname, scope]);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const handleNavigationStart = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
        document.documentElement.classList.add("page-loading");
      }
    };

    root.addEventListener("click", handleNavigationStart, true);
    return () => root.removeEventListener("click", handleNavigationStart, true);
  }, [scope]);

  return <div ref={scope} className="page-entrance-scope">{children}</div>;
}

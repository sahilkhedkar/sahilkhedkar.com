"use client";

import { stagger, useAnimate } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll(entranceTargets));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  return <div ref={scope} className="page-entrance-scope">{children}</div>;
}

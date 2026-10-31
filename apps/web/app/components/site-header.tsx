"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNav } from "../lib/profile";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="frame header-bar">
        <nav className="site-nav" aria-label="Primary">
          {headerNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

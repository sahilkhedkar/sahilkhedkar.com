"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { headerNav } from "../lib/profile";
import { ViewCounter } from "./view-counter";

export function SiteHeader() {
  const pathname = usePathname();
  const [blogSearch, setBlogSearch] = useState("");

  useEffect(() => {
    setBlogSearch("");
    window.dispatchEvent(new CustomEvent("blog-search-change", { detail: "" }));
  }, [pathname]);

  function updateBlogSearch(value: string) {
    setBlogSearch(value);
    window.dispatchEvent(new CustomEvent("blog-search-change", { detail: value }));
  }

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
        <div className="header-actions">
          {pathname === "/blogs" && (
            <label className="header-blog-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                value={blogSearch}
                placeholder="Search blogs..."
                aria-label="Search blogs"
                onChange={(event) => updateBlogSearch(event.target.value)}
              />
              {blogSearch && (
                <button
                  type="button"
                  aria-label="Clear blog search"
                  onClick={() => updateBlogSearch("")}
                >
                  ×
                </button>
              )}
            </label>
          )}
          <ViewCounter />
        </div>
      </div>
    </header>
  );
}

import React from "react";

export function Skills() {
  return (
    <div id="skills" className="scroll-mt-4 md:scroll-mt-10">
      <section className="mb-16 md:mb-20" aria-labelledby="skills-heading">
        <div className="stack-header">
          <h2 id="skills-heading" className="text-xl font-bold stack-heading">
            Stack
          </h2>
        </div>

        <div>
          {/* 01: Frontend and desktop */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-monitor-smartphone h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
                <path d="M10 19v-3.96 3.15" />
                <path d="M7 19h5" />
                <rect width="6" height="10" x="16" y="12" rx="2" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                Frontend and desktop
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Next.js"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/nextdotjs.svg"
                />
                Next.js
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="JavaScript"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/javascript.svg"
                />
                JavaScript
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="React.js"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/react.svg"
                />
                React.js
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="TailwindCSS"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/tailwindcss.svg"
                />
                TailwindCSS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Tauri"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/tauri.svg"
                />
                Tauri
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Electron"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/electron.svg"
                />
                Electron
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-box h-3.5 w-3.5"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                Chromium
              </span>
            </div>
          </div>

          {/* 02: Backend */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-server-cog h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5" />
                <path d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5" />
                <path d="M6 6h.01" />
                <path d="M6 18h.01" />
                <path d="m15.7 13.4-.9-.3" />
                <path d="m9.2 10.9-.9-.3" />
                <path d="m10.6 15.7.3-.9" />
                <path d="m13.6 15.7-.4-1" />
                <path d="m10.8 9.3-.4-1" />
                <path d="m8.3 13.6 1-.4" />
                <path d="m14.7 10.8 1-.4" />
                <path d="m13.4 8.3-.3.9" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                Backend
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="TypeScript"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/typescript.svg"
                />
                TypeScript
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Ruby"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/ruby.svg"
                />
                Ruby
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Rust"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/rust.svg"
                />
                Rust
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Python"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/python.svg"
                />
                Python
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Node.js"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/nodedotjs.svg"
                />
                Node.js
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Express.js"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/express.svg"
                />
                Express.js
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="tRPC"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/trpc.svg"
                />
                tRPC
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Zod"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/zod.svg"
                />
                Zod
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-link h-3.5 w-3.5"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                REST APIs
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="GraphQL"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/graphql.svg"
                />
                GraphQL
              </span>
            </div>
          </div>

          {/* 03: Databases and ORMs */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-database h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                <path d="M3 12A9 3 0 0 0 21 12" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                Databases and ORMs
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="PostgreSQL"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/postgresql.svg"
                />
                PostgreSQL
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="MongoDB"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/mongodb.svg"
                />
                MongoDB
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Drizzle ORM"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/drizzle.svg"
                />
                Drizzle ORM
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Prisma"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/prisma.svg"
                />
                Prisma
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="SQLite"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/sqlite.svg"
                />
                SQLite
              </span>
            </div>
          </div>

          {/* 04: Testing and DevOps */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-flask-conical h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                <path d="M8.5 2h7" />
                <path d="M7 16h10" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                Testing and DevOps
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Playwright"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/playwright.svg"
                />
                Playwright
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-refresh-cw h-3.5 w-3.5"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                E2E Testing
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Docker"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/tech/docker.svg"
                />
                Docker
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="GitHub Actions"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/githubactions.svg"
                />
                GitHub Actions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Homebrew"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/homebrew.svg"
                />
                Homebrew
              </span>
            </div>
          </div>

          {/* 05: Infrastructure */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-terminal h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" x2="20" y1="19" y2="19" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                Infrastructure
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Shell"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/shell.svg"
                />
                Shell
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Linux"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/linux.svg"
                />
                Linux
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <img
                  alt="Debian"
                  loading="lazy"
                  width="14"
                  height="14"
                  className="h-3.5 w-3.5"
                  src="/icons/debian.svg"
                />
                Debian
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-wrench h-3.5 w-3.5"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                Make
              </span>
            </div>
          </div>

          {/* 06: AI and integrations */}
          <div className="grid gap-3 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-7">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-cable h-3.5 w-3.5 shrink-0 text-foreground/55"
              >
                <path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1" />
                <path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" />
                <path d="M21 21v-2h-4" />
                <path d="M3 5h4V3" />
                <path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3" />
              </svg>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                AI and integrations
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-cable h-3.5 w-3.5"
                >
                  <path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1" />
                  <path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" />
                  <path d="M21 21v-2h-4" />
                  <path d="M3 5h4V3" />
                  <path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3" />
                </svg>
                MCP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key-round h-3.5 w-3.5"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
                OAuth
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bot h-3.5 w-3.5"
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
                AI agents
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-box h-3.5 w-3.5"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                E2B
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line/80 bg-card px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-foreground/85 transition-colors hover:border-foreground/30 hover:bg-canvas-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mouse-pointer2 h-3.5 w-3.5"
                >
                  <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
                </svg>
                Computer use
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

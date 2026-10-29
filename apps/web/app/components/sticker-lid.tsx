"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TechIcon } from "./tech-icon";

type Sticker = {
  slug: string;
  name: string;
  x: number;
  y: number;
  r: number;
  s: number;
  ink: string;
};

const stickers: Sticker[] = [
  { slug: "typescript", name: "TypeScript", x: 22, y: 26, r: -8, s: 148, ink: "#3178C6" },
  { slug: "react", name: "React", x: 50, y: 46, r: 3, s: 136, ink: "#61DAFB" },
  { slug: "javascript", name: "JavaScript", x: 70, y: 72, r: -4, s: 128, ink: "#F7DF1E" },
  { slug: "nextdotjs", name: "Next.js", x: 80, y: 30, r: 7, s: 96, ink: "#111111" },
  { slug: "postgresql", name: "PostgreSQL", x: 28, y: 68, r: -6, s: 88, ink: "#4169E1" },
  { slug: "nodedotjs", name: "Node.js", x: 36, y: 22, r: 6, s: 70, ink: "#5FA04E" },
  { slug: "docker", name: "Docker", x: 58, y: 18, r: -5, s: 64, ink: "#2496ED" },
  { slug: "tailwindcss", name: "Tailwind CSS", x: 34, y: 42, r: 9, s: 58, ink: "#06B6D4" },
  { slug: "openai", name: "OpenAI", x: 86, y: 50, r: -7, s: 60, ink: "#412991" },
  { slug: "rust", name: "Rust", x: 12, y: 44, r: 8, s: 58, ink: "#CE412B" },
  { slug: "github", name: "GitHub", x: 14, y: 78, r: -5, s: 56, ink: "#24292F" },
  { slug: "mongodb", name: "MongoDB", x: 46, y: 74, r: 6, s: 58, ink: "#47A248" },
  { slug: "redis", name: "Redis", x: 58, y: 58, r: -8, s: 52, ink: "#FF4438" },
  { slug: "prisma", name: "Prisma", x: 36, y: 86, r: 4, s: 52, ink: "#2D3748" },
  { slug: "firebase", name: "Firebase", x: 54, y: 88, r: -3, s: 50, ink: "#FFA000" },
  { slug: "stripe", name: "Stripe", x: 74, y: 48, r: 8, s: 54, ink: "#635BFF" },
  { slug: "html5", name: "HTML", x: 12, y: 18, r: -4, s: 52, ink: "#E34F26" },
  { slug: "css", name: "CSS", x: 90, y: 16, r: 6, s: 52, ink: "#1572B6" },
  { slug: "vercel", name: "Vercel", x: 10, y: 60, r: -8, s: 50, ink: "#111111" },
  { slug: "vite", name: "Vite", x: 90, y: 68, r: 5, s: 56, ink: "#646CFF" },
  { slug: "nestjs", name: "NestJS", x: 80, y: 84, r: -6, s: 56, ink: "#E0234E" },
  { slug: "framermotion", name: "Framer Motion", x: 22, y: 36, r: -9, s: 50, ink: "#0055FF" },
  { slug: "supabase", name: "Supabase", x: 64, y: 32, r: 6, s: 52, ink: "#3ECF8E" },
  { slug: "solidity", name: "Solidity", x: 74, y: 16, r: -3, s: 48, ink: "#363636" },
];

function tidyStyle(index: number, count: number, width: number, height: number): CSSProperties {
  const narrow = width < 560;
  const cols = narrow ? 4 : 6;
  const rows = Math.ceil(count / cols);
  const padX = 16;
  const padTop = 18;
  const padBottom = 56;
  const innerW = Math.max(0, width - padX * 2);
  const innerH = Math.max(0, height - padTop - padBottom);
  const maxSize = Math.min((innerW - (cols - 1) * 8) / cols, (innerH - (rows - 1) * 8) / rows);
  const sticker = Math.max(34, Math.min(narrow ? 48 : 60, maxSize));
  const gapX = cols > 1 ? (innerW - cols * sticker) / (cols - 1) : 0;
  const gapY = rows > 1 ? (innerH - rows * sticker) / (rows - 1) : 0;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const inLast = row === rows - 1;
  const itemsInRow = inLast ? count - row * cols : cols;
  const rowWidth = itemsInRow * sticker + Math.max(0, itemsInRow - 1) * gapX;
  const offsetX = padX + (innerW - rowWidth) / 2;
  const x = offsetX + col * (sticker + gapX);
  const y = padTop + row * (sticker + gapY);

  return {
    width: sticker,
    height: sticker,
    left: x,
    top: y,
    transform: "translate(0px, 0px) rotate(0deg)",
    zIndex: 1,
  };
}

export function StickerLid() {
  const lidRef = useRef<HTMLDivElement>(null);
  const [tidy, setTidy] = useState(false);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = lidRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    setReady(true);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={ready ? "lid is-ready" : "lid"} ref={lidRef}>
      <span className="lid-cam" aria-hidden="true" />
      <p className="sr-only">
        Stickers for the tools that have shipped in real work. The named list follows on this page.
      </p>
      {stickers.map((sticker, index) => {
        const style: CSSProperties =
          tidy && box.w > 0
            ? tidyStyle(index, stickers.length, box.w, box.h)
            : {
                width: `${(sticker.s / 680) * 100}%`,
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `translate(-50%, -50%) rotate(${sticker.r}deg)`,
                zIndex: Math.round(sticker.s),
              };

        return (
          <div
            key={sticker.slug}
            className="sticker"
            style={{ ...style, ["--ink" as string]: sticker.ink }}
            title={sticker.name}
          >
            <TechIcon slug={sticker.slug} />
          </div>
        );
      })}
      <button
        type="button"
        className="lid-tidy"
        aria-pressed={tidy}
        onClick={() => {
          const el = lidRef.current;
          if (el && box.w === 0) setBox({ w: el.clientWidth, h: el.clientHeight });
          setTidy((value) => !value);
        }}
      >
        {tidy ? "Scatter" : "Tidy up"}
      </button>
    </div>
  );
}

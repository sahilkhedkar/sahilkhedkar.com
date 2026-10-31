"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ContributionDay } from "../lib/contributions";
import {
  hitWindow,
  layoutSkyline,
  roofAt,
  skylineTip,
  todayWindowIndex,
  type SkyBuilding,
  type SkyMoon,
  type SkyWindow,
  type SkylineLayout,
} from "../lib/skyline";

type Tip = {
  text: string;
  x: number;
  y: number;
  below: boolean;
  visible: boolean;
};

type Palette = {
  buildings: string[];
  cornice: string;
  windows: string[];
  glow: string;
  glowAlpha: number;
  star: string;
  hover: string;
  night: boolean;
  moon: string;
  moonLit: string;
  moonShade: string;
  moonGlow: string;
  meteor: string;
};

type Meteor = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  life: number;
  bright: number;
  born: number;
};

type LayoutCache = {
  width: number;
  height: number;
  dpr: number;
  layout: SkylineLayout;
};

const HIDDEN_TIP: Tip = { text: "", x: 0, y: 0, below: false, visible: false };

export function Skyline({ days }: { days: ContributionDay[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const windowsRef = useRef<SkyWindow[]>([]);
  const drawRef = useRef<() => void>(() => {});
  const hoverRef = useRef(-1);
  const [tip, setTip] = useState<Tip>(HIDDEN_TIP);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    hoverRef.current = -1;
    const meteors: Meteor[] = [];
    let nextMeteorAt = 0;
    let cache: LayoutCache | null = null;
    let colors: Palette | null = null;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onScreen = true;
    let raf = 0;

    const scene = () => {
      const cssWidth = host.clientWidth;
      const cssHeight = host.clientHeight;
      if (
        !cache ||
        cache.width !== cssWidth ||
        cache.height !== cssHeight ||
        cache.dpr !== (window.devicePixelRatio || 1)
      ) {
        const dpr = window.devicePixelRatio || 1;
        cache = {
          width: cssWidth,
          height: cssHeight,
          dpr,
          layout: layoutSkyline(days, cssWidth, cssHeight, dpr),
        };
      }
      return cache;
    };

    const draw = (now: number) => {
      const cssWidth = host.clientWidth;
      const cssHeight = host.clientHeight;
      if (cssWidth < 2 || cssHeight < 2) return;

      const frame = scene();
      const bitmapWidth = Math.round(cssWidth * frame.dpr);
      const bitmapHeight = Math.round(cssHeight * frame.dpr);
      if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
        canvas.width = bitmapWidth;
        canvas.height = bitmapHeight;
      }

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(frame.dpr, 0, 0, frame.dpr, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);

      windowsRef.current = frame.layout.windows;
      if (!colors) colors = palette(host);

      if (colors.night && !reduced) {
        if (nextMeteorAt === 0) nextMeteorAt = now + 1100;
        for (let index = meteors.length - 1; index >= 0; index -= 1) {
          const meteor = meteors[index];
          if (!meteor || now - meteor.born >= meteor.life)
            meteors.splice(index, 1);
        }
        if (meteors.length === 0 && now >= nextMeteorAt) {
          const meteor = makeMeteor(
            cssWidth,
            frame.layout.buildings,
            frame.layout.moon,
            Math.random,
          );
          if (meteor) meteors.push({ ...meteor, born: now });
          nextMeteorAt = now + 3200 + Math.random() * 3400;
        }
      }

      paint(context, frame.layout, colors, hoverRef.current, {
        now,
        reduced,
        meteors,
      });
    };

    const tick = (now: number) => {
      draw(now);
      raf = 0;
      if (shouldAnimate()) raf = window.requestAnimationFrame(tick);
    };

    const shouldAnimate = () =>
      onScreen && document.visibilityState === "visible" && !reduced;

    const kick = () => {
      if (raf === 0 && shouldAnimate())
        raf = window.requestAnimationFrame(tick);
    };

    drawRef.current = () => draw(performance.now());
    draw(performance.now());
    kick();

    const resize = new ResizeObserver(() => {
      hoverRef.current = -1;
      meteors.splice(0, meteors.length);
      setTip((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
      draw(performance.now());
      kick();
    });
    resize.observe(host);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduced = motion.matches;
      if (reduced) meteors.splice(0, meteors.length);
      draw(performance.now());
      kick();
    };
    motion.addEventListener("change", onMotion);

    const onVisibility = () => {
      if (document.visibilityState === "visible") kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false;
      if (onScreen) kick();
    });
    seen.observe(host);

    return () => {
      if (raf !== 0) window.cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      drawRef.current = () => {};
    };
  }, [days]);

  useLayoutEffect(() => {
    const element = tipRef.current;
    const host = hostRef.current;
    if (!element || !host || !tip.visible) return;
    const half = element.offsetWidth / 2 + 8;
    const next = Math.min(host.clientWidth - half, Math.max(half, tip.x));
    element.style.left = `${next}px`;
  }, [tip]);

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    const windows = windowsRef.current;
    const index = hitWindow(
      windows,
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );
    if (index === hoverRef.current) return;
    hoverRef.current = index;
    drawRef.current();

    if (index < 0) {
      setTip((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
      return;
    }

    const pane = windows[index];
    if (!pane) return;
    const below = pane.y < 34;
    setTip({
      text: skylineTip(pane.day, index === todayWindowIndex(windows)),
      x: pane.x + pane.w / 2,
      y: below ? pane.y + pane.h : pane.y,
      below,
      visible: true,
    });
  }

  function leave() {
    if (hoverRef.current < 0 && !tip.visible) return;
    hoverRef.current = -1;
    drawRef.current();
    setTip((current) =>
      current.visible ? { ...current, visible: false } : current,
    );
  }

  return (
    <div
      ref={hostRef}
      className="skyline"
      role="img"
      aria-labelledby="contributions-caption"
      data-days={days.length}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerMove={move}
        onPointerDown={move}
        onPointerLeave={leave}
      />
      <div
        ref={tipRef}
        className="skytip"
        style={{
          opacity: tip.visible ? 1 : 0,
          left: tip.x,
          top: tip.y,
          transform: tip.below
            ? "translate(-50%, 8px)"
            : "translate(-50%, calc(-100% - 8px))",
        }}
      >
        {tip.text}
      </div>
    </div>
  );
}

function palette(element: HTMLElement): Palette {
  const style = getComputedStyle(element);
  const pick = (name: string) => style.getPropertyValue(name).trim();
  const star = pick("--sky-star");
  return {
    buildings: [pick("--sky-a"), pick("--sky-b"), pick("--sky-c")],
    cornice: pick("--sky-cornice"),
    windows: [0, 1, 2, 3, 4].map((level) => pick(`--sky-win-${level}`)),
    glow: pick("--sky-glow"),
    glowAlpha: Number(pick("--sky-glow-alpha")) || 0,
    star,
    hover: pick("--sky-hover"),
    night: star !== "" && star !== "transparent",
    moon: pick("--sky-moon"),
    moonLit: pick("--sky-moon-lit"),
    moonShade: pick("--sky-moon-shade"),
    moonGlow: pick("--sky-moon-glow"),
    meteor: pick("--sky-meteor"),
  };
}

function buildingFill(colors: Palette, shade: number) {
  return colors.buildings[shade] ?? colors.buildings[0] ?? "#26231c";
}

function windowFill(colors: Palette, level: number) {
  return colors.windows[level] ?? colors.windows[0] ?? "#100e0b";
}

function paint(
  context: CanvasRenderingContext2D,
  layout: SkylineLayout,
  colors: Palette,
  hover: number,
  motion: { now: number; reduced: boolean; meteors: Meteor[] },
) {
  const today = todayWindowIndex(layout.windows);
  const pulse = motion.reduced ? 1 : blinkAmount(motion.now);

  if (colors.night) {
    for (const star of layout.stars) {
      const wave =
        0.5 + 0.5 * Math.sin((motion.now / 1000) * star.speed + star.phase);
      const twinkle = motion.reduced
        ? 1
        : 1 - star.twinkle + star.twinkle * wave;
      context.globalAlpha = star.a * twinkle;
      context.fillStyle = colors.star;
      context.beginPath();
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      context.fill();
      if (star.r > 1) {
        context.globalAlpha = star.a * twinkle * 0.55;
        context.strokeStyle = colors.star;
        context.lineWidth = 0.6;
        context.beginPath();
        context.moveTo(star.x - star.r * 2.4, star.y);
        context.lineTo(star.x + star.r * 2.4, star.y);
        context.moveTo(star.x, star.y - star.r * 2.4);
        context.lineTo(star.x, star.y + star.r * 2.4);
        context.stroke();
      }
    }
    context.globalAlpha = 1;

    if (layout.moon) drawMoon(context, layout.moon, colors);
    if (!motion.reduced) {
      for (const meteor of motion.meteors) {
        drawMeteor(context, meteor, motion.now, colors);
      }
    }
  }

  for (const building of layout.buildings) {
    context.fillStyle = buildingFill(colors, building.shade);
    context.fillRect(building.x, building.y, building.w, building.h);
    context.fillStyle = colors.cornice;
    context.fillRect(building.x, building.y, building.w, 1);

    if (building.cap) {
      context.fillStyle = buildingFill(colors, building.shade);
      context.fillRect(
        building.cap.x,
        building.cap.y,
        building.cap.w,
        building.cap.h,
      );
      context.fillStyle = colors.cornice;
      context.fillRect(building.cap.x, building.cap.y, building.cap.w, 1);
    }

    if (building.antenna) {
      context.fillStyle = colors.cornice;
      context.fillRect(
        building.antenna.x,
        building.antenna.top,
        1,
        building.antenna.bottom - building.antenna.top,
      );
    }
  }

  layout.windows.forEach((pane, index) => {
    const level =
      pane.day.count <= 0 ? 0 : Math.max(1, Math.min(4, pane.day.level));
    if (index === today)
      drawToday(context, pane, colors, level, index === hover, pulse);
    else drawPane(context, pane, colors, level, index === hover);
  });
}

function blinkAmount(now: number) {
  const t = (now % 2100) / 2100;
  if (t < 0.66) return 1;
  if (t < 0.74) return 1 - smoother((t - 0.66) / 0.08);
  if (t < 0.84) return 0;
  return smoother((t - 0.84) / 0.16);
}

function smoother(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function drawMoon(
  context: CanvasRenderingContext2D,
  moon: SkyMoon,
  colors: Palette,
) {
  if (!colors.moon || colors.moon === "transparent") return;

  const glowX = moon.x - moon.r * 0.28;
  const glowY = moon.y - moon.r * 0.06;
  const halo = context.createRadialGradient(
    glowX,
    glowY,
    moon.r * 0.3,
    glowX,
    glowY,
    moon.r * 2.5,
  );
  halo.addColorStop(0, `rgba(${colors.moonGlow}, 0.16)`);
  halo.addColorStop(0.5, `rgba(${colors.moonGlow}, 0.045)`);
  halo.addColorStop(1, `rgba(${colors.moonGlow}, 0)`);
  context.fillStyle = halo;
  context.beginPath();
  context.arc(glowX, glowY, moon.r * 2.5, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.beginPath();
  context.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  context.clip();

  const body = context.createRadialGradient(
    moon.x - moon.r * 0.34,
    moon.y - moon.r * 0.32,
    moon.r * 0.12,
    moon.x,
    moon.y,
    moon.r,
  );
  body.addColorStop(0, colors.moonLit);
  body.addColorStop(0.62, colors.moon);
  body.addColorStop(1, colors.moonShade);
  context.fillStyle = body;
  context.beginPath();
  context.arc(moon.x, moon.y, moon.r, 0, Math.PI * 2);
  context.fill();

  context.globalCompositeOperation = "destination-out";
  context.fillStyle = "#000";
  context.beginPath();
  context.arc(moon.cutX, moon.cutY, moon.cutR, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawMeteor(
  context: CanvasRenderingContext2D,
  meteor: Meteor,
  now: number,
  colors: Palette,
) {
  const t = (now - meteor.born) / meteor.life;
  if (t <= 0 || t >= 1) return;
  const fade = Math.sin(Math.PI * t);
  const travel = 1 - (1 - t) * (1 - t);
  const headT = travel;
  const tailT = Math.max(0, travel - 0.34);
  const headX = meteor.x0 + (meteor.x1 - meteor.x0) * headT;
  const headY = meteor.y0 + (meteor.y1 - meteor.y0) * headT;
  const tailX = meteor.x0 + (meteor.x1 - meteor.x0) * tailT;
  const tailY = meteor.y0 + (meteor.y1 - meteor.y0) * tailT;
  const alpha = fade * meteor.bright;

  context.save();
  const trail = context.createLinearGradient(tailX, tailY, headX, headY);
  trail.addColorStop(0, `rgba(${colors.meteor}, 0)`);
  trail.addColorStop(0.45, `rgba(${colors.meteor}, ${0.28 * alpha})`);
  trail.addColorStop(1, `rgba(${colors.meteor}, ${0.95 * alpha})`);
  context.strokeStyle = trail;
  context.lineWidth = 1.3;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(headX, headY);
  context.stroke();

  const glow = context.createRadialGradient(headX, headY, 0, headX, headY, 5.5);
  glow.addColorStop(0, `rgba(${colors.moonGlow}, ${0.9 * alpha})`);
  glow.addColorStop(0.45, `rgba(${colors.meteor}, ${0.32 * alpha})`);
  glow.addColorStop(1, `rgba(${colors.meteor}, 0)`);
  context.fillStyle = glow;
  context.beginPath();
  context.arc(headX, headY, 5.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function makeMeteor(
  width: number,
  buildings: SkyBuilding[],
  moon: SkyMoon | null,
  random: () => number,
) {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const dir = random() < 0.22 ? -1 : 1;
    const slope = 0.12 + random() * 0.16;
    const length = 108 + random() * 96;
    const x0 =
      dir > 0
        ? 8 + random() * Math.max(24, width * 0.58)
        : width * 0.36 + random() * Math.max(24, width * 0.56);
    const y0 = 5 + random() * 14;
    const x1 = x0 + dir * length * Math.cos(slope);
    const y1 = y0 + length * Math.sin(slope);
    if (!pathFits(width, buildings, moon, x0, y0, x1, y1)) continue;
    return {
      x0,
      y0,
      x1,
      y1,
      life: 820 + random() * 380,
      bright: 0.7 + random() * 0.3,
    };
  }
  return null;
}

function pathFits(
  width: number,
  buildings: SkyBuilding[],
  moon: SkyMoon | null,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  for (let step = 0; step <= 8; step += 1) {
    const t = step / 8;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    if (x < 2 || x > width - 2 || y < 2) return false;
    if (y > roofAt(buildings, x) - 7) return false;
    if (moon && Math.hypot(x - moon.x, y - moon.y) < moon.r + 10) return false;
  }
  return true;
}

function drawPane(
  context: CanvasRenderingContext2D,
  pane: SkyWindow,
  colors: Palette,
  level: number,
  hovered: boolean,
) {
  if (level > 0 && colors.glowAlpha > 0) {
    const cx = pane.x + pane.w / 2;
    const cy = pane.y + pane.h / 2;
    const radius = Math.max(pane.w, pane.h) * (1.15 + level * 0.28);
    const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const alpha = colors.glowAlpha * (0.05 + level * 0.045);
    gradient.addColorStop(0, `rgba(${colors.glow}, ${alpha})`);
    gradient.addColorStop(1, `rgba(${colors.glow}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  context.fillStyle = windowFill(colors, level);
  fillRoundRect(
    context,
    pane.x,
    pane.y,
    pane.w,
    pane.h,
    Math.min(1.1, pane.w * 0.2),
  );

  if (hovered) strokeHover(context, pane, colors);
}

function drawToday(
  context: CanvasRenderingContext2D,
  pane: SkyWindow,
  colors: Palette,
  level: number,
  hovered: boolean,
  pulse: number,
) {
  drawPane(context, pane, colors, level, false);

  const cx = pane.x + pane.w / 2;
  const cy = pane.y + pane.h / 2;
  const dim = 1 - pulse;
  if (dim > 0.02) {
    context.save();
    context.globalAlpha = 0.82 * dim;
    context.fillStyle = windowFill(colors, 0);
    fillRoundRect(
      context,
      pane.x,
      pane.y,
      pane.w,
      pane.h,
      Math.min(1.1, pane.w * 0.2),
    );
    context.restore();
  }

  if (pulse > 0.02 && colors.glowAlpha > 0) {
    const radius = Math.max(pane.w, pane.h) * 3.2;
    const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const alpha = colors.glowAlpha * 0.32 * pulse;
    gradient.addColorStop(0, `rgba(${colors.glow}, ${alpha})`);
    gradient.addColorStop(1, `rgba(${colors.glow}, 0)`);
    context.fillStyle = gradient;
    context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }

  if (pulse > 0.02) {
    context.save();
    context.globalAlpha = pulse;
    context.fillStyle = windowFill(colors, 4);
    fillRoundRect(
      context,
      pane.x,
      pane.y,
      pane.w,
      pane.h,
      Math.min(1.1, pane.w * 0.2),
    );
    context.restore();
  }

  if (hovered) strokeHover(context, pane, colors);
}

function strokeHover(
  context: CanvasRenderingContext2D,
  pane: SkyWindow,
  colors: Palette,
) {
  context.strokeStyle = colors.hover;
  context.lineWidth = 1;
  strokeRoundRect(
    context,
    pane.x - 0.5,
    pane.y - 0.5,
    pane.w + 1,
    pane.h + 1,
    Math.min(1.4, pane.w * 0.24),
  );
}

function fillRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function strokeRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.stroke();
}

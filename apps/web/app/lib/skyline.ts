import type { ContributionDay } from "./contributions";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

// Column counts are the skyline's rhythm. 3 reads as a tower, 6 as a low block.
const WIDTHS = [5, 4, 6, 3, 5, 4, 3, 5, 6, 4, 3, 4];
const WEIGHTS = [
  0.78, 0.95, 0.7, 1.35, 0.82, 1, 1.42, 0.9, 0.66, 1.05, 1.28, 0.88,
];
const SHADES = [0, 1, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2];

export type SkyWindow = {
  day: ContributionDay;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SkyBuilding = {
  x: number;
  y: number;
  w: number;
  h: number;
  shade: number;
  cap: { x: number; y: number; w: number; h: number } | null;
  antenna: { x: number; top: number; bottom: number } | null;
  windows: SkyWindow[];
};

export type SkyStar = {
  x: number;
  y: number;
  r: number;
  a: number;
  twinkle: number;
  phase: number;
  speed: number;
};

export type SkyMoon = {
  x: number;
  y: number;
  r: number;
  cutX: number;
  cutY: number;
  cutR: number;
};

export type SkylineLayout = {
  buildings: SkyBuilding[];
  windows: SkyWindow[];
  stars: SkyStar[];
  moon: SkyMoon | null;
};

type Facade = {
  days: ContributionDay[];
  cols: number;
  rows: number;
  penthouse: number;
  shade: number;
};

type Metrics = {
  winW: number;
  winH: number;
  gapX: number;
  gapY: number;
  padX: number;
  padTop: number;
  padBottom: number;
  street: number;
};

export function skylineTip(day: ContributionDay, today = false) {
  const date = new Date(`${day.date}T00:00:00Z`);
  const month = MONTHS[date.getUTCMonth()] ?? "";
  const label = `${month} ${date.getUTCDate()}`;
  const noun = day.count === 1 ? "contribution" : "contributions";
  const base =
    day.count <= 0 ? `${label} · quiet day` : `${label} · ${day.count} ${noun}`;
  return today ? `${base} · today` : base;
}

export function todayWindowIndex(windows: SkyWindow[], now = new Date()) {
  if (windows.length === 0) return -1;
  const local = calendarKey(now);
  const utc = now.toISOString().slice(0, 10);
  for (let index = 0; index < windows.length; index += 1) {
    if (windows[index]?.day.date === local) return index;
  }
  if (local !== utc) {
    for (let index = 0; index < windows.length; index += 1) {
      if (windows[index]?.day.date === utc) return index;
    }
  }
  return windows.length - 1;
}

function calendarKey(now: Date) {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function layoutSkyline(
  days: ContributionDay[],
  width: number,
  height: number,
  dpr: number,
): SkylineLayout {
  const facades = planFacades(days);
  // Taller frames keep a night-sky band. The compact light-theme frame stays tight.
  const sky = height >= 206 ? Math.min(54, Math.max(42, height * 0.22)) : 22;
  const marginTop = sky;
  const marginBottom = 2;
  const marginX = 1;
  const usableW = Math.max(8, width - marginX * 2);
  const usableH = Math.max(8, height - marginTop - marginBottom);

  let lo = 0.3;
  let hi = 8;
  for (let step = 0; step < 24; step += 1) {
    const mid = (lo + hi) / 2;
    const size = citySize(facades, metrics(mid));
    if (size.width <= usableW && size.height <= usableH) lo = mid;
    else hi = mid;
  }

  const fitted = metrics(lo);
  const fittedSize = citySize(facades, fitted);
  const extra = usableW - fittedSize.width;
  const gaps = facades.length + 1;
  const share = extra > 0.5 && gaps > 0 ? extra / gaps : 0;
  const side = marginX + share;
  const street = fitted.street + share;
  const baseline = height - marginBottom;

  const buildings: SkyBuilding[] = [];
  const windows: SkyWindow[] = [];
  let cursor = side;

  for (const facade of facades) {
    const main = blockSize(facade.cols, facade.rows, fitted);
    const x = cursor;
    const y = baseline - main.h;
    const tuck = fitted.padBottom * 0.45;
    const capSize =
      facade.penthouse > 0 ? blockSize(facade.penthouse, 1, fitted) : null;
    const cap = capSize
      ? {
          x: snap(x + (main.w - capSize.w) / 2, dpr),
          y: snap(y - (capSize.h - tuck), dpr),
          w: snap(capSize.w, dpr),
          h: snap(capSize.h, dpr),
        }
      : null;
    const placed = placeWindows(facade, fitted, x, y, cap);
    const building: SkyBuilding = {
      x: snap(x, dpr),
      y: snap(y, dpr),
      w: snap(main.w, dpr),
      h: snap(main.h, dpr),
      shade: facade.shade,
      cap,
      antenna: null,
      windows: placed,
    };
    buildings.push(building);
    windows.push(...placed);
    cursor += main.w + street;
  }

  const masts = buildings
    .map((building, index) => ({ index, roof: building.cap?.y ?? building.y }))
    .sort((a, b) => a.roof - b.roof)
    .slice(0, 2);
  masts.forEach((mast, index) => {
    const building = buildings[mast.index];
    if (!building) return;
    const length = Math.min(
      fitted.winH * (index === 0 ? 1.8 : 1.25),
      mast.roof - 4,
    );
    if (length < 7) return;
    const center = building.cap
      ? building.cap.x + building.cap.w / 2
      : building.x + building.w / 2;
    building.antenna = {
      x: snap(center, dpr),
      top: snap(mast.roof - length, dpr),
      bottom: snap(mast.roof, dpr),
    };
  });

  if (windows.length !== days.length) {
    throw new Error(
      `Skyline placed ${windows.length} windows for ${days.length} days`,
    );
  }

  const moon = placeMoon(width, buildings);
  return {
    buildings,
    windows,
    stars: starfield(width, height, buildings, moon),
    moon,
  };
}

export function hitWindow(windows: SkyWindow[], x: number, y: number) {
  let best = -1;
  let bestDist = 7;
  for (let index = 0; index < windows.length; index += 1) {
    const window = windows[index];
    if (!window) continue;
    const dx =
      x < window.x
        ? window.x - x
        : x > window.x + window.w
          ? x - (window.x + window.w)
          : 0;
    const dy =
      y < window.y
        ? window.y - y
        : y > window.y + window.h
          ? y - (window.y + window.h)
          : 0;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      best = index;
      bestDist = dist;
    }
  }
  return best;
}

function planFacades(days: ContributionDay[]): Facade[] {
  if (days.length === 0) return [];

  const count =
    days.length >= 280
      ? 12
      : days.length >= 180
        ? 9
        : days.length >= 90
          ? 6
          : Math.max(1, Math.min(4, days.length));
  const periods = splitEven(days, count);
  const totals = periods.map((period) =>
    period.reduce((sum, day) => sum + day.count, 0),
  );
  const peak = Math.max(1, ...totals);
  const weights = periods.map((_, index) => {
    const activity = (totals[index] ?? 0) / peak;
    const rhythm = WEIGHTS[index % WEIGHTS.length] ?? 1;
    return rhythm * (0.86 + activity * 0.28);
  });
  const sizes = allocate(days.length, weights);

  let cursor = 0;
  const facades: Facade[] = sizes.map((size, index) => {
    const slice = days.slice(cursor, cursor + size);
    cursor += size;
    const activity = (totals[index] ?? 0) / peak;
    let cols = WIDTHS[index % WIDTHS.length] ?? 4;
    if (activity > 0.82) cols = Math.max(3, cols - 1);
    else if (activity < 0.04) cols = Math.min(6, cols + 1);
    const facade = toFacade(slice, cols);
    return { ...facade, shade: SHADES[index % SHADES.length] ?? 0 };
  });

  return facades;
}

function splitEven<T>(items: T[], parts: number) {
  const base = Math.floor(items.length / parts);
  let extra = items.length % parts;
  const out: T[][] = [];
  let cursor = 0;
  for (let index = 0; index < parts; index += 1) {
    const take = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    out.push(items.slice(cursor, cursor + take));
    cursor += take;
  }
  return out;
}

function allocate(total: number, weights: number[]) {
  const safe = weights.map((weight) => (weight > 0 ? weight : 1));
  const sum = safe.reduce((totalWeight, weight) => totalWeight + weight, 0);
  const exact = safe.map((weight) => (weight / sum) * total);
  const sizes = exact.map((value) => Math.floor(value));
  let used = sizes.reduce((totalSize, size) => totalSize + size, 0);
  const order = exact
    .map((value, index) => ({ index, frac: value - (sizes[index] ?? 0) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  let cursor = 0;
  while (used < total) {
    const slot = order[cursor % order.length];
    if (!slot) break;
    sizes[slot.index] = (sizes[slot.index] ?? 0) + 1;
    used += 1;
    cursor += 1;
  }
  return sizes;
}

function toFacade(
  days: ContributionDay[],
  preferredCols: number,
): Omit<Facade, "shade"> {
  const windows = days.length;
  let cols = Math.min(Math.max(1, preferredCols), Math.max(1, windows));
  while (cols > 1 && windows / (cols * cols) > 4.4) cols += 1;
  while (cols > 1 && Math.floor(windows / cols) < 2) cols -= 1;

  let penthouse = windows % cols;
  let rows = Math.floor(windows / cols);
  if (penthouse === 1) {
    const candidates = [cols + 1, cols + 2, cols - 1, cols + 3].filter(
      (next) => next >= 2 && next <= windows,
    );
    for (const next of candidates) {
      const remainder = windows % next;
      if (
        remainder !== 1 &&
        Math.floor(windows / next) >= 2 &&
        windows / (next * next) <= 4.6
      ) {
        cols = next;
        penthouse = remainder;
        rows = Math.floor(windows / next);
        break;
      }
    }
  }

  if (rows === 0) return { days, cols: windows, rows: 1, penthouse: 0 };
  return { days, cols, rows, penthouse };
}

function metrics(scale: number): Metrics {
  const winW = 3 * scale;
  const winH = 4.2 * scale;
  return {
    winW,
    winH,
    gapX: winW * 0.56,
    gapY: winH * 0.46,
    padX: winW * 0.7,
    padTop: winH * 0.58,
    padBottom: winH * 0.52,
    street: winW * 1.05,
  };
}

function blockSize(cols: number, rows: number, metric: Metrics) {
  const gridW = cols * metric.winW + Math.max(0, cols - 1) * metric.gapX;
  const gridH = rows * metric.winH + Math.max(0, rows - 1) * metric.gapY;
  return {
    w: gridW + metric.padX * 2,
    h: gridH + metric.padTop + metric.padBottom,
  };
}

function citySize(facades: Facade[], metric: Metrics) {
  let width = 0;
  let height = 0;
  for (const facade of facades) {
    const main = blockSize(facade.cols, facade.rows, metric);
    let blockHeight = main.h;
    if (facade.penthouse > 0) {
      const cap = blockSize(facade.penthouse, 1, metric);
      blockHeight += cap.h - metric.padBottom * 0.45;
    }
    width += main.w;
    height = Math.max(height, blockHeight);
  }
  width += metric.street * Math.max(0, facades.length - 1);
  return { width, height };
}

function placeWindows(
  facade: Facade,
  metric: Metrics,
  x: number,
  y: number,
  cap: { x: number; y: number } | null,
) {
  const placed: SkyWindow[] = [];
  let index = 0;

  if (cap && facade.penthouse > 0) {
    const originX = cap.x + metric.padX;
    const originY = cap.y + metric.padTop;
    for (let col = 0; col < facade.penthouse; col += 1) {
      const day = facade.days[index];
      index += 1;
      if (!day) break;
      placed.push({
        day,
        x: originX + col * (metric.winW + metric.gapX),
        y: originY,
        w: metric.winW,
        h: metric.winH,
      });
    }
  }

  const originX = x + metric.padX;
  const originY = y + metric.padTop;
  for (let row = 0; row < facade.rows; row += 1) {
    for (let col = 0; col < facade.cols; col += 1) {
      const day = facade.days[index];
      index += 1;
      if (!day) break;
      placed.push({
        day,
        x: originX + col * (metric.winW + metric.gapX),
        y: originY + row * (metric.winH + metric.gapY),
        w: metric.winW,
        h: metric.winH,
      });
    }
  }

  return placed;
}

export function roofAt(buildings: SkyBuilding[], x: number) {
  let roof = Number.POSITIVE_INFINITY;
  let nearest = Number.POSITIVE_INFINITY;
  let nearestRoof = 24;
  for (const building of buildings) {
    const left = Math.min(building.x, building.cap?.x ?? building.x);
    const right = Math.max(
      building.x + building.w,
      building.cap ? building.cap.x + building.cap.w : 0,
    );
    const top = building.antenna?.top ?? building.cap?.y ?? building.y;
    if (x >= left - 1 && x <= right + 1) roof = Math.min(roof, top);
    const dist = Math.abs(building.x + building.w / 2 - x);
    if (dist < nearest) {
      nearest = dist;
      nearestRoof = top;
    }
  }
  return roof === Number.POSITIVE_INFINITY ? nearestRoof : roof;
}

function placeMoon(width: number, buildings: SkyBuilding[]): SkyMoon | null {
  if (width < 96 || buildings.length === 0) return null;
  const radius = Math.min(15.5, Math.max(11, width * 0.021));
  let ceiling = Number.POSITIVE_INFINITY;
  for (const building of buildings) {
    ceiling = Math.min(
      ceiling,
      building.antenna?.top ?? building.cap?.y ?? building.y,
    );
  }
  const y = Math.max(radius + 4, ceiling * 0.46);
  if (y + radius > ceiling - 6) return null;

  let bestX = width * 0.78;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let step = 0; step <= 28; step += 1) {
    const x = width * (0.64 + (0.26 * step) / 28);
    if (x < radius + 10 || x > width - radius - 20) continue;
    let penalty = 0;
    for (const building of buildings) {
      const antenna = building.antenna;
      if (!antenna) continue;
      const nearestY = Math.min(antenna.bottom, Math.max(antenna.top, y));
      const dist = Math.hypot(x - antenna.x, y - nearestY);
      const clearance = radius + 8;
      if (dist < clearance) penalty += (clearance - dist) * 5;
    }
    const score = (x / width) * 10 - penalty;
    if (score > bestScore) {
      bestScore = score;
      bestX = x;
    }
  }

  return {
    x: bestX,
    y,
    r: radius,
    cutX: bestX + radius * 1.18,
    cutY: y - radius * 0.04,
    cutR: radius * 0.86,
  };
}

function starfield(
  width: number,
  height: number,
  buildings: SkyBuilding[],
  moon: SkyMoon | null,
) {
  const random = mulberry32(0x51a7c0de);
  const stars: SkyStar[] = [];
  const budget = Math.round(Math.min(36, 16 + (width * height) / 18000));
  let guard = 0;
  while (stars.length < budget && guard < 420) {
    guard += 1;
    const x = 8 + random() * Math.max(12, width - 16);
    const open = roofAt(buildings, x) - 7;
    if (open < 12) continue;
    const y = 3 + random() * Math.max(6, open - 3);
    if (moon && Math.hypot(x - moon.x, y - moon.y) < moon.r + 6) continue;
    if (moon && Math.hypot(x - moon.cutX, y - moon.cutY) < moon.cutR + 3) {
      continue;
    }
    const blocked = buildings.some((building) => {
      const top = (building.antenna?.top ?? building.cap?.y ?? building.y) - 4;
      const left = Math.min(building.x, building.cap?.x ?? building.x) - 3;
      const right =
        Math.max(
          building.x + building.w,
          building.cap ? building.cap.x + building.cap.w : 0,
        ) + 3;
      return (
        x >= left && x <= right && y >= top && y <= building.y + building.h
      );
    });
    if (blocked) continue;
    const bright = random() > 0.9;
    stars.push({
      x,
      y,
      r: bright ? 1.15 : random() > 0.55 ? 0.75 : 0.5,
      a: bright ? 0.5 + random() * 0.4 : 0.16 + random() * 0.36,
      twinkle: bright ? 0.5 : 0.14 + random() * 0.18,
      phase: random() * Math.PI * 2,
      speed: 0.4 + random() * 0.85,
    });
  }
  return stars;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function snap(value: number, dpr: number) {
  const ratio = dpr > 0 ? dpr : 1;
  return Math.round(value * ratio) / ratio;
}

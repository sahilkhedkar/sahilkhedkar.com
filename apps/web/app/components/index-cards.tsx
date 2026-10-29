import Link from "next/link";
import { indexCards, type IndexIcon } from "../lib/profile";

const stars = Array.from({ length: 128 }, (_, i) => {
  const x = ((i * 47) % 96) + 2;
  const y = ((i * 31) % 94) + 3;
  const edge = y < 12 || y > 88 || x < 6 || x > 94;
  return {
    x,
    y,
    s: edge && i % 2 === 0 ? 1.8 : i % 3 === 0 ? 1.35 : 1,
    d: (i % 9) * 0.38,
  };
});

function Constellation({
  name,
  viewBox,
  lines,
  stars: points,
}: {
  name: string;
  viewBox: string;
  lines: string[];
  stars: Array<[number, number, number]>;
}) {
  return (
    <svg className={`constellation const-${name}`} viewBox={viewBox}>
      {lines.map((d) => (
        <path key={d} d={d} />
      ))}
      {points.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  );
}

function Alien({ kind }: { kind: IndexIcon }) {
  const common = {
    className: `alien alien-${kind}`,
    viewBox: "0 0 64 72",
    "aria-hidden": true as const,
  };

  if (kind === "work") {
    return (
      <svg {...common}>
        <line x1="32" y1="16" x2="32" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle className="bulb" cx="32" cy="5" r="2.6" fill="currentColor" />
        <ellipse cx="32" cy="28" rx="14" ry="12" fill="currentColor" />
        <ellipse cx="27" cy="28" rx="3.2" ry="3.8" fill="var(--bg)" />
        <ellipse cx="37" cy="28" rx="3.2" ry="3.8" fill="var(--bg)" />
        <circle cx="27.4" cy="28.6" r="1.4" fill="currentColor" />
        <circle cx="37.4" cy="28.6" r="1.4" fill="currentColor" />
        <ellipse cx="32" cy="46" rx="12" ry="8" fill="currentColor" />
        <rect x="24" y="52" width="5" height="12" rx="2.5" fill="currentColor" />
        <rect x="35" y="52" width="5" height="12" rx="2.5" fill="currentColor" />
        <ellipse cx="25.5" cy="65" rx="4.2" ry="2" fill="currentColor" />
        <ellipse cx="38.5" cy="65" rx="4.2" ry="2" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "projects") {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="26" rx="16" ry="14" fill="currentColor" />
        <ellipse className="eye" cx="32" cy="27" rx="7" ry="6.2" fill="var(--bg)" />
        <circle cx="32" cy="27.4" r="2.4" fill="currentColor" />
        <path d="M24 36c3 2 13 2 16 0" fill="none" stroke="var(--bg)" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="32" cy="48" rx="11" ry="7" fill="currentColor" />
        <rect x="25" y="53" width="5" height="11" rx="2.5" fill="currentColor" />
        <rect x="34" y="53" width="5" height="11" rx="2.5" fill="currentColor" />
        <ellipse cx="26.4" cy="65" rx="4" ry="2" fill="currentColor" />
        <ellipse cx="37.6" cy="65" rx="4" ry="2" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "know") {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="14" rx="8" ry="7" fill="currentColor" />
        <ellipse cx="29" cy="14" rx="1.8" ry="2.2" fill="var(--bg)" />
        <ellipse cx="35" cy="14" rx="1.8" ry="2.2" fill="var(--bg)" />
        <rect x="30" y="20" width="4" height="10" rx="2" fill="currentColor" />
        <ellipse cx="32" cy="40" rx="9" ry="11" fill="currentColor" />
        <rect x="26" y="50" width="4" height="14" rx="2" fill="currentColor" />
        <rect x="34" y="50" width="4" height="14" rx="2" fill="currentColor" />
        <ellipse cx="27" cy="65" rx="3.6" ry="1.8" fill="currentColor" />
        <ellipse cx="37" cy="65" rx="3.6" ry="1.8" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "tech") {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="26" rx="18" ry="12" fill="currentColor" />
        <circle cx="22" cy="26" r="3.1" fill="var(--bg)" />
        <circle cx="32" cy="25" r="3.1" fill="var(--bg)" />
        <circle cx="42" cy="26" r="3.1" fill="var(--bg)" />
        <circle cx="22" cy="26.4" r="1.3" fill="currentColor" />
        <circle cx="32" cy="25.4" r="1.3" fill="currentColor" />
        <circle cx="42" cy="26.4" r="1.3" fill="currentColor" />
        <ellipse cx="32" cy="46" rx="12" ry="8" fill="currentColor" />
        <rect x="24" y="52" width="5" height="12" rx="2.5" fill="currentColor" />
        <rect x="35" y="52" width="5" height="12" rx="2.5" fill="currentColor" />
        <ellipse cx="25.5" cy="65" rx="4" ry="2" fill="currentColor" />
        <ellipse cx="38.5" cy="65" rx="4" ry="2" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "blogs") {
    return (
      <svg {...common}>
        <ellipse cx="34" cy="24" rx="13" ry="11" fill="currentColor" />
        <ellipse cx="29.5" cy="24" rx="2.8" ry="3.4" fill="var(--bg)" />
        <ellipse cx="38.5" cy="24" rx="2.8" ry="3.4" fill="var(--bg)" />
        <circle cx="29.8" cy="24.6" r="1.2" fill="currentColor" />
        <circle cx="38.8" cy="24.6" r="1.2" fill="currentColor" />
        <ellipse cx="34" cy="44" rx="11" ry="8" fill="currentColor" />
        <g className="arm">
          <rect x="14" y="30" width="5" height="16" rx="2.5" fill="currentColor" />
        </g>
        <rect x="44" y="38" width="5" height="10" rx="2.5" fill="currentColor" />
        <rect x="27" y="51" width="5" height="12" rx="2.5" fill="currentColor" />
        <rect x="36" y="51" width="5" height="12" rx="2.5" fill="currentColor" />
        <ellipse cx="28.4" cy="64" rx="4" ry="2" fill="currentColor" />
        <ellipse cx="39.6" cy="64" rx="4" ry="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <ellipse cx="32" cy="30" rx="15" ry="13" fill="currentColor" />
      <ellipse cx="26" cy="29" rx="3" ry="3.6" fill="var(--bg)" />
      <ellipse cx="38" cy="29" rx="3" ry="3.6" fill="var(--bg)" />
      <circle cx="26.4" cy="29.6" r="1.3" fill="currentColor" />
      <circle cx="38.4" cy="29.6" r="1.3" fill="currentColor" />
      <path d="M27 36c2.2 2 8 2 10.4 0" fill="none" stroke="var(--bg)" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="32" cy="50" rx="16" ry="8" fill="currentColor" />
      <ellipse cx="20" cy="56" rx="8" ry="3.2" fill="currentColor" transform="rotate(18 20 56)" />
      <ellipse cx="46" cy="58" rx="8" ry="3.2" fill="currentColor" transform="rotate(-24 46 58)" />
    </svg>
  );
}

function Sky() {
  return (
    <>
      <div className="field-sky" aria-hidden="true">
        <Constellation
          name="dipper"
          viewBox="0 0 160 64"
          lines={["M4 8 L30 20 L56 32 L84 26 L126 12 L116 48 L78 52 L84 26"]}
          stars={[
            [4, 8, 1.5],
            [30, 20, 1.8],
            [56, 32, 1.6],
            [84, 26, 1.5],
            [126, 12, 2.2],
            [116, 48, 1.9],
            [78, 52, 1.6],
          ]}
        />
        <Constellation
          name="cass"
          viewBox="0 0 132 52"
          lines={["M6 10 L34 40 L66 8 L96 42 L126 14"]}
          stars={[
            [6, 10, 1.8],
            [34, 40, 2],
            [66, 8, 2.3],
            [96, 42, 1.7],
            [126, 14, 1.9],
          ]}
        />
        <svg className="field-planet" viewBox="0 0 80 80">
          <ellipse cx="40" cy="42" rx="30" ry="8" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(-22 40 42)" />
          <circle cx="40" cy="40" r="14" fill="currentColor" />
          <ellipse cx="35" cy="36" rx="5" ry="3" fill="var(--bg)" opacity="0.2" />
        </svg>
        <svg className="field-moon" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="16" fill="currentColor" />
          <circle cx="16" cy="18" r="3" fill="var(--bg)" opacity="0.25" />
          <circle cx="28" cy="26" r="4.5" fill="var(--bg)" opacity="0.22" />
          <circle cx="20" cy="30" r="2" fill="var(--bg)" opacity="0.2" />
        </svg>
        <svg className="field-crescent" viewBox="0 0 40 40">
          <path d="M24 4a16 16 0 1 0 0 32 12 12 0 1 1 0-32z" fill="currentColor" />
        </svg>
        <svg className="field-sat" viewBox="0 0 88 28">
          <rect x="2" y="9" width="22" height="8" fill="currentColor" opacity="0.7" />
          <rect x="64" y="9" width="22" height="8" fill="currentColor" opacity="0.7" />
          <rect x="26" y="6" width="36" height="16" rx="2" fill="currentColor" />
          <circle cx="44" cy="14" r="3" fill="var(--bg)" />
          <path d="M44 6V1M40 3h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <svg className="field-ufo" viewBox="0 0 120 64">
          <path className="beam" d="M60 30c-8 0-14 22-28 30h56c-14-8-20-30-28-30z" fill="currentColor" />
          <ellipse cx="60" cy="24" rx="13" ry="9" fill="currentColor" />
          <ellipse cx="56" cy="22" rx="5" ry="3" fill="var(--bg)" opacity="0.35" />
          <ellipse cx="60" cy="36" rx="36" ry="10" fill="currentColor" />
          <circle cx="38" cy="37" r="1.6" fill="var(--bg)" />
          <circle cx="50" cy="39" r="1.6" fill="var(--bg)" />
          <circle cx="62" cy="40" r="1.6" fill="var(--bg)" />
          <circle cx="74" cy="39" r="1.6" fill="var(--bg)" />
          <circle cx="86" cy="37" r="1.6" fill="var(--bg)" />
        </svg>
      </div>
      <div className="field-front" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={index}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              animationDelay: `${star.d}s`,
            }}
          />
        ))}
        <span className="pebble pebble-a" />
        <span className="pebble pebble-b" />
        <span className="pebble pebble-c" />
      </div>
    </>
  );
}

export function IndexCards() {
  return (
    <div className="field">
      <Sky />
      <div className="field-rocks">
        {indexCards.map((card) => (
          <div key={card.href} className="rock-slot">
            <Alien kind={card.icon} />
            <Link href={card.href} className={`rock rock-${card.icon}`}>
              <span className="rock-no">{card.number}</span>
              <span className="rock-label">{card.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

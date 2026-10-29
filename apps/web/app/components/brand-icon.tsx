import { icons, type IconName } from "../lib/icons";

export function BrandIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 256 256" className="brand-icon" aria-hidden="true">
      {icons[name].map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill="currentColor"
          opacity={"opacity" in path ? path.opacity : undefined}
        />
      ))}
    </svg>
  );
}

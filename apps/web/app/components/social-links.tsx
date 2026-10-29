import { socials } from "../lib/profile";
import { BrandIcon } from "./brand-icon";

export function SocialLinks({ variant }: { variant: "inline" | "boxed" }) {
  return (
    <div className={variant === "inline" ? "socials-inline" : "socials-boxed"}>
      {socials.map((social) => {
        const external = social.href.startsWith("http");
        return (
          <a
            key={social.label}
            className={variant === "inline" ? "social-inline" : "social-boxed"}
            href={social.href}
            aria-label={social.label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            <span className="social-tip" aria-hidden="true">
              {social.label}
            </span>
            <BrandIcon name={social.icon} />
            <span className="sr-only">{social.label}</span>
          </a>
        );
      })}
    </div>
  );
}

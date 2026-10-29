import Link from "next/link";
import { footerNav } from "../lib/profile";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="frame">
        <div className="footer-grid">
          <div>
            <p className="footer-label">Navigate</p>
            <nav className="footer-nav" aria-label="Footer">
              {footerNav.map((item) =>
                item.href.endsWith(".xml") ? (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
          <div>
            <p className="footer-label">Connect</p>
            <SocialLinks variant="boxed" />
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Sahil Khedkar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

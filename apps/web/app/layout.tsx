import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { profile } from "./lib/profile";
import "./globals.css";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sahil Khedkar",
    template: "%s · Sahil Khedkar",
  },
  description: profile.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <div className="shell">
          <SiteHeader />
          <main className="frame main-frame">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

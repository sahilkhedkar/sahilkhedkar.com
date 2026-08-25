import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahil Khedkar",
  description: "a bit of me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

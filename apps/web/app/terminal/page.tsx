import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terminal" };

export default function TerminalPage() {
  return (
    <article className="subpage">
      <h1>Terminal</h1>
      <p className="empty">Nothing here yet.</p>
    </article>
  );
}

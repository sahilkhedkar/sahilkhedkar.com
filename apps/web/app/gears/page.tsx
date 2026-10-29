import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gears" };

export default function GearsPage() {
  return (
    <article className="subpage">
      <h1>Gears</h1>
      <p className="empty">Nothing here yet.</p>
    </article>
  );
}

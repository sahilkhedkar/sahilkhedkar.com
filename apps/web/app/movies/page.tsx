import type { Metadata } from "next";

export const metadata: Metadata = { title: "Movies" };

export default function MoviesPage() {
  return (
    <article className="subpage">
      <h1>Movies</h1>
      <p className="empty">Nothing here yet.</p>
    </article>
  );
}

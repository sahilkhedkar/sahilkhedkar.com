import type { Metadata } from "next";

export const metadata: Metadata = { title: "Books" };

export default function BooksPage() {
  return (
    <article className="subpage">
      <h1>Books</h1>
      <p className="empty">Nothing here yet.</p>
    </article>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <article className="subpage">
      <h1>Projects</h1>
      <p className="empty">Projects will land here as they ship.</p>
    </article>
  );
}

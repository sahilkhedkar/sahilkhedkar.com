import type { Metadata } from "next";
import { BlogIndex } from "../components/blog-index";
import { posts } from "../lib/profile";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on engineering and programming.",
};

export default function BlogsPage() {
  return (
    <article className="subpage blogs-page">
      <header className="blogs-page-header">
        <h1 className="blogs-title">Blog</h1>
        <p className="blogs-page-subtitle">Thoughts, tutorials, and insights on engineering and programming.</p>
      </header>
      <BlogIndex posts={posts} />
    </article>
  );
}

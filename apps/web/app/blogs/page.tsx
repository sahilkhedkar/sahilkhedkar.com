import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "../lib/profile";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Thoughts, tutorials, and insights on engineering and programming.",
};

export default function BlogsPage() {
  return (
    <article className="subpage blogs-page">
      <header className="blogs-page-header">
        <h1 className="blogs-title">Blogs</h1>
        <p className="blogs-page-subtitle">
          Thoughts, tutorials, and insights on engineering and programming.
        </p>
      </header>

      <div className="blogs-list">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="blogs-list-item"
          >
            <div className="blogs-item-content">
              <h2 className="blogs-item-title">{post.title}</h2>
              <p className="blogs-item-description">{post.description}</p>
              <div className="blogs-item-date">
                <svg
                  className="calendar-icon"
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <time dateTime={post.date}>{post.displayDate}</time>
              </div>
            </div>

            <div className="blogs-item-action">
              <span className="blogs-item-readmore">
                Read more <span className="readmore-arrow">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}

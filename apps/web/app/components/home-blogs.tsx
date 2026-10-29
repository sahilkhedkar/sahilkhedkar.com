import Link from "next/link";
import { posts } from "../lib/profile";

export function HomeBlogs() {
  const displayedPosts = posts.slice(0, 3);

  return (
    <div className="home-blogs-container">
      <h2 className="home-blogs-heading">Blogs</h2>

      <div className="home-blogs-list">
        {displayedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="home-blog-card"
          >
            <div className="home-blog-content">
              <h3 className="home-blog-title">{post.title}</h3>
              <p className="home-blog-description">{post.description}</p>
              <div className="home-blog-meta">
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

            <div className="home-blog-action">
              <span className="home-blog-readmore">
                Read more <span className="readmore-arrow">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="home-blogs-footer">
        <Link href="/blogs" className="show-all-blogs-link">
          show all blogs <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

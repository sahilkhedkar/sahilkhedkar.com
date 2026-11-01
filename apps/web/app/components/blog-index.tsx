"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "../lib/profile";

const blogTags = [
  "Personal",
  "AI",
  "Engineering",
  "Next.js",
  "Design",
  "Frontend",
  "Security",
  "Automation",
  "Backend",
  "Career",
  "Go",
  "JavaScript",
  "Performance",
] as const;

export function BlogIndex({ posts }: { posts: readonly Post[] }) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [query, setQuery] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  useEffect(() => {
    const handleSearch = (event: Event) => {
      const searchEvent = event as CustomEvent<unknown>;
      if (typeof searchEvent.detail === "string") setQuery(searchEvent.detail);
    };
    window.addEventListener("blog-search-change", handleSearch);
    return () => window.removeEventListener("blog-search-change", handleSearch);
  }, []);
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>(blogTags.map((tag) => [tag, 0] as const));
    posts.forEach((post) => {
      post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return blogTags.map((tag) => [tag, counts.get(tag) ?? 0] as const);
  }, [posts]);
  const visibleTags = showAllTags ? tagCounts : tagCounts.slice(0, 5);
  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag);
    const searchText = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
    return matchesTag && searchText.includes(query.trim().toLowerCase());
  });

  return (
    <div className="blog-index-controls">
      <div className="blog-filter-row" role="group" aria-label="Filter blogs by topic">
        <button
          className={`blog-tag-filter${selectedTag === "All" ? " is-selected" : ""}`}
          type="button"
          onClick={() => setSelectedTag("All")}
          aria-pressed={selectedTag === "All"}
        >
          All <span className="blog-tag-count">{posts.length}</span>
        </button>
        {visibleTags.map(([tag, count]) => (
          <button
            key={tag}
            className={`blog-tag-filter${selectedTag === tag ? " is-selected" : ""}`}
            type="button"
            onClick={() => setSelectedTag(tag)}
            aria-pressed={selectedTag === tag}
          >
            {tag} <span className="blog-tag-count">{count}</span>
          </button>
        ))}
        {tagCounts.length > 5 && (
          <button
            className="blog-tag-filter blog-show-tags"
            type="button"
            onClick={() => setShowAllTags((shown) => !shown)}
            aria-expanded={showAllTags}
          >
            {showAllTags ? "Hide" : `${tagCounts.length - 5} Show all`}
          </button>
        )}
      </div>

      <div className="blogs-list">
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/blogs/${post.slug}`} className="blogs-list-item">
            <div className="blogs-item-content">
              <h2 className="blogs-item-title">{post.title}</h2>
              <p className="blogs-item-description">{post.description}</p>
              <div className="blogs-item-tags">
                {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <time className="blogs-item-date" dateTime={post.date}>
                <svg viewBox="0 0 256 256" aria-hidden="true">
                  <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z" />
                </svg>
                {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
              </time>
            </div>
            <span className="blogs-item-readmore">
              Read more <span className="readmore-arrow">→</span>
            </span>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <p className="blogs-empty-state">No posts match that search. Try another title or topic.</p>
        )}
      </div>
    </div>
  );
}

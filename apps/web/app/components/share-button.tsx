"use client";

import { useEffect, useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`https://sahilkhedkar.com${window.location.pathname}`);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const message = url ? `Check out: ${title}\n${url}` : `Check out: ${title}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access requires HTTPS or localhost in modern browsers.
    }
  }

  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(message)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <>
      <button type="button" className="share" onClick={() => setOpen(true)}>
        Share
      </button>
      {open && (
        <div className="share-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">
            <header className="share-dialog-header">
              <div>
                <h2 id="share-title">Share this post</h2>
                <p>“{title}”</p>
              </div>
            </header>
            <button className="share-close" type="button" aria-label="Close share dialog" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.51a12 12 0 0 1-17-17L111 128 47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" /></svg>
            </button>
            <div className="share-dialog-content">
              <div className="share-field">
                <label className="share-label" htmlFor="share-url">Copy link</label>
                <div className="share-copy-row">
                  <input id="share-url" type="text" readOnly value={url} onFocus={(event) => event.currentTarget.select()} />
                  <button className="share-copy-button" type="button" onClick={copyLink} aria-label="Copy link" title="Copy link">
                    {copied ? "✓" : <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8ZM160 208H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z" /></svg>}
                  </button>
                </div>
                <span className="share-copy-status" aria-live="polite">{copied ? "Link copied" : ""}</span>
              </div>
              <div className="share-field">
                <div className="share-label">Share on</div>
                <div className="share-socials">
                  <a href={xUrl} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M215 219.85a8 8 0 0 1-7 4.15h-48a8 8 0 0 1-6.75-3.71l-40.49-63.63-58.84 64.72a8 8 0 0 1-11.84-10.76l61.77-68L41.25 44.3A8 8 0 0 1 48 32h48a8 8 0 0 1 6.75 3.71l40.49 63.63 58.84-64.72a8 8 0 0 1 11.84 10.76l-61.77 67.95 62.6 98.38a8 8 0 0 1 .25 8.14Z" /></svg>
                    Twitter / X
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 256 256" aria-hidden="true"><path d="M216 24H40a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16ZM96 176a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0ZM88 96a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm96 80a8 8 0 0 1-16 0v-36a20 20 0 0 0-40 0v36a8 8 0 0 1-16 0v-64a8 8 0 0 1 15.79-1.78A36 36 0 0 1 184 140Z" /></svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

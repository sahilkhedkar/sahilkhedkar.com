import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found-art" aria-hidden="true">
        <svg viewBox="0 0 600 600" role="presentation">
          <use href="/error-illustration-v3.svg#error-art" />
        </svg>
      </div>
      <div className="not-found-copy">
        <p className="not-found-code">404 <span>·</span> Page not found</p>
        <h1 id="not-found-title">Looks like you’re lost.</h1>
        <p className="not-found-description">
          The page you’re looking for has wandered off. Let’s get you back to
          somewhere familiar.
        </p>
        <Link className="not-found-home" href="/">
          Back to home page
        </Link>
      </div>
    </section>
  );
}

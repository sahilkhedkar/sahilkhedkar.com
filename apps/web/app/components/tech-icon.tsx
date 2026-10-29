export function TechIcon({ slug, className }: { slug: string; className?: string }) {
  const classes = className ? `tech-icon ${className}` : "tech-icon";

  return (
    <span
      className={classes}
      style={{ ["--mark" as string]: `url("/tech/${slug}.svg")` }}
      aria-hidden="true"
    />
  );
}

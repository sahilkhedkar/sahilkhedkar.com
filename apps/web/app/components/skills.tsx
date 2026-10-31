const skills = [
  { name: "React", href: "https://www.google.com/search?q=React%20JS%20JavaScript%20library" },
  { name: "Next", href: "https://www.google.com/search?q=Next.js%20React%20framework" },
  { name: "Expo", href: "https://www.google.com/search?q=Expo%20React%20Native%20framework" },
  { name: "Swift", href: "https://www.google.com/search?q=Swift%20programming%20language" },
  { name: "Tauri", href: "https://www.google.com/search?q=Tauri%20desktop%20app%20framework" },
  { name: "Django", href: "https://www.google.com/search?q=Django%20Python%20web%20framework" },
  { name: "Express", href: "https://www.google.com/search?q=Express.js%20Node.js%20framework" },
  { name: "Node", href: "https://www.google.com/search?q=Node.js%20JavaScript%20runtime" },
  { name: "Bun", href: "https://www.google.com/search?q=Bun.js%20JavaScript%20runtime" },
  { name: "PostgreSQL", href: "https://www.google.com/search?q=PostgreSQL%20database" },
  { name: "MongoDB", href: "https://www.google.com/search?q=MongoDB%20NoSQL%20database" },
  { name: "Redis", href: "https://www.google.com/search?q=Redis%20in-memory%20database" },
  { name: "Prisma", href: "https://www.google.com/search?q=Prisma%20ORM%20database%20toolkit" },
  { name: "Clerk", href: "https://www.google.com/search?q=Clerk%20authentication%20platform" },
  { name: "Zustand", href: "https://www.google.com/search?q=Zustand%20React%20state%20management" },
  { name: "Tanstack Query", href: "https://www.google.com/search?q=TanStack%20Query%20React%20Query" },
  { name: "Postman", href: "https://www.google.com/search?q=Postman%20API%20testing%20tool" },
  { name: "Tailwind", href: "https://www.google.com/search?q=Tailwind%20CSS%20framework" },
  { name: "shadcn", href: "https://www.google.com/search?q=shadcn%2Fui%20React%20components" },
  { name: "Motion", href: "https://www.google.com/search?q=Framer%20Motion%20React%20animation%20library" },
  { name: "GSAP", href: "https://www.google.com/search?q=GSAP%20GreenSock%20animation%20library" },
  { name: "JavaScript", href: "https://www.google.com/search?q=JavaScript%20programming%20language" },
  { name: "TypeScript", href: "https://www.google.com/search?q=TypeScript%20programming%20language" },
  { name: "Java", href: "https://www.google.com/search?q=Java%20programming%20language" },
  { name: "Python", href: "https://www.google.com/search?q=Python%20programming%20language" },
  { name: "C/C++", href: "https://www.google.com/search?q=C%20and%20C%2B%2B%20programming%20language" },
  { name: "SQL", href: "https://www.google.com/search?q=SQL%20database%20query%20language" },
  { name: "Git", href: "https://www.google.com/search?q=Git%20version%20control" },
  { name: "Github", href: "https://www.google.com/search?q=GitHub%20code%20hosting%20platform" },
  { name: "Figma", href: "https://www.google.com/search?q=Figma%20design%20tool" },
  { name: "Docker", href: "https://www.google.com/search?q=Docker%20containerization%20platform" },
  { name: "Linux", href: "https://www.google.com/search?q=Linux%20operating%20system" },
];

export function Skills() {
  return (
    <div className="skills-section">
      <h2 className="home-blogs-heading">Skills &amp; Technologies</h2>
      <ul className="skills-list" aria-label="Skills and technologies">
        {skills.map((skill) => (
          <li key={skill.name}>
            <a className="skill-chip" href={skill.href} target="_blank" rel="noopener noreferrer">
              {skill.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const skills = [
  "React",
  "Next.js",
  "Expo",
  "Swift",
  "Tauri",
  "Django",
  "Express",
  "Node.js",
  "Bun",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Prisma",
  "Clerk",
  "Zustand",
  "TanStack Query",
  "Postman",
  "Tailwind CSS",
  "shadcn/ui",
  "Motion",
  "GSAP",
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
  "C/C++",
  "SQL",
  "Git",
  "GitHub",
  "Figma",
  "Docker",
  "Linux",
];

export function Skills() {
  return (
    <div className="skills-section">
      <h2 className="home-blogs-heading">Skills &amp; Technologies</h2>
      <ul className="skills-list" aria-label="Skills and technologies">
        {skills.map((skill) => (
          <li key={skill} className="skill-chip">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type TechItem = {
  name: string;
  slug: string;
};

export type TechGroup = {
  title: string;
  items: TechItem[];
};

export const stackColumns: TechGroup[][] = [
  [
    {
      title: "Languages",
      items: [
        { name: "TypeScript", slug: "typescript" },
        { name: "JavaScript", slug: "javascript" },
        { name: "Solidity", slug: "solidity" },
        { name: "Rust", slug: "rust" },
        { name: "SQL", slug: "sql" },
        { name: "HTML", slug: "html5" },
        { name: "CSS", slug: "css" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "React", slug: "react" },
        { name: "Next.js", slug: "nextdotjs" },
        { name: "Tailwind CSS", slug: "tailwindcss" },
        { name: "shadcn/ui", slug: "shadcnui" },
        { name: "Vite", slug: "vite" },
        { name: "TanStack Query", slug: "reactquery" },
        { name: "Redux Toolkit", slug: "redux" },
        { name: "Framer Motion", slug: "framermotion" },
        { name: "Zustand", slug: "zustand" },
      ],
    },
    {
      title: "Backend",
      items: [
        { name: "Node.js", slug: "nodedotjs" },
        { name: "Express", slug: "express" },
        { name: "NestJS", slug: "nestjs" },
        { name: "FastAPI", slug: "fastapi" },
        { name: "Medusa", slug: "medusa" },
        { name: "Socket.io", slug: "socketdotio" },
        { name: "Puppeteer", slug: "puppeteer" },
        { name: "BullMQ", slug: "bullmq" },
        { name: "TypeORM", slug: "typeorm" },
      ],
    },
  ],
  [
    {
      title: "Data + AI",
      items: [
        { name: "PostgreSQL", slug: "postgresql" },
        { name: "Supabase", slug: "supabase" },
        { name: "Prisma", slug: "prisma" },
        { name: "MongoDB", slug: "mongodb" },
        { name: "Redis", slug: "redis" },
        { name: "Firebase", slug: "firebase" },
        { name: "Anthropic", slug: "anthropic" },
        { name: "Gemini", slug: "googlegemini" },
        { name: "OpenAI", slug: "openai" },
        { name: "Vercel AI SDK", slug: "vercelai" },
        { name: "MCP SDK", slug: "mcp" },
      ],
    },
    {
      title: "Web3 + payments",
      items: [
        { name: "ethers.js", slug: "ethers" },
        { name: "Stripe", slug: "stripe" },
        { name: "Hardhat", slug: "hardhat" },
        { name: "viem", slug: "viem" },
        { name: "Monad", slug: "monad" },
        { name: "Aptos", slug: "aptos" },
      ],
    },
    {
      title: "Infra + tools",
      items: [
        { name: "Docker", slug: "docker" },
        { name: "Vercel", slug: "vercel" },
        { name: "GitHub", slug: "github" },
        { name: "Postman", slug: "postman" },
        { name: "Sentry", slug: "sentry" },
        { name: "OpenTelemetry", slug: "opentelemetry" },
        { name: "Vitest", slug: "vitest" },
        { name: "Playwright", slug: "playwright" },
      ],
    },
  ],
];

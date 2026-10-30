import type { IconName } from "./icons";

export const profile = {
  name: "Sahil Khedkar",
  tagline: "Engineer · Polymath",
  bio: "love to build cool stuff",
  email: "hi.sahilkhedkar@gmail.com",
};

export type Social = {
  label: string;
  href: string;
  icon: IconName;
};

export const socials: Social[] = [
  { label: "X", href: "https://x.com/sahlkr", icon: "x" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahilkhedkar", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/sahilkhedkar", icon: "github" },
  { label: "YouTube", href: "https://youtube.com/khedkarsahil", icon: "youtube" },
  { label: "Medium", href: "https://sahilkhedkar.medium.com", icon: "medium" },
  { label: "Email", href: "mailto:hi.sahilkhedkar@gmail.com", icon: "email" },
];

export type Experience = {
  company: string;
  role: string;
  dates: string;
  location: string;
  current: boolean;
  href?: string;
  logo?: string;
  classified?: boolean;
  points: string[];
};

export const experiences: Experience[] = [
  {
    company: "Stealth Startup",
    role: "Software Engineer Intern",
    dates: "Jun 2026 - Present",
    location: "Bangalore, India (Remote)",
    current: true,
    classified: true,
    points: [
      "Building the whole product from the ground up, from the first screen to the systems underneath it.",
      "Carrying it from an empty repository toward something a person can actually use.",
    ],
  },
  {
    company: "Athira",
    role: "GTM Engineer Intern",
    dates: "May 2026 - Jun 2026",
    location: "United States (Remote)",
    current: false,
    href: "https://athira.io",
    logo: "/logos/athira.webp",
    points: [
      "Reworked the interface so the product felt as considered as the idea behind it.",
      "Built a tool that takes a prompt and returns several design directions, then lets you talk any one of them into the version you meant.",
      "Wrote go-to-market plans for how the product should get better, and who it should reach first.",
    ],
  },
  {
    company: "TenseAI",
    role: "Full Stack Developer Intern",
    dates: "Dec 2025 - Apr 2026",
    location: "Noida, India (Remote)",
    current: false,
    href: "https://www.tenseai.in",
    logo: "/logos/tense-aii.PNG",
    points: [
      "Rebuilt the website UI.",
      "Moved a basic MERN site onto Next.js, TypeScript, Redis, and Docker.",
      "Fixed loading and API calls so the product stayed smooth.",
      "Added image, code, and file generation, each in the right format.",
      "Built automation workflows that start from a prompt.",
    ],
  },
];

export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  description: string;
};

export const posts = [
  {
    slug: "routing-in-nextjs",
    title: "Routing in NextJs",
    date: "2026-10-30",
    displayDate: "30 Oct 2026",
    description:
      "A guide to routing in Next.js (App Router) covering Catch-All Segments, Dynamic Routes, Nested Routes, and more.",
  },
] as const;

export const headerNav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blogs", label: "Blogs" },
  { href: "/resume", label: "Resume" },
];

export const footerNav = [
  ...headerNav,
  { href: "/projects", label: "Projects" },
  { href: "/hi", label: "Say hi" },
  { href: "/gears", label: "Gears" },
  { href: "/blog/feed.xml", label: "RSS FEED" },
];

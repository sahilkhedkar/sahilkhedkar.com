import type { Metadata } from "next";
import { ExperienceList } from "../components/experience-list";
import { profile } from "../lib/profile";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <article className="subpage">
      <h1>{profile.name}</h1>
      <p className="lede">{profile.tagline}</p>
      <p className="lede">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <ExperienceList />
    </article>
  );
}

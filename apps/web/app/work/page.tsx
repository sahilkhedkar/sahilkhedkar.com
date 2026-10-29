import type { Metadata } from "next";
import { ExperienceList } from "../components/experience-list";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <article className="subpage">
      <h1>Work</h1>
      <ExperienceList />
    </article>
  );
}

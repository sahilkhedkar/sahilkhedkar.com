import type { Metadata } from "next";
import { SocialLinks } from "../components/social-links";
import { profile } from "../lib/profile";

export const metadata: Metadata = {
  title: "Say hi",
  description: "A note to Sahil Khedkar.",
};

export default function HiPage() {
  return (
    <article className="subpage hi">
      <h1>Say hi</h1>
      <p className="lede">I read every note. A short one, with a little context, is the one I answer first.</p>
      <a className="hi-mail" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <SocialLinks variant="inline" />
    </article>
  );
}

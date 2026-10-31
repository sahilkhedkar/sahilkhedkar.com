import { ContributionGraph } from "./components/contribution-graph";
import { ExperienceList } from "./components/experience-list";
import { HomeBlogs } from "./components/home-blogs";
import { NowPlaying } from "./components/now-playing";
import { Quote } from "./components/quote";
import { Skills } from "./components/skills";
import { SocialLinks } from "./components/social-links";
import { profile } from "./lib/profile";
import { getNowPlayingState } from "./lib/now-playing/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const initialData = await getNowPlayingState();

  return (
    <>
      <section className="profile" aria-label="Profile">
        <div className="identity">
          <img className="avatar" src="/avatar.png" alt="Sahil Khedkar" width={84} height={84} />
          <div>
            <h1>{profile.name}</h1>
            <p className="tagline">{profile.tagline}</p>
          </div>
        </div>
        <p className="bio">love to build cool stuff</p>
        <SocialLinks variant="inline" />
        <NowPlaying initialData={initialData} />
        <ContributionGraph />
      </section>

      <section className="section" aria-label="Experience">
        <ExperienceList />
      </section>

      <section className="section" aria-label="Blogs">
        <HomeBlogs />
      </section>

      <section className="section" aria-label="Skills and technologies">
        <Skills />
      </section>

      <Quote />
    </>
  );
}

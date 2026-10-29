import type { Metadata } from "next";
import { StackList } from "../components/stack-list";
import { StickerLid } from "../components/sticker-lid";

export const metadata: Metadata = {
  title: "What I know",
  description: "The laptop lid, and the same tools written out by name.",
};

export default function KnowPage() {
  return (
    <article className="subpage">
      <h1>What I know</h1>
      <p className="lede">
        The lid of the machine I actually work on. A sticker earns its place by shipping.
      </p>
      <StickerLid />
      <section id="stack" className="know-stack" aria-labelledby="stack-heading">
        <h2 id="stack-heading">Tech I use</h2>
        <StackList />
      </section>
    </article>
  );
}

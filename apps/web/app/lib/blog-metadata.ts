import type { Metadata } from "next";
import { posts } from "./profile";

const siteOrigin = "https://sahilkhedkar.com";

export function generateBlogMetadata(slug: string): Metadata {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};

  const canonicalUrl = new URL(`/blogs/${post.slug}`, siteOrigin).toString();
  const imageUrl = new URL(post.socialImage.src, siteOrigin).toString();

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      siteName: "Sahil Khedkar",
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      images: [{
        url: imageUrl,
        width: post.socialImage.width,
        height: post.socialImage.height,
        type: post.socialImage.type,
        alt: post.imageAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: imageUrl, alt: post.imageAlt }],
    },
  };
}

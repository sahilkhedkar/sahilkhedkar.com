"use client";

import { useEffect, useState } from "react";

type ImageDetails = { src: string; alt: string };

export function ImageLightbox() {
  const [image, setImage] = useState<ImageDetails | null>(null);

  useEffect(() => {
    const article = document.querySelector(".essay");
    if (!article) return;

    const images = Array.from(article.querySelectorAll<HTMLImageElement>("img")).filter(
      (img) => !img.closest(".essay-hero-card"),
    );
    const onArticleClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement) || target.closest(".essay-hero-card")) return;
      setImage({ src: target.currentSrc || target.src, alt: target.alt });
    };
    const onImageKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        (event.currentTarget as HTMLImageElement).click();
      }
    };

    images.forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", img.alt ? `Open image: ${img.alt}` : "Open image");
      img.addEventListener("keydown", onImageKeyDown);
    });
    article.addEventListener("click", onArticleClick);

    return () => {
      images.forEach((img) => {
        img.removeAttribute("tabindex");
        img.removeAttribute("role");
        img.removeAttribute("aria-label");
        img.removeEventListener("keydown", onImageKeyDown);
      });
      article.removeEventListener("click", onArticleClick);
    };
  }, []);

  useEffect(() => {
    if (!image) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setImage(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [image]);

  if (!image) return null;

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "Image preview"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setImage(null);
      }}
    >
      <button className="image-lightbox-close" type="button" onClick={() => setImage(null)} aria-label="Close image preview">
        ×
      </button>
      <img src={image.src} alt={image.alt} />
      {image.alt && <p>{image.alt}</p>}
    </div>
  );
}

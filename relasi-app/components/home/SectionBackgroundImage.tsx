import Image from "next/image";
import { hasImageAsset, urlForImage } from "@/lib/sanity/image";
import type { SanityImageWithAlt } from "@/lib/sanity/types";
import type { SanityImageSource } from "@sanity/image-url";

type SanityBg = (SanityImageWithAlt & SanityImageSource) | null | undefined;

/**
 * Full-bleed section background image from Sanity.
 * Returns null when no asset is uploaded so the parent can keep its solid color.
 */
export function SectionBackgroundImage({
  image,
  priority = false,
  darken = false,
}: {
  image: SanityBg;
  priority?: boolean;
  /** Soft dark overlay for light text (e.g. after-movie). */
  darken?: boolean;
}) {
  if (!hasImageAsset(image)) return null;

  const src = urlForImage(image).width(1920).url();

  return (
    <>
      <Image
        src={src}
        alt={image.alt || ""}
        fill
        unoptimized
        priority={priority}
        sizes="100vw"
        className="object-cover"
        aria-hidden={!image.alt}
      />
      <div
        className={
          darken
            ? "absolute inset-0 bg-forest/55"
            : "absolute inset-0 bg-mist/70"
        }
        aria-hidden
      />
    </>
  );
}

/** Resolve a Sanity background to a CDN URL, or null if missing. */
export function berandaBgUrl(image: SanityBg, width = 1920): string | null {
  if (!hasImageAsset(image)) return null;
  return urlForImage(image).width(width).url();
}

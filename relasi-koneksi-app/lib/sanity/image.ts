import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

/**
 * STRICT RULE 3.2 #5: Sanity images MUST be served through the Sanity image
 * CDN URL builder combined with next/image (resize + WebP/AVIF conversion).
 */
const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing).");
  }
  return builder.image(source).auto("format");
}

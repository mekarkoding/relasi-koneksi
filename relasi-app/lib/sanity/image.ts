import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

/**
 * STRICT RULE 3.2 #5: Sanity images MUST be served through the Sanity image
 * CDN URL builder combined with next/image (resize + WebP/AVIF conversion).
 */
const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

/** True when the image has an uploaded asset ref (alt-only stubs are invalid). */
export function hasImageAsset(
  source: unknown,
): source is SanityImageSource {
  if (!source || typeof source !== "object") return false;
  const asset = (source as { asset?: unknown }).asset;
  if (!asset || typeof asset !== "object") return false;
  const ref = (asset as { _ref?: unknown })._ref;
  return typeof ref === "string" && ref.length > 0;
}

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing).");
  }
  return builder.image(source).auto("format");
}

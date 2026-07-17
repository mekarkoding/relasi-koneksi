import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-01";

/** True once the Sanity project is linked via .env.local */
export const isSanityConfigured = Boolean(projectId);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Fetch wrapper that degrades gracefully while the Sanity project is not
 * yet configured (returns the fallback), so the site builds before setup.
 * ISR: article content revalidates every 60s (PRD 3.2).
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set — returning fallback data.");
    }
    return fallback;
  }
  return client.fetch<T>(query, params, { next: { revalidate: 60 } });
}

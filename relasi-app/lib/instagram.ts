import "server-only";
import { unstable_cache } from "next/cache";
import type { InstagramPost } from "@/lib/instagram-types";

/**
 * Instagram feed via the Instagram Graph API (PRD 4.8).
 * - Long-lived token in INSTAGRAM_ACCESS_TOKEN (refresh every ~60 days).
 * - Fetched server-side only (`server-only`); client code must import the
 *   post type from `@/lib/instagram-types`, not this module.
 * - Outbound Graph requests use `cache: "no-store"` so Next's fetch Data Cache
 *   never stores a URL that includes the access token. Hourly revalidation is
 *   handled by `unstable_cache` with a token-free key.
 * - Fails gracefully: `getInstagramPosts` returns [] so the section can render a
 *   static fallback instead of a broken/empty grid. The failure is caught
 *   *outside* `unstable_cache` on purpose - a rejected callback is not written
 *   to the cache, so the next request retries instead of serving an empty feed
 *   for the full revalidate window.
 */

export type { InstagramPost };

interface GraphMediaItem {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
}

/** Public handle (without @), used for the follow button + fallback text. */
export const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "";

export const instagramProfileUrl = instagramHandle
  ? `https://www.instagram.com/${instagramHandle}/`
  : "https://www.instagram.com/";

/** Meta returns the oldest supported version for unversioned paths; pin it. */
const GRAPH_API_VERSION = "v23.0";

async function fetchInstagramPosts(limit: number): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) throw new Error("INSTAGRAM_ACCESS_TOKEN is not set");

  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink";
  // graph.instagram.com rejects `Authorization: Bearer` with OAuth code 190,
  // so the token has to travel in the query string.
  const res = await fetch(
    `https://graph.instagram.com/${GRAPH_API_VERSION}/me/media` +
      `?fields=${fields}&limit=${limit}&access_token=${accessToken}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error(`Instagram Graph API returned ${res.status} ${res.statusText}`);
  }

  const json: unknown = await res.json();
  const data =
    json && typeof json === "object" && Array.isArray((json as { data?: unknown }).data)
      ? ((json as { data: GraphMediaItem[] }).data)
      : [];

  return data
    .map((item) => ({
      id: item.id,
      caption: item.caption,
      // Videos/reels expose the poster frame as thumbnail_url; media_url is an
      // .mp4 there and would render as a broken <Image>.
      mediaUrl:
        item.media_type === "VIDEO"
          ? (item.thumbnail_url ?? "")
          : (item.media_url ?? item.thumbnail_url ?? ""),
      permalink: item.permalink ?? instagramProfileUrl,
      mediaType: item.media_type ?? "IMAGE",
    }))
    .filter((post) => post.mediaUrl.length > 0);
}

const getCachedInstagramPosts = unstable_cache(
  async (limit: number) => fetchInstagramPosts(limit),
  // Include the public handle so switching Instagram accounts invalidates
  // a previous cached feed (empty or from the old account).
  ["instagram-posts", GRAPH_API_VERSION, instagramHandle || "unset"],
  { revalidate: 3600 },
);

/** Hourly-cached Instagram posts for the Beranda feed (PRD 4.8). */
export async function getInstagramPosts(limit = 8): Promise<InstagramPost[]> {
  try {
    return await getCachedInstagramPosts(limit);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    // Redact defensively: a network-layer error may echo the request URL.
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    console.error(
      "[instagram] feed unavailable, rendering follow-us fallback:",
      token ? reason.split(token).join("<redacted>") : reason,
    );
    return [];
  }
}

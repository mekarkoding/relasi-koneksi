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
 * - Fails gracefully: any error / missing token returns [] so the section can
 *   render a static fallback instead of a broken/empty grid.
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

async function fetchInstagramPosts(limit: number): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) return [];

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink";
    // Prefer Bearer so the token is not part of the request URL (logs / proxies).
    // Fall back to query param if the host rejects the header (Meta supports both).
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}`;
    let res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${url}&access_token=${accessToken}`, {
        cache: "no-store",
      });
    }

    if (!res.ok) return [];

    const json: unknown = await res.json();
    const data =
      json && typeof json === "object" && Array.isArray((json as { data?: unknown }).data)
        ? ((json as { data: GraphMediaItem[] }).data)
        : [];

    return data
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        mediaUrl:
          item.media_type === "VIDEO"
            ? (item.thumbnail_url ?? item.media_url ?? "")
            : (item.media_url ?? ""),
        permalink: item.permalink ?? instagramProfileUrl,
        mediaType: item.media_type ?? "IMAGE",
      }))
      .filter((post) => post.mediaUrl.length > 0);
  } catch {
    return [];
  }
}

const getCachedInstagramPosts = unstable_cache(
  async (limit: number) => fetchInstagramPosts(limit),
  ["instagram-posts"],
  { revalidate: 3600 },
);

/** Hourly-cached Instagram posts for the Beranda feed (PRD 4.8). */
export async function getInstagramPosts(limit = 8): Promise<InstagramPost[]> {
  return getCachedInstagramPosts(limit);
}

/**
 * Instagram feed via the Instagram Graph API (PRD 4.8).
 * - Long-lived token in INSTAGRAM_ACCESS_TOKEN (refresh every ~60 days).
 * - Fetched server-side and cached at ISR (hourly). Never client-fetched.
 * - Fails gracefully: any error / missing token returns [] so the section can
 *   render a static fallback instead of a broken/empty grid.
 */

export interface InstagramPost {
  id: string;
  caption?: string;
  /** Thumbnail/image URL (VIDEO uses thumbnail_url) */
  mediaUrl: string;
  permalink: string;
  mediaType: string;
}

interface GraphMediaItem {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
}

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

/** Public handle (without @), used for the follow button + fallback text. */
export const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "";

export const instagramProfileUrl = instagramHandle
  ? `https://www.instagram.com/${instagramHandle}/`
  : "https://www.instagram.com/";

export async function getInstagramPosts(limit = 8): Promise<InstagramPost[]> {
  if (!ACCESS_TOKEN) return [];

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${ACCESS_TOKEN}`;

    // Hourly ISR is plenty for a feed (PRD 4.8) and never blocks at request time.
    const res = await fetch(url, { next: { revalidate: 3600 } });
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

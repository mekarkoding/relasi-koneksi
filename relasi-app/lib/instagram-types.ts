/**
 * Client-safe Instagram post shape.
 * Keep this free of `server-only` / tokens so client carousels can import it.
 */
export interface InstagramPost {
  id: string;
  caption?: string;
  /** Thumbnail/image URL (VIDEO uses thumbnail_url) */
  mediaUrl: string;
  permalink: string;
  mediaType: string;
}

import Image from "next/image";
import type { InstagramPost } from "@/lib/instagram-types";

/** Soft cap so long IG captions don't blow up the card. */
const CAPTION_MAX = 140;

function formatCaption(caption?: string): string {
  if (!caption) return "";
  const trimmed = caption.replace(/\s+/g, " ").trim();
  if (trimmed.length <= CAPTION_MAX) return trimmed;
  return `${trimmed.slice(0, CAPTION_MAX).trimEnd()}…`;
}

interface Props {
  post: InstagramPost;
  /** Larger image + roomier caption for the mobile carousel. */
  size?: "grid" | "carousel";
}

/**
 * Single Instagram post tile: image on top, caption strip inside the same box.
 */
export function InstagramPostCard({ post, size = "grid" }: Props) {
  const caption = formatCaption(post.caption);
  const isCarousel = size === "carousel";

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col overflow-hidden bg-white/70 ring-1 ring-forest/10 transition-all duration-300 ease-in-out hover:ring-tamblingan/40 ${
        isCarousel ? "rounded-2xl" : "rounded-lg"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={post.mediaUrl}
          alt={caption || "Instagram post"}
          fill
          unoptimized
          sizes={
            isCarousel
              ? "(max-width: 768px) 100vw, 24rem"
              : "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
          }
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div
        className={`border-t border-forest/10 ${
          isCarousel ? "px-4 py-3" : "px-2.5 py-2"
        }`}
      >
        <p
          className={`text-forest/80 ${
            isCarousel
              ? "line-clamp-3 text-sm leading-relaxed"
              : "line-clamp-2 text-xs leading-snug"
          }`}
        >
          {caption || "\u00A0"}
        </p>
      </div>
    </a>
  );
}

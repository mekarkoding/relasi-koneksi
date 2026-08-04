import { getTranslations } from "next-intl/server";
import {
  getInstagramPosts,
  instagramHandle,
  instagramProfileUrl,
} from "@/lib/instagram";
import { InstagramFeedCarousel } from "@/components/home/InstagramFeedCarousel";

/**
 * Instagram feed section body (PRD 4.8). Server-rendered; on missing/expired
 * token it degrades to a static "follow us" message + button - never blank.
 * The section wrapper + heading are provided by the home page.
 * Up to 10 posts in a strip carousel (5 visible on desktop).
 */
export async function InstagramFeed() {
  const t = await getTranslations("instagram");
  const posts = await getInstagramPosts(10);
  const handleLabel = instagramHandle ? `@${instagramHandle}` : "";

  const followButton = (
    <a
      href={instagramProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-tamblingan px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light"
    >
      {t("follow")}
      {handleLabel && <span>{handleLabel}</span>}
    </a>
  );

  if (posts.length === 0) {
    return (
      <div className="text-center">
        <p className="text-forest/70">
          {t("fallback")}
          {handleLabel ? ` ${handleLabel}` : ""}
        </p>
        <div className="mt-5 mb-4">{followButton}</div>
      </div>
    );
  }

  return (
    <div>
      <InstagramFeedCarousel posts={posts} />
      <div className="mt-8 mb-4 text-center">{followButton}</div>
    </div>
  );
}

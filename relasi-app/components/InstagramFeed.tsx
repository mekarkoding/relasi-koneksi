import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  getInstagramPosts,
  instagramHandle,
  instagramProfileUrl,
} from "@/lib/instagram";

/**
 * Instagram feed section body (PRD 4.8). Server-rendered; on missing/expired
 * token it degrades to a static "follow us" message + button - never blank.
 * The section wrapper + heading are provided by the home page.
 */
export async function InstagramFeed() {
  const t = await getTranslations("instagram");
  const posts = await getInstagramPosts(9);
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
        <div className="mt-5">{followButton}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-5">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={post.mediaUrl}
              alt={post.caption?.slice(0, 120) || "Instagram post"}
              fill
              unoptimized
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            />
          </a>
        ))}
      </div>
      <div className="mt-6 text-center">{followButton}</div>
    </div>
  );
}

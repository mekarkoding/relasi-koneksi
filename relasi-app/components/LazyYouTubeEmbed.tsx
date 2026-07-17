"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  videoId: string;
  title: string;
}

/**
 * Lazy facade embed (PRD 4.2): renders a thumbnail + play button first;
 * the YouTube iframe player loads only after a click.
 */
export function LazyYouTubeEmbed({ videoId, title }: Props) {
  const t = useTranslations("common");
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-xl"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`${t("playVideo")}: ${title}`}
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-xl"
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-forest/30 transition-all duration-300 ease-in-out group-hover:bg-forest/40">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-marigold text-forest shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/lib/sanity/image";
import { LazyYouTubeEmbed } from "./LazyYouTubeEmbed";
import { extractYouTubeId } from "@/lib/youtube";

/**
 * STRICT RULE (PRD 4.3): article bodies are Portable Text rendered with
 * @portabletext/react + this components map. Never dangerouslySetInnerHTML.
 * Unknown block types render nothing (dev-only console warning).
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold text-forest">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-forest">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-justify leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-marigold pl-4 text-justify italic text-forest/80">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-tamblingan underline underline-offset-2 transition-all duration-300 ease-in-out hover:text-tamblingan-dark"
      >
        {children}
      </a>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-justify">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-justify">{children}</ol>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlForImage(value).width(1200).url()}
            alt={value.alt || ""}
            width={1200}
            height={800}
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="rounded-xl"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-forest/60">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    youtube: ({ value }) => {
      const videoId = value?.url ? extractYouTubeId(value.url) : null;
      if (!videoId) return null;
      return (
        <div className="relative my-8 aspect-video">
          <LazyYouTubeEmbed videoId={videoId} title="YouTube video" />
        </div>
      );
    },
  },

  unknownType: ({ value }) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[portable-text] Unknown block type: ${value?._type}`);
    }
    return null;
  },
};

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}

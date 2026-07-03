import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Locale-aware hreflang alternates (PRD 4.1 SEO requirement).
 * @param path route path without locale prefix, e.g. "/attractions"
 */
export function localeAlternates(path: string): Metadata["alternates"] {
  return {
    canonical: `${siteUrl}/id${path}`,
    languages: {
      id: `${siteUrl}/id${path}`,
      en: `${siteUrl}/en${path}`,
    },
  };
}

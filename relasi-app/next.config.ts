import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // STRICT RULE 3.2: Sanity images served through the Sanity image CDN
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      // YouTube thumbnails for the lazy facade embed (Section 4.2)
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
      // Instagram feed thumbnails (Section 4.8)
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async redirects() {
    return [
      // v1 -> v2 route moves
      { source: "/:locale/attractions", destination: "/:locale/wisata", permanent: true },
      { source: "/:locale/attractions/:path*", destination: "/:locale/wisata", permanent: true },
      { source: "/:locale/homestay", destination: "/:locale", permanent: true },
      { source: "/:locale/gallery", destination: "/:locale/media/galeri", permanent: true },
      { source: "/:locale/downloads", destination: "/:locale/media/galeri", permanent: true },
      { source: "/:locale/booklet", destination: "/:locale/media/buklet", permanent: true },
      { source: "/:locale/booklet/:slug", destination: "/:locale/media/buklet/:slug", permanent: true },
      { source: "/:locale/about", destination: "/:locale/about/adat-dalem-tamblingan", permanent: true },
      { source: "/:locale/articles", destination: "/:locale/articles/berita", permanent: true },
    ];
  },
  experimental: {
    // Tree-shake heavy packages used by the entrance / studio-adjacent deps
    optimizePackageImports: ["framer-motion", "next-intl"],
    // Soft navigations reuse RSC payloads; keep TTL short so CMS edits show up
    // without a hard refresh. Next.js requires static >= 30.
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
};

export default withNextIntl(nextConfig);

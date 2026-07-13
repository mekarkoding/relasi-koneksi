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
    ],
  },
  experimental: {
    // Tree-shake heavy packages used by the entrance / studio-adjacent deps
    optimizePackageImports: ["framer-motion", "next-intl"],
  },
};

export default withNextIntl(nextConfig);

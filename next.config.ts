import type { NextConfig } from "next";

// Mirrors the CSP served in production, with img-src widened to allow the
// CartoDB basemap tiles the live network map renders (components/map/vatssa-map.tsx).
// 'unsafe-eval' is added only outside production: Next.js dev tooling (Turbopack
// Fast Refresh, RSC chunk loading) relies on eval(); the production React build never uses it.
const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.vatssa.com https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.vatssa.com",
].join("; ");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hq/welcome.php",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
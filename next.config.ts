import type { NextConfig } from "next";
import crypto from "crypto";

function getCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";
  // Remove 'unsafe-inline' and use the request-specific nonce instead
  const scriptSrc = isDev 
    ? "'self' 'unsafe-inline' 'unsafe-eval'" 
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;
    
  const upgradeInsecure = isDev ? "" : "upgrade-insecure-requests;";

  return `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://images.unsplash.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://wa.me;
    frame-ancestors 'none';
    form-action 'self' https://wa.me mailto:;
    base-uri 'self';
    object-src 'none';
    ${upgradeInsecure}
  `.replace(/\s{2,}/g, " ").trim();
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    // Note: For full production security with nonces in Next.js App Router, 
    // headers are often handled via middleware to inject the nonce into request headers.
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
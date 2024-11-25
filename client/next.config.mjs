/** @type {import('next').NextConfig} */
import JavaScriptObfuscator from "webpack-obfuscator";

const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateStringArray: true,
          },
          []
        )
      );
    }
    return config;
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
  async headers() {
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' https://utfs.io;
      connect-src 'self';
      font-src 'self';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.trim();
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

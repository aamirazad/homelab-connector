/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: require.resolve("pdfjs-dist/build/pdf.worker.min.js"),
            to: path.join(__dirname, "public/static/js"),
          },
        ],
      }),
    );
  },
};

export default config;

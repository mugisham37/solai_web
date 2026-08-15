import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Dev only: Next serves /_next/* to the dev host it booted with, so opening
  // the app (or driving it from Playwright) on the loopback IP instead of
  // "localhost" 403s every client chunk and the page silently never hydrates.
  allowedDevOrigins: ["127.0.0.1"],
};

export default withNextIntl(nextConfig);

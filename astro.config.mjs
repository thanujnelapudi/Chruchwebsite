// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://thepillaroffireministries.vercel.app",
  output: "static",
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [tailwind(), react(), sitemap()],
  devToolbar: { enabled: false },
  server: { allowedHosts: true, host: true },
  security: { checkOrigin: false },
});
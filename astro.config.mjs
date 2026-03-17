// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [tailwind(), react()],
  devToolbar: { enabled: false },
  server: { allowedHosts: true, host: true },
  security: { checkOrigin: false },
});
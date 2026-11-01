import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { folio } from "@uichat-mira/folio/vite";
import config from "./folio.config";

export default defineConfig({
  base: process.env.VITE_SITE_BASE || "/",
  plugins: [
    react(),
    folio({
      contentDir: "content",
      config,
      staticRoutes: {
        locale: "zh_CN",
        siteName: config.title,
        sitemap: true,
        robots: true,
      },
    }),
  ],
});

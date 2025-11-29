import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    tailwindcss(),
    oxlintPlugin({
      path: "src",
    }),
  ],
});

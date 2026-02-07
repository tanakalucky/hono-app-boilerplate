/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";

export default defineConfig({
  test: {
    passWithNoTests: true,
    watch: false,
    projects: [
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src/react-app"),
          },
        },
        test: {
          globals: true,
          name: "unit",
          environment: "node",
          include: ["**/*.unit.{test,spec}.{ts,tsx}"],
        },
      },
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./src/react-app"),
          },
        },
        test: {
          include: ["**/*.browser.{test,spec}.{ts,tsx}"],
          name: "browser",
          globals: true,
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            headless: true,
          },
        },
      },
    ],
  },
});

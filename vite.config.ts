import type { UserConfig as VitestUserConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

declare module "vite" {
  export interface UserConfig {
    test: VitestUserConfig["test"];
  }
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});

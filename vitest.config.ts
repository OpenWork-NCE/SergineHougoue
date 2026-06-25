import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: [
      "src/**/*.{test,spec}.{js,ts}",
      "tests/unit/**/*.{test,spec}.{js,ts}",
      "tests/component/**/*.{test,spec}.{js,ts}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.d.ts", "tests/**", "node_modules/**"],
    },
  },
  resolve: {
    alias: {
      $components: "/src/lib/components",
      $i18n: "/src/lib/i18n",
      $sanity: "/src/lib/sanity",
      $server: "/src/lib/server",
      $utils: "/src/lib/utils",
    },
  },
});

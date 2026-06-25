import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: { port: 5173 },
  optimizeDeps: {
    include: [
      "sanity",
      "@sanity/vision",
      "@sanity/document-internationalization",
    ],
  },
});

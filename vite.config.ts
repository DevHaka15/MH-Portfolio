import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Starts downloading the two main font files straight from the HTML, before the JavaScript has even loaded. */
function preloadFonts(): Plugin {
  return {
    name: "preload-fonts",
    transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return;
      const wanted = [/bricolage-grotesque-latin-wdth-normal-.*\.woff2$/, /figtree-latin-wght-normal-.*\.woff2$/];
      return Object.keys(ctx.bundle)
        .filter((f) => wanted.some((re) => re.test(f)))
        .map((f) => ({
          tag: "link",
          attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: `/${f}` },
          injectTo: "head" as const,
        }));
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadFonts()],
  // same header Vercel sends (see vercel.json), so a sandboxed preview works the same locally
  preview: { headers: { "Access-Control-Allow-Origin": "*" } },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
      },
    },
  },
});

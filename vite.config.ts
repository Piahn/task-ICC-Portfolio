import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
        "#site/content": path.resolve(__dirname, "./.velite"),
        "next/image": path.resolve(__dirname, "./lib/compat/next-image.tsx"),
        "next/link": path.resolve(__dirname, "./lib/compat/next-link.tsx"),
        "next/navigation": path.resolve(__dirname, "./lib/compat/next-navigation.ts"),
        "next/dynamic": path.resolve(__dirname, "./lib/compat/next-dynamic.tsx"),
        "next/font/google": path.resolve(__dirname, "./lib/compat/next-font.ts"),
      },
    },
    define: {
      "process.env.NEXT_PUBLIC_BASE_URL": JSON.stringify(
        (env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/^["']|["']$/g, "")
      ),
      "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
        (env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^["']|["']$/g, "")
      ),
      "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
        (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").replace(/^["']|["']$/g, "")
      ),
      "process.env.NEXT_PUBLIC_GITHUB_TOKEN": JSON.stringify(
        (env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || "").replace(/^["']|["']$/g, "")
      ),
      "process.env": {
        NEXT_PUBLIC_BASE_URL: (env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/^["']|["']$/g, ""),
        NEXT_PUBLIC_SUPABASE_URL: (env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^["']|["']$/g, ""),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").replace(/^["']|["']$/g, ""),
        NEXT_PUBLIC_GITHUB_TOKEN: (env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || "").replace(/^["']|["']$/g, ""),
      },
    },
    server: {
      port: 3000,
      host: true,
    },
  };
});

/// <reference types="vitest" />
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // 🔎 Carrega todas as variáveis do .env.local
  const env = loadEnv(mode, process.cwd(), "");

  // ✅ Log para debug no terminal
  console.log("🔑 Variáveis carregadas pelo Vite:");
  console.log("   VITE_OLLAMA_API_KEY:", env.VITE_OLLAMA_API_KEY ? "OK" : "NÃO ENCONTRADA");
  console.log("   VITE_OLLAMA_API_URL:", env.VITE_OLLAMA_API_URL || "NÃO DEFINIDO");
  console.log("   VITE_MODEL_ID:", env.VITE_MODEL_ID || "NÃO DEFINIDO");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      open: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:10000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts: true, // ✅ libera todos os domínios para evitar erros de bloqueio
    },
    plugins: [react(), ...(!process.env.VITEST ? [tailwindcss()] : [])],
    test: {
      globals: true,
      environment: "jsdom",
      server: {
        deps: {
          inline: ["@tailwindcss/vite"],
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});


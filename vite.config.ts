/// <reference types="vitest" />
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
    },
    preview: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts: true, // ✅ libera todos os domínios para evitar erros de bloqueio
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    define: {
      // ✅ Injeta as variáveis para uso no import.meta.env
      "import.meta.env.VITE_OLLAMA_API_KEY": JSON.stringify(env.VITE_OLLAMA_API_KEY),
      "import.meta.env.VITE_OLLAMA_API_URL": JSON.stringify(env.VITE_OLLAMA_API_URL),
      "import.meta.env.VITE_MODEL_ID": JSON.stringify(env.VITE_MODEL_ID),
    },
  };
});


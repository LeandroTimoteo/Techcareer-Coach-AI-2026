import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // 🔎 Carrega todas as variáveis do .env.local
  const env = loadEnv(mode, process.cwd(), "");

  // ✅ Log para debug no terminal
  console.log("🔑 Variáveis carregadas pelo Vite:");
  console.log("   VITE_OPENROUTER_API_KEY:", env.VITE_OPENROUTER_API_KEY ? "OK" : "NÃO ENCONTRADA");
  console.log("   VITE_MODEL_ID:", env.VITE_MODEL_ID || "NÃO DEFINIDO");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      open: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    define: {
      // ✅ Injeta as variáveis para uso no import.meta.env
      "import.meta.env.VITE_OPENROUTER_API_KEY": JSON.stringify(env.VITE_OPENROUTER_API_KEY),
      "import.meta.env.VITE_MODEL_ID": JSON.stringify(env.VITE_MODEL_ID),
    },
  };
});


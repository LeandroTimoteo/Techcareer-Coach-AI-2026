import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import cors from "cors";

const __dirname = path.resolve();

// Lightweight .env loader (avoids adding a new dependency when offline)
const loadEnvFile = (fileName) => {
  const fullPath = path.join(__dirname, fileName);
  if (!fs.existsSync(fullPath)) return;

  const lines = fs.readFileSync(fullPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!process.env[key]) {
      // remove optional surrounding quotes
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
};

loadEnvFile(".env");
loadEnvFile(".env.local");

const app = express();
app.use(cors()); // ✅ Liberar acesso de qualquer origem e porta
app.use(express.json());

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || process.env.VITE_OLLAMA_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ||
  process.env.VITE_MODEL_ID ||
  "mistralai/mistral-small-3.1-24b-instruct:free";

// ✅ Se houver VITE_OLLAMA_API_URL (geralmente localhost), usamos ela
// Caso contrário, usamos OpenRouter
let API_URL = process.env.VITE_OLLAMA_API_URL || "https://openrouter.ai/api/v1";
if (API_URL.includes("localhost") || API_URL.includes("127.0.0.1")) {
  // Ajuste para Ollama API se for localhost
  if (!API_URL.endsWith("/v1")) {
    API_URL = API_URL.replace(/\/+$/, "") + "/v1";
  }
}
const OPENROUTER_API_URL = `${API_URL}/chat/completions`.replace(/([^:])\/\//g, '$1/');

const APP_URL = process.env.APP_URL || "http://localhost:5173";

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt vazio." });
    }

    const isLocal = OPENROUTER_API_URL.includes("localhost") || OPENROUTER_API_URL.includes("127.0.0.1");

    if (!OPENROUTER_API_KEY && !isLocal) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY não configurada no servidor.",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      "HTTP-Referer": APP_URL,
      "X-Title": "TechCareer Coach AI",
    };
    if (OPENROUTER_API_KEY) {
      headers["Authorization"] = `Bearer ${OPENROUTER_API_KEY}`;
    }

    console.log(`📡 Chamando IA (${isLocal ? 'Local Ollama' : 'Cloud OpenRouter'}):`, model || OPENROUTER_MODEL);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model || OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });


    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.error ||
        `${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const assistantReply =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.response ||
      data?.text;

    if (!assistantReply) {
      throw new Error("Resposta vazia da IA.");
    }

    return res.json({ response: assistantReply });
  } catch (error) {
    console.error("❌ Erro backend:", error.message);
    console.error("📍 Endpoint:", OPENROUTER_API_URL);
    console.error("🤖 Model:", OPENROUTER_MODEL);
    
    return res.status(500).json({
      error:
        error?.message ||
        "Erro interno backend. Verifique a API do modelo configurada.",
    });
  }
});


app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Permitir que a API abra em qualquer porta definida pelo ambiente ou 10000 por padrão
// Listening on 0.0.0.0 makes it accessible on any host/network interface.
const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${port} e acessível em 0.0.0.0`);
});

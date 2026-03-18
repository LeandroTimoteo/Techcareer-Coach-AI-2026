import express from "express";
import path from "path";
import fetch from "node-fetch";

const app = express();
const __dirname = path.resolve();

app.use(express.json());

const OLLAMA_API_URL = (process.env.OLLAMA_API_URL || "http://localhost:11434").replace(/\/+$/, "");

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Erro backend:", error);
    return res.status(500).json({
      error: "Erro interno backend",
    });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// Rota da API (resposta fake para demo)
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Olá, sou o TechCareer Coach AI! Você disse: ${message}` });
});

// Fallback para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));


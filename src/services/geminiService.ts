import { Language } from "../types";

// 🔎 Debug: mostra todas as variáveis carregadas pelo Vite
console.log("Variáveis carregadas pelo Vite:", import.meta.env);

// ✅ Garantimos que a URL termine com o endpoint correto se o usuário passar apenas o host
let base_url = import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434";
if (base_url.endsWith("/")) base_url = base_url.slice(0, -1);
const API_URL = base_url.includes("/api/") ? base_url : `${base_url}/api/chat`;

// ✅ Modelo configurado com fallback para stable-beluga
const MODEL_ID: string = import.meta.env.VITE_MODEL_ID || "stable-beluga:latest";

// Confirma se o modelo foi carregado
console.log("URL Final da API:", API_URL);
console.log("Modelo configurado:", MODEL_ID);

const getSystemInstruction = (language: Language) => `
Você é o "TechCareer Coach", um mentor sênior de carreira em tecnologia.
Você ajuda desenvolvedores, analistas e designers a se destacarem no mercado global.

Seu objetivo é:
- Transformar currículos genéricos em currículos magnéticos para ATS.
- Criar perfis de LinkedIn que atraem recrutadores.
- Preparar candidatos para entrevistas técnicas usando o método STAR.
- Escrever mensagens de networking curtas e impactantes.

Estilo: Profissional, prático e motivador.
Idioma de resposta: ${language === "pt" ? "Português (Brasil)" : "English (US)"}.
Sempre use Markdown para formatar títulos e listas.
`;

export const generateCareerAdvice = async (
  prompt: string,
  contextType: "resume" | "linkedin" | "interview" | "networking" | "general",
  language: Language
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OLLAMA_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: "system", content: getSystemInstruction(language) },
          { role: "user", content: prompt },
        ],
        stream: false, // Fundamental para receber um JSON completo
      }),
    });

    const rawText = await response.text();
    console.log("Raw Ollama Response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse Ollama response as JSON:", rawText);
      throw new Error("Resposta da IA inválida (não é JSON). Verifique se o Ollama está respondendo corretamente.");
    }

    // ✅ Tratamento de erros da API
    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || data.error || `${response.status} ${response.statusText}`;
      console.error("Ollama Error Response:", data);

      if (response.status === 429 || (typeof errorMessage === 'string' && errorMessage.includes("Rate limit"))) {
        return language === "pt"
          ? "⚠️ Limite diário atingido. Tente novamente amanhã."
          : "⚠️ Daily limit reached. Try again tomorrow.";
      }

      throw new Error(errorMessage);
    }

    // ✅ Retorno seguro do conteúdo
    return (
      data.message?.content?.trim() ||
      (language === "pt" ? "Ocorreu um erro na geração." : "Error generating content.")
    );
  } catch (error: any) {
    console.error("Ollama Error:", error);

    const isSyntaxError = error instanceof SyntaxError || error.message?.includes("JSON");
    
    if (isSyntaxError) {
      return language === "pt"
        ? "❌ Erro de formato na resposta da IA. Certifique-se de que a URL da API está correta e o serviço Ollama está saudável."
        : "❌ AI response format error. Ensure the API URL is correct and Ollama is healthy.";
    }

    return language === "pt"
      ? `Erro na IA: ${error.message || "Erro de conexão"}. Verifique o Ollama.`
      : `AI Error: ${error.message || "Connection error"}. Check Ollama.`;
  }
};

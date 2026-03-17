import { Language } from "../types";

const sanitizeBaseUrl = (url: string) => {
  let sanitized = url.trim();
  if (!sanitized) {
    sanitized = "http://localhost:11434";
  }
  sanitized = sanitized.replace(/\/+$/, ""); // remove trailing slashes
  sanitized = sanitized.replace(/\/api$/, ""); // evita duplicar /api
  return sanitized;
};

export const OLLAMA_API_HOST = sanitizeBaseUrl(import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434");
export const OLLAMA_API_ENDPOINT = `${OLLAMA_API_HOST}/api/generate`;
export const MODEL_ID: string = import.meta.env.VITE_MODEL_ID || "stable-beluga:latest";

console.log("Variáveis carregadas pelo Vite:", import.meta.env);
console.log("Host da API Ollama:", OLLAMA_API_HOST);
console.log("Endpoint final da API:", OLLAMA_API_ENDPOINT);
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
    const finalPrompt = `${getSystemInstruction(language)}\n\n${prompt}`.trim();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const apiKey = import.meta.env.VITE_OLLAMA_API_KEY;
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(OLLAMA_API_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: MODEL_ID,
        prompt: finalPrompt,
        stream: false,
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

    const assistantResponseBase =
      typeof data.response === "string"
        ? data.response
        : Array.isArray(data.response)
          ? data.response.join("\n")
          : data.response;

    const assistantResponse = typeof assistantResponseBase === "string"
      ? assistantResponseBase.trim()
      : assistantResponseBase;

    if (!response.ok || data.error || !assistantResponse) {
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
    return String(assistantResponse);
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

import { Language } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ✅ Modelo configurado com fallback para ":free"
const MODEL_ID = import.meta.env.VITE_MODEL_ID || "tngtech/deepseek-r1t2-chimera:free";

// Confirma se a chave e o modelo foram carregados
console.log("API KEY carregada:", API_KEY ? "OK" : "NÃO ENCONTRADA");
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
    if (!API_KEY) {
      throw new Error("API Key não encontrada. Verifique seu arquivo .env ou .env.local");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          { role: "system", content: getSystemInstruction(language) },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // ✅ Tratamento de erros da API
    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || `${response.status} ${response.statusText}`;
      console.error("OpenRouter Error Response:", data);

      // Fallback para limite diário (429)
      if (errorMessage.includes("Rate limit") || response.status === 429) {
        return language === "pt"
          ? "⚠️ Limite diário atingido. Tente novamente amanhã ou adicione créditos no OpenRouter."
          : "⚠️ Daily limit reached. Try again tomorrow or add credits on OpenRouter.";
      }

      // Fallback genérico
      return language === "pt"
        ? "Ocorreu um erro na geração. Verifique sua chave API ou modelo configurado."
        : "Error generating content. Check your API Key or configured model.";
    }

    // ✅ Retorno seguro do conteúdo
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      (language === "pt"
        ? "Ocorreu um erro na geração."
        : "Error generating content.")
    );
  } catch (error: any) {
    console.error("OpenRouter Error:", error);

    // ✅ Fallback final em caso de falha inesperada
    return language === "pt"
      ? "Erro de conexão com a IA. Verifique sua chave API ou modelo configurado."
      : "AI Connection error. Check your API Key or configured model.";
  }
};

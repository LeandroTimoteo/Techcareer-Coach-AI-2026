import { GoogleGenerativeAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

const getSystemInstruction = (language: Language) => `
Você é o "TechCareer Coach", um mentor sênior de carreira em tecnologia.
Você ajuda desenvolvedores, analistas e designers a se destacarem no mercado global.

Seu objetivo é:
- Transformar currículos genéricos em currículos magnéticos para ATS.
- Criar perfis de LinkedIn que atraem recrutadores.
- Preparar candidatos para entrevistas técnicas usando o método STAR.
- Escrever mensagens de networking curtas e impactantes.

Estilo: Profissional, prático e motivador.
Idioma de resposta: ${language === 'pt' ? 'Português (Brasil)' : 'English (US)'}.
Sempre use Markdown para formatar títulos e listas.
`;

export const generateCareerAdvice = async (
  prompt: string, 
  contextType: 'resume' | 'linkedin' | 'interview' | 'networking' | 'general',
  language: Language
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // modelo estável mais recente
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.7,
      }
    });

    return response.outputText || (language === 'pt' ? "Ocorreu um erro na geração." : "Error generating content.");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(language === 'pt' ? "Erro de conexão com a IA. Verifique sua chave API." : "AI Connection error. Check your API Key.");
  }
};



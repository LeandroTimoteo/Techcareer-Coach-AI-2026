import { Language } from '../types';

const API_ENDPOINT = '/api/generate';
export const MODEL_ID: string =
  import.meta.env.VITE_MODEL_ID || 'stable-beluga:latest';

console.log('Variáveis carregadas pelo Vite:', import.meta.env);
console.log('Endpoint da API interna:', API_ENDPOINT);
console.log('Modelo configurado:', MODEL_ID);

const getSystemInstruction = (language: Language) => `
Você é o 'TechCareer Coach', um mentor sênior de carreira em tecnologia.
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
    const finalPrompt = `${getSystemInstruction(language)}\n\n${prompt}`.trim();

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        prompt: finalPrompt,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return language === 'pt'
          ? '⚠️ Limite diário atingido. Tente novamente amanhã.'
          : '⚠️ Daily limit reached. Try again tomorrow.';
      }

      return 'Error generating content. Check your configured model.';
    }

    const assistantResponse =
      typeof data.response === 'string'
        ? data.response.trim()
        : '';

    if (!assistantResponse) {
      return 'Error generating content. Check your configured model.';
    }

    return assistantResponse;
  } catch (error) {
    console.error('Ollama Proxy Error:', error);

    return language === 'pt'
      ? 'Erro de conexão com IA. Verifique se o backend está ativo.'
      : 'AI Connection error. Check if Ollama is running and the configured model is correct.';
  }
};
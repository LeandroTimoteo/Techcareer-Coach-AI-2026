import { Language } from '../types';

const API_ENDPOINT = '/api/generate';
export const MODEL_ID: string = import.meta.env.VITE_MODEL_ID || 'stable-beluga:latest';

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

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      throw new Error('Resposta da API vazia.');
    }

    const data = await response.json();

    const assistantResponseBase =
      typeof data.response === 'string'
        ? data.response
        : Array.isArray(data.response)
          ? data.response.join('\n')
          : data.response;

    const assistantResponse = typeof assistantResponseBase === 'string'
      ? assistantResponseBase.trim()
      : assistantResponseBase;

    if (data.error || !assistantResponse) {
      const errorMessage = data.error?.message || data.error || 'Resposta inesperada.';
      console.error('Ollama Proxy Error:', data);

      if (typeof errorMessage === 'string' && errorMessage.includes('Rate limit')) {
        return language === 'pt'
          ? '⚠️ Limite diário atingido. Tente novamente amanhã.'
          : '⚠️ Daily limit reached. Try again tomorrow.';
      }

      throw new Error(errorMessage);
    }

    return String(assistantResponse);
  } catch (error: any) {
    console.error('Ollama Proxy Error:', error);

    const isSyntaxError = error instanceof SyntaxError || error.message?.includes('JSON');
    
    if (isSyntaxError) {
      return language === 'pt'
        ? '❌ Erro de formato na resposta da IA. Certifique-se de que o backend está retornando JSON.'
        : '❌ AI response format error. Ensure the backend is returning JSON.';
    }

    return language === 'pt'
      ? `Erro na IA: ${error.message || 'Erro de conexão'}. Verifique o backend.`
      : `AI Error: ${error.message || 'Connection error'}. Check the backend.`;
  }
};

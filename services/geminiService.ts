import { Language } from "../types";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// Usa modelos que garantidamente funcionam com free tier
const MODEL_ID = import.meta.env.VITE_MODEL_ID || 'tngtech/deepseek-r1t2-chimera:free';

// Debug logs
console.log('Variáveis carregadas pelo Vite:', {
  key: OPENROUTER_API_KEY ? 'OK' : 'FALTANDO',
  model: MODEL_ID
});
if (OPENROUTER_API_KEY) {
  console.log('API KEY carregada: OK');
  console.log('Chave iniciada com:', OPENROUTER_API_KEY.substring(0, 15) + '...');
}
console.log('Modelo configurado:', MODEL_ID);

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
    const systemInstruction = getSystemInstruction(language);
    
    console.log('🚀 Enviando requisição para OpenRouter');
    console.log('Modelo usado:', MODEL_ID);
    console.log('Chave API presente:', !!OPENROUTER_API_KEY);
    
    const payload = {
      model: MODEL_ID,
      messages: [
        {
          role: 'system',
          content: systemInstruction
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };
    
    console.log('📤 Payload completo:', JSON.stringify(payload, null, 2));
    
    // Headers para OpenRouter
    const headers: HeadersInit = {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
      'X-Title': 'TechCareer Coach AI',
    };
    
    console.log('📌 Headers enviados:', Object.keys(headers));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    console.log('📍 Status HTTP:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Resposta bruta:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Erro ao parsear JSON:', responseText);
      throw new Error('Resposta inválida da API');
    }
    
    console.log('📦 Dados parseados:', data);

    if (!response.ok) {
      console.error('❌ Erro da API (Status', response.status + '):', data);
      const errorMsg = data?.error?.message || data?.error || `HTTP ${response.status}`;
      throw new Error(`Erro OpenRouter: ${errorMsg}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('❌ Resposta vazia:', data);
      throw new Error('Nenhum conteúdo retornado pela API');
    }
    
    console.log('✨ Sucesso! Resposta recebida com', content.length, 'caracteres');
    return content;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌ Erro completo:", msg);
    throw new Error(language === 'pt' ? `Erro na IA: ${msg}` : `AI Error: ${msg}`);
  }
};



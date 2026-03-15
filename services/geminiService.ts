import { Language } from "../types";

const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY;
// Usa a URL do Ollama ou localhost por padrão
const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';
const MODEL_ID = import.meta.env.VITE_MODEL_ID || 'stable-beluga';

// Debug logs
console.log('Variáveis carregadas pelo Vite:', {
  key: OLLAMA_API_KEY ? 'OK' : 'FALTANDO',
  url: OLLAMA_API_URL,
  model: MODEL_ID
});
if (OLLAMA_API_KEY) {
  console.log('API KEY carregada: OK');
  console.log('Chave iniciada com:', OLLAMA_API_KEY.substring(0, 15) + '...');
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
    
    console.log('🚀 Enviando requisição para Ollama');
    console.log('Modelo usado:', MODEL_ID);
    console.log('URL Ollama:', OLLAMA_API_URL);
    
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
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (OLLAMA_API_KEY) {
       headers['Authorization'] = `Bearer ${OLLAMA_API_KEY}`;
    }
    
    console.log('📌 Headers enviados:', Object.keys(headers));
    
    const response = await fetch(`${OLLAMA_API_URL}/v1/chat/completions`, {
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
      throw new Error(`Erro Ollama: ${errorMsg}`);
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

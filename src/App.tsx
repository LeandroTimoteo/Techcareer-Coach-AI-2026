import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Linkedin, MessageSquare, Users, Sparkles, Globe, Moon, Sun } from 'lucide-react';
import { ToolId, ToolConfig, Language } from './types';
import { ResumeTool, LinkedInTool, InterviewTool, NetworkingTool } from './components/Tools';
import { generateCareerAdvice, MODEL_ID } from './services/geminiService';
import './theme.css'; // ✅ Import correto do CSS para tema claro/escuro

const tools: ToolConfig[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, description: 'Overview', color: 'text-slate-600' },
  { id: 'resume', name: 'CV Review', icon: FileText, description: 'ATS Optimization', color: 'text-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, description: 'Profile Boost', color: 'text-[#0077b5]' },
  { id: 'interview', name: 'Interview', icon: MessageSquare, description: 'Practice', color: 'text-purple-600' },
  { id: 'networking', name: 'Messages', icon: Users, description: 'Connect', color: 'text-emerald-600' },
];

const translations = {
  pt: {
    sidebarTitle: 'Carreira Tech',
    heroTitle: 'Decole sua Carreira! 🚀',
    heroSub: 'Use as ferramentas para brilhar no mercado global.',
    ready: 'Pronto para agir?',
    accessLinkedin: 'Abrir LinkedIn',
    tipPrompt: "Dê uma dica curta de carreira tech em 2 frases.",
    chatPlaceholder: "Digite sua mensagem...",
    send: "Enviar"
  },
  en: {
    sidebarTitle: 'Tech Coach',
    heroTitle: 'Boost your Career! 🚀',
    heroSub: 'Use the tools to shine in the global market.',
    ready: 'Ready to act?',
    accessLinkedin: 'Open LinkedIn',
    tipPrompt: "Give a short tech career tip in 2 sentences.",
    chatPlaceholder: "Type your message...",
    send: "Send"
  }
};

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('dashboard');
  const [language, setLanguage] = useState<Language>('pt');
  const [dailyTip, setDailyTip] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const t = translations[language];

  useEffect(() => {
    generateCareerAdvice(t.tipPrompt, 'general', language)
      .then(setDailyTip)
      .catch(() => setDailyTip(language === 'pt' ? 'Sempre continue aprendendo!' : 'Always keep learning!'));
  }, [language]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_ID,
          prompt: userMessage,
          stream: false,
        }),
      });

      if (!response.ok) {
        let message = `${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          message = errorBody?.error || message;
        } catch {
          const text = await response.text();
          message = text || message;
        }

        console.error("Chat API retornou erro:", message);
        throw new Error(message);
      }

      const data = await response.json();

      const assistantReplyBase =
        typeof data.response === "string"
          ? data.response
          : Array.isArray(data.response)
            ? data.response.join("\n")
            : data.response;

      const assistantReply = typeof assistantReplyBase === "string"
        ? assistantReplyBase.trim()
        : assistantReplyBase;

      if (!assistantReply) {
        const message = "Resposta da IA vazia";
        console.error("Chat API retornou erro:", message, data);
        throw new Error(message);
      }

      setChat(prev => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
      setChat(prev => [...prev, { role: 'assistant', content: err.message || "Erro ao conectar com o servidor." }]);
    }
  };

  const renderContent = () => {
    switch (activeTool) {
      case 'resume': return <ResumeTool language={language} />;
      case 'linkedin': return <LinkedInTool language={language} />;
      case 'interview': return <InterviewTool language={language} />;
      case 'networking': return <NetworkingTool language={language} />;
      default:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">{t.heroTitle}</h1>
              <p className="text-blue-100 mb-6">{t.heroSub}</p>
              {dailyTip && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/20 italic">
                  "{dailyTip.replace(/\*\*/g, '')}"
                </div>
              )}
            </div>

            {/* ✅ Chat integrado */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <div className="h-64 overflow-y-auto space-y-2 mb-4">
                {chat.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white mr-auto'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {t.send}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.filter(tool => tool.id !== 'dashboard').map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-left group"
                >
                  <tool.icon className={`w-8 h-8 mb-4 ${tool.color}`} />
                  <h3 className="font-bold text-slate-800 dark:text-white">{tool.name}</h3>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900">
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-800 border-b lg:border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5"/> {t.sidebarTitle}
        </h1>
        <nav className="flex-1 space-y-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                activeTool === tool.id
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <tool.icon className="w-4 h-4"/> {tool.name}
            </button>
          ))}
        </nav>
        <div className="mt-8 p-4 bg-slate-900 dark:bg-slate-700 rounded-lg text-white text-center">
          <p className="text-xs mb-2">{t.ready}</p>
          <button
            onClick={() => window.open('https://linkedin.com')}
            className="w-full bg-blue-600 py-1 rounded text-xs"
          >
            {t.accessLinkedin}
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header
          className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0"
          role="banner"
        >
          <h2 className="font-bold text-slate-700 dark:text-slate-200 uppercase">
            Tech Career Coach AI
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(l => (l === 'pt' ? 'en' : 'pt'))}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium"
            >
              <Globe className="w-4 h-4"/> {language === 'pt' ? 'Português' : 'English'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium"
            >
              {darkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              {darkMode ? 'Claro' : 'Escuro'}
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-12">
          <div className="max-w-3xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}

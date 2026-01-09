import React, { useState } from 'react';
import { Send, FileText, Linkedin, Users, Mic, Loader2, Copy, Check } from 'lucide-react';
import { generateCareerAdvice } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AnalysisResult, Language } from '../types';

const t = {
  pt: {
    loading: 'O Coach está analisando...',
    wait: 'Isso pode levar alguns segundos.',
    error: 'Ocorreu um erro',
    analysisTitle: 'Análise & Sugestões',
    copy: 'Copiar',
    copied: 'Copiado!',
    analyzeBtn: 'Analisar',
    generateBtn: 'Gerar',
    optimizeBtn: 'Otimizar',
    createBtn: 'Criar Mensagens',
    resumeLabel: 'Conteúdo do seu Currículo',
    resumePlaceholder: 'Cole aqui seu resumo ou experiências...',
    linkedinRoleLabel: 'Cargo Alvo',
    linkedinRolePlaceholder: 'Ex: Desenvolvedor Senior...',
    linkedinAboutLabel: 'Sobre (Opcional)',
    linkedinAboutPlaceholder: 'Cole seu resumo atual aqui...',
    interviewLabel: 'Descrição da Vaga',
    interviewPlaceholder: 'Cole os requisitos da vaga aqui...',
    networkRecipientLabel: 'Destinatário',
    networkRecipientPlaceholder: 'Recrutador na Empresa X...',
    networkGoalLabel: 'Objetivo',
    networkGoalPlaceholder: 'Ex: Café virtual ou tirar dúvidas...',
  },
  en: {
    loading: 'Coach is analyzing...',
    wait: 'This may take a few seconds.',
    error: 'An error occurred',
    analysisTitle: 'Analysis & Suggestions',
    copy: 'Copy',
    copied: 'Copied!',
    analyzeBtn: 'Analyze',
    generateBtn: 'Generate',
    optimizeBtn: 'Optimize',
    createBtn: 'Draft Messages',
    resumeLabel: 'Resume Content',
    resumePlaceholder: 'Paste your summary or experiences here...',
    linkedinRoleLabel: 'Target Role',
    linkedinRolePlaceholder: 'Ex: Senior Developer...',
    linkedinAboutLabel: 'About section (Optional)',
    linkedinAboutPlaceholder: 'Paste your current summary here...',
    interviewLabel: 'Job Description',
    interviewPlaceholder: 'Paste the job requirements here...',
    networkRecipientLabel: 'Recipient',
    networkRecipientPlaceholder: 'Recruiter at Company X...',
    networkGoalLabel: 'Goal',
    networkGoalPlaceholder: 'Ex: Virtual coffee or asking questions...',
  }
};

const ResultDisplay: React.FC<{ result: AnalysisResult; language: Language }> = ({ result, language }) => {
  const [copied, setCopied] = useState(false);
  const text = t[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-100 h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">{text.loading}</p>
      </div>
    );
  }

  if (result.error) return <div className="p-6 bg-red-50 text-red-700 rounded-xl">{result.error}</div>;
  if (!result.markdown) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700">{text.analysisTitle}</h3>
        <button onClick={handleCopy} className="text-slate-500 hover:text-blue-600 flex items-center gap-1 text-sm">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? text.copied : text.copy}
        </button>
      </div>
      <div className="p-8"><MarkdownRenderer content={result.markdown} /></div>
    </div>
  );
};

export const ResumeTool: React.FC<{ language: Language }> = ({ language }) => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<AnalysisResult>({ markdown: '', loading: false });
  const text = t[language];

  const handleAnalyze = async () => {
    setResult({ markdown: '', loading: true });
    try {
      const advice = await generateCareerAdvice(`Analyze this resume: ${content}`, 'resume', language);
      setResult({ markdown: advice, loading: false });
    } catch (e: any) { setResult({ markdown: '', loading: false, error: e.message }); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">{text.resumeLabel}</label>
        <textarea className="w-full h-40 p-4 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder={text.resumePlaceholder} value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={handleAnalyze} disabled={!content.trim() || result.loading} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:opacity-50">{text.analyzeBtn}</button>
      </div>
      <ResultDisplay result={result} language={language} />
    </div>
  );
};

export const LinkedInTool: React.FC<{ language: Language }> = ({ language }) => {
  const [role, setRole] = useState('');
  const [result, setResult] = useState<AnalysisResult>({ markdown: '', loading: false });
  const text = t[language];

  const handleOptimize = async () => {
    setResult({ markdown: '', loading: true });
    try {
      const advice = await generateCareerAdvice(`Improve LinkedIn for: ${role}`, 'linkedin', language);
      setResult({ markdown: advice, loading: false });
    } catch (e: any) { setResult({ markdown: '', loading: false, error: e.message }); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">{text.linkedinRoleLabel}</label>
        <input className="w-full p-3 bg-slate-50 border rounded-lg mb-4" placeholder={text.linkedinRolePlaceholder} value={role} onChange={e => setRole(e.target.value)} />
        <button onClick={handleOptimize} disabled={!role.trim() || result.loading} className="w-full bg-[#0077b5] text-white py-2 rounded-lg font-bold">{text.optimizeBtn}</button>
      </div>
      <ResultDisplay result={result} language={language} />
    </div>
  );
};

export const InterviewTool: React.FC<{ language: Language }> = ({ language }) => {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<AnalysisResult>({ markdown: '', loading: false });
  const text = t[language];

  const handleGenerate = async () => {
    setResult({ markdown: '', loading: true });
    try {
      const advice = await generateCareerAdvice(`Prep interview questions for: ${jd}`, 'interview', language);
      setResult({ markdown: advice, loading: false });
    } catch (e: any) { setResult({ markdown: '', loading: false, error: e.message }); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">{text.interviewLabel}</label>
        <textarea className="w-full h-40 p-4 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder={text.interviewPlaceholder} value={jd} onChange={e => setJd(e.target.value)} />
        <button onClick={handleGenerate} disabled={!jd.trim() || result.loading} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-bold">{text.generateBtn}</button>
      </div>
      <ResultDisplay result={result} language={language} />
    </div>
  );
};

export const NetworkingTool: React.FC<{ language: Language }> = ({ language }) => {
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState<AnalysisResult>({ markdown: '', loading: false });
  const text = t[language];

  const handleDraft = async () => {
    setResult({ markdown: '', loading: true });
    try {
      const advice = await generateCareerAdvice(`Networking message for: ${goal}`, 'networking', language);
      setResult({ markdown: advice, loading: false });
    } catch (e: any) { setResult({ markdown: '', loading: false, error: e.message }); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-medium mb-2">{text.networkGoalLabel}</label>
        <input className="w-full p-3 bg-slate-50 border rounded-lg mb-4" placeholder={text.networkGoalPlaceholder} value={goal} onChange={e => setGoal(e.target.value)} />
        <button onClick={handleDraft} disabled={!goal.trim() || result.loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">{text.createBtn}</button>
      </div>
      <ResultDisplay result={result} language={language} />
    </div>
  );
};
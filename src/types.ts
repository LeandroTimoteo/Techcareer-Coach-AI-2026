import React from 'react';

export type ToolId = 'dashboard' | 'resume' | 'linkedin' | 'interview' | 'networking';
export type Language = 'pt' | 'en';

export interface ToolConfig {
  id: ToolId;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

export interface AnalysisResult {
  markdown: string;
  loading: boolean;
  error?: string;
}
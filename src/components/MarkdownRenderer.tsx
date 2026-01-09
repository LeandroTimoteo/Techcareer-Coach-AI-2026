import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-slate-800">
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="text-2xl mb-4 text-slate-900" {...props} />,
          h2: (props) => <h2 className="text-xl mt-6 mb-3 text-slate-800 border-b pb-2 border-slate-200" {...props} />,
          h3: (props) => <h3 className="text-lg mt-4 mb-2 text-slate-800" {...props} />,
          ul: (props) => <ul className="list-disc list-outside ml-5 mb-4 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-1" {...props} />,
          li: (props) => <li className="text-slate-700" {...props} />,
          p: (props) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
          blockquote: (props) => <blockquote className="border-l-4 border-blue-500 pl-4 italic bg-slate-50 py-2 my-4 rounded-r" {...props} />,
          code: (props) => <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded font-mono text-sm" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};




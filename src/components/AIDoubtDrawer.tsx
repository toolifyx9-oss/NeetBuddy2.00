import React, { useState } from 'react';
import { askAiDoubt } from '../lib/api';

interface Message {
  text: string;
  isUser: boolean;
}

interface AIDoubtDrawerProps {
  userName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIDoubtDrawer: React.FC<AIDoubtDrawerProps> = ({ userName, isOpen, onToggle }) => {
  const firstName = userName.trim().split(' ')[0];
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hi ${firstName}! I am NEETBuddy AI. Ask me any doubt in Physics, Chemistry, Botany or Zoology.`, isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { text: prompt, isUser: true }]);
    setIsLoading(true);

    try {
      const data = await askAiDoubt(prompt);
      setMessages(prev => [...prev, { text: data.reply || 'No response generated.', isUser: false }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { text: `Error: ${err.message || 'Could not connect to AI solver.'}`, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Dimensional formula of force',
    'Physics numerical tips',
    'Cell biology revision',
    'NEET study routine'
  ];

  return (
    <>
      <button id="aib" aria-label="Open NEETBuddy AI" onClick={onToggle}>
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M12 2l2.4 6.2L21 10l-6.6 1.8L12 18l-2.4-6.2L3 10l6.6-1.8z" fill="#fff" />
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" fill="#fff" />
        </svg>
        <b>AI</b>
      </button>

      <section id="aip" hidden={!isOpen} aria-label="NEETBuddy AI">
        <header>
          <span className="flex items-center gap-2">
            <span>✨ NEETBuddy AI</span>
          </span>
          <button onClick={onToggle} aria-label="Close" className="text-white hover:opacity-80">
            ✕
          </button>
        </header>

        <div id="aim">
          {messages.map((m, idx) => (
            <div key={idx} className={`mb2 ${m.isUser ? 'u' : 'b'}`}>
              {m.text}
            </div>
          ))}
          {isLoading && <div className="mb2 b text-slate-500 font-semibold italic">NEETBuddy AI is thinking…</div>}
        </div>

        <div className="flex gap-2 overflow-x-auto p-2 scrollbar-none bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition"
              onClick={() => handleSend(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a NEET doubt…"
            className="flex-1 h-11 border-0 rounded-full px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-50 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 transition"
          >
            ➤
          </button>
        </form>
      </section>
    </>
  );
};

import React from 'react';
import { LogoSvg } from './Navigation';

interface LandingPageProps {
  onEnterApp: (mode?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, darkMode, onToggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-emerald-50">
      {/* Top Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-2xl">
          <LogoSvg />
          <span>NEET<b className="text-emerald-600 dark:text-emerald-400">Buddy</b></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => onEnterApp('login')}
            className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
          >
            Login
          </button>
          <button
            onClick={() => onEnterApp('signup')}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white font-bold shadow-md hover:bg-emerald-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wide mb-4">
            NEET UG 2026 Platform
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Crack NEET with <span className="text-emerald-600 dark:text-emerald-400">smart practice</span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-emerald-200/80 text-lg leading-relaxed">
            Chapter-wise practice, real exam mocks, instant performance analysis, and an improvement book that remembers every mistake.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onEnterApp('signup')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-lg hover:shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => onEnterApp('home')}
              className="px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              Explore the App
            </button>
          </div>
        </div>

        {/* Visual Hero Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-extrabold leading-tight">
            Practice More.<br />
            Improve Faster.
          </h2>
          <p className="mt-2 text-emerald-100 text-sm">
            NMC 2026 syllabus aligned question bank with instant explanations and analytics.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl">
              <div className="text-2xl font-extrabold">50,000+</div>
              <div className="text-xs text-emerald-100">NCERT Questions</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl">
              <div className="text-2xl font-extrabold">720 Marks</div>
              <div className="text-xs text-emerald-100">Real Exam Mocks</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl">
              <div className="text-2xl font-extrabold">100%</div>
              <div className="text-xs text-emerald-100">NCERT Coverage</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl">
              <div className="text-2xl font-extrabold">AI Solver</div>
              <div className="text-xs text-emerald-100">Step-by-step Doubt Help</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-extrabold text-center mb-8">
          Everything you need for NEET prep
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Chapter-wise Practice', desc: 'All subjects and chapters categorized with difficulty levels.' },
            { icon: '📝', title: 'Mock Tests & PYQs', desc: '180 questions, 720 marks, +4/-1 real NEET pattern tests.' },
            { icon: '📊', title: 'Performance Analytics', desc: 'Subject accuracy, weak areas, and time management trends.' },
            { icon: '📖', title: 'Improvement Book', desc: 'Auto-saves every wrong answer for targeted re-attempts.' },
            { icon: '🔖', title: 'Notes & Flashcards', desc: 'Rich HTML notes and 3D card flip recall interface.' },
            { icon: '💡', title: 'AI Doubt Solver', desc: 'Instant step-by-step explanations for tricky questions.' }
          ].map((f, i) => (
            <div key={i} className="card hover:shadow-lg transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-extrabold text-lg mb-1">{f.title}</h3>
              <p className="text-slate-600 dark:text-emerald-300/70 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-center text-xs text-slate-500">
        © 2026 NEETBuddy. All rights reserved. Powered by AlphaDev.
      </footer>
    </div>
  );
};

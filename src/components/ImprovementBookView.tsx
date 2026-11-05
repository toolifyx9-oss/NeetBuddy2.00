import React, { useState } from 'react';
import { Question } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface ImprovementBookViewProps {
  onStartReattempt: (questions: Question[]) => void;
  onNavigate: (view: string) => void;
}

export const ImprovementBookView: React.FC<ImprovementBookViewProps> = ({
  onStartReattempt,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'All' | 'Incorrect' | 'Marked'>('All');

  const mockMistakes: { id: string; question: Question; reason: string; attempts: number }[] = [
    {
      id: 'ib-1',
      question: {
        id: 'phy-1',
        subject: 'Physics',
        chapter: 'Physics and Measurement',
        topic: 'Dimensional analysis and its applications',
        statement: 'The dimensional formula of force is:',
        options: ['[MLT⁻¹]', '[MLT⁻²]', '[ML²T⁻²]', '[ML⁻¹T⁻²]'],
        correctOptionIndex: 1,
        explanation: 'Force = mass × acceleration = M × LT⁻² = [MLT⁻²].',
        difficulty: 'Easy'
      },
      reason: 'Calculation mistake in acceleration exponent',
      attempts: 2
    },
    {
      id: 'ib-2',
      question: {
        id: 'chem-4',
        subject: 'Chemistry',
        chapter: 'Equilibrium',
        topic: 'Ionic equilibrium, pH scale, buffer solutions',
        statement: 'The pH of a 10⁻⁸ M HCl solution at 25 °C is:',
        options: ['8.0', '6.98', '7.00', '5.00'],
        correctOptionIndex: 1,
        explanation: 'Water auto-ionisation contribution [H⁺] = 10⁻⁷ M must be added to acid [H⁺] = 10⁻⁸ M.',
        difficulty: 'Hard'
      },
      reason: 'Forgot water auto-ionisation contribution',
      attempts: 3
    }
  ];

  return (
    <div className="space-y-6">
      <WavyHero
        title="Improvement Book"
        subtitle="Revise your mistakes, weak areas, and marked questions in one place."
        quote="Every mistake is a free lesson. Collect them all."
      />

      <div className="hg">
        <div className="st s3 bg-red-50 dark:bg-red-950/40">
          <span className="ic bg-red-100 text-red-800">✖</span>
          <span>
            <small>Incorrect Qs</small>
            <b>124</b>
          </span>
        </div>
        <div className="st s3 bg-amber-50 dark:bg-amber-950/40">
          <span className="ic bg-amber-100 text-amber-800">🔖</span>
          <span>
            <small>Marked for Review</small>
            <b>48</b>
          </span>
        </div>
        <div className="st s3 bg-blue-50 dark:bg-blue-950/40">
          <span className="ic bg-blue-100 text-blue-800">🔁</span>
          <span>
            <small>Reattempt Later</small>
            <b>36</b>
          </span>
        </div>
        <div className="st s3 bg-emerald-50 dark:bg-emerald-950/40">
          <span className="ic bg-emerald-100 text-emerald-800">✔</span>
          <span>
            <small>Mastered Qs</small>
            <b>208</b>
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="tabs mb-0">
          {(['All', 'Incorrect', 'Marked'] as const).map((t) => (
            <button
              key={t}
              className={`tb ${filter === t ? 'on' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          className="btn sm bg-emerald-600 text-white"
          onClick={() => onStartReattempt(mockMistakes.map(m => m.question))}
        >
          🔁 Re-attempt All Mistakes
        </button>
      </div>

      <div className="space-y-3">
        {mockMistakes.map((item) => (
          <div key={item.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <span className="chip c1">{item.question.subject}</span>
                <span className="text-xs text-slate-500 font-semibold">{item.question.chapter}</span>
              </div>
              <h3 className="font-extrabold text-base">{item.question.statement}</h3>
              <small className="text-red-600 dark:text-red-400 font-bold block">
                Mistake reason: {item.reason} ({item.attempts} attempts)
              </small>
            </div>

            <button
              className="btn sm"
              onClick={() => onStartReattempt([item.question])}
            >
              Re-attempt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

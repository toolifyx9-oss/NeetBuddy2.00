import React from 'react';
import { SubjectName } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface DppViewProps {
  onStartDpp: (subject: SubjectName) => void;
}

export const DppView: React.FC<DppViewProps> = ({ onStartDpp }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="space-y-6">
      <WavyHero
        title="DPP Practice"
        subtitle="Daily Practice Problems: solve 10 targeted questions every day per subject."
        quote="Small daily wins build big ranks."
      />

      <div className="card">
        <h3 className="font-extrabold text-base mb-3">This Week's Streak</h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isDone = idx <= todayIndex;
            return (
              <div
                key={idx}
                className={`py-3 rounded-2xl border ${
                  isToday
                    ? 'bg-emerald-600 text-white font-extrabold border-emerald-600 shadow-md'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200'
                }`}
              >
                <small className="block text-[11px] uppercase tracking-wide opacity-80">{day}</small>
                <b className="text-lg block mt-1">{isDone ? '✓' : '•'}</b>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="font-extrabold text-lg text-slate-900 dark:text-emerald-50">Today's DPP Sets</h2>

      <div className="g g4">
        {[
          { name: 'Physics' as SubjectName, icon: '⚛️', bg: '#e6f0ff', chapter: 'Kinematics & Motion' },
          { name: 'Chemistry' as SubjectName, icon: '🧪', bg: '#fff0e4', chapter: 'Chemical Bonding' },
          { name: 'Botany' as SubjectName, icon: '🌿', bg: '#e8f7e6', chapter: 'Cell: The Unit of Life' },
          { name: 'Zoology' as SubjectName, icon: '🧬', bg: '#f0e8ff', chapter: 'Human Reproduction' }
        ].map((s, idx) => (
          <button
            key={idx}
            className="tile"
            style={{ background: s.bg }}
            onClick={() => onStartDpp(s.name)}
          >
            <div className="ti">{s.icon}</div>
            <h3>{s.name} DPP</h3>
            <small>{s.chapter}</small>
            <small className="font-bold text-slate-700">10 Questions • 20 Mins</small>
            <div className="pr">
              <span className="chip c3">Solve Today →</span>
              <span className="ar">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

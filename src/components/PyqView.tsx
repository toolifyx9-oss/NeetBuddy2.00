import React, { useState } from 'react';
import { SubjectName } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface PyqViewProps {
  onStartPyqSession: (year: number) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const PyqView: React.FC<PyqViewProps> = ({ onStartPyqSession, onNavigate }) => {
  const [filterType, setFilterType] = useState<'Year' | 'Subject'>('Year');
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  return (
    <div className="space-y-6">
      <WavyHero
        title="Previous Year Questions (PYQs)"
        subtitle="Practise real NEET papers from 2016 to 2025."
        quote="Study the past to score in the future."
      />

      <div className="tabs">
        {(['Year', 'Subject'] as const).map((f) => (
          <button
            key={f}
            className={`tb ${filterType === f ? 'on' : ''}`}
            onClick={() => setFilterType(f)}
          >
            {f === 'Year' ? 'Year-wise Papers' : 'Subject-wise Collections'}
          </button>
        ))}
      </div>

      {filterType === 'Year' && (
        <div className="g g4">
          {years.map((y, idx) => (
            <button
              key={idx}
              className="tile"
              style={{ background: ['#e6f0ff', '#e8f7e6', '#fff0e4', '#f0e8ff'][idx % 4] }}
              onClick={() => onStartPyqSession(y)}
            >
              <div className="ti">📄</div>
              <h3>NEET UG {y}</h3>
              <small>180 Questions • 3 Hours • 720 Marks</small>
              <div className="pr">
                <span className="chip c6">Start PYQ Set</span>
                <span className="ar">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {filterType === 'Subject' && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Physics', icon: '⚛️', bg: '#e6f0ff', desc: '10 Years Physics PYQs' },
            { name: 'Chemistry', icon: '🧪', bg: '#fff0e4', desc: '10 Years Chemistry PYQs' },
            { name: 'Botany', icon: '🌿', bg: '#e8f7e6', desc: '10 Years Botany PYQs' },
            { name: 'Zoology', icon: '🧬', bg: '#f0e8ff', desc: '10 Years Zoology PYQs' }
          ].map((s, idx) => (
            <button
              key={idx}
              className="card flex items-center justify-between hover:shadow-md transition text-left"
              style={{ background: s.bg }}
              onClick={() => onNavigate('setup', { subject: s.name as SubjectName })}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl p-3 bg-white rounded-2xl shadow-sm">{s.icon}</div>
                <div>
                  <h3 className="font-extrabold text-base">{s.name} PYQ Bank</h3>
                  <small className="text-slate-600">{s.desc}</small>
                </div>
              </div>
              <span className="ar">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

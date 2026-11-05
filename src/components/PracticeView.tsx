import React, { useState } from 'react';
import { SubjectName } from '../types/neetbuddy';
import { NEET_SYLLABUS } from '../data/syllabus';
import { WavyHero } from './WavyHero';

interface PracticeViewProps {
  currentSubView: 'subjects' | 'chapters' | 'topics' | 'setup';
  selectedSubject: SubjectName | null;
  selectedChapter: string | null;
  selectedTopic: string | null;
  onSelectSubject: (sub: SubjectName) => void;
  onSelectChapter: (chap: string) => void;
  onSelectTopic: (top: string) => void;
  onStartPractice: (config: { questionCount: number; difficulty: string; mode: string }) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  currentSubView,
  selectedSubject,
  selectedChapter,
  selectedTopic,
  onSelectSubject,
  onSelectChapter,
  onSelectTopic,
  onStartPractice,
  onNavigate
}) => {
  const [tabFilter, setTabFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Mixed');
  const [mode, setMode] = useState('Practice');

  // Subjects List
  if (currentSubView === 'subjects' || !selectedSubject) {
    const subjectsList: { name: SubjectName; icon: string; bg: string; chapters: number }[] = [
      { name: 'Physics', icon: '⚛️', bg: '#e6f0ff', chapters: 20 },
      { name: 'Chemistry', icon: '🧪', bg: '#fff0e4', chapters: 20 },
      { name: 'Botany', icon: '🌿', bg: '#e8f7e6', chapters: 17 },
      { name: 'Zoology', icon: '🧬', bg: '#f0e8ff', chapters: 18 }
    ];

    return (
      <div className="space-y-6">
        <WavyHero
          title="Practice Questions"
          subtitle="Choose a subject • Based on the NMC NEET UG 2026 syllabus"
          quote="Practice makes you permanent. Practise perfectly."
        />

        <div className="g g4">
          {subjectsList.map((s, idx) => (
            <button
              key={idx}
              className="tile"
              style={{ background: s.bg }}
              onClick={() => onSelectSubject(s.name)}
            >
              <div className="ti">{s.icon}</div>
              <h3>{s.name}</h3>
              <small>{s.chapters} Chapters • 2,000+ Qs</small>
              <div className="pr">
                <div className="bar"><i style={{ width: '45%' }} /></div>
                <b>45%</b>
                <span className="ar">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chapters List
  if (currentSubView === 'chapters' && selectedSubject) {
    const chapters = NEET_SYLLABUS[selectedSubject] || [];

    return (
      <div className="space-y-6">
        <WavyHero
          title={selectedSubject}
          subtitle={`${chapters.length} Chapters • NMC NEET UG 2026 Syllabus`}
        />

        <div className="tabs">
          {(['All', 'In Progress', 'Completed'] as const).map((t) => (
            <button
              key={t}
              className={`tb ${tabFilter === t ? 'on' : ''}`}
              onClick={() => setTabFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {chapters.map((c, idx) => (
            <button
              key={idx}
              className="row"
              onClick={() => onSelectChapter(c.name)}
            >
              <span className="n">{String(idx + 1).padStart(2, '0')}</span>
              <span className="x">
                <b className="text-base">{c.name}</b>
                <small className="block">{c.topics.length} Topics • {c.classLevel}</small>
                <div className="pr">
                  <div className="bar"><i style={{ width: `${(idx * 17) % 85 + 15}%` }} /></div>
                </div>
              </span>
              <span className="text-slate-400 font-bold">›</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Topics List
  if (currentSubView === 'topics' && selectedSubject && selectedChapter) {
    const chapterObj = NEET_SYLLABUS[selectedSubject]?.find(c => c.name === selectedChapter);
    const topics = chapterObj ? chapterObj.topics : [];

    return (
      <div className="space-y-6">
        <WavyHero
          title={selectedChapter}
          subtitle={`${selectedSubject} • ${topics.length} Topics`}
        />

        <button
          className="row font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
          onClick={() => onSelectTopic('Whole Chapter')}
        >
          <span className="n bg-emerald-600 text-white">★</span>
          <span className="x">
            <b>Practise Whole Chapter</b>
            <small className="block text-slate-500">Mixed questions from all topics in {selectedChapter}</small>
          </span>
          <span>›</span>
        </button>

        <div className="space-y-3">
          {topics.map((t, idx) => (
            <button
              key={idx}
              className="row"
              onClick={() => onSelectTopic(t)}
            >
              <span className="n text-xs">{idx + 1}</span>
              <span className="x">
                <b>{t}</b>
                <small className="block text-slate-500">20+ NCERT Questions</small>
              </span>
              <span>›</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Practice Setup Config
  return (
    <div className="space-y-6">
      <WavyHero
        title={selectedTopic || selectedChapter || selectedSubject}
        subtitle={`${selectedSubject} • ${selectedChapter}`}
      />

      <div className="card max-w-xl mx-auto space-y-4">
        <div>
          <label className="block text-xs font-bold mb-2">Mode</label>
          <div className="tabs">
            {['Practice', 'Timed'].map((m) => (
              <button
                key={m}
                className={`tb ${mode === m ? 'on' : ''}`}
                onClick={() => setMode(m)}
              >
                {m} {m === 'Timed' ? '(Exam Pattern)' : '(Instant Answers)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">Number of Questions</label>
          <div className="tabs">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                className={`tb ${questionCount === n ? 'on' : ''}`}
                onClick={() => setQuestionCount(n)}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">Difficulty</label>
          <div className="tabs">
            {['Easy', 'Medium', 'Hard', 'Mixed'].map((d) => (
              <button
                key={d}
                className={`tb ${difficulty === d ? 'on' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn w-full mt-4 h-12 text-base"
          onClick={() => onStartPractice({ questionCount, difficulty, mode })}
        >
          Start Practice →
        </button>
      </div>
    </div>
  );
};

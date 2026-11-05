import React, { useState } from 'react';
import { SubjectName } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface MockTestsViewProps {
  onStartTest: (testName: string, subject?: SubjectName, questionCount?: number) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({ onStartTest, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Full' | 'Part' | 'Custom'>('Full');
  const [customSubject, setCustomSubject] = useState<SubjectName>('Physics');
  const [customQuestions, setCustomQuestions] = useState(15);

  const fullSyllabusTests = [
    { title: 'NEET Ultimate Full Test 01', questions: 180, time: '180 Mins', marks: 720 },
    { title: 'NEET Ultimate Full Test 02', questions: 180, time: '180 Mins', marks: 720 },
    { title: 'NEET Ultimate Full Test 03', questions: 180, time: '180 Mins', marks: 720 }
  ];

  const partTests = [
    { title: 'Physics Part Test 01', subject: 'Physics' as SubjectName, questions: 20, time: '30 Mins' },
    { title: 'Chemistry Part Test 01', subject: 'Chemistry' as SubjectName, questions: 20, time: '30 Mins' },
    { title: 'Botany Part Test 01', subject: 'Botany' as SubjectName, questions: 20, time: '30 Mins' },
    { title: 'Zoology Part Test 01', subject: 'Zoology' as SubjectName, questions: 20, time: '30 Mins' }
  ];

  return (
    <div className="space-y-6">
      <WavyHero
        title="Mock Tests"
        subtitle="Attempt real NEET pattern exams (+4 / -1 marking) and improve your score."
        quote="Train like it is exam day, so exam day feels like training."
      />

      <div className="tabs">
        {(['Full', 'Part', 'Custom'] as const).map((t) => (
          <button
            key={t}
            className={`tb ${activeTab === t ? 'on' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'Full' ? 'Full Syllabus Mocks' : t === 'Part' ? 'Part & Subject Tests' : 'Custom Test Builder'}
          </button>
        ))}
      </div>

      {activeTab === 'Full' && (
        <div className="space-y-3">
          {fullSyllabusTests.map((t, idx) => (
            <div key={idx} className="row">
              <span className="n bg-blue-100 text-blue-700">📘</span>
              <span className="x">
                <b>{t.title}</b>
                <small className="block">{t.questions} Qs • {t.time} • {t.marks} Marks</small>
              </span>
              <button
                className="btn sm"
                onClick={() => onStartTest(t.title, undefined, 20)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Part' && (
        <div className="grid md:grid-cols-2 gap-4">
          {partTests.map((t, idx) => (
            <div key={idx} className="card flex justify-between items-center">
              <div>
                <span className="chip c1 mb-1">{t.subject}</span>
                <h3 className="font-extrabold text-base">{t.title}</h3>
                <small className="text-slate-500">{t.questions} Qs • {t.time}</small>
              </div>
              <button
                className="btn sm"
                onClick={() => onStartTest(t.title, t.subject, t.questions)}
              >
                Start
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Custom' && (
        <div className="card max-w-lg mx-auto space-y-4">
          <h3 className="font-extrabold text-lg">Create Custom Test</h3>
          <div>
            <label className="block text-xs font-bold mb-2">Subject</label>
            <div className="tabs">
              {(['Physics', 'Chemistry', 'Botany', 'Zoology'] as const).map((s) => (
                <button
                  key={s}
                  className={`tb ${customSubject === s ? 'on' : ''}`}
                  onClick={() => setCustomSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">Number of Questions</label>
            <div className="tabs">
              {[10, 15, 20, 30].map((n) => (
                <button
                  key={n}
                  className={`tb ${customQuestions === n ? 'on' : ''}`}
                  onClick={() => setCustomQuestions(n)}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn w-full mt-4 h-12"
            onClick={() => onStartTest(`Custom ${customSubject} Test`, customSubject, customQuestions)}
          >
            Create &amp; Start Test →
          </button>
        </div>
      )}
    </div>
  );
};

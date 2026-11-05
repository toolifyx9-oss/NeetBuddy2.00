import React from 'react';
import { UserProfile, TestResultSummary, GoalItem } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface DashboardViewProps {
  currentUser: UserProfile | null;
  onNavigate: (view: string, params?: any) => void;
  goals: GoalItem[];
  onToggleGoal: (id: string) => void;
  testResults: TestResultSummary[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigate,
  goals,
  onToggleGoal,
  testResults
}) => {
  const userName = currentUser ? currentUser.fullName : 'Ayush Kumar';
  const firstName = userName.trim().split(' ')[0];

  const quickAccess = [
    { icon: '🎯', label: 'Practice', view: 'practice', bg: '#ffe5e5' },
    { icon: '📋', label: 'Mock Tests', view: 'tests', bg: '#e4f6ec' },
    { icon: '📘', label: 'PYQs', view: 'pyq', bg: '#e6f0ff' },
    { icon: '🧱', label: 'DPP Practice', view: 'dpp', bg: '#e4f6ec' },
    { icon: '⚡', label: 'Flashcards', view: 'flash', bg: '#f0e8ff' },
    { icon: '🔖', label: 'Notes', view: 'notes', bg: '#fff4d6' }
  ];

  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className="space-y-6">
      <WavyHero
        title={`Good Day, ${firstName}! 👋`}
        subtitle="Pick a module to continue your NEET UG 2027 preparation."
        quote="Consistency today, MBBS tomorrow."
      />

      {/* Stats Bar */}
      <div className="hg">
        <div className="st s3">
          <span className="ic bg-emerald-100 text-emerald-800">⏱️</span>
          <span>
            <small>Study Time</small>
            <b>4h 30m</b>
          </span>
        </div>
        <div className="st s3">
          <span className="ic bg-blue-100 text-blue-800">❓</span>
          <span>
            <small>Questions</small>
            <b>180</b>
          </span>
        </div>
        <div className="st s3">
          <span className="ic bg-teal-100 text-teal-800">🎯</span>
          <span>
            <small>Accuracy</small>
            <b>78%</b>
          </span>
        </div>
        <div className="st s3">
          <span className="ic bg-amber-100 text-amber-800">🔥</span>
          <span>
            <small>Streak</small>
            <b>12 Days</b>
          </span>
        </div>
      </div>

      {/* Main Grid: Continue Learning & Goals */}
      <div className="grid md:grid-cols-12 gap-4">
        {/* Continue Learning Card */}
        <div className="card md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-base">Continue Learning</h3>
              <button
                onClick={() => onNavigate('setup', { subject: 'Physics', chapter: 'Kinematics', topic: 'Units and Dimensions' })}
                className="text-emerald-600 font-bold text-sm hover:underline"
              >
                →
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <div className="ti w-20 h-20 text-3xl bg-blue-100 flex items-center justify-center rounded-2xl">
                ⚛️
              </div>
              <div className="flex-1 min-w-0">
                <small className="text-slate-500 font-semibold">Physics • Kinematics</small>
                <h3 className="font-bold text-lg truncate">Units and Dimensions</h3>
                <small className="text-slate-500">12 / 50 Questions</small>
                <div className="pr mt-2">
                  <div className="bar"><i style={{ width: '24%' }} /></div>
                  <b>24%</b>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('setup', { subject: 'Physics', chapter: 'Kinematics', topic: 'Units and Dimensions' })}
            className="btn sm mt-4 w-full"
          >
            Continue Practice →
          </button>
        </div>

        {/* Today's Goals Card */}
        <div className="card md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-base">🎯 Set Your Today's Goal</h3>
              <span className="text-xs font-bold text-emerald-600">
                {completedGoals} / {goals.length} Completed
              </span>
            </div>
            <div className="space-y-2">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    g.completed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <button
                    onClick={() => onToggleGoal(g.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      g.completed ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {g.completed && '✓'}
                  </button>
                  <span className={`text-xs font-semibold flex-1 ${g.completed ? 'line-through text-slate-400' : ''}`}>
                    {g.title}
                  </span>
                  {!g.completed && g.navigateTo && (
                    <button
                      onClick={() => onNavigate(g.navigateTo!)}
                      className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold"
                    >
                      Go →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="card">
        <h3 className="font-extrabold text-base mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickAccess.map((q, idx) => (
            <button
              key={idx}
              className="tile items-center p-3 rounded-2xl text-center flex flex-col gap-1 border border-slate-100 dark:border-slate-800"
              style={{ background: q.bg }}
              onClick={() => onNavigate(q.view)}
            >
              <span className="text-2xl">{q.icon}</span>
              <small className="font-extrabold text-slate-900 text-xs">{q.label}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Subject Progress */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-extrabold text-base">Subject Progress</h3>
          <button onClick={() => onNavigate('practice')} className="text-emerald-600 font-bold text-xs hover:underline">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Physics', icon: '⚛️', percent: 62 },
            { name: 'Chemistry', icon: '🧪', percent: 40 },
            { name: 'Botany', icon: '🌿', percent: 30 },
            { name: 'Zoology', icon: '🧬', percent: 50 }
          ].map((s, idx) => (
            <div
              key={idx}
              className="pr cursor-pointer hover:opacity-90"
              onClick={() => onNavigate('chap', { subject: s.name })}
            >
              <span className="w-24 text-xs font-bold">{s.icon} {s.name}</span>
              <div className="bar"><i style={{ width: `${s.percent}%` }} /></div>
              <b className="w-10 text-xs">{s.percent}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

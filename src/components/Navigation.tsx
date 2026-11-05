import React from 'react';
import { UserProfile } from '../types/neetbuddy';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  currentUser: UserProfile | null;
}

export const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'practice', icon: '🎯', label: 'Practice' },
  { id: 'tests', icon: '📝', label: 'Mock Tests' },
  { id: 'perf', icon: '📊', label: 'Performance' },
  { id: 'ib', icon: '📖', label: 'Improvement Book' },
  { id: 'notes', icon: '🔖', label: 'Notes & Bookmarks' },
  { id: 'pyq', icon: '📚', label: 'PYQs' },
  { id: 'dpp', icon: '🗒️', label: 'DPP Practice' },
  { id: 'flash', icon: '🃏', label: 'Flashcards' },
  { id: 'doubt', icon: '💡', label: 'Doubt Solver', badge: 'AI' },
  { id: 'plan', icon: '📅', label: 'Study Plan' },
  { id: 'admin', icon: '🛡️', label: 'Admin CMS', badge: 'CMS' },
  { id: 'more', icon: '⚙️', label: 'Settings & More' }
];

export const MOBILE_TABS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'practice', icon: '🎯', label: 'Practice' },
  { id: 'tests', icon: '📝', label: 'Tests' },
  { id: 'perf', icon: '📊', label: 'Performance' },
  { id: 'admin', icon: '🛡️', label: 'Admin' },
  { id: 'more', icon: '⋯', label: 'More' }
];

export const LogoSvg = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" rx="12" fill="#14a366" />
    <path d="M9 13c4-1.5 8-1 11 1.5 3-2.5 7-3 11-1.5v15c-4-1.5-8-1-11 1.5-3-2.5-7-3-11-1.5z" fill="#fff" />
    <path d="M20 14.5v15" stroke="#14a366" strokeWidth="1.6" fill="none" />
    <path d="M30 6l1 2.4 2.4 1-2.4 1L30 13l-1-2.6-2.4-1 2.4-1z" fill="#ffd36b" />
  </svg>
);

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, currentUser }) => {
  const getActiveTab = (view: string) => {
    if (['setup', 'chap', 'top', 'quiz', 'result', 'review'].includes(view)) return 'practice';
    if (['tl', 'ins'].includes(view)) return 'tests';
    if (['sp', 'weak'].includes(view)) return 'perf';
    if (['ibd'].includes(view)) return 'ib';
    if (['nedit'].includes(view)) return 'notes';
    return view;
  };

  const activeTab = getActiveTab(currentView);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sb hidden md:block">
        <div className="lg cursor-pointer" onClick={() => onNavigate('home')}>
          <LogoSvg />
          <span className="lt">
            NEET<b>Buddy</b>
          </span>
        </div>

        <nav className="flex flex-col gap-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                title={item.label}
                className={`ni ${isActive ? 'on' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <i className="not-italic text-center w-5">{item.icon}</i>
                <span>{item.label}</span>
                {item.badge && <span className="ai-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="qc mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-950 font-bold text-sm leading-tight border border-emerald-200">
          Discipline today.<br />
          Doctor tomorrow.
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bt md:hidden">
        {MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={isActive ? 'on' : ''}
              onClick={() => onNavigate(tab.id)}
            >
              <i className="not-italic text-lg">{tab.icon}</i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

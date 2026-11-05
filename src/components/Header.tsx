import React from 'react';
import { UserProfile } from '../types/neetbuddy';
import { LogoSvg } from './Navigation';

interface HeaderProps {
  currentUser: UserProfile | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: string) => void;
  breadcrumb?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  darkMode,
  onToggleDarkMode,
  onNavigate,
  breadcrumb
}) => {
  const userName = currentUser ? currentUser.fullName : 'Ayush Kumar';
  const initial = userName.trim()[0].toUpperCase();
  const yearText = currentUser ? `NEET ${currentUser.targetYear}` : 'NEET 2027';

  return (
    <div className="w-full">
      <div className="tp">
        <div className="mb flex md:hidden mr-auto items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <LogoSvg />
          <span className="font-extrabold text-lg text-slate-900 dark:text-emerald-50">
            NEET<b className="text-emerald-600 dark:text-emerald-400">Buddy</b>
          </span>
        </div>

        <button
          className="ib-btn"
          aria-label="Toggle dark mode"
          onClick={onToggleDarkMode}
          title="Toggle Dark Mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>

        <button className="ib-btn" aria-label="Notifications" title="Notifications">
          🔔
          <span className="dot" />
        </button>

        <div className="us" onClick={() => onNavigate('more')}>
          <div className="av">{initial}</div>
          <span className="hidden sm:inline">
            <b className="text-xs text-slate-900 dark:text-emerald-100">{userName}</b>
            <small>{yearText}</small>
          </span>
        </div>
      </div>

      {breadcrumb && (
        <div className="text-xs text-slate-500 dark:text-emerald-400 mb-2 font-semibold">
          {breadcrumb}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { WavyHero } from './WavyHero';

interface PerformanceViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <WavyHero
        title="Performance Overview"
        subtitle="Your preparation insights, accuracy trends, and weak area analysis."
        quote="What gets measured gets improved."
      />

      <div className="hg">
        <div className="st s3 bg-emerald-50 dark:bg-emerald-950/40">
          <span className="ic bg-emerald-100 text-emerald-800">🎯</span>
          <span>
            <small>Best Test Score</small>
            <b>640 / 720</b>
          </span>
        </div>
        <div className="st s3 bg-blue-50 dark:bg-blue-950/40">
          <span className="ic bg-blue-100 text-blue-800">📶</span>
          <span>
            <small>Overall Accuracy</small>
            <b>78%</b>
          </span>
        </div>
        <div className="st s3 bg-purple-50 dark:bg-purple-950/40">
          <span className="ic bg-purple-100 text-purple-800">🧱</span>
          <span>
            <small>Questions Attempted</small>
            <b>5,420</b>
          </span>
        </div>
        <div className="st s3 bg-amber-50 dark:bg-amber-950/40">
          <span className="ic bg-amber-100 text-amber-800">🔥</span>
          <span>
            <small>Current Streak</small>
            <b>12 Days</b>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Subject-wise Accuracy */}
        <div className="card">
          <h3 className="font-extrabold text-base mb-3">Subject-wise Accuracy</h3>
          <div className="space-y-3">
            {[
              { name: 'Physics', icon: '⚛️', accuracy: 82 },
              { name: 'Chemistry', icon: '🧪', accuracy: 76 },
              { name: 'Botany', icon: '🌿', accuracy: 78 },
              { name: 'Zoology', icon: '🧬', accuracy: 73 }
            ].map((s, idx) => (
              <div
                key={idx}
                className="pr cursor-pointer"
                onClick={() => onNavigate('sp', { subject: s.name })}
              >
                <span className="w-28 text-xs font-bold">{s.icon} {s.name}</span>
                <div className="bar"><i style={{ width: `${s.accuracy}%` }} /></div>
                <b className="w-12 text-xs">{s.accuracy}%</b>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Trend Chart (SVG Polyline) */}
        <div className="card">
          <h3 className="font-extrabold text-base mb-3">Accuracy Trend (Last 5 Weeks)</h3>
          <svg viewBox="0 0 320 140" className="w-full">
            <line x1="30" x2="300" y1="20" y2="20" stroke="#e2eee7" />
            <line x1="30" x2="300" y1="55" y2="55" stroke="#e2eee7" />
            <line x1="30" x2="300" y1="90" y2="90" stroke="#e2eee7" />
            <path
              d="M30 100 Q80 80 130 85 T230 50 T300 35"
              fill="none"
              stroke="#14a366"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="30" cy="100" r="4" fill="#14a366" />
            <circle cx="130" cy="85" r="4" fill="#14a366" />
            <circle cx="230" cy="50" r="4" fill="#14a366" />
            <circle cx="300" cy="35" r="4" fill="#14a366" />
            <text x="30" y="125" fontSize="10" fill="#62766b">W1 (65%)</text>
            <text x="130" y="125" fontSize="10" fill="#62766b">W3 (72%)</text>
            <text x="300" y="125" fontSize="10" fill="#62766b" textAnchor="end">W5 (82%)</text>
          </svg>
        </div>
      </div>

      {/* Weak Areas Card */}
      <div className="card">
        <h3 className="font-extrabold text-base mb-3">Targeted Weak Areas</h3>
        <div className="space-y-2">
          {[
            { chapter: 'Rotational Motion', subject: 'Physics', accuracy: 58 },
            { chapter: 'Chemical Bonding & Hybridisation', subject: 'Chemistry', accuracy: 62 },
            { chapter: 'Plant Hormones & Growth', subject: 'Botany', accuracy: 61 }
          ].map((w, idx) => (
            <div key={idx} className="row justify-between items-center cursor-default">
              <div className="flex items-center gap-3">
                <span className="n bg-red-100 text-red-600 font-extrabold">!</span>
                <div>
                  <b className="text-sm">{w.chapter}</b>
                  <small className="block text-slate-500">{w.subject}</small>
                </div>
              </div>
              <b className="text-red-600 text-sm font-extrabold">{w.accuracy}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

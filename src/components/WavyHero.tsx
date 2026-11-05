import React from 'react';

interface WavyHeroProps {
  title: string;
  subtitle: string;
  quote?: string;
}

export const TargetSvg = () => (
  <svg className="absolute right-6 top-6 md:top-1/2 md:-translate-y-1/2 w-20 md:w-32 opacity-95 pointer-events-none" viewBox="0 0 120 120">
    <circle cx="60" cy="68" r="46" fill="rgba(255,255,255,0.2)" />
    <circle cx="60" cy="68" r="34" fill="#ffffff" stroke="#ffffff" strokeWidth="8" />
    <circle cx="60" cy="68" r="16" fill="#ffd36b" />
    <path d="M60 68L104 20" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
    <path d="M98 14l10 2-4 10z" fill="#ffffff" />
  </svg>
);

export const WavyHero: React.FC<WavyHeroProps> = ({ title, subtitle, quote }) => {
  return (
    <div className="hero">
      <h1 className="pr-16 md:pr-0">{title}</h1>
      <p className="pr-16 md:pr-0">{subtitle}</p>
      {quote && <div className="qt">💬 {quote}</div>}
      <TargetSvg />
    </div>
  );
};

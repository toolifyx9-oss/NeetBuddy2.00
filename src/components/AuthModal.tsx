import React, { useState } from 'react';
import { UserProfile } from '../types/neetbuddy';
import { LogoSvg } from './Navigation';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onSuccess, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [classLevel, setClassLevel] = useState('Class 12');
  const [targetYear, setTargetYear] = useState('2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!fullName.trim()) return setError('Please enter your full name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
      if (password.length < 6) return setError('Password must be at least 6 characters.');

      setLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, phone, classLevel, targetYear, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onSuccess(data.user);
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) return setError('Please enter your email and password.');

      setLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onSuccess(data.user);
      } catch (err: any) {
        setError(err.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LogoSvg />
            <span className="font-extrabold text-2xl tracking-tight">
              NEET<b>Buddy</b>
            </span>
          </div>
          <h1 className="text-xl font-bold">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p className="text-xs text-emerald-100 mt-1">
            {isSignUp ? 'Start your NEET UG preparation today.' : 'Log in to continue your practice.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold mb-1">Mobile Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Class</label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                >
                  <option>Class 11</option>
                  <option>Class 12</option>
                  <option>Dropper</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">NEET Year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                >
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg hover:shadow-emerald-500/25 transition"
          >
            {loading ? 'Processing…' : isSignUp ? 'Create Account' : 'Log In'}
          </button>

          <div className="text-center text-xs text-slate-500 mt-3">
            {isSignUp ? (
              <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-emerald-600 font-bold underline">Log in</button></span>
            ) : (
              <span>Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-emerald-600 font-bold underline">Sign up</button></span>
            )}
          </div>

          <div className="text-center mt-2">
            <button type="button" onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600">
              ← Back to Landing Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

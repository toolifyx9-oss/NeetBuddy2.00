import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getInitialUrl = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('neetbuddy_supabase_url');
    if (stored && stored.trim()) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase.supabase.co';
};

const getInitialKey = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('neetbuddy_supabase_key');
    if (stored && stored.trim()) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';
};

let clientInstance: SupabaseClient = createClient(getInitialUrl(), getInitialKey());

export const supabase = clientInstance;

export const updateClientSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('neetbuddy_supabase_url', url);
    localStorage.setItem('neetbuddy_supabase_key', key);
  }
  clientInstance = createClient(url, key);
  return clientInstance;
};

export const isSupabaseConfigured = () => {
  const url = getInitialUrl();
  return !!url && !url.includes('placeholder-supabase') && url.startsWith('http');
};

import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL & Anon Key from localStorage or import.meta.env
const getSupabaseConfig = () => {
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_key') : null;

  const url = storedUrl || (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const key = storedKey || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  return { url, key };
};

const { url, key } = getSupabaseConfig();

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key)
  : null;

export const saveSupabaseConfig = (newUrl: string, newKey: string) => {
  localStorage.setItem('supabase_url', newUrl);
  localStorage.setItem('supabase_key', newKey);
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_key');
  window.location.reload();
};

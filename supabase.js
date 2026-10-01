import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from .env or LocalStorage (for dynamic setup from Barista Panel)
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey };
  }

  try {
    const localConfig = localStorage.getItem('scoopmatch_supabase_config');
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key };
      }
    }
  } catch (e) {
    console.error('Error reading Supabase credentials', e);
  }

  return { url: '', key: '' };
}

let supabaseInstance = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (supabaseInstance && currentUrl === url && currentKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key);
    currentUrl = url;
    currentKey = key;
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key);
}

/**
 * Supabase Client - Frontend
 * Cliente singleton de Supabase
 */
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.config';

console.log('Supabase Config:', {
  url: ENV.supabaseUrl,
  key: `${ENV.supabaseAnonKey.substring(0, 20)}...`,
  env: import.meta.env.MODE,
});

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('Supabase client initialized');

// Test de conexión
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error.message);
  } else {
    console.log('Supabase connection test successful');
    console.log('Session:', data.session ? 'Active session found' : 'No active session');
  }
});

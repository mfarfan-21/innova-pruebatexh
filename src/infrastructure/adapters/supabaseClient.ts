/**
 * Supabase Client - Frontend
 * Cliente singleton de Supabase
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? `✅ ${supabaseUrl}` : '❌ Missing',
  key: supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 20)}...` : '❌ Missing',
  env: import.meta.env.MODE,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials not configured. Check your .env file.');
  console.error('Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('✅ Supabase client initialized');

// Test de conexión
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection test successful');
    console.log('Session:', data.session ? 'Active session found' : 'No active session');
  }
});

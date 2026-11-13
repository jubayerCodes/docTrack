import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const secretKey = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl && process.env.DEV_MODE !== 'true') {
  console.warn('⚠️ SUPABASE_URL is not defined in environment variables.');
}

/**
 * Client-facing / Public Supabase client instance using Publishable Key.
 */
export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Privileged Admin Supabase client instance using Secret Key (sb_secret_...).
 * Exclusively used by this backend server for user session verification,
 * user management, role assignments, and bypassing RLS.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  secretKey || publishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

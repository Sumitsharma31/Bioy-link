import { createClient } from '@supabase/supabase-js';

/**
 * WARNING: This client uses the SERVICE_ROLE_KEY which bypasses all RLS policies.
 * ONLY use this in Server Actions or Route Handlers, never on the client.
 */
export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase Admin environment variables.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

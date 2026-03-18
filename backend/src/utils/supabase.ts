import { createClient, SupabaseClient } from '@supabase/supabase-js';
import env from '../config/env';

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_ANON_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );
  }
  return adminClient;
}

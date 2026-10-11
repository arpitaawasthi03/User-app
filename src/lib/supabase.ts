import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration for RoadRider User App.
 *
 * Uses standard Vite public environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)
 *
 * Security:
 * - Only public / anon keys are accepted.
 * - Secret service-role keys and database passwords are never accepted or used here.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

const isPlaceholder = (val: string) =>
  !val ||
  val.includes("your-project") ||
  val.includes("your-publishable") ||
  val.includes("placeholder");

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !isPlaceholder(supabaseUrl) &&
    !isPlaceholder(supabasePublishableKey)
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    "[Supabase] Not initialized. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env to connect."
  );
}

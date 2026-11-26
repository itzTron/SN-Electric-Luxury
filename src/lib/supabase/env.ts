// Server-only. Never import this from a component that can render in the browser.
const env = (key: string): string => (process.env[key] ?? "").trim();

export const supabaseUrl = () => env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
export const supabaseAnonKey = () => env("VITE_SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
export const supabaseSecretKey = () => env("SUPABASE_SECRET_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");

/** The public site and the admin both require at least a URL + publishable key. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

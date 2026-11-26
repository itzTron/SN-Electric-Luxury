import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { deleteCookie, getCookies, setCookie } from "@tanstack/react-start/server";

import { isSupabaseConfigured, supabaseAnonKey, supabaseSecretKey, supabaseUrl } from "./env";

export { isSupabaseConfigured };

const COOKIE_CHUNK = 3180;

/**
 * Per-request client that reads/writes the Supabase auth session through
 * httpOnly cookies. The browser never sees the session token.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) throw new Error("Supabase is not configured (missing URL or publishable key).");

  return createServerClient(url, key, {
    cookies: {
      getAll: () =>
        Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            if (!value) {
              deleteCookie(name, { path: "/" });
              continue;
            }
            setCookie(name, value, {
              ...options,
              path: "/",
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              maxAge: options?.maxAge ?? 60 * 60 * 24 * 7,
            });
          }
        } catch {
          // Called from a read-only context (e.g. a loader). The next action refreshes the session.
        }
      },
    },
  });
}

/** RLS-bound client for public reads. No session, no secret. */
export function anonClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) throw new Error("Supabase is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Bypasses RLS. Only ever call after requireAdmin(). */
export function adminClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseSecretKey();
  if (!url || !key) throw new Error("Supabase secret key is not configured on the server.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type AdminSession = { userId: string; email: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id, email")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (!admin) return null;
    return { userId: data.user.id, email: admin.email as string };
  } catch {
    return null;
  }
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor() {
    super("Sign in as an administrator to continue.");
    this.name = "UnauthorizedError";
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

export { COOKIE_CHUNK };

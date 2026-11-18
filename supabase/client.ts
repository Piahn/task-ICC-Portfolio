import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/database.types";

const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://placeholder.supabase.co";
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

const supabaseUrl = String(rawUrl).replace(/^["']|["']$/g, "").trim();
const supabaseAnonKey = String(rawKey).replace(/^["']|["']$/g, "").trim();

let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export const createClient = () => {
  if (!clientInstance) {
    clientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
};

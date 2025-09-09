import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. Did you forget to provision a database?",
  );
}

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// For compatibility with existing code that expects a db export
export const db = supabase;
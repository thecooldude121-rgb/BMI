import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

// For compatibility with existing code that expects a supabase export
export const supabase = null; // This will need to be properly configured if Supabase features are needed
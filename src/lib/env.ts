import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_APP_NAME: z.string().default("Arjun Automation OS"),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success ? parsed.data : envSchema.parse({});

export const isServer = typeof window === "undefined";

import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_WEBHOOK_URL: z.string().url().optional(),
  
  // Solana
  SOLANA_NETWORK: z.enum(['devnet', 'mainnet-beta']).default('devnet'),
  SOLANA_RPC_URL: z.string().url(),
  REFERRAL_PROGRAM_ID: z.string().min(1),
  OTTO_TOKEN_MINT: z.string().min(1),
  
  // Database
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  REDIS_TOKEN: z.string().optional(),
  
  // Helius
  HELIUS_API_KEY: z.string().min(1),
  
  // API
  API_URL: z.string().url().default('http://localhost:3001'),
  
  // Security
  JWT_SECRET: z.string().min(32),
  
  // App
  APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Development
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>; 
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string(),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default('super-secreto-temporal-en-desarrollo'),
  CLIENT_URL: z.string().default('http://localhost:3000')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = parsed.data

import zod from 'zod'

// Load environment variables
process.loadEnvFile()

// Define environment schema
const envSchema = zod.object({
    NODE_ENV: zod.string().default('development'),
    PORT: zod.string().default('8080'),
    DB_HOST: zod.string().default('localhost'),
    DB_PORT: zod.string().default('5432'),
    DB_USER: zod.string().default('postgres'),
    DB_PASS: zod.string().default('postgres'),
    DB_NAME: zod.string().default('postgres'),
})

export type Env = zod.infer<typeof envSchema>
export const env = envSchema.parse(process.env) as Env

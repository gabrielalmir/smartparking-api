import 'dotenv/config'
import zod from 'zod'

// Define environment schema
const envSchema = zod.object({
    NODE_ENV: zod.string().default('development'),
    PORT: zod.string().default('8080'),
    DATABASE_URL: zod.string().url(),
    MQTT_URL: zod.string().url().default("mqtt://broker.emqx.io"),
})

export type Env = zod.infer<typeof envSchema>
export const env = envSchema.parse(process.env) as Env

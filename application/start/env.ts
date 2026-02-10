import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  PORT: Env.schema.number(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  APP_KEY: Env.schema.string(),
})

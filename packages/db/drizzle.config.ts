import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
  out: './drizzle',
  schema: './src/schema.ts',
  breakpoints: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

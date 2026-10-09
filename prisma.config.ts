import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI does not load Next.js .env.local automatically.
// Preserve shell environment variables, then load local and shared dotenv files.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "pnpm exec tsx prisma/seed.ts",
  },
  datasource: {
    // Use the direct PostgreSQL URL for local migrations.
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/optik_kelilink?schema=public",
  },
});

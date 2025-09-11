// src/server/db/migrate.ts
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/env";
import { db } from "./index";

async function main() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const migrationClient = postgres(env.DATABASE_URL);
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  await migrationClient.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@db/schema";
import * as relations from "@db/relations";
import { mkdirSync } from "fs";
import { dirname } from "path";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    const url = (process.env["DATABASE_URL"] && !process.env["DATABASE_URL"].includes("stub") ? process.env["DATABASE_URL"] : "./data/invite.db").replace(/^file:/, "");
    mkdirSync(dirname(url), { recursive: true });
    const sqlite = new Database(url);
    sqlite.exec(
      "CREATE TABLE IF NOT EXISTS guests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch()))"
    );
    instance = drizzle(sqlite, { schema: fullSchema });
  }
  return instance;
}

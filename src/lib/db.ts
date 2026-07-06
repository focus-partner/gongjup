import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../drizzle/schema";
import path from "path";
import fs from "fs";

// 确保数据目录存在
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 单例模式，避免开发时热重载创建多个连接
const globalForDb = globalThis as unknown as {
  sqliteInstance: Database.Database | undefined;
};

const sqlite =
  globalForDb.sqliteInstance ??
  new Database(path.join(dataDir, "toolstation.db"));

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqliteInstance = sqlite;
}

// 开启 WAL 模式提升并发读取性能
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
export { schema };

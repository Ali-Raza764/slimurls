import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const openDb = async () => {
  return open({
    filename: './urls.db',
    driver: sqlite3.Database
  });
};

// Initialize the database and create the urls table
export const initDb = async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_url TEXT NOT NULL UNIQUE
    );
  `);
  await db.close();
};

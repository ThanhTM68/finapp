import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('fincoin.db');
    await runMigrations(db);
  }
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const applied = await database.getAllAsync<{ name: string }>(
    'SELECT name FROM migrations ORDER BY id ASC',
  );
  const appliedNames = new Set(applied.map((r) => r.name));

  for (const migration of MIGRATIONS) {
    if (!appliedNames.has(migration.name)) {
      await migration.run(database);
      await database.runAsync('INSERT INTO migrations (name) VALUES (?)', [migration.name]);
    }
  }
}

interface Migration {
  name: string;
  run: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

const MIGRATIONS: Migration[] = [
  {
    name: '001_init',
    run: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS wallets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          balance REAL NOT NULL DEFAULT 0,
          color TEXT NOT NULL DEFAULT '#16a34a',
          is_deleted INTEGER NOT NULL DEFAULT 0,
          sync_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          icon TEXT NOT NULL DEFAULT '',
          color TEXT NOT NULL DEFAULT '#16a34a',
          is_default INTEGER NOT NULL DEFAULT 0,
          sync_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          wallet_id TEXT NOT NULL,
          category_id TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          note TEXT NOT NULL DEFAULT '',
          date TEXT NOT NULL,
          is_recurring INTEGER NOT NULL DEFAULT 0,
          recurring_interval TEXT,
          transfer_id TEXT,
          sync_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (wallet_id) REFERENCES wallets(id),
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS budgets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category_id TEXT,
          amount REAL NOT NULL,
          spent REAL NOT NULL DEFAULT 0,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          sync_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          operation TEXT NOT NULL,
          payload TEXT NOT NULL,
          synced INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
    },
  },
  {
    // Adds transfer_id to existing databases that were created without this column.
    // New databases already have the column from 001_init; this is a safe no-op for them.
    name: '002_add_transfer_id',
    run: async (database) => {
      const columns = await database.getAllAsync<{ name: string }>(
        `PRAGMA table_info(transactions)`,
      );
      const hasColumn = columns.some((col) => col.name === 'transfer_id');
      if (!hasColumn) {
        await database.execAsync(`ALTER TABLE transactions ADD COLUMN transfer_id TEXT;`);
      }
    },
  },
];

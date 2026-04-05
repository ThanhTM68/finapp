import { getDb } from './client';

const MIGRATIONS: string[] = [
  // v1 – initial schema
  `
  CREATE TABLE IF NOT EXISTS users_local (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    avatar_url  TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'cash',
    balance     REAL NOT NULL DEFAULT 0,
    color       TEXT NOT NULL DEFAULT '#1DB954',
    icon        TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    deleted_at  TEXT,
    is_deleted  INTEGER NOT NULL DEFAULT 0,
    version     INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    kind        TEXT NOT NULL DEFAULT 'expense',
    icon        TEXT NOT NULL DEFAULT 'tag',
    color       TEXT NOT NULL DEFAULT '#1DB954',
    is_default  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    deleted_at  TEXT,
    is_deleted  INTEGER NOT NULL DEFAULT 0,
    version     INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id           TEXT PRIMARY KEY,
    type         TEXT NOT NULL DEFAULT 'expense',
    amount       REAL NOT NULL,
    note         TEXT,
    date         TEXT NOT NULL,
    wallet_id    TEXT NOT NULL REFERENCES wallets(id),
    category_id  TEXT REFERENCES categories(id),
    to_wallet_id TEXT REFERENCES wallets(id),
    transfer_id  TEXT,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL,
    deleted_at   TEXT,
    is_deleted   INTEGER NOT NULL DEFAULT 0,
    version      INTEGER NOT NULL DEFAULT 1
  );

  CREATE INDEX IF NOT EXISTS idx_transactions_date      ON transactions(date);
  CREATE INDEX IF NOT EXISTS idx_transactions_wallet    ON transactions(wallet_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_category  ON transactions(category_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_transfer  ON transactions(transfer_id);

  CREATE TABLE IF NOT EXISTS budgets (
    id          TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id),
    amount      REAL NOT NULL,
    period      TEXT NOT NULL,
    spent       REAL NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    UNIQUE(category_id, period)
  );

  CREATE TABLE IF NOT EXISTS recurring_rules (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL DEFAULT 'expense',
    amount      REAL NOT NULL,
    category_id TEXT REFERENCES categories(id),
    wallet_id   TEXT NOT NULL REFERENCES wallets(id),
    frequency   TEXT NOT NULL DEFAULT 'monthly',
    start_date  TEXT NOT NULL,
    next_date   TEXT NOT NULL,
    note        TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sync_queue (
    id          TEXT PRIMARY KEY,
    entity      TEXT NOT NULL,
    entity_id   TEXT NOT NULL,
    operation   TEXT NOT NULL,
    payload     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending',
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);

  CREATE TABLE IF NOT EXISTS sync_meta (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budget_alerts (
    id             TEXT PRIMARY KEY,
    budget_id      TEXT NOT NULL REFERENCES budgets(id),
    threshold      REAL NOT NULL,
    triggered_at   TEXT NOT NULL
  );
  `,
];

export async function runMigrations(): Promise<void> {
  const db = getDb();

  // Bootstrap migration table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      applied_at  TEXT NOT NULL
    );
  `);

  const applied = db
    .getAllSync<{ version: number }>('SELECT version FROM _migrations ORDER BY version ASC')
    .map((r) => r.version);

  for (let i = 0; i < MIGRATIONS.length; i++) {
    const version = i + 1;
    if (applied.includes(version)) continue;

    db.withTransactionSync(() => {
      db.execSync(MIGRATIONS[i]);
      db.runSync('INSERT INTO _migrations (version, applied_at) VALUES (?, ?)', [
        version,
        new Date().toISOString(),
      ]);
    });

    console.log(`[DB] Migration v${version} applied`);
  }
}

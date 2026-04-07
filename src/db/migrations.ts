import { getDb } from './client';
import { nowIso } from '../services/utils';

const MIGRATIONS: string[] = [
  // v1 – initial schema
  `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users_local (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    avatar_url  TEXT,
    device_id   TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'cash' CHECK (type IN ('cash','bank','credit','savings','ewallet')),
    balance     REAL NOT NULL DEFAULT 0,
    color       TEXT NOT NULL DEFAULT '#1DB954',
    icon        TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    device_id   TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    deleted_at  TEXT,
    is_deleted  INTEGER NOT NULL DEFAULT 0,
    version     INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_wallets_deleted ON wallets(is_deleted);

  CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    kind        TEXT NOT NULL DEFAULT 'expense' CHECK (kind IN ('income','expense')),
    icon        TEXT NOT NULL DEFAULT 'tag',
    color       TEXT NOT NULL DEFAULT '#1DB954',
    is_default  INTEGER NOT NULL DEFAULT 0,
    device_id   TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    deleted_at  TEXT,
    is_deleted  INTEGER NOT NULL DEFAULT 0,
    version     INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_categories_kind ON categories(kind);

  CREATE TABLE IF NOT EXISTS transactions (
    id           TEXT PRIMARY KEY,
    type         TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income','expense','transfer')),
    amount       REAL NOT NULL CHECK (amount >= 0),
    note         TEXT,
    date         TEXT NOT NULL,
    wallet_id    TEXT NOT NULL REFERENCES wallets(id),
    category_id  TEXT REFERENCES categories(id),
    to_wallet_id TEXT REFERENCES wallets(id),
    transfer_id  TEXT,
    device_id    TEXT,
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
  CREATE INDEX IF NOT EXISTS idx_transactions_deleted   ON transactions(is_deleted);

  CREATE TABLE IF NOT EXISTS budgets (
    id          TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id),
    amount      REAL NOT NULL CHECK (amount >= 0),
    period      TEXT NOT NULL,
    spent       REAL NOT NULL DEFAULT 0 CHECK (spent >= 0),
    device_id   TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL,
    UNIQUE(category_id, period)
  );
  CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period);

  CREATE TABLE IF NOT EXISTS recurring_rules (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL DEFAULT 'expense' CHECK (type IN ('income','expense','transfer')),
    amount      REAL NOT NULL CHECK (amount >= 0),
    category_id TEXT REFERENCES categories(id),
    wallet_id   TEXT NOT NULL REFERENCES wallets(id),
    frequency   TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('daily','weekly','monthly','yearly')),
    start_date  TEXT NOT NULL,
    next_date   TEXT NOT NULL,
    note        TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    device_id   TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_recurring_next_date ON recurring_rules(next_date);

  CREATE TABLE IF NOT EXISTS sync_queue (
    id          TEXT PRIMARY KEY,
    entity      TEXT NOT NULL CHECK (entity IN ('wallet','category','transaction','budget','recurring_rule')),
    entity_id   TEXT NOT NULL,
    operation   TEXT NOT NULL CHECK (operation IN ('create','update','delete')),
    payload     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','syncing','synced','failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    idempotency_key TEXT,
    last_error  TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_queue_idempotency ON sync_queue(idempotency_key);

  CREATE TABLE IF NOT EXISTS sync_meta (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budget_alerts (
    id             TEXT PRIMARY KEY,
    budget_id      TEXT NOT NULL REFERENCES budgets(id),
    threshold      REAL NOT NULL,
    triggered_at   TEXT NOT NULL,
    UNIQUE(budget_id, threshold)
  );

  CREATE TABLE IF NOT EXISTS transfers (
    id             TEXT PRIMARY KEY,
    from_wallet_id TEXT NOT NULL REFERENCES wallets(id),
    to_wallet_id   TEXT NOT NULL REFERENCES wallets(id),
    amount         REAL NOT NULL CHECK (amount >= 0),
    note           TEXT,
    date           TEXT NOT NULL,
    out_tx_id      TEXT UNIQUE REFERENCES transactions(id),
    in_tx_id       TEXT UNIQUE REFERENCES transactions(id),
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(date);
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

  seedInitialData();
}

function seedInitialData(): void {
  const db = getDb();
  const now = nowIso();

  db.withTransactionSync(() => {
    db.runSync(
      `INSERT OR IGNORE INTO users_local (id, name, email, avatar_url, device_id, created_at, updated_at)
       VALUES ('user-local-1', 'Nguyễn Văn A', 'nguyenvana@email.com', NULL, 'local-device', ?, ?)`,
      [now, now],
    );

    db.runSync(
      `INSERT OR IGNORE INTO wallets (id, name, type, balance, color, icon, is_archived, device_id, created_at, updated_at, is_deleted, version)
       VALUES ('wallet-cash-default', 'Tiền mặt', 'cash', 0, '#1DB954', 'cash', 0, 'local-device', ?, ?, 0, 1)`,
      [now, now],
    );

    const categories = [
      ['cat-income-salary', 'Lương', 'income', '💼', '#1DB954', 1],
      ['cat-income-bonus', 'Thưởng', 'income', '🎁', '#4CAF50', 1],
      ['cat-expense-food', 'Ăn uống', 'expense', '🍔', '#FF9800', 1],
      ['cat-expense-transport', 'Di chuyển', 'expense', '🚌', '#2196F3', 1],
      ['cat-expense-shopping', 'Mua sắm', 'expense', '🛒', '#E91E63', 1],
      ['cat-expense-house', 'Nhà cửa', 'expense', '🏠', '#9C27B0', 1],
    ] as const;

    for (const [id, name, kind, icon, color, isDefault] of categories) {
      db.runSync(
        `INSERT OR IGNORE INTO categories
          (id, name, kind, icon, color, is_default, device_id, created_at, updated_at, is_deleted, version)
         VALUES (?, ?, ?, ?, ?, ?, 'local-device', ?, ?, 0, 1)`,
        [id, name, kind, icon, color, isDefault, now, now],
      );
    }

    db.runSync(
      `INSERT OR REPLACE INTO sync_meta (key, value, updated_at) VALUES ('seed_version', 'v1', ?)`,
      [now],
    );
  });
}

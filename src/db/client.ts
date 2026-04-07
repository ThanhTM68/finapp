import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync('fincoin.db');
  }
  return _db;
}

/** Reset singleton – used in tests */
export function resetDb(): void {
  _db = null;
}

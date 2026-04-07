import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from './client';

async function resolveMigrationPath(): Promise<string> {
  const candidates = [
    path.join(__dirname, 'migrations', '001_init.sql'),
    path.join(process.cwd(), 'src', 'db', 'migrations', '001_init.sql'),
  ];

  for (const filePath of candidates) {
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      // continue
    }
  }

  throw new Error('Không tìm thấy migration file 001_init.sql');
}

export async function runMigrations(): Promise<void> {
  const filePath = await resolveMigrationPath();
  const sql = await fs.readFile(filePath, 'utf-8');
  await pool.query(sql);
}

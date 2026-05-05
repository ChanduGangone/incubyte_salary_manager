import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

export function getDatabase(dbPath) {
  if (!dbPath) {
    throw new Error('Database path is required');
  }

  const sqliteModule = process.getBuiltinModule('node:sqlite');

  if (!sqliteModule) {
    throw new Error('node:sqlite is not available in this Node runtime');
  }

  const { DatabaseSync } = sqliteModule;
  const directory = path.dirname(dbPath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const database = new DatabaseSync(dbPath);
  initializeSchema(database);

  return database;
}

function initializeSchema(db) {
  const schema = fs.readFileSync(schemaPath, 'utf8');

  db.exec(schema);
}

export function closeDatabase(database) {
  if (database) {
    database.close();
  }
}

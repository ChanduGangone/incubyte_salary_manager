import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { closeDatabase, getDatabase } from '../../src/db/index.js';

describe('db', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salary-manager-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('opens the database connection', () => {
    const db = getDatabase(path.join(tempDir, 'test.sqlite'));

    expect(db.prepare('SELECT 1 AS ok').get()).toEqual({ ok: 1 });
    closeDatabase(db);
  });

  it('throws when dbPath is missing', () => {
    expect(() => getDatabase()).toThrow('Database path is required');
  });
});

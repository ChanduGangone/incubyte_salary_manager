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
    closeDatabase();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('opens the database connection', () => {
    const dbPath = path.join(tempDir, 'test.sqlite');
    const db = getDatabase(dbPath);

    expect(db.prepare('SELECT 1 AS ok').get()).toEqual({ ok: 1 });
  });
});

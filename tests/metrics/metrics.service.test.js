import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { closeDatabase, getDatabase } from '../../src/db/index.js';
import { createEmployee } from '../../src/employees/employee.repository.js';
import { getSalaryMetricsByCountry } from '../../src/metrics/metrics.service.js';

describe('salary metrics service', () => {
  let tempDir;
  let db;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salary-manager-'));
    db = getDatabase(path.join(tempDir, 'test.sqlite'));
  });

  afterEach(() => {
    closeDatabase();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns min max and average salary for a country', () => {
    createEmployee(db, {
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });
    createEmployee(db, {
      fullName: 'John Doe',
      jobTitle: 'Manager',
      country: 'India',
      salary: 7000
    });
    createEmployee(db, {
      fullName: 'Alice Doe',
      jobTitle: 'Analyst',
      country: 'United States',
      salary: 10000
    });

    expect(getSalaryMetricsByCountry(db, 'India')).toEqual({
      minimumSalary: 5000,
      maximumSalary: 7000,
      averageSalary: 6000
    });
  });

  it('returns undefined when no employees match the country', () => {
    expect(getSalaryMetricsByCountry(db, 'India')).toBeUndefined();
  });
});

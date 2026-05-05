import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { closeDatabase, getDatabase } from '../../src/db/index.js';
import { createEmployee } from '../../src/employees/employee.service.js';

describe('employee service', () => {
  let tempDir;
  let db;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salary-manager-'));
    db = getDatabase(path.join(tempDir, 'employees.sqlite'));
  });

  afterEach(() => {
    closeDatabase();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('validates required employee fields', () => {
    expect(() =>
      createEmployee(db, {
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow('Missing required field: fullName');
  });

  it('throws when jobTitle is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        country: 'India',
        salary: 5000
      })
    ).toThrow('Missing required field: jobTitle');
  });

  it('throws when country is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        salary: 5000
      })
    ).toThrow('Missing required field: country');
  });

  it('throws when salary is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India'
      })
    ).toThrow('Missing required field: salary');
  });

  it('throws when salary is not a number', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 'five thousand'
      })
    ).toThrow('Salary must be a number');
  });

  it('throws when country is not supported', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'Germany',
        salary: 5000
      })
    ).toThrow('Country must be India or United States');
  });

  it('throws when fullName contains invalid characters', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane123',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow('fullName must contain only letters and spaces');
  });

  it('throws when jobTitle contains invalid characters', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Eng1neer',
        country: 'India',
        salary: 5000
      })
    ).toThrow('jobTitle must contain only letters and spaces');
  });

  it('shapes repository errors when the db is missing', () => {
    expect(() =>
      createEmployee(undefined, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow('Unable to create employee');
  });
});

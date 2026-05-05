import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { closeDatabase, getDatabase } from '../../src/db/index.js';
import { createEmployee, deleteEmployee, updateEmployee } from '../../src/employees/employee.service.js';
import { ValidationError } from '../../src/errors/validation-error.js';

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
    ).toThrow(ValidationError);
  });

  it('throws when jobTitle is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        country: 'India',
        salary: 5000
      })
    ).toThrow(ValidationError);
  });

  it('throws when country is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        salary: 5000
      })
    ).toThrow(ValidationError);
  });

  it('throws when salary is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India'
      })
    ).toThrow(ValidationError);
  });

  it('throws when salary is not a number', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 'five thousand'
      })
    ).toThrow(ValidationError);
  });

  it('allows employees from other countries', () => {
    expect(
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'Germany',
        salary: 5000
      })
    ).toMatchObject({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'Germany',
      salary: 5000
    });
  });

  it('throws when fullName contains invalid characters', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane123',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow(ValidationError);
  });

  it('throws when jobTitle contains invalid characters', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Eng1neer',
        country: 'India',
        salary: 5000
      })
    ).toThrow(ValidationError);
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

  it('updates an employee record', () => {
    const createdEmployee = createEmployee(db, {
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });

    const updatedEmployee = updateEmployee(db, createdEmployee.id, {
      fullName: 'Jane Doe',
      jobTitle: 'Senior Engineer',
      country: 'India',
      salary: 6000
    });

    expect(updatedEmployee).toMatchObject({
      id: createdEmployee.id,
      fullName: 'Jane Doe',
      jobTitle: 'Senior Engineer',
      country: 'India',
      salary: 6000
    });
  });

  it('throws when db is missing for updateEmployee', () => {
    expect(() =>
      updateEmployee(undefined, 1, {
        fullName: 'Jane Doe',
        jobTitle: 'Senior Engineer',
        country: 'India',
        salary: 6000
      })
    ).toThrow('Unable to update employee');
  });

  it('deletes an employee record', () => {
    const createdEmployee = createEmployee(db, {
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });

    expect(deleteEmployee(db, createdEmployee.id)).toBe(true);
  });

  it('throws when db is missing for deleteEmployee', () => {
    expect(() => deleteEmployee(undefined, 1)).toThrow('Unable to delete employee');
  });
});

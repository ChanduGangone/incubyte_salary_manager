import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { closeDatabase, getDatabase } from '../../src/db/index.js';
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  updateEmployee
} from '../../src/employees/employee.repository.js';

describe('employee repository', () => {
  let tempDir;
  let db;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salary-manager-'));
    db = getDatabase(path.join(tempDir, 'employees.sqlite'));
  });

  afterEach(() => {
    closeDatabase(db);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates and reads back an employee record', () => {
    const createdEmployee = createEmployee(db, {
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });

    expect(createdEmployee).toMatchObject({
      id: expect.any(Number),
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });
    expect(getEmployeeById(db, createdEmployee.id)).toEqual(createdEmployee);
  });

  it('throws when fullName is missing', () => {
    expect(() =>
      createEmployee(db, {
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow();
  });

  it('throws when jobTitle is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        country: 'India',
        salary: 5000
      })
    ).toThrow();
  });

  it('throws when country is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        salary: 5000
      })
    ).toThrow();
  });

  it('throws when salary is missing', () => {
    expect(() =>
      createEmployee(db, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India'
      })
    ).toThrow();
  });

  it('throws when db is missing for createEmployee', () => {
    expect(() =>
      createEmployee(undefined, {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      })
    ).toThrow();
  });

  it('throws when db is missing for getEmployeeById', () => {
    expect(() => getEmployeeById(undefined, 1)).toThrow();
  });

  it('returns undefined when employee does not exist', () => {
    expect(getEmployeeById(db, 9999)).toBeUndefined();
  });

  it('updates an existing employee record', () => {
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
    expect(getEmployeeById(db, createdEmployee.id)).toEqual(updatedEmployee);
  });

  it('returns undefined when updating a missing employee', () => {
    expect(
      updateEmployee(db, 9999, {
        fullName: 'Jane Doe',
        jobTitle: 'Senior Engineer',
        country: 'India',
        salary: 6000
      })
    ).toBeUndefined();
  });

  it('deletes an existing employee record', () => {
    const createdEmployee = createEmployee(db, {
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });

    expect(deleteEmployee(db, createdEmployee.id)).toBe(true);
    expect(getEmployeeById(db, createdEmployee.id)).toBeUndefined();
  });

  it('returns false when deleting a missing employee', () => {
    expect(deleteEmployee(db, 9999)).toBe(false);
  });
});

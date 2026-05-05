import { jest } from '@jest/globals';

import { ValidationError } from '../../src/errors/validation-error.js';
import { createEmployeeController } from '../../src/employees/employee.controller.js';

describe('employee controller', () => {
  it('creates an employee and responds with 201', () => {
    const employee = {
      id: 1,
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    };
    const service = {
      createEmployee: jest.fn().mockReturnValue(employee)
    };
    const db = {};
    const req = {
      body: {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = createEmployeeController({ db, employeeService: service });
    handler(req, res);

    expect(service.createEmployee).toHaveBeenCalledWith(db, req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(employee);
  });

  it('returns 400 when validation fails', () => {
    const service = {
      createEmployee: jest.fn().mockImplementation(() => {
        throw new ValidationError('Missing required field: fullName');
      })
    };
    const req = {
      body: {
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = createEmployeeController({ db: {}, employeeService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required field: fullName'
    });
  });

  it('returns 500 when the service throws an unexpected error', () => {
    const service = {
      createEmployee: jest.fn().mockImplementation(() => {
        throw new Error('Database connection is required');
      })
    };
    const db = {};
    const req = {
      body: {
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = createEmployeeController({ db, employeeService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });
});

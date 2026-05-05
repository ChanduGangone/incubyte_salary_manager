import { jest } from '@jest/globals';

import { ValidationError } from '../../src/errors/validation-error.js';
import {
  createEmployeeController,
  getEmployeeByIdController,
  listEmployeesController
} from '../../src/employees/employee.controller.js';

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

  it('returns 200 when an employee is found', () => {
    const employee = {
      id: 1,
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    };
    const service = {
      getEmployeeById: jest.fn().mockReturnValue(employee)
    };
    const db = {};
    const req = {
      params: { id: '1' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getEmployeeByIdController({ db, employeeService: service });
    handler(req, res);

    expect(service.getEmployeeById).toHaveBeenCalledWith(db, '1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(employee);
  });

  it('returns 404 when an employee is not found', () => {
    const service = {
      getEmployeeById: jest.fn().mockReturnValue(undefined)
    };
    const db = {};
    const req = {
      params: { id: '999' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getEmployeeByIdController({ db, employeeService: service });
    handler(req, res);

    expect(service.getEmployeeById).toHaveBeenCalledWith(db, '999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Employee not found'
    });
  });

  it('returns 500 when getEmployeeById throws an unexpected error', () => {
    const service = {
      getEmployeeById: jest.fn().mockImplementation(() => {
        throw new Error('Database connection is required');
      })
    };
    const db = {};
    const req = {
      params: { id: '1' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getEmployeeByIdController({ db, employeeService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });

  it('returns 200 with all employees', () => {
    const employees = [
      {
        id: 1,
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'India',
        salary: 5000
      }
    ];
    const service = {
      listEmployees: jest.fn().mockReturnValue(employees)
    };
    const db = {};
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = listEmployeesController({ db, employeeService: service });
    handler(req, res);

    expect(service.listEmployees).toHaveBeenCalledWith(db);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(employees);
  });

  it('returns 500 when listEmployees throws an unexpected error', () => {
    const service = {
      listEmployees: jest.fn().mockImplementation(() => {
        throw new Error('Database connection is required');
      })
    };
    const db = {};
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = listEmployeesController({ db, employeeService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });
});

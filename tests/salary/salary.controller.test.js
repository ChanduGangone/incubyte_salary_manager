import { jest } from '@jest/globals';

import { getSalaryController } from '../../src/salary/salary.controller.js';

describe('salary controller', () => {
  it('returns 200 with salary breakdown', () => {
    const breakdown = {
      grossSalary: 1000,
      deductions: 100,
      netSalary: 900
    };
    const service = {
      getSalaryByEmployeeId: jest.fn().mockReturnValue(breakdown)
    };
    const db = {};
    const req = {
      params: { id: '1' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryController({ db, salaryService: service });
    handler(req, res);

    expect(service.getSalaryByEmployeeId).toHaveBeenCalledWith(db, '1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(breakdown);
  });

  it('returns 404 when employee is not found', () => {
    const service = {
      getSalaryByEmployeeId: jest.fn().mockReturnValue(undefined)
    };
    const db = {};
    const req = {
      params: { id: '99' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryController({ db, salaryService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Employee not found'
    });
  });

  it('returns 500 when the service throws', () => {
    const service = {
      getSalaryByEmployeeId: jest.fn().mockImplementation(() => {
        throw new Error('boom');
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

    const handler = getSalaryController({ db, salaryService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });
});

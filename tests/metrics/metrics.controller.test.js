import { jest } from '@jest/globals';

import {
  getSalaryMetricsByCountryController,
  getSalaryMetricsByJobTitleController
} from '../../src/metrics/metrics.controller.js';

describe('salary metrics controller', () => {
  it('returns 200 with country metrics', () => {
    const metrics = {
      minimumSalary: 5000,
      maximumSalary: 7000,
      averageSalary: 6000
    };
    const service = {
      getSalaryMetricsByCountry: jest.fn().mockReturnValue(metrics)
    };
    const db = {};
    const req = {
      params: { country: 'India' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByCountryController({ db, metricsService: service });
    handler(req, res);

    expect(service.getSalaryMetricsByCountry).toHaveBeenCalledWith(db, 'India');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(metrics);
  });

  it('returns 404 when no employees match the country', () => {
    const service = {
      getSalaryMetricsByCountry: jest.fn().mockReturnValue(undefined)
    };
    const db = {};
    const req = {
      params: { country: 'India' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByCountryController({ db, metricsService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Country not found'
    });
  });

  it('returns 500 when the service throws', () => {
    const service = {
      getSalaryMetricsByCountry: jest.fn().mockImplementation(() => {
        throw new Error('boom');
      })
    };
    const db = {};
    const req = {
      params: { country: 'India' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByCountryController({ db, metricsService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });

  it('returns 200 with job title average salary', () => {
    const metrics = {
      averageSalary: 6000
    };
    const service = {
      getSalaryMetricsByJobTitle: jest.fn().mockReturnValue(metrics)
    };
    const db = {};
    const req = {
      params: { jobTitle: 'Engineer' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByJobTitleController({ db, metricsService: service });
    handler(req, res);

    expect(service.getSalaryMetricsByJobTitle).toHaveBeenCalledWith(db, 'Engineer');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(metrics);
  });

  it('returns 404 when no employees match the job title', () => {
    const service = {
      getSalaryMetricsByJobTitle: jest.fn().mockReturnValue(undefined)
    };
    const db = {};
    const req = {
      params: { jobTitle: 'Engineer' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByJobTitleController({ db, metricsService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Job title not found'
    });
  });

  it('returns 500 when the job title service throws', () => {
    const service = {
      getSalaryMetricsByJobTitle: jest.fn().mockImplementation(() => {
        throw new Error('boom');
      })
    };
    const db = {};
    const req = {
      params: { jobTitle: 'Engineer' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const handler = getSalaryMetricsByJobTitleController({ db, metricsService: service });
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });
});

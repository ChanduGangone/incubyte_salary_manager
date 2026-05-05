import { jest } from '@jest/globals';

import { createEmployeeRoutes } from '../../src/employees/employee.routes.js';

describe('employee routes', () => {
  it('registers employee routes', () => {
    const router = {
      post: jest.fn(),
      get: jest.fn()
    };

    const routes = createEmployeeRoutes({ router });

    expect(routes).toBe(router);
    expect(router.post).toHaveBeenCalled();
    expect(router.get).toHaveBeenCalled();
  });

  it('registers employee list route', () => {
    const router = {
      post: jest.fn(),
      get: jest.fn()
    };

    createEmployeeRoutes({ router });

    expect(router.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(router.get).toHaveBeenCalledWith('/:id', expect.any(Function));
  });
});

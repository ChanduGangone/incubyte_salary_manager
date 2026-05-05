import { jest } from '@jest/globals';

import { createEmployeeRoutes } from '../../src/employees/employee.routes.js';

describe('employee routes', () => {
  it('registers employee routes', () => {
    const router = {
      post: jest.fn(),
    };

    const routes = createEmployeeRoutes({ router });

    expect(routes).toBe(router);
    expect(router.post).toHaveBeenCalled();
  });
});

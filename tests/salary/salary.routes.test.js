import { jest } from '@jest/globals';

import { createSalaryRoutes } from '../../src/salary/salary.routes.js';

describe('salary routes', () => {
  it('registers salary route', () => {
    const router = {
      get: jest.fn()
    };

    const routes = createSalaryRoutes({ router });

    expect(routes).toBe(router);
    expect(router.get).toHaveBeenCalledWith('/:id/salary', expect.any(Function));
  });
});

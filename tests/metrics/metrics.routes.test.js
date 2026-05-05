import { jest } from '@jest/globals';

import { createMetricsRoutes } from '../../src/metrics/metrics.routes.js';

describe('salary metrics routes', () => {
  it('registers country and job title metrics routes', () => {
    const router = {
      get: jest.fn()
    };

    const routes = createMetricsRoutes({ router });

    expect(routes).toBe(router);
    expect(router.get).toHaveBeenCalledWith('/country/:country', expect.any(Function));
    expect(router.get).toHaveBeenCalledWith('/job-title/:jobTitle', expect.any(Function));
  });
});

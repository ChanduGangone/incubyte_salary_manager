import { getSalaryMetricsByCountryController } from './metrics.controller.js';

export function createMetricsRoutes({ router, db, metricsService }) {
  const getCountryMetrics = getSalaryMetricsByCountryController({ db, metricsService });

  router.get('/country/:country', getCountryMetrics);

  return router;
}

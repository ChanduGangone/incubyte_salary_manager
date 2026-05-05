import {
  getSalaryMetricsByCountryController,
  getSalaryMetricsByJobTitleController
} from './metrics.controller.js';

export function createMetricsRoutes({ router, db, metricsService }) {
  const getCountryMetrics = getSalaryMetricsByCountryController({ db, metricsService });
  const getJobTitleMetrics = getSalaryMetricsByJobTitleController({ db, metricsService });

  router.get('/country/:country', getCountryMetrics);
  router.get('/job-title/:jobTitle', getJobTitleMetrics);

  return router;
}

function isNotFoundResult(result) {
  return result === undefined;
}

export function getSalaryMetricsByCountryController({ db, metricsService }) {
  return function getSalaryMetricsByCountry(req, res) {
    try {
      const metrics = metricsService.getSalaryMetricsByCountry(db, req.params.country);

      if (isNotFoundResult(metrics)) {
        return res.status(404).json({ error: 'Country not found' });
      }

      return res.status(200).json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function getSalaryMetricsByJobTitleController({ db, metricsService }) {
  return function getSalaryMetricsByJobTitle(req, res) {
    try {
      const metrics = metricsService.getSalaryMetricsByJobTitle(db, req.params.jobTitle);

      if (isNotFoundResult(metrics)) {
        return res.status(404).json({ error: 'Job title not found' });
      }

      return res.status(200).json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

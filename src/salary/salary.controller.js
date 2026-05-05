export function getSalaryController({ db, salaryService }) {
  return function getSalary(req, res) {
    try {
      const breakdown = salaryService.getSalaryByEmployeeId(db, req.params.id);

      if (!breakdown) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      return res.status(200).json(breakdown);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

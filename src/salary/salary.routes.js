import { getSalaryController } from './salary.controller.js';

export function createSalaryRoutes({ router, db, salaryService }) {
  const getSalary = getSalaryController({ db, salaryService });

  router.get('/:id/salary', getSalary);

  return router;
}

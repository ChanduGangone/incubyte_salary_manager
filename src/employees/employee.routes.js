import { createEmployeeController } from './employee.controller.js';

export function createEmployeeRoutes({ router, db, employeeService }) {
  const createEmployee = createEmployeeController({ db, employeeService });

  router.post('/', createEmployee);

  return router;
}

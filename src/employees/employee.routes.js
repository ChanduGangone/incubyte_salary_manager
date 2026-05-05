import { createEmployeeController, getEmployeeByIdController } from './employee.controller.js';

export function createEmployeeRoutes({ router, db, employeeService }) {
  const createEmployee = createEmployeeController({ db, employeeService });
  const getEmployeeById = getEmployeeByIdController({ db, employeeService });

  router.post('/', createEmployee);
  router.get('/:id', getEmployeeById);

  return router;
}

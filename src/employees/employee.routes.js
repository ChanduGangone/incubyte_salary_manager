import { createEmployeeController, getEmployeeByIdController, listEmployeesController } from './employee.controller.js';

export function createEmployeeRoutes({ router, db, employeeService }) {
  const createEmployee = createEmployeeController({ db, employeeService });
  const getEmployeeById = getEmployeeByIdController({ db, employeeService });
  const listEmployees = listEmployeesController({ db, employeeService });

  router.post('/', createEmployee);
  router.get('/', listEmployees);
  router.get('/:id', getEmployeeById);

  return router;
}

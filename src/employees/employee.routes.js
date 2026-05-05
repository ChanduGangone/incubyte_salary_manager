import {
  createEmployeeController,
  deleteEmployeeController,
  getEmployeeByIdController,
  listEmployeesController,
  updateEmployeeController
} from './employee.controller.js';

export function createEmployeeRoutes({ router, db, employeeService }) {
  const createEmployee = createEmployeeController({ db, employeeService });
  const getEmployeeById = getEmployeeByIdController({ db, employeeService });
  const listEmployees = listEmployeesController({ db, employeeService });
  const updateEmployee = updateEmployeeController({ db, employeeService });
  const deleteEmployee = deleteEmployeeController({ db, employeeService });

  router.post('/', createEmployee);
  router.get('/', listEmployees);
  router.get('/:id', getEmployeeById);
  router.put('/:id', updateEmployee);
  router.delete('/:id', deleteEmployee);

  return router;
}

import { ValidationError } from '../errors/validation-error.js';

export function createEmployeeController({ db, employeeService }) {
  return function createEmployee(req, res) {
    try {
      const employee = employeeService.createEmployee(db, req.body);

      return res.status(201).json(employee);
    } catch (error) {
      if (isValidationError(error)) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function getEmployeeByIdController({ db, employeeService }) {
  return function getEmployeeById(req, res) {
    try {
      const employee = employeeService.getEmployeeById(db, req.params.id);

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function listEmployeesController() {
  return undefined;
}

function isValidationError(error) {
  return error instanceof ValidationError;
}

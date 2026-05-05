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

function isValidationError(error) {
  return error instanceof ValidationError;
}

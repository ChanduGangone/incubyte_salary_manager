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

export function listEmployeesController({ db, employeeService }) {
  return function listEmployees(req, res) {
    try {
      const employees = employeeService.listEmployees(db);

      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function updateEmployeeController({ db, employeeService }) {
  return function updateEmployee(req, res) {
    try {
      const employee = employeeService.updateEmployee(db, req.params.id, req.body);

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      return res.status(200).json(employee);
    } catch (error) {
      if (isValidationError(error)) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function deleteEmployeeController({ db, employeeService }) {
  return function deleteEmployee(req, res) {
    try {
      const deleted = employeeService.deleteEmployee(db, req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

function isValidationError(error) {
  return error instanceof ValidationError;
}

import {
  createEmployee as createEmployeeRecord,
  getEmployeeById as getEmployeeByIdRecord,
  listEmployees as listEmployeesRecord,
  updateEmployee as updateEmployeeRecord,
  deleteEmployee as deleteEmployeeRecord
} from './employee.repository.js';
import { normalizeEmployeeInput } from './employee.utils.js';
import { ValidationError } from '../errors/validation-error.js';

const REQUIRED_FIELDS = ['fullName', 'jobTitle', 'country', 'salary'];
const NAME_PATTERN = /^[A-Za-z ]+$/;

function validateRequiredFields(employee) {
  for (const field of REQUIRED_FIELDS) {
    if (employee?.[field] === undefined || employee?.[field] === null) {
      throw new ValidationError(`Missing required field: ${field}`);
    }
  }
}

function validateEmployee(employee) {
  validateRequiredFields(employee);

  const normalizedEmployee = normalizeEmployeeInput(employee);

  if (typeof normalizedEmployee.salary !== 'number' || Number.isNaN(normalizedEmployee.salary)) {
    throw new ValidationError('Salary must be a number');
  }

  if (!NAME_PATTERN.test(normalizedEmployee.fullName)) {
    throw new ValidationError('fullName must contain only letters and spaces');
  }

  if (!NAME_PATTERN.test(normalizedEmployee.jobTitle)) {
    throw new ValidationError('jobTitle must contain only letters and spaces');
  }

  return normalizedEmployee;
}

export function createEmployee(db, employee) {
  const normalizedEmployee = validateEmployee(employee);

  if (!db) {
    throw new Error('Unable to create employee');
  }

  try {
    return createEmployeeRecord(db, normalizedEmployee);
  } catch (error) {
    throw new Error('Unable to create employee');
  }
}

export function getEmployeeById(db, id) {
  if (!db) {
    throw new Error('Unable to fetch employee');
  }

  return getEmployeeByIdRecord(db, id);
}

export function listEmployees(db, filters = {}) {
  if (!db) {
    throw new Error('Unable to fetch employees');
  }

  return listEmployeesRecord(db, filters);
}

export function updateEmployee(db, id, employee) {
  if (!db) {
    throw new Error('Unable to update employee');
  }

  const normalizedEmployee = validateEmployee(employee);

  return updateEmployeeRecord(db, id, normalizedEmployee);
}

export function deleteEmployee(db, id) {
  if (!db) {
    throw new Error('Unable to delete employee');
  }

  return deleteEmployeeRecord(db, id);
}

import { createEmployee as createEmployeeRecord, getEmployeeById as getEmployeeByIdRecord } from './employee.repository.js';
import { normalizeEmployeeInput } from './employee.utils.js';

const REQUIRED_FIELDS = ['fullName', 'jobTitle', 'country', 'salary'];
const COUNTRY_PATTERN = /^(india|united states)$/i;
const NAME_PATTERN = /^[A-Za-z ]+$/;

function validateRequiredFields(employee) {
  for (const field of REQUIRED_FIELDS) {
    if (employee?.[field] === undefined || employee?.[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

function validateEmployee(employee) {
  validateRequiredFields(employee);

  const normalizedEmployee = normalizeEmployeeInput(employee);

  if (typeof normalizedEmployee.salary !== 'number' || Number.isNaN(normalizedEmployee.salary)) {
    throw new Error('Salary must be a number');
  }

  if (!COUNTRY_PATTERN.test(normalizedEmployee.country)) {
    throw new Error('Country must be India or United States');
  }

  if (!NAME_PATTERN.test(normalizedEmployee.fullName)) {
    throw new Error('fullName must contain only letters and spaces');
  }

  if (!NAME_PATTERN.test(normalizedEmployee.jobTitle)) {
    throw new Error('jobTitle must contain only letters and spaces');
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

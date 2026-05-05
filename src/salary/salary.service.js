import { getEmployeeById as getEmployeeByIdRecord } from '../employees/employee.repository.js';

export function calculateSalary({ country, salary }) {
  const normalizedCountry = String(country || '').trim().toLowerCase();
  const grossSalary = salary;

  let deductionRate = 0;

  if (normalizedCountry === 'india') {
    deductionRate = 0.1;
  } else if (normalizedCountry === 'united states') {
    deductionRate = 0.12;
  }

  const deductions = grossSalary * deductionRate;

  return {
    grossSalary,
    deductions,
    netSalary: grossSalary - deductions
  };
}

export function getSalaryByEmployeeId(db, id) {
  if (!db) {
    throw new Error('Database connection is required');
  }

  const employee = getEmployeeByIdRecord(db, id);

  if (!employee) {
    return undefined;
  }

  return calculateSalary({
    country: employee.country,
    salary: employee.salary
  });
}

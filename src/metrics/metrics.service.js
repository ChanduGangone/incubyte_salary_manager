import { listEmployees } from '../employees/employee.repository.js';

function assertDatabase(db) {
  if (!db) {
    throw new Error('Database connection is required');
  }
}

function normalizeCountry(country) {
  return String(country || '').trim().toLowerCase();
}

export function getSalaryMetricsByCountry(db, country) {
  assertDatabase(db);

  const targetCountry = normalizeCountry(country);
  const employees = listEmployees(db);
  const matchingEmployees = employees.filter((employee) => normalizeCountry(employee.country) === targetCountry);

  if (matchingEmployees.length === 0) {
    return undefined;
  }

  const salaries = matchingEmployees.map((employee) => employee.salary);
  const totalSalary = salaries.reduce((sum, salary) => sum + salary, 0);

  return {
    minimumSalary: Math.min(...salaries),
    maximumSalary: Math.max(...salaries),
    averageSalary: totalSalary / salaries.length
  };
}

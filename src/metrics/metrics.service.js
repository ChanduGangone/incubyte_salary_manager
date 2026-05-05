import { listEmployees } from '../employees/employee.repository.js';

function assertDatabase(db) {
  if (!db) {
    throw new Error('Database connection is required');
  }
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function getSalaryMetricsByCountry(db, country) {
  assertDatabase(db);

  const targetCountry = normalizeText(country);
  const employees = listEmployees(db);
  const matchingEmployees = employees.filter((employee) => normalizeText(employee.country) === targetCountry);

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

export function getSalaryMetricsByJobTitle(db, jobTitle) {
  assertDatabase(db);

  const targetJobTitle = normalizeText(jobTitle);
  const employees = listEmployees(db);
  const matchingEmployees = employees.filter((employee) => normalizeText(employee.jobTitle) === targetJobTitle);

  if (matchingEmployees.length === 0) {
    return undefined;
  }

  const salaries = matchingEmployees.map((employee) => employee.salary);
  const totalSalary = salaries.reduce((sum, salary) => sum + salary, 0);

  return {
    averageSalary: totalSalary / salaries.length
  };
}

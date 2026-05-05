const REQUIRED_FIELDS = ['fullName', 'jobTitle', 'country', 'salary'];

function assertDatabase(db) {
  if (!db) {
    throw new Error('Database connection is required');
  }
}

function assertEmployeeInput(employee) {
  for (const field of REQUIRED_FIELDS) {
    if (employee?.[field] === undefined || employee?.[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

function mapRowToEmployee(row) {
  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    jobTitle: row.job_title,
    country: row.country,
    salary: row.salary
  };
}

function mapRowsToEmployees(rows) {
  return rows.map(mapRowToEmployee);
}

export function createEmployee(db, employee) {
  assertDatabase(db);
  assertEmployeeInput(employee);

  const statement = db.prepare(
    `INSERT INTO employees (full_name, job_title, country, salary)
     VALUES (?, ?, ?, ?)`
  );

  const result = statement.run(
    employee.fullName,
    employee.jobTitle,
    employee.country,
    employee.salary
  );

  return getEmployeeById(db, Number(result.lastInsertRowid));
}

export function getEmployeeById(db, id) {
  assertDatabase(db);

  const row = db
    .prepare(
      `SELECT id, full_name, job_title, country, salary
       FROM employees
       WHERE id = ?`
    )
    .get(id);

  return mapRowToEmployee(row);
}

export function listEmployees(db) {
  assertDatabase(db);

  const rows = db
    .prepare(
      `SELECT id, full_name, job_title, country, salary
       FROM employees
       ORDER BY id ASC`
    )
    .all();

  return mapRowsToEmployees(rows);
}

export function updateEmployee() {
  return undefined;
}

export function deleteEmployee() {
  return undefined;
}

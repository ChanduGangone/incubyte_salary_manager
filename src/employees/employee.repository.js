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

function mapUpdateArgs(employee) {
  return [
    employee.fullName,
    employee.jobTitle,
    employee.country,
    employee.salary
  ];
}

function normalizeFilterValue(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return normalizeFilterValue(value[0]);
  }

  const normalizedValue = String(value).trim();

  return normalizedValue === '' ? undefined : normalizedValue;
}

function buildListEmployeesQuery(filters = {}) {
  const clauses = [];
  const params = [];

  const fullName = normalizeFilterValue(filters.fullName);
  if (fullName !== undefined) {
    clauses.push('LOWER(TRIM(full_name)) = LOWER(TRIM(?))');
    params.push(fullName);
  }

  const jobTitle = normalizeFilterValue(filters.jobTitle);
  if (jobTitle !== undefined) {
    clauses.push('LOWER(TRIM(job_title)) = LOWER(TRIM(?))');
    params.push(jobTitle);
  }

  const country = normalizeFilterValue(filters.country);
  if (country !== undefined) {
    clauses.push('LOWER(TRIM(country)) = LOWER(TRIM(?))');
    params.push(country);
  }

  const salary = normalizeFilterValue(filters.salary);
  if (salary !== undefined) {
    clauses.push('salary = ?');
    params.push(salary);
  }

  const whereClause = clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '';

  return {
    query: `SELECT id, full_name, job_title, country, salary
       FROM employees${whereClause}
       ORDER BY id ASC`,
    params
  };
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

export function listEmployees(db, filters = {}) {
  assertDatabase(db);

  const { query, params } = buildListEmployeesQuery(filters);
  const rows = db.prepare(query).all(...params);

  return mapRowsToEmployees(rows);
}

export function updateEmployee(db, id, employee) {
  assertDatabase(db);
  assertEmployeeInput(employee);

  const statement = db.prepare(
    `UPDATE employees
     SET full_name = ?, job_title = ?, country = ?, salary = ?
     WHERE id = ?`
  );

  const result = statement.run(...mapUpdateArgs(employee), id);

  if (result.changes === 0) {
    return undefined;
  }

  return getEmployeeById(db, id);
}

export function deleteEmployee(db, id) {
  assertDatabase(db);

  const statement = db.prepare(`DELETE FROM employees WHERE id = ?`);
  const result = statement.run(id);

  return result.changes > 0;
}

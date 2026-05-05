export function createEmployeeController({ db, employeeService }) {
  return function createEmployee(req, res) {
    const employee = employeeService.createEmployee(db, req.body);

    return res.status(201).json(employee);
  };
}

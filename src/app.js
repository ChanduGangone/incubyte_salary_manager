import express from 'express';

import { getDatabase } from './db/index.js';
import { createEmployeeRoutes } from './employees/employee.routes.js';
import * as employeeService from './employees/employee.service.js';

export function createApp({ db = getDatabase() } = {}) {
  const app = express();

  app.use(express.json());
  app.use('/employees', createEmployeeRoutes({ router: express.Router(), db, employeeService }));

  return app;
}

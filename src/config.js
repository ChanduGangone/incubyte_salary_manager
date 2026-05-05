import path from 'node:path';

function parsePort(portValue) {
  if (portValue === undefined || portValue === '') {
    return 3000;
  }

  const port = Number(portValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Invalid PORT value');
  }

  return port;
}

export function getConfig(env = process.env) {
  return {
    port: parsePort(env.PORT),
    databasePath: env.DATABASE_PATH || path.join(process.cwd(), 'data', 'salary-manager.sqlite')
  };
}

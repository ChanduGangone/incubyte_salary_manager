import { getConfig } from '../src/config.js';

describe('config', () => {
  it('uses default port and database path when env is missing', () => {
    const config = getConfig({});

    expect(config).toEqual({
      port: 3000,
      databasePath: expect.stringContaining('data/salary-manager.sqlite')
    });
  });

  it('reads port and database path from env', () => {
    const config = getConfig({
      PORT: '4000',
      DATABASE_PATH: '/tmp/test.sqlite'
    });

    expect(config).toEqual({
      port: 4000,
      databasePath: '/tmp/test.sqlite'
    });
  });

  it('throws when PORT is not a valid number', () => {
    expect(() => {
      getConfig({
        PORT: 'abc'
      });
    }).toThrow('Invalid PORT value');
  });

  it('throws when PORT is out of range', () => {
    expect(() => {
      getConfig({
        PORT: '70000'
      });
    }).toThrow('Invalid PORT value');
  });
});

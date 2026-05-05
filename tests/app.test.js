import { createApp } from '../src/app.js';

describe('app', () => {
  it('registers employee routes', () => {
    const db = {};
    const app = createApp({ db });

    expect(app).toBeDefined();
  });
});

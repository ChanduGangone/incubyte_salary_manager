import { normalizeEmployeeInput } from '../../src/employees/employee.utils.js';

describe('employee utils', () => {
  it('normalizes employee input', () => {
    expect(
      normalizeEmployeeInput({
        fullName: '  Jane Doe  ',
        jobTitle: '  Engineer  ',
        country: '  India  ',
        salary: 5000
      })
    ).toEqual({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'India',
      salary: 5000
    });
  });
});

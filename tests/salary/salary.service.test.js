import { calculateSalary } from '../../src/salary/salary.service.js';

describe('salary service', () => {
  it('calculates 10 percent TDS for India', () => {
    expect(
      calculateSalary({
        country: 'India',
        salary: 1000
      })
    ).toEqual({
      grossSalary: 1000,
      deductions: 100,
      netSalary: 900
    });
  });

  it('calculates 12 percent TDS for United States', () => {
    expect(
      calculateSalary({
        country: 'United States',
        salary: 1000
      })
    ).toEqual({
      grossSalary: 1000,
      deductions: 120,
      netSalary: 880
    });
  });

  it('applies no deductions for other countries', () => {
    expect(
      calculateSalary({
        country: 'Germany',
        salary: 1000
      })
    ).toEqual({
      grossSalary: 1000,
      deductions: 0,
      netSalary: 1000
    });
  });
});

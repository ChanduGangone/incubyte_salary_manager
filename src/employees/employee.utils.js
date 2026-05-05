function normalizeText(value) {
  return String(value || '').trim();
}

export function normalizeEmployeeInput(employee) {
  return {
    fullName: normalizeText(employee?.fullName),
    jobTitle: normalizeText(employee?.jobTitle),
    country: normalizeText(employee?.country),
    salary: employee?.salary
  };
}

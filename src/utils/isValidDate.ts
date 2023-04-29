/**
 * Checks if a given value is a valid Date object.
 *
 * @param date - The value to check.
 * @returns True if the value is a valid Date object, false otherwise.
 */
export function isValidDate(date: unknown): date is Date {
  if (!(date instanceof Date)) {
    return false;
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
}

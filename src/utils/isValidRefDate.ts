import { isValidDate } from './isValidDate';
import { isValidDateTime } from './isValidDateTime';

/**
 * Checks if a given value is a valid reference date.
 *
 * @remarks A reference date can be either a `Date` object or a `DateTime` object.
 * @param refDate - The value to check.
 * @returns True if the value is a valid reference date, false otherwise.
 */
export function isValidRefDate(refDate: unknown): boolean {
  if (isValidDate(refDate) || isValidDateTime(refDate)) {
    return true;
  } else {
    return false;
  }
}

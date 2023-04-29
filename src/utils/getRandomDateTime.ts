import { DateTime } from 'luxon';

/**
 * Returns a random luxon DateTime object within a given range.
 *
 * @param start - The start of the range (default start of time epoch).
 * @param end - The end of the range (default 31.12.2100).
 * @returns A random date.
 * @throws Error if the start or end date are invalid or if the start date is after the end date.
 */
export function getRandomDateTime(
  start: DateTime = DateTime.fromMillis(0),
  end: DateTime = DateTime.fromISO('2100-12-31')
): DateTime {
  if (!start.isValid || !end.isValid) {
    throw new Error('Invalid start or end date');
  }
  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }

  const randomMillis =
    start.toMillis() + Math.random() * (end.toMillis() - start.toMillis());

  const randomDate = DateTime.fromMillis(randomMillis);

  return randomDate;
}

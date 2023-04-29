import { Duration, DurationUnit } from 'luxon';

export const durationUnitKeys: DurationUnit[] = [
  'day',
  'days',
  'hour',
  'hours',
  'millisecond',
  'milliseconds',
  'minute',
  'minutes',
  'month',
  'months',
  'quarter',
  'quarters',
  'second',
  'seconds',
  'week',
  'weeks',
  'year',
  'years',
];

/**
 * Checks if a given value is a valid DurationUnit.
 *
 * A DurationUnit is a string that represents a unit of time, such as
 * 'years', 'months', 'days', etc.
 * @param timeUnit - The value to check.
 * @returns A boolean value indicating whether the value is a valid DurationUnit.
 * Also acts as a type guard, narrowing the type of the value to DurationUnit if true.
 */
export function isValidTimeUnit(timeUnit: unknown): timeUnit is DurationUnit {
  if (typeof timeUnit !== 'string') {
    return false;
  } else {
    try {
      const duration = Duration.fromObject({ [timeUnit]: 1 });
      return duration.isValid;
    } catch (error) {
      return false;
    }
  }
}

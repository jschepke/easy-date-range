import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { isValidDateTime } from '../../src/utils/isValidDateTime';

describe('isValidDateTime', () => {
  it('returns true for valid DateTime', () => {
    const date = DateTime.local(2022, 1, 1);
    const result = isValidDateTime(date);
    expect(result).toBe(true);
  });

  it('returns false for invalid DateTime', () => {
    const date = DateTime.fromObject({ year: 2022, month: 13, day: 32 });
    const result = isValidDateTime(date);
    expect(result).toBe(false);
  });

  it('returns false for non-DateTime object', () => {
    const date = new Date('2022-01-01');
    const result = isValidDateTime(date);
    expect(result).toBe(false);
  });

  it('returns false for null', () => {
    const date = null;
    const result = isValidDateTime(date);
    expect(result).toBe(false);
  });

  it('returns false for undefined', () => {
    const date = undefined;
    const result = isValidDateTime(date);
    expect(result).toBe(false);
  });
});

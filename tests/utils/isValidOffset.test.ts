import { describe, expect, test } from 'vitest';

import { isValidOffset } from '../../src/utils/isValidOffset';

describe('isValidOffset', () => {
  describe('Given a valid values', () => {
    const validValues = [0, 1, 123, 10000];

    test.each(validValues)('returns true for %j', (value) => {
      expect(isValidOffset(value)).toBe(true);
    });
  });
  describe('Given a non-valid values', () => {
    const invalidValues = [
      null,
      undefined,
      NaN,
      Infinity,
      -1,
      0.5,
      1.5,
      '10',
      true,
      [],
      {},
    ];

    test.each(invalidValues)('returns false for %j', (value) => {
      expect(isValidOffset(value)).toBe(false);
    });
  });
});

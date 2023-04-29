import { describe, expect, test } from "vitest";

import { DateRange } from "../src/dateRange";

describe.todo("eachDayOfMonth", () => {
	test("should not throw error", () => {
		const dateRange = new DateRange();
		dateRange.eachDayOfMonth();
		// dateRange.eachDayOfMonth('test');
		// dateRange.eachDayOfMonth({ refDate: 'test' });
		dateRange.eachDayOfMonth();

		// console.log(dateRange.eachDayOfWeek());
		// expect(dateRange.eachDayOfWeek()).toThrow();
		expect(dateRange.eachDayOfWeek()).toBeInstanceOf(DateRange);
		expect(dateRange.eachDayOfMonth()).toBeInstanceOf(DateRange);
	});

	/* describe.skip('Input validation', () => {
    test('should throw error if refDate is invalid', () => {
      const dateRange = new DateRange();
      expect(() =>
        // @ts-expect-error: testing invalid inputs
        dateRange.eachDayOfMonth({ refDate: 'test' })
      ).toThrowError();
      // @ts-expect-error: testing invalid inputs
      expect(() => dateRange.eachDayOfMonth({ refDate: 1 })).toThrowError();
    });

    test('should throw error if refWeekday is invalid', () => {
      const dateRange = new DateRange();
      expect(() =>
        // @ts-expect-error: testing invalid inputs
        dateRange.eachDayOfMonth({ refWeekday: 'test' })
      ).toThrowError();
      expect(() =>
        // @ts-expect-error: testing invalid inputs
        dateRange.eachDayOfMonth({ refWeekday: 0 })
      ).toThrowError();
      expect(() =>
        // @ts-expect-error: testing invalid inputs
        dateRange.eachDayOfMonth({ refWeekday: 8 })
      ).toThrowError();
    });

    test('should not throw error if refDate is valid JS Date', () => {
      const dateRange = new DateRange();
      expect(() =>
        dateRange.eachDayOfMonth({ refDate: new Date() })
      ).not.toThrowError();
    });
  }); */
});

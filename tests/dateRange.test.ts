import { afterEach, describe, expect, it, test, vi } from "vitest";

import { DateRange } from "../src/dateRange";
import { DateTime } from "luxon";

import { WEEKDAY } from "../src/constants";
import { weekdayTestValues } from "./testUtils";

describe("dateRange", () => {
	afterEach(() => {
		// restoring date after each test run
		vi.useRealTimers();
	});

	describe("Instance", () => {
		it("should throw an error if any parameters are passed to the constructor", () => {
			// @ts-expect-error: testing invalid input
			expect(() => new DateRange("2022-01-01")).toThrowError();
		});

		it("should create a DateRange instance", () => {
			const dateRange = new DateRange();
			expect(dateRange).toBeInstanceOf(DateRange);
		});

		it("should create a DateRange instance with refDate as current time", () => {
			// mock current time
			// date from milliseconds, toISOString: 2023-04-30T10:36:30.504Z
			const date = new Date(1682850990504);
			vi.setSystemTime(date);

			const dateRange = new DateRange();
			expect(dateRange.refDate.valueOf()).toEqual(date.getTime());
		});

		it("should create a DateRange instance with empty dates array", () => {
			const dateRange = new DateRange();
			expect(dateRange.dates).toEqual([]);
		});

		it("should create a DateRange instance with refWeekday equal to 1 (1 for Monday)", () => {
			const dateRange = new DateRange();
			// with use of WEEKDAY enum
			expect(dateRange.refWeekday).toEqual(WEEKDAY.Monday);
			// with a number
			expect(dateRange.refWeekday).toEqual(1);
		});
	});

	describe("Utility methods", () => {
		describe("isValidRefDate", () => {
			test("returns true for valid Date or DateTime objects", () => {
				const dateRange = new DateRange();
				const date = new Date();

				const dateTime = DateTime.now();
				expect(dateRange.isValidRefDate(date)).toBe(true);
				expect(dateRange.isValidRefDate(dateTime)).toBe(true);
			});

			test("returns false for invalid Date or DateTime objects or other types of values", () => {
				const dateRange = new DateRange();
				const invalidDate = new Date("invalid");
				const invalidDateTime = DateTime.invalid("invalid");
				const values = [null, undefined, "string", 123, true, {}, []];
				expect(dateRange.isValidRefDate(invalidDate)).toBe(false);
				expect(dateRange.isValidRefDate(invalidDateTime)).toBe(false);
				for (const value of values) {
					expect(dateRange.isValidRefDate(value)).toBe(false);
				}
			});
		});

		describe("isValidRefWeekday", () => {
			const dateRange = new DateRange();

			describe("with a valid weekday value", () => {
				test.each(weekdayTestValues.valid)(
					"returns true for value: %d",
					(value) => {
						expect(dateRange.isValidRefWeekday(value)).toBe(true);
					},
				);
			});

			describe("with an invalid weekday value", () => {
				test.each(weekdayTestValues.invalid)(
					"returns false for value: $name",
					({ value }) => {
						expect(dateRange.isValidRefWeekday(value)).toBe(false);
					},
				);
			});
		});
	});
});

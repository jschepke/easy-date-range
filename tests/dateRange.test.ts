import { describe, expect, it, test } from "vitest";

import { DateRange } from "../src/dateRange";
import { DateTime } from "luxon";

import { WEEKDAY } from "../src/constants";

describe("dateRangeClass", () => {
	describe("Instance", () => {
		it("should throw an error if any parameters are passed to the constructor", () => {
			// @ts-expect-error: testing invalid input
			expect(() => new DateRange("2022-01-01")).toThrowError(
				"DateRange constructor does not accept any parameters",
			);
		});

		it("should create a DateRange instance", () => {
			const dateRange = new DateRange();
			expect(dateRange).toBeInstanceOf(DateRange);
		});

		it.todo(
			"should create a DateRange instance with refDate as DateTime.now()",
			() => {
				const dateRange = new DateRange();
				expect(dateRange.refDate).toBeInstanceOf(DateTime);
				// TODO refactor
				// expect(dateRange.refDate.toISO().substring(0, 19)).toEqual(
				// 	DateTime.now().toISO().substring(0, 19),
				// );
			},
		);

		it("should create a DateRange instance with empty dates array", () => {
			const dateRange = new DateRange();
			expect(dateRange.dates).toEqual([]);
		});

		it("should create a DateRange instance with refWeekday equal to 1 (1 for Monday)", () => {
			const dateRange = new DateRange();
			expect(dateRange.refWeekday).toEqual(WEEKDAY.Monday);
			expect(dateRange.refWeekday).toEqual(1);
		});
	});

	describe("Methods", () => {
		describe("isValidRefDate", () => {
			test("returns true for valid Date or DateTime objects", () => {
				const dateRange = new DateRange();
				const date = new Date();
				const dateTime = DateTime.local();
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

			test("should return true for valid weekdays", () => {
				expect(dateRange.isValidRefWeekday(1)).toBe(true);
				expect(dateRange.isValidRefWeekday(3)).toBe(true);
				expect(dateRange.isValidRefWeekday(7)).toBe(true);
			});

			test("should return false for invalid weekdays", () => {
				expect(dateRange.isValidRefWeekday(0)).toBe(false);
				expect(dateRange.isValidRefWeekday(8)).toBe(false);
				expect(dateRange.isValidRefWeekday(-1)).toBe(false);
			});

			test("should return false for non-numbers", () => {
				expect(dateRange.isValidRefWeekday("Monday")).toBe(false);
				expect(dateRange.isValidRefWeekday(null)).toBe(false);
				expect(dateRange.isValidRefWeekday(undefined)).toBe(false);
			});
		});
	});
});

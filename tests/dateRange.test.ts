import { describe, expect, it, test, vi } from "vitest";

import { DateRange, DateRangeMembers } from "../src/dateRange";
import { DateTime } from "luxon";

import { RANGE_TYPE, WEEKDAY } from "../src/constants";
import { weekdayTestValues } from "./testUtils";

describe("dateRange", () => {
	const dateRangeMembersKeys: (keyof DateRangeMembers)[] = [
		"dates",
		"daysCount",
		"endOffset",
		"isNext",
		"rangeType",
		"refDate",
		"refWeekday",
		"startOffset",
	];
	describe("Given a new DateRange instance", () => {
		it("throws an error if any parameters are passed to the constructor", () => {
			// @ts-expect-error: testing invalid input
			expect(() => new DateRange("2022-01-01")).toThrowError();
		});

		it("creates a DateRange instance", () => {
			const dateRange = new DateRange();
			expect(dateRange).toBeInstanceOf(DateRange);
		});

		test("all the instance members are undefined", () => {
			const dr = new DateRange();
			const values = Object.values(dr);
			values.forEach((val) => expect(val).toBe(undefined));
		});

		test.each(dateRangeMembersKeys)(
			"throws an error when accessing %s",
			(key) => {
				const dr = new DateRange();
				expect(() => dr[key]).toThrowError();
			},
		);
	});

	describe("After calling methods", () => {
		describe("getDays", () => {
			const dr = new DateRange().getDays();
			const drMembers: DateRangeMembers = {
				dates: dr.dates,
				daysCount: dr.daysCount,
				endOffset: dr.endOffset,
				isNext: dr.isNext,
				rangeType: dr.rangeType,
				refDate: dr.refDate,
				refWeekday: dr.refWeekday,
				startOffset: dr.startOffset,
			};

			test("all instance members are initialized", () => {
				const values = Object.values(drMembers);
				values.forEach((val) => expect(val).toBeDefined());
			});
			test(`rangeType is "${RANGE_TYPE.Days}"`, () => {
				expect(dr.rangeType).toBe(RANGE_TYPE.Days);
			});
		});
		describe.todo("getMonth");
		describe.todo("getMonthExact");
		describe.todo("getMonthExact");
		describe.todo("getWeek");
		describe.todo("next");
	});

	describe("Utility methods", () => {
		describe.todo("isValidOffset");

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

import { describe, expect, it, test, vi } from "vitest";

import { DateRange, DateRangeMembers } from "../src/dateRange";
import { DateTime } from "luxon";

import { RANGE_TYPE } from "../src/constants";
import { TestValues, weekdayTestValues } from "./testUtils";

describe("dateRange instance", () => {
	const dateRangeMembersKeys: (keyof DateRangeMembers)[] = [
		"dateTimes",
		"daysCount",
		"endOffset",
		"isNext",
		"rangeType",
		"refDate",
		"refWeekday",
		"startOffset",
	];

	const testValues: {
		methodName: string;
		dateRange: DateRange;
		rangeType: RANGE_TYPE;
	}[] = [
		{
			methodName: "getDays",
			dateRange: new DateRange().getDays(),
			rangeType: RANGE_TYPE.Days,
		},
		{
			methodName: "getWeek",
			dateRange: new DateRange().getWeek(),
			rangeType: RANGE_TYPE.Week,
		},
		{
			methodName: "getMonthExtended",
			dateRange: new DateRange().getMonthExtended(),
			rangeType: RANGE_TYPE.MonthExtended,
		},
		{
			methodName: "getMonthExact",
			dateRange: new DateRange().getMonthExact(),
			rangeType: RANGE_TYPE.MonthExact,
		},
	];

	describe("Given a new DateRange instance", () => {
		it("throws an error if any parameters are passed to the constructor", () => {
			// @ts-expect-error: testing invalid input
			expect(() => new DateRange("2022-01-01")).toThrowError();
			// test for more then one argument
			// @ts-expect-error: testing invalid input
			expect(() => new DateRange(1, 2)).toThrowError();
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

	describe("The instance after initialization with range generators", () => {
		describe.each(testValues)(
			"Initialized with $methodName method",
			({ dateRange, rangeType }) => {
				const members: DateRangeMembers = {
					dateTimes: dateRange.dateTimes,
					daysCount: dateRange.daysCount,
					endOffset: dateRange.endOffset,
					isNext: dateRange.isNext,
					rangeType: dateRange.rangeType,
					refDate: dateRange.refDate,
					refWeekday: dateRange.refWeekday,
					startOffset: dateRange.startOffset,
					isPrevious: dateRange.isPrevious,
				};

				test("all instance members are initialized", () => {
					const values = Object.values(members);
					values.forEach((val) => expect(val).toBeDefined());
				});
				test(`rangeType is "${rangeType}"`, () => {
					expect(dateRange.rangeType).toBe(rangeType);
				});
			},
		);
	});

	describe("getNext and getPrevious methods", () => {
		describe("getNext", () => {
			describe.each(testValues)(
				"with range type $rangeType",
				({ dateRange, rangeType }) => {
					const dr = new DateRange().getNext(dateRange);

					const members: DateRangeMembers = {
						dateTimes: dr.dateTimes,
						daysCount: dr.daysCount,
						endOffset: dr.endOffset,
						isNext: dr.isNext,
						rangeType: dr.rangeType,
						refDate: dr.refDate,
						refWeekday: dr.refWeekday,
						startOffset: dr.startOffset,
						isPrevious: dateRange.isPrevious,
					};

					test("all instance members are initialized", () => {
						const values = Object.values(members);
						values.forEach((val) => expect(val).toBeDefined());
					});
					test(`rangeType is "${rangeType}"`, () => {
						expect(dr.rangeType).toBe(rangeType);
					});
				},
			);
		});

		describe("getPrevious", () => {
			describe.each(testValues)(
				"with range type $rangeType",
				({ dateRange, rangeType }) => {
					const dr = new DateRange().getPrevious(dateRange);

					const members: DateRangeMembers = {
						dateTimes: dr.dateTimes,
						daysCount: dr.daysCount,
						endOffset: dr.endOffset,
						isNext: dr.isNext,
						rangeType: dr.rangeType,
						refDate: dr.refDate,
						refWeekday: dr.refWeekday,
						startOffset: dr.startOffset,
						isPrevious: dateRange.isPrevious,
					};

					test("all instance members are initialized", () => {
						const values = Object.values(members);
						values.forEach((val) => expect(val).toBeDefined());
					});
					test(`rangeType is "${rangeType}"`, () => {
						expect(dr.rangeType).toBe(rangeType);
					});
				},
			);
		});
	});

	describe("Utilities", () => {
		describe("isValidOffset", () => {
			describe("Given a valid offset values", () => {
				test.each([-1000, -123, -1, 0, 1, 123, 10000])(
					"returns true for value: %j",
					(value) => {
						expect(new DateRange().isValidOffset(value)).toBe(true);
					},
				);
			});
			describe("Given a non-valid offset values", () => {
				test.each(
					new TestValues().excludeByName([
						"integer 0",
						"integer 1",
						"negative integer -1",
					]),
				)("returns false for $name", ({ value }) => {
					expect(new DateRange().isValidOffset(value)).toBe(false);
				});
			});
		});

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

		describe("isNext", () => {
			describe("Given range generated without 'getNext' method", () => {
				test.each(testValues)(
					"returns false for range type: $rangeType",
					({ dateRange }) => {
						expect(dateRange.isNext).toBe(false);
					},
				);
			});
			describe("Given range generated with 'getNext' method", () => {
				test.each(testValues)(
					"returns true for range type: $rangeType",
					({ dateRange }) => {
						const next = new DateRange().getNext(dateRange);
						expect(next.isNext).toBe(true);
						// isPrevious remains false
						expect(next.isPrevious).toBe(false);
					},
				);
			});
		});

		describe("isPrevious", () => {
			describe("Before instance initialized", () => {
				test("throws an error", () => {
					expect(() => new DateRange().isPrevious).toThrowError();
				});
			});
			describe("Given range generated without 'getPrevious' method", () => {
				test.each(testValues)(
					"returns false for range type: $rangeType",
					({ dateRange }) => {
						expect(dateRange.isNext).toBe(false);
					},
				);
			});
			describe("Given range generated with 'getPrevious' method", () => {
				test.each(testValues)(
					"returns true for range type: $rangeType",
					({ dateRange }) => {
						const previous = new DateRange().getPrevious(dateRange);
						expect(previous.isPrevious).toBe(true);
						// isNext remains false
						expect(previous.isNext).toBe(false);
					},
				);
			});
		});
	});
});

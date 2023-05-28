import { DateRange, DateRangeOpts_Days } from "../../src/dateRange";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { RANGE_TYPE } from "../../src/constants";
import { EmptyDateRangeError } from "../../src/errors";
import { TestValues } from "../testUtils";
import { DateTime } from "luxon";

const date1 = DateTime.fromObject({
	year: 2021,
	month: 2,
	day: 1,
	hour: 12,
	minute: 59,
});
const date2 = DateTime.fromObject({
	year: 2001,
	month: 5,
	day: 7,
	hour: 2,
	minute: 3,
});
const date3 = DateTime.fromObject({
	year: 2010,
	month: 2,
	day: 1,
	hour: 15,
	minute: 32,
});

describe("next method", () => {
	describe("Input validation", () => {
		describe("Given no arguments to the function", () => {
			test("throws an errors", () => {
				// @ts-expect-error: testing invalid input
				expect(() => new DateRange().next()).toThrowError("Missing");
			});
		});
		describe("Given invalid arguments to the function", () => {
			test.each(new TestValues().excludeByName(["undefined"]))(
				"throws an error for argument: $name",
				({ value }) => {
					expect(() => new DateRange().next(value)).toThrowError(
						"The value of the dateRange parameter is invalid.",
					);
				},
			);
		});
		describe("Given an empty DateRange object to the function", () => {
			test("throws the 'EmptyDateRangeError", () => {
				const dr = new DateRange();
				expect(() => new DateRange().next(dr)).toThrowError(
					new EmptyDateRangeError("next() method"),
				);
			});
		});

		describe("Functionality", () => {
			// set mocked time
			beforeEach(() => {
				vi.useFakeTimers();
				vi.setSystemTime(date1.toJSDate());
			});

			// restoring date after each test run
			afterEach(() => {
				vi.useRealTimers();
			});

			describe(`with DateRange of type ${RANGE_TYPE.Days}`, () => {
				describe.each([
					new DateRange().getDays(),
					new DateRange().getDays({
						refDate: date1,
						daysCount: 10,
						endOffset: 5,
						startOffset: 5,
					}),
					new DateRange().getDays({
						daysCount: 999,
						refDate: date2,
						endOffset: 100,
						startOffset: 100,
					}),
				])("test index: %#", (dr) => {
					test("has the same number of dates", () => {
						const next = new DateRange().next(dr);
						expect(next.dates.length).toBe(dr.dates.length);
					});

					test("has correct refDate", () => {
						const next = new DateRange().next(dr);
						expect(next.refDate.toISO()).toBe(
							dr.refDate.startOf("day").plus({ days: dr.daysCount }).toISO(),
						);
					});

					test("has correct first date", () => {
						const drNext = new DateRange().next(dr);

						expect(drNext.dates[0].toISODate()).toBe(
							dr.dates[0].plus({ days: dr.daysCount }).toISODate(),
						);
					});

					test("each date of the range is the next day after the previous day", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i].toISO()).toBe(
								dates[i - 1].plus({ day: 1 }).toISO(),
							);
						}
					});

					test("each date of the range is a valid luxon DateTime", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i]).instanceOf(DateTime);
							expect(dates[i].isValid).toBe(true);
						}
					});

					test("rangeType after calling the next method is set to 'DAYS' (with a new instance)", () => {
						const drNext = new DateRange().next(dr);
						expect(drNext.rangeType).toBe(RANGE_TYPE.Days);
					});

					test("rangeType after calling the next method is set to 'DAYS' (with a previously generated instance)", () => {
						// generate a week range
						const drWeek = new DateRange().getWeek();
						expect(drWeek.rangeType).toBe(RANGE_TYPE.Week);
						// assign a new range with next method
						drWeek.next(dr);
						expect(drWeek.rangeType).toBe(RANGE_TYPE.Days);
					});
				});
			});

			describe(`with DateRange of type ${RANGE_TYPE.Week}`, () => {
				describe.each([
					new DateRange().getWeek(),
					new DateRange().getWeek({
						refDate: date1,
						endOffset: 5,
						startOffset: 5,
						refWeekday: 4,
					}),
					new DateRange().getWeek({
						refDate: date2,
						endOffset: 3,
						startOffset: 3,
						refWeekday: 2,
					}),
					new DateRange().getWeek({
						refDate: date2,
						endOffset: 30,
						startOffset: 30,
						refWeekday: 2,
					}),
				])("test index: %#", (dr) => {
					test("has the same number of dates", () => {
						const next = new DateRange().next(dr);
						expect(next.dates.length).toBe(dr.dates.length);
					});

					test("has correct refDate", () => {
						const next = new DateRange().next(dr);
						expect(next.refDate.toISO()).toBe(
							dr.refDate.startOf("day").plus({ days: 7 }).toISO(),
						);
					});

					test("has correct first date", () => {
						const drNext = new DateRange().next(dr);

						expect(drNext.dates[0].toISODate()).toBe(
							dr.dates[0].plus({ days: 7 }).toISODate(),
						);
					});

					test("each date of the range is the next day after the previous day", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i].toISO()).toBe(
								dates[i - 1].plus({ day: 1 }).toISO(),
							);
						}
					});

					test("each date of the range is a valid luxon DateTime", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i]).instanceOf(DateTime);
							expect(dates[i].isValid).toBe(true);
						}
					});

					test(`rangeType after calling the next method is set to '${RANGE_TYPE.Week}' (with a new instance)`, () => {
						const drNext = new DateRange().next(dr);
						expect(drNext.rangeType).toBe(RANGE_TYPE.Week);
					});

					test(`rangeType after calling the next method is set to '${RANGE_TYPE.Week}' (with a previously generated instance)`, () => {
						// generate a some range
						const drMonth = new DateRange().getMonth();
						expect(drMonth.rangeType).toBe(RANGE_TYPE.MonthWeekExtended);
						// assign a new range with next method
						drMonth.next(dr);
						expect(drMonth.rangeType).toBe(RANGE_TYPE.Week);
					});
				});
			});

			describe(`with DateRange of type ${RANGE_TYPE.MonthWeekExtended}`, () => {
				describe.each([
					new DateRange().getMonth(),
					new DateRange().getMonth({
						refDate: date1,
						endOffset: 5,
						startOffset: 5,
						refWeekday: 4,
					}),
					new DateRange().getMonth({
						refDate: date2,
						endOffset: 3,
						startOffset: 3,
						refWeekday: 2,
					}),
					new DateRange().getMonth({
						refDate: date2,
						endOffset: 30,
						startOffset: 30,
						refWeekday: 2,
					}),
					new DateRange().getMonth({
						refDate: date3,
					}),
				])("test index: %#", (dr) => {
					test("has correct refDate", () => {
						const next = new DateRange().next(dr);
						expect(next.refDate.toISO()).toBe(
							dr.refDate.startOf("month").plus({ month: 1 }).toISO(),
						);
					});

					test("with no offset the first date of the range is refWeekday", () => {
						const drNext = new DateRange().next(dr);

						expect(drNext.dates[0].plus({ days: dr.startOffset }).weekday).toBe(
							dr.refWeekday,
						);
					});

					test("with no offset the last date of the range is weekday preceding the refWeekday", () => {
						const drNext = new DateRange().next(dr);

						expect(
							drNext.dates[drNext.dates.length - 1].minus({
								days: dr.endOffset,
							}).weekday,
						).toBe(
							// get the weekday preceding the refWeekday
							dr.refWeekday - 1 >= 1 ? dr.refWeekday - 1 : dr.refWeekday + 6,
						);
					});

					test("each date of the range is the next day after the previous day", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i].toISO()).toBe(
								dates[i - 1].plus({ day: 1 }).toISO(),
							);
						}
					});

					test("each date of the range is a valid luxon DateTime", () => {
						const drNext = new DateRange().next(dr);
						const { dates } = drNext;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i]).instanceOf(DateTime);
							expect(dates[i].isValid).toBe(true);
						}
					});

					test(`rangeType after calling the next method is set to '${RANGE_TYPE.MonthWeekExtended}' (with a new instance)`, () => {
						const drNext = new DateRange().next(dr);
						expect(drNext.rangeType).toBe(RANGE_TYPE.MonthWeekExtended);
					});

					test(`rangeType after calling the next method is set to '${RANGE_TYPE.MonthWeekExtended}' (with a previously generated instance)`, () => {
						// generate a some range
						const drDays = new DateRange().getDays();
						expect(drDays.rangeType).toBe(RANGE_TYPE.Days);
						// assign a new range with next method
						drDays.next(dr);
						expect(drDays.rangeType).toBe(RANGE_TYPE.MonthWeekExtended);
					});
				});
			});
		});
	});
});

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DateRange } from "../../src/dateRange";
import { TestValues } from "../testUtils";
import { DateTime } from "luxon";

describe("getDays", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getDays()).not.toThrowError();
			});
		});

		describe("Given invalid arbitrary parameters", () => {
			const values = new TestValues().excludeByName(["undefined"]);
			test.each(values)("throws an error for value: $name", ({ value }) => {
				expect(() => new DateRange().getDays(value)).toThrowError();
			});
		});

		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test("throws error if refDate is invalid", () => {
					const dateRange = new DateRange();
					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getDays({ refDate: "test" }),
					).toThrowError();

					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getDays({ refDate: 1 }),
					).toThrowError();
				});

				test("doesn't throw error if refDate is a valid JS Date", () => {
					const dateRange = new DateRange();
					expect(() =>
						dateRange.getDays({
							refDate: new Date(),
						}),
					).not.toThrowError();
				});
			});

			describe("offset", () => {
				test.each([-1, 0.5, Infinity, "test"])(
					"throws an error if endOffset is invalid: %s",
					(value) => {
						expect(() =>
							// @ts-expect-error: testing invalid inputs
							new DateRange().getDays({ endOffset: value }),
						).toThrowError();
					},
				);

				test.each([-1, 0.5, Infinity, "test"])(
					"throws an error if startOffset is invalid: %s",
					(value) => {
						expect(() =>
							// @ts-expect-error: testing invalid inputs
							new DateRange().getDays({ startOffset: value }),
						).toThrowError();
					},
				);
			});

			describe("daysCount", () => {
				describe("Given non-valid daysCount property", () => {
					const testValues = new TestValues().excludeByName([
						"undefined",
						"integer 0",
						"integer 1",
					]);
					test.each(testValues)(
						"throws an error for value: $name",
						({ value }) => {
							expect(() =>
								new DateRange().getDays({ daysCount: value }),
							).toThrowError();
						},
					);
				});
				describe("Given valid daysCount property", () => {
					test.each([0, 1, 123, 999])(
						"doesn't throw error for value: %d",
						(num) => {
							expect(() =>
								new DateRange().getDays({ daysCount: num }),
							).not.toThrowError();
						},
					);
				});
			});
		});
	});

	describe("Functionality", () => {
		afterEach(() => {
			// restoring date after each test run
			vi.useRealTimers();
		});

		describe("Given no arguments", () => {
			const date = DateTime.fromObject({
				year: 2021,
				month: 1,
				day: 1,
				hour: 12,
				minute: 10,
			});

			// set mocked time
			beforeEach(() => {
				vi.useFakeTimers();
				vi.setSystemTime(date.toJSDate());
			});

			test("creates a date range with one date", () => {
				const dr = new DateRange().getDays();
				expect(dr.dates.length).toBe(1);
			});

			test("refDate is equal to mocked current date", () => {
				const dr = new DateRange().getDays();
				expect(dr.refDate.valueOf()).toBe(date.valueOf());
			});

			test("date rage starts on a refDate", () => {
				const dr = new DateRange().getDays();
				const firstDate = dr.dates[0];

				expect(firstDate.valueOf()).toBe(date.startOf("day").valueOf());
			});
		});

		describe("Given options argument", () => {
			const date1 = DateTime.fromObject({
				year: 2023,
				month: 6,
				day: 4,
				hour: 13,
				minute: 14,
			});

			const date2 = DateTime.fromObject({
				year: 2022,
				month: 1,
				day: 31,
				hour: 19,
				minute: 58,
				second: 1,
			});

			const date3 = DateTime.fromObject({
				year: 2010,
				month: 2,
				day: 17,
				hour: 4,
				minute: 34,
				second: 17,
			});

			const date4 = DateTime.fromObject({
				year: 1905,
				month: 11,
				day: 3,
				hour: 4,
				minute: 45,
				second: 56,
			});

			const date5 = DateTime.fromObject({
				year: 2036,
				month: 2,
				day: 17,
				hour: 12,
				minute: 34,
				second: 17,
			});

			describe("with endOffset property", () => {
				const testValues: {
					refDate: DateTime;
					refDateString: string;
					daysCount: number;
					endOffset: number;
					assertions: {
						numberOfDates: number;
						firstDate: DateTime;
						lastDate: DateTime;
					}[];
				}[] = [
					{
						refDate: date1,
						refDateString: date1.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						daysCount: 1,
						endOffset: 1,

						assertions: [
							{
								numberOfDates: 1 + 1,
								firstDate: date1,
								lastDate: date1.plus({ day: 1 + 1 }),
							},
						],
					},
					{
						daysCount: 3,
						refDate: date2,
						refDateString: date2.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						endOffset: 10,
						assertions: [
							{
								numberOfDates: 3 + 10,
								firstDate: date2,
								lastDate: date2.plus({ days: 3 + 10 }),
							},
						],
					},
					{
						daysCount: 7,
						refDate: date3,
						refDateString: date3.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						endOffset: 30,
						assertions: [
							{
								numberOfDates: 7 + 30,
								firstDate: date3,
								lastDate: date3.plus({ days: 7 + 30 }),
							},
						],
					},
					{
						daysCount: 30,
						refDate: date4,
						refDateString: date4.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						endOffset: 365,
						assertions: [
							{
								numberOfDates: 30 + 365,
								firstDate: date4,
								lastDate: date4.plus({ days: 30 + 365 }),
							},
						],
					},
					{
						daysCount: 999,
						refDate: date5,
						refDateString: date5.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						endOffset: 1,
						assertions: [
							{
								numberOfDates: 999 + 1,
								firstDate: date5,
								lastDate: date5.plus({ days: 999 + 1 }),
							},
						],
					},
				];

				describe.each(testValues)(
					"given endOffset: $endOffset, daysCount: $daysCount and mocked date: $refDateString",
					({ assertions, refDate, daysCount, endOffset, refDateString }) => {
						// set mocked time
						beforeEach(() => {
							vi.useFakeTimers();
							vi.setSystemTime(refDate.toJSDate());
						});

						const { numberOfDates } = assertions[0];

						test(`creates range of ${numberOfDates} dates`, () => {
							const dr = new DateRange().getDays({ daysCount, endOffset });
							expect(dr.dates.length).toBe(numberOfDates);
						});
						test("first date of range is mocked current date", () => {
							const dr = new DateRange().getDays({ daysCount, endOffset });
							expect(dr.dates[0].valueOf()).toBe(
								refDate.startOf("day").valueOf(),
							);
						});
						test("each date of the range is the next day after the previous day", () => {
							const dr = new DateRange().getDays({ daysCount, endOffset });
							const { dates } = dr;

							for (let i = 1; i < dates.length; i++) {
								expect(dates[i].toISO()).toBe(
									dates[i - 1].plus({ day: 1 }).toISO(),
								);
							}
						});
					},
				);
			});

			describe("with startOffset property", () => {
				const testValues: {
					refDate: DateTime;
					refDateString: string;
					daysCount: number;
					startOffset: number;
					assertions: {
						numberOfDates: number;
						firstDate: DateTime;
						lastDate: DateTime;
					}[];
				}[] = [
					{
						refDate: date1,
						refDateString: date1.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						daysCount: 1,
						startOffset: 1,

						assertions: [
							{
								numberOfDates: 1 + 1,
								firstDate: date1.minus({ day: 1 }),
								lastDate: date1.plus({ day: 1 }),
							},
						],
					},
					{
						daysCount: 3,
						refDate: date2,
						refDateString: date2.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						startOffset: 10,
						assertions: [
							{
								numberOfDates: 3 + 10,
								firstDate: date2.minus({ days: 10 }),
								lastDate: date2.plus({ days: 3 }),
							},
						],
					},
					{
						daysCount: 7,
						refDate: date3,
						refDateString: date3.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						startOffset: 30,
						assertions: [
							{
								numberOfDates: 7 + 30,
								firstDate: date3.minus({ days: 30 }),
								lastDate: date3.plus({ days: 7 }),
							},
						],
					},
					{
						daysCount: 30,
						refDate: date4,
						refDateString: date4.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						startOffset: 365,
						assertions: [
							{
								numberOfDates: 30 + 365,
								firstDate: date4.minus({ days: 365 }),
								lastDate: date4.plus({ days: 30 }),
							},
						],
					},
					{
						daysCount: 999,
						refDate: date5,
						refDateString: date5.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						startOffset: 1,
						assertions: [
							{
								numberOfDates: 999 + 1,
								firstDate: date5.minus({ days: 1 }),
								lastDate: date5.plus({ days: 999 }),
							},
						],
					},
				];

				describe.each(testValues)(
					"given startOffset: $startOffset, daysCount: $daysCount and mocked date: $refDateString",
					({ assertions, refDate, daysCount, startOffset }) => {
						// set mocked time
						beforeEach(() => {
							vi.useFakeTimers();
							vi.setSystemTime(refDate.toJSDate());
						});

						const { numberOfDates } = assertions[0];

						test(`creates range of ${numberOfDates} dates`, () => {
							const dr = new DateRange().getDays({ daysCount, startOffset });
							expect(dr.dates.length).toBe(numberOfDates);
						});
						test(`first date of range is ${startOffset} days before mocked current date`, () => {
							const dr = new DateRange().getDays({ daysCount, startOffset });
							expect(dr.dates[0].valueOf()).toBe(
								refDate.startOf("day").minus({ days: startOffset }).valueOf(),
							);
						});
						test("each date of the range is the next day after the previous day", () => {
							const dr = new DateRange().getDays({ daysCount, startOffset });
							const { dates } = dr;

							for (let i = 1; i < dates.length; i++) {
								expect(dates[i].toISO()).toBe(
									dates[i - 1].plus({ day: 1 }).toISO(),
								);
							}
						});
					},
				);
			});

			describe("with daysCount property", () => {
				const testValues: {
					refDate: DateTime;
					refDateString: string;
					daysCount: number;
					assertions: {
						numberOfDates: number;
						firstDate: DateTime;
						lastDate: DateTime;
					}[];
				}[] = [
					{
						refDate: date1,
						refDateString: date1.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						daysCount: 1,

						assertions: [
							{
								numberOfDates: 1,
								firstDate: date1,
								lastDate: date1.plus({ day: 1 }),
							},
						],
					},
					{
						daysCount: 3,
						refDate: date2,
						refDateString: date2.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						assertions: [
							{
								numberOfDates: 3,
								firstDate: date2,
								lastDate: date2.plus({ days: 3 }),
							},
						],
					},
					{
						daysCount: 7,
						refDate: date3,
						refDateString: date3.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						assertions: [
							{
								numberOfDates: 7,
								firstDate: date3,
								lastDate: date3.plus({ days: 7 }),
							},
						],
					},
					{
						daysCount: 30,
						refDate: date4,
						refDateString: date4.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						assertions: [
							{
								numberOfDates: 30,
								firstDate: date4,
								lastDate: date4.plus({ days: 30 }),
							},
						],
					},
					{
						daysCount: 999,
						refDate: date5,
						refDateString: date5.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						),
						assertions: [
							{
								numberOfDates: 999,
								firstDate: date5,
								lastDate: date5.plus({ days: 999 }),
							},
						],
					},
				];

				describe.each(testValues)(
					"given daysCount: $daysCount and mocked date: $refDateString",
					({ assertions, refDate, daysCount }) => {
						// set mocked time
						beforeEach(() => {
							vi.useFakeTimers();
							vi.setSystemTime(refDate.toJSDate());
						});

						const { numberOfDates } = assertions[0];

						test(`creates range of ${numberOfDates} dates`, () => {
							const dr = new DateRange().getDays({ daysCount });
							expect(dr.dates.length).toBe(numberOfDates);
						});
						test("first date of range is mocked current date", () => {
							const dr = new DateRange().getDays({ daysCount });

							expect(dr.dates[0].valueOf()).toBe(
								refDate.startOf("day").valueOf(),
							);
						});
						test("each date of the range is the next day after the previous day", () => {
							const dr = new DateRange().getDays({ daysCount });
							const { dates } = dr;

							for (let i = 1; i < dates.length; i++) {
								expect(dates[i].toISO()).toBe(
									dates[i - 1].plus({ day: 1 }).toISO(),
								);
							}
						});
					},
				);
			});
		});
	});
});

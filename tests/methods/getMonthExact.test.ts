import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DateRange, OptionsMonthExact } from "../../src/dateRange";
import { TestValues, monthExactTestValues } from "../testUtils";
import { DateTime } from "luxon";

describe("getMonthExact", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getMonthExact()).not.toThrowError();
			});
		});
		describe("Given invalid arbitrary parameters", () => {
			test.each(
				new TestValues().excludeByName([
					"object { a: 1, b: 'foo' }",
					"undefined",
				]),
			)("throws an error for value: $name", ({ value }) => {
				expect(() => new DateRange().getMonthExact(value)).toThrowError();
			});
		});
		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test.each(
					new TestValues().excludeByName([
						"undefined",
						"Date object - new Date()",
						"DateTime object - DateTime.now()",
					]),
				)("throws an error for value: $name", ({ value }) => {
					expect(() =>
						new DateRange().getMonthExact({ refDate: value }),
					).toThrowError();
				});
			});

			describe("startOffset", () => {
				test.each(
					new TestValues().excludeByName([
						"undefined",
						"integer 0",
						"integer 1",
						"negative integer -1",
					]),
				)("throws an error for value: $name", ({ value }) => {
					expect(() =>
						new DateRange().getMonthExact({ startOffset: value }),
					).toThrowError();
				});
			});
			describe("endOffset", () => {
				test.each(
					new TestValues().excludeByName([
						"undefined",
						"integer 0",
						"integer 1",
						"negative integer -1",
					]),
				)("throws an error for value: $name", ({ value }) => {
					expect(() =>
						new DateRange().getMonthExact({ endOffset: value }),
					).toThrowError();
				});
			});
		});
	});

	describe("Functionality", () => {
		describe("Given no options parameter", () => {
			afterEach(() => {
				// restoring date after each test run
				vi.useRealTimers();
			});

			describe.each(monthExactTestValues.valid.refDate)(
				"mocked current time set to $refDate",
				({ refDate, assertions }) => {
					beforeEach(() => {
						vi.setSystemTime(refDate.toJSDate());
					});

					const { firstDate, lastDate, numberOfDates } = assertions[0];

					test(`creates range of ${numberOfDates} dates`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExact().dateTimes;
						expect(dateTimes.length).toBe(numberOfDates);
					});

					test("each date of the range is the next day after the previous day", () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExact().dateTimes;

						for (let i = 1; i < dateTimes.length; i++) {
							expect(dateTimes[i].toISO()).toEqual(
								dateTimes[i - 1].plus({ day: 1 }).toISO(),
							);
						}
					});

					test(`the first date in range is ${firstDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExact().dateTimes;

						expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
					});

					test(`the last date in range is ${lastDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExact().dateTimes;

						expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
							lastDate.valueOf(),
						);
					});
				},
			);
		});

		describe("Given options parameter", () => {
			describe("refDate", () => {
				describe.each(monthExactTestValues.valid.refDate)(
					"Given date $refDate",
					({ refDate, assertions }) => {
						const { firstDate, lastDate, numberOfDates } = assertions[0];

						test(`creates range of ${numberOfDates} dates`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExact({
								refDate,
							}).dateTimes;
							expect(dateTimes.length).toBe(numberOfDates);
						});

						test("each date of the range is the next day after the previous day", () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExact({
								refDate,
							}).dateTimes;

							for (let i = 1; i < dateTimes.length; i++) {
								expect(dateTimes[i].toISO()).toEqual(
									dateTimes[i - 1].plus({ day: 1 }).toISO(),
								);
							}
						});

						test(`the first date in range is ${firstDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExact({
								refDate,
							}).dateTimes;

							expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
						});

						test(`the last date in range is ${lastDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExact({
								refDate,
							}).dateTimes;

							expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
								lastDate.valueOf(),
							);
						});
					},
				);
			});

			describe("startOffset", () => {
				describe("With mocked current time", () => {
					describe.each(monthExactTestValues.valid.startOffset)(
						"current time set to: $refDate",
						({ refDate, assertions }) => {
							beforeEach(() => {
								vi.setSystemTime(refDate.toJSDate());
							});

							describe.each(assertions)(
								"and startOffset set to $startOffset",
								({ firstDate, lastDate, numberOfDates, startOffset }) => {
									test(`creates range of ${numberOfDates} dates`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											startOffset,
										}).dateTimes;
										expect(dateTimes.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											startOffset,
										}).dateTimes;

										for (let i = 1; i < dateTimes.length; i++) {
											expect(dateTimes[i].toISO()).toEqual(
												dateTimes[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											startOffset,
										}).dateTimes;

										expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											startOffset,
										}).dateTimes;

										expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});
								},
							);
						},
					);
				});
			});
			describe("endOffset", () => {
				describe("With mocked current time", () => {
					describe.each(monthExactTestValues.valid.endOffset)(
						"current time set to: $refDate",
						({ refDate, assertions }) => {
							beforeEach(() => {
								vi.setSystemTime(refDate.toJSDate());
							});

							describe.each(assertions)(
								"and endOffset set to $endOffset",
								({ firstDate, lastDate, numberOfDates, endOffset }) => {
									test(`creates range of ${numberOfDates} dates`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											endOffset,
										}).dateTimes;
										expect(dateTimes.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											endOffset,
										}).dateTimes;

										for (let i = 1; i < dateTimes.length; i++) {
											expect(dateTimes[i].toISO()).toEqual(
												dateTimes[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											endOffset,
										}).dateTimes;

										expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExact({
											endOffset,
										}).dateTimes;

										expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});
								},
							);
						},
					);
				});
			});

			describe("starOffset and endOffset together", () => {
				describe("Given valid data", () => {
					const data: Array<
						OptionsMonthExact & {
							expectedFirstDate: DateTime;
							expectedLastDate: DateTime;
						}
					> = [
						{
							startOffset: 0,
							endOffset: 0,
							refDate: DateTime.fromISO("2023-03-01"),
							expectedFirstDate: DateTime.fromISO("2023-03-01"),
							expectedLastDate: DateTime.fromISO("2023-03-31"),
						},
						{
							startOffset: -5,
							endOffset: -5,
							refDate: DateTime.fromISO("2023-03-01"),
							expectedFirstDate: DateTime.fromISO("2023-03-06"),
							expectedLastDate: DateTime.fromISO("2023-03-26"),
						},
						{
							startOffset: 5,
							endOffset: -5,
							refDate: DateTime.fromISO("2023-03-01"),
							expectedFirstDate: DateTime.fromISO("2023-02-24"),
							expectedLastDate: DateTime.fromISO("2023-03-26"),
						},
						{
							startOffset: -5,
							endOffset: 5,
							refDate: DateTime.fromISO("2023-03-01"),
							expectedFirstDate: DateTime.fromISO("2023-03-06"),
							expectedLastDate: DateTime.fromISO("2023-04-05"),
						},
					];

					describe.each(data)(
						"Given startOffset: $startOffset, endOffset: $endOffset",
						({
							expectedFirstDate,
							expectedLastDate,
							endOffset,
							refDate,
							startOffset,
						}) => {
							const options = { endOffset, refDate, startOffset };

							const dr = new DateRange().getMonthExact(options);
							const firstDate = dr.dateTimes[0];
							const lastDate = dr.dateTimes[dr.dateTimes.length - 1];

							test("The first date of range is correct", () => {
								expect(firstDate.toISO()).toEqual(expectedFirstDate.toISO());
							});
							test("The last date of range is correct", () => {
								expect(lastDate.toISO()).toEqual(expectedLastDate.toISO());
							});
						},
					);
				});

				describe("Given non valid data", () => {
					const data: OptionsMonthExact[] = [
						{
							startOffset: -31,
							endOffset: 5,
							refDate: DateTime.fromISO("2023-03-01"),
						},
						{
							startOffset: 5,
							endOffset: -31,
							refDate: DateTime.fromISO("2023-03-01"),
						},
						{
							startOffset: -1,
							endOffset: -30,
							refDate: DateTime.fromISO("2023-03-01"),
						},
					];

					describe.each(data)(
						"Given startOffset: $startOffset, endOffset: $endOffset",
						({ endOffset, refDate, startOffset }) => {
							test("throws an error", () => {
								expect(() =>
									new DateRange().getMonthExact({
										endOffset,
										refDate,
										startOffset,
									}),
								).toThrowError();
							});
						},
					);
				});
			});
		});
	});
});

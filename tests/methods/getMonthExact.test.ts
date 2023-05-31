import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DateRange } from "../../src/dateRange";
import { monthExactTestValues } from "../testUtils";
import { DateTime } from "luxon";

describe("getMonthExact", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getMonthExact()).not.toThrowError();
			});
		});
		describe("Given invalid arbitrary parameters", () => {
			test.each(monthExactTestValues.invalid.arbitraryParams)(
				"throws an error for value: $name",
				({ value }) => {
					expect(() => new DateRange().getMonthExact(value)).toThrowError();
				},
			);
		});
		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test.each(monthExactTestValues.invalid.refDate)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonthExact({ refDate: value }),
						).toThrowError();
					},
				);
			});

			describe("startOffset", () => {
				test.each(monthExactTestValues.invalid.startOffset)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonthExact({ startOffset: value }),
						).toThrowError();
					},
				);
			});
			describe("endOffset", () => {
				test.each(monthExactTestValues.invalid.endOffset)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonthExact({ endOffset: value }),
						).toThrowError();
					},
				);
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
						const dates = dateRange.getMonthExact().dates;
						expect(dates.length).toBe(numberOfDates);
					});

					test("each date of the range is the next day after the previous day", () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonthExact().dates;

						for (let i = 1; i < dates.length; i++) {
							expect(dates[i].toISO()).toEqual(
								dates[i - 1].plus({ day: 1 }).toISO(),
							);
						}
					});

					test(`the first date in range is ${firstDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonthExact().dates;

						expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
					});

					test(`the last date in range is ${lastDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonthExact().dates;

						expect(dates[dates.length - 1].valueOf()).toBe(lastDate.valueOf());
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
							const dates = dateRange.getMonthExact({
								refDate,
							}).dates;
							expect(dates.length).toBe(numberOfDates);
						});

						test("each date of the range is the next day after the previous day", () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonthExact({
								refDate,
							}).dates;

							for (let i = 1; i < dates.length; i++) {
								expect(dates[i].toISO()).toEqual(
									dates[i - 1].plus({ day: 1 }).toISO(),
								);
							}
						});

						test(`the first date in range is ${firstDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonthExact({
								refDate,
							}).dates;

							expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
						});

						test(`the last date in range is ${lastDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonthExact({
								refDate,
							}).dates;

							expect(dates[dates.length - 1].valueOf()).toBe(
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
										const dates = dateRange.getMonthExact({
											startOffset,
										}).dates;
										expect(dates.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											startOffset,
										}).dates;

										for (let i = 1; i < dates.length; i++) {
											expect(dates[i].toISO()).toEqual(
												dates[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											startOffset,
										}).dates;

										expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											startOffset,
										}).dates;

										expect(dates[dates.length - 1].valueOf()).toBe(
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
										const dates = dateRange.getMonthExact({
											endOffset,
										}).dates;
										expect(dates.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											endOffset,
										}).dates;

										for (let i = 1; i < dates.length; i++) {
											expect(dates[i].toISO()).toEqual(
												dates[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											endOffset,
										}).dates;

										expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonthExact({
											endOffset,
										}).dates;

										expect(dates[dates.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});
								},
							);
						},
					);
				});
			});
		});
	});
});

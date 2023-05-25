import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DateRange } from "../../src/dateRange";
import { monthTestValues } from "../testUtils";
import { DateTime, Info } from "luxon";

describe("getMonth", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getMonth()).not.toThrowError();
			});
		});
		describe("Given invalid arbitrary parameters", () => {
			test.each(monthTestValues.invalid.arbitraryParams)(
				"throws an error for value: $name",
				({ value }) => {
					expect(() => new DateRange().getMonth(value)).toThrowError();
				},
			);
		});
		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test.each(monthTestValues.invalid.refDate)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonth({ refDate: value }),
						).toThrowError();
					},
				);
			});
			describe("refWeekday", () => {
				test.each(monthTestValues.invalid.refWeekday)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonth({ refWeekday: value }),
						).toThrowError();
					},
				);
			});
			describe("startOffset", () => {
				test.each(monthTestValues.invalid.startOffset)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonth({ startOffset: value }),
						).toThrowError();
					},
				);
			});
			describe("endOffset", () => {
				test.each(monthTestValues.invalid.endOffset)(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonth({ endOffset: value }),
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

			describe.each(monthTestValues.valid.refDate)(
				"mocked current time set to $refDate",
				({ refDate, assertions }) => {
					beforeEach(() => {
						vi.setSystemTime(refDate.toJSDate());
					});

					const {
						firstDate,
						lastDate,
						lastWeekday,
						numberOfDates,
						refWeekday = 1,
					} = assertions[0];

					if (lastWeekday === undefined) {
						throw new Error(
							"lastWeekday prop is not defined in test values, but required in the test suite",
						);
					}

					test(`creates range of ${numberOfDates} dates`, () => {
						const dr = new DateRange().getMonth();
						expect(dr.dates.length).toBe(numberOfDates);
					});

					test("each date of the range is the next day after the previous day", () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonth().dates;

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
						const dates = dateRange.getMonth().dates;

						expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
					});

					test(`the last date in range is ${lastDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonth().dates;

						expect(dates[dates.length - 1].valueOf()).toBe(lastDate.valueOf());
					});

					test(`the first weekday in range is ${
						Info.weekdays()[refWeekday - 1]
					} (${refWeekday})`, () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonth().dates;

						expect(dates[0].weekday).toBe(refWeekday);
					});

					test(`the last weekday in range is ${
						Info.weekdays()[lastWeekday - 1]
					} (${lastWeekday})`, () => {
						const dateRange = new DateRange();
						const dates = dateRange.getMonth().dates;

						expect(dates[dateRange.dates.length - 1].weekday).toBe(lastWeekday);
					});
				},
			);
		});

		describe("Given options parameter", () => {
			describe("refDate", () => {
				describe.each(monthTestValues.valid.refDate)(
					"Given date $refDate",
					({ refDate, assertions }) => {
						const {
							firstDate,
							lastDate,
							lastWeekday,
							numberOfDates,
							refWeekday = 1,
						} = assertions[0];

						if (lastWeekday === undefined) {
							throw new Error(
								"lastWeekday prop is not defined in test values, but required in the tests",
							);
						}

						test(`creates range of ${numberOfDates} dates`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonth({
								refDate,
							}).dates;
							expect(dates.length).toBe(numberOfDates);
						});

						test("each date of the range is the next day after the previous day", () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonth({
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
							const dates = dateRange.getMonth({
								refDate,
							}).dates;

							expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
						});

						test(`the last date in range is ${lastDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonth({
								refDate,
							}).dates;

							expect(dates[dates.length - 1].valueOf()).toBe(
								lastDate.valueOf(),
							);
						});

						test(`the first weekday in range is ${
							Info.weekdays()[refWeekday - 1]
						} (${refWeekday})`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonth({
								refDate,
							}).dates;

							expect(dates[0].weekday).toBe(refWeekday);
						});

						test(`the last weekday in range is ${
							Info.weekdays()[lastWeekday - 1]
						} (${lastWeekday})`, () => {
							const dateRange = new DateRange();
							const dates = dateRange.getMonth({
								refDate,
							}).dates;

							expect(dates[dateRange.dates.length - 1].weekday).toBe(
								lastWeekday,
							);
						});
					},
				);
			});

			describe("refWeekday", () => {
				describe("With mocked current time", () => {
					describe.each(monthTestValues.valid.refWeekday)(
						"current time set to: $refDate",
						({ refDate, assertions }) => {
							beforeEach(() => {
								vi.setSystemTime(refDate.toJSDate());
							});

							describe.each(assertions)(
								"and refWeekday set to $refWeekday",
								({
									firstDate,
									lastDate,
									lastWeekday,
									refWeekday = 1,
									numberOfDates,
								}) => {
									if (lastWeekday === undefined) {
										throw new Error(
											"lastWeekday prop is not defined in test values, but required in the tests",
										);
									}

									test(`creates range of ${numberOfDates} dates`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											refWeekday,
										}).dates;
										expect(dates.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											refWeekday,
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
										const dates = dateRange.getMonth({
											refWeekday,
										}).dates;

										expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											refWeekday,
										}).dates;

										expect(dates[dates.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the first weekday in range is ${
										Info.weekdays()[refWeekday - 1]
									} (${refWeekday})`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											refWeekday,
										}).dates;

										expect(dates[0].weekday).toBe(refWeekday);
									});

									test(`the last weekday in range is ${
										Info.weekdays()[lastWeekday - 1]
									} (${lastWeekday})`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											refWeekday,
										}).dates;

										expect(dates[dateRange.dates.length - 1].weekday).toBe(
											lastWeekday,
										);
									});
								},
							);
						},
					);
				});
			});
			describe("startOffset", () => {
				describe("With mocked current time", () => {
					describe.each(monthTestValues.valid.startOffset)(
						"current time set to: $refDate",
						({ refDate, assertions }) => {
							beforeEach(() => {
								vi.setSystemTime(refDate.toJSDate());
							});

							describe.each(assertions)(
								"and startOffset set to $startOffset",
								({
									firstDate,
									lastDate,
									lastWeekday,
									numberOfDates,
									startOffset,
								}) => {
									if (lastWeekday === undefined) {
										throw new Error(
											"lastWeekday prop is not defined in test values, but required in the tests",
										);
									}

									test(`creates range of ${numberOfDates} dates`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											startOffset,
										}).dates;
										expect(dates.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
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
										const dates = dateRange.getMonth({
											startOffset,
										}).dates;

										expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											startOffset,
										}).dates;

										expect(dates[dates.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the last weekday in range is ${
										Info.weekdays()[lastWeekday - 1]
									} (${lastWeekday})`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											startOffset,
										}).dates;

										expect(dates[dateRange.dates.length - 1].weekday).toBe(
											lastWeekday,
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
					describe.each(monthTestValues.valid.endOffset)(
						"current time set to: $refDate",
						({ refDate, assertions }) => {
							beforeEach(() => {
								vi.setSystemTime(refDate.toJSDate());
							});

							describe.each(assertions)(
								"and endOffset set to $endOffset",
								({
									firstDate,
									lastDate,
									refWeekday = 1,
									numberOfDates,
									endOffset,
								}) => {
									test(`creates range of ${numberOfDates} dates`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											endOffset,
										}).dates;
										expect(dates.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											endOffset,
										}).dates;

										for (let i = 1; i < dates.length; i++) {
											expect(dates[i].toISO()).toBe(
												dates[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											endOffset,
										}).dates;

										expect(dates[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											endOffset,
										}).dates;

										expect(dates[dates.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the first weekday in range is ${
										Info.weekdays()[refWeekday - 1]
									} (${refWeekday})`, () => {
										const dateRange = new DateRange();
										const dates = dateRange.getMonth({
											endOffset,
										}).dates;

										expect(dates[0].weekday).toBe(refWeekday);
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

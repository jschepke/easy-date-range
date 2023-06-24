import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DateRange, OptionsMonthExtended } from "../../src/dateRange";
import { TestValues, monthTestValues } from "../testUtils";
import { DateTime, Info } from "luxon";

describe("getMonthExtended", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getMonthExtended()).not.toThrowError();
			});
		});
		describe("Given invalid arbitrary parameters", () => {
			test.each(
				new TestValues().excludeByName([
					"object { a: 1, b: 'foo' }",
					"undefined",
				]),
			)("throws an error for value: $name", ({ value }) => {
				expect(() => new DateRange().getMonthExtended(value)).toThrowError();
			});
		});
		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test.each(
					new TestValues().excludeByName([
						"Date object - new Date()",
						"DateTime object - DateTime.now()",
						"undefined",
					]),
				)("throws an error for value: $name", ({ value }) => {
					expect(() =>
						new DateRange().getMonthExtended({ refDate: value }),
					).toThrowError();
				});
			});
			describe("refWeekday", () => {
				test.each(new TestValues().excludeByName(["integer 1", "undefined"]))(
					"throws an error for value: $name",
					({ value }) => {
						expect(() =>
							new DateRange().getMonthExtended({ refWeekday: value }),
						).toThrowError();
					},
				);
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
						new DateRange().getMonthExtended({ startOffset: value }),
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
						new DateRange().getMonthExtended({ endOffset: value }),
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
						const dr = new DateRange().getMonthExtended();
						expect(dr.dateTimes.length).toBe(numberOfDates);
					});

					test("each date of the range is the next day after the previous day", () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExtended().dateTimes;

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
						const dateTimes = dateRange.getMonthExtended().dateTimes;

						expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
					});

					test(`the last date in range is ${lastDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					)}`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExtended().dateTimes;

						expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
							lastDate.valueOf(),
						);
					});

					test(`the first weekday in range is ${
						Info.weekdays()[refWeekday - 1]
					} (${refWeekday})`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExtended().dateTimes;

						expect(dateTimes[0].weekday).toBe(refWeekday);
					});

					test(`the last weekday in range is ${
						Info.weekdays()[lastWeekday - 1]
					} (${lastWeekday})`, () => {
						const dateRange = new DateRange();
						const dateTimes = dateRange.getMonthExtended().dateTimes;

						expect(dateTimes[dateRange.dateTimes.length - 1].weekday).toBe(
							lastWeekday,
						);
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
							const dateTimes = dateRange.getMonthExtended({
								refDate,
							}).dateTimes;
							expect(dateTimes.length).toBe(numberOfDates);
						});

						test("each date of the range is the next day after the previous day", () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExtended({
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
							const dateTimes = dateRange.getMonthExtended({
								refDate,
							}).dateTimes;

							expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
						});

						test(`the last date in range is ${lastDate.toLocaleString(
							DateTime.DATETIME_MED_WITH_WEEKDAY,
						)}`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExtended({
								refDate,
							}).dateTimes;

							expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
								lastDate.valueOf(),
							);
						});

						test(`the first weekday in range is ${
							Info.weekdays()[refWeekday - 1]
						} (${refWeekday})`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExtended({
								refDate,
							}).dateTimes;

							expect(dateTimes[0].weekday).toBe(refWeekday);
						});

						test(`the last weekday in range is ${
							Info.weekdays()[lastWeekday - 1]
						} (${lastWeekday})`, () => {
							const dateRange = new DateRange();
							const dateTimes = dateRange.getMonthExtended({
								refDate,
							}).dateTimes;

							expect(dateTimes[dateRange.dateTimes.length - 1].weekday).toBe(
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
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
										}).dateTimes;
										expect(dateTimes.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
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
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
										}).dateTimes;

										expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
										}).dateTimes;

										expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the first weekday in range is ${
										Info.weekdays()[refWeekday - 1]
									} (${refWeekday})`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
										}).dateTimes;

										expect(dateTimes[0].weekday).toBe(refWeekday);
									});

									test(`the last weekday in range is ${
										Info.weekdays()[lastWeekday - 1]
									} (${lastWeekday})`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											refWeekday,
										}).dateTimes;

										expect(
											dateTimes[dateRange.dateTimes.length - 1].weekday,
										).toBe(lastWeekday);
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
										const dateTimes = dateRange.getMonthExtended({
											startOffset,
										}).dateTimes;
										expect(dateTimes.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
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
										const dateTimes = dateRange.getMonthExtended({
											startOffset,
										}).dateTimes;

										expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											startOffset,
										}).dateTimes;

										expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the last weekday in range is ${
										Info.weekdays()[lastWeekday - 1]
									} (${lastWeekday})`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											startOffset,
										}).dateTimes;

										expect(
											dateTimes[dateRange.dateTimes.length - 1].weekday,
										).toBe(lastWeekday);
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
										const dateTimes = dateRange.getMonthExtended({
											endOffset,
										}).dateTimes;
										expect(dateTimes.length).toBe(numberOfDates);
									});

									test("each date of the range is the next day after the previous day", () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											endOffset,
										}).dateTimes;

										for (let i = 1; i < dateTimes.length; i++) {
											expect(dateTimes[i].toISO()).toBe(
												dateTimes[i - 1].plus({ day: 1 }).toISO(),
											);
										}
									});

									test(`the first date in range is ${firstDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											endOffset,
										}).dateTimes;

										expect(dateTimes[0].valueOf()).toEqual(firstDate.valueOf());
									});

									test(`the last date in range is ${lastDate.toLocaleString(
										DateTime.DATETIME_MED_WITH_WEEKDAY,
									)}`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											endOffset,
										}).dateTimes;

										expect(dateTimes[dateTimes.length - 1].valueOf()).toBe(
											lastDate.valueOf(),
										);
									});

									test(`the first weekday in range is ${
										Info.weekdays()[refWeekday - 1]
									} (${refWeekday})`, () => {
										const dateRange = new DateRange();
										const dateTimes = dateRange.getMonthExtended({
											endOffset,
										}).dateTimes;

										expect(dateTimes[0].weekday).toBe(refWeekday);
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
						OptionsMonthExtended & {
							expectedFirstDate: DateTime;
							expectedLastDate: DateTime;
						}
					> = [
						{
							startOffset: 0,
							endOffset: 0,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
							expectedFirstDate: DateTime.fromISO("2023-02-27"),
							expectedLastDate: DateTime.fromISO("2023-04-02"),
						},
						{
							startOffset: -5,
							endOffset: -5,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
							expectedFirstDate: DateTime.fromISO("2023-03-04"),
							expectedLastDate: DateTime.fromISO("2023-03-28"),
						},
						{
							startOffset: 5,
							endOffset: -5,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
							expectedFirstDate: DateTime.fromISO("2023-02-22"),
							expectedLastDate: DateTime.fromISO("2023-03-28"),
						},
						{
							startOffset: -5,
							endOffset: 5,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
							expectedFirstDate: DateTime.fromISO("2023-03-04"),
							expectedLastDate: DateTime.fromISO("2023-04-07"),
						},
					];

					describe.each(data)(
						"Given startOffset: $startOffset, endOffset: $endOffset",
						({
							expectedFirstDate,
							expectedLastDate,
							endOffset,
							refDate,
							refWeekday,
							startOffset,
						}) => {
							const options = { endOffset, refDate, refWeekday, startOffset };

							const dr = new DateRange().getMonthExtended(options);
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
					const data: OptionsMonthExtended[] = [
						{
							startOffset: -35,
							endOffset: 5,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
						},
						{
							startOffset: 5,
							endOffset: -35,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
						},
						{
							startOffset: -5,
							endOffset: -30,
							refDate: DateTime.fromISO("2023-03-01"),
							refWeekday: 1,
						},
					];

					describe.each(data)(
						"Given startOffset: $startOffset, endOffset: $endOffset",
						({ endOffset, refDate, refWeekday, startOffset }) => {
							test("throws an error", () => {
								expect(() =>
									new DateRange().getMonthExtended({
										endOffset,
										refDate,
										refWeekday,
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

import { describe, expect, it, test } from "vitest";

import { DateRange } from "../../src/dateRange";
import { DateTime } from "luxon";

import { WEEKDAY } from "../../src/constants";
import { getRandomDateTime, getRandomWeekday } from "../../src/utils";
import { TestValues } from "../testUtils";

describe("getWeek", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("doesn't throw error if no parameters are specified", () => {
				expect(() => new DateRange().getWeek()).not.toThrowError();
			});
		});

		describe("Given invalid arbitrary parameters", () => {
			const values = new TestValues().excludeByName(["undefined"]);
			test.each(values)("throws an error for value: $name", ({ value }) => {
				expect(() => new DateRange().getWeek(value)).toThrowError();
			});
		});

		describe("Given invalid expected parameters", () => {
			describe("refDate", () => {
				test("throws error if refDate is invalid", () => {
					const dateRange = new DateRange();
					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getWeek({ refDate: "test" }),
					).toThrowError();

					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getWeek({ refDate: 1 }),
					).toThrowError();
				});

				test("doesn't throw error if refDate is a valid JS Date", () => {
					const dateRange = new DateRange();
					expect(() =>
						dateRange.getWeek({
							refDate: new Date(),
						}),
					).not.toThrowError();
				});
			});

			describe("refWeekday", () => {
				test("throws error if refWeekday is invalid", () => {
					const dateRange = new DateRange();
					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getWeek({ refWeekday: "test" }),
					).toThrowError();
					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getWeek({ refWeekday: 0 }),
					).toThrowError();
					expect(() =>
						// @ts-expect-error: testing invalid inputs
						dateRange.getWeek({ refWeekday: 8 }),
					).toThrowError();
				});
			});

			describe("offset", () => {
				test.each([-1, 0.5, Infinity, "test"])(
					"throws an error if endOffset is invalid: %s",
					(value) => {
						expect(() =>
							// @ts-expect-error: testing invalid inputs
							new DateRange().getWeek({ endOffset: value }),
						).toThrowError();
					},
				);

				test.each([-1, 0.5, Infinity, "test"])(
					"throws an error if startOffset is invalid: %s",
					(value) => {
						expect(() =>
							// @ts-expect-error: testing invalid inputs
							new DateRange().getWeek({ startOffset: value }),
						).toThrowError();
					},
				);
			});
		});
	});

	describe("Functionality", () => {
		describe("Given no parameters", () => {
			it("should create 7 dates over multiple calls", () => {
				const dateRange = new DateRange();

				for (let i = 0; i < 10; i++) {
					const result = dateRange.getWeek();
					const dates = result.dates;
					expect(dates.length).toEqual(7);
					dates.forEach((date) =>
						expect(DateTime.isDateTime(date)).toBeTruthy(),
					);
				}
			});

			test("getWeek includes the refDate and starts on the refWeekday", () => {
				// The loop ensures that the result is the same for repeated calls
				for (let i = 0; i < 3; i++) {
					const dateRange = new DateRange();
					const dates = dateRange.getWeek().dates;
					const instanceRefDate = dateRange.refDate;
					const instanceRefWeekday = dateRange.refWeekday;

					if (!instanceRefDate) {
						throw new Error(
							"instanceRefDate is not defined after calling the getWeek() method",
						);
					}
					expect(
						dates.find(
							(date) => date.toISODate() === instanceRefDate.toISODate(),
						),
					).toBeTruthy();

					expect(dates[0].weekday).toEqual(instanceRefWeekday);

					// Expect the first date in the array is a refDate or is before the refDate
					expect(dates[0].valueOf()).toBeLessThanOrEqual(
						instanceRefDate.valueOf(),
					);
				}
			});

			test("getWeek starts on a refDate or starts on a date that is before the refDate", () => {
				// The loop ensures that the result is the same for repeated calls
				for (let i = 0; i < 3; i++) {
					const dateRange = new DateRange().getWeek();
					const dates = dateRange.getWeek().dates;
					const { refDate } = dateRange;

					if (!refDate) {
						throw new Error(
							"instanceRefDate is not defined after calling the getWeek() method",
						);
					}

					expect(dates[0].valueOf()).toBeLessThanOrEqual(refDate.valueOf());
				}
			});

			test("each date of an array starts at the beginning of the day", () => {
				for (let i = 0; i < 3; i++) {
					const dateRange = new DateRange();
					const dates = dateRange.getWeek().dates;

					dates.forEach((date) => {
						expect(date.toISO()).toBe(date.startOf("day").toISO());
					});
				}
			});

			test("Monday is the first date of the range", () => {
				for (let i = 0; i < 3; i++) {
					const dateRange = new DateRange();
					const dates = dateRange.getWeek().dates;

					expect(dates[0].weekday).toEqual(WEEKDAY.Monday);
				}
			});
		});

		describe("Given options parameter", () => {
			describe("with refDate and refWeekday", () => {
				it("should create 7 dates over multiple calls", () => {
					const dateRange = new DateRange();

					for (let i = 0; i < 10; i++) {
						const randomRefDate = getRandomDateTime();
						const randomRefWeekday = getRandomWeekday();

						const dates = dateRange.getWeek({
							refDate: randomRefDate,
							refWeekday: randomRefWeekday,
						}).dates;

						expect(dates.length).toEqual(7);
						dates.forEach((date) =>
							expect(DateTime.isDateTime(date)).toBeTruthy(),
						);
					}
				});

				test("getWeek includes the refDate and starts on the refWeekday", () => {
					const dateRange = new DateRange();

					for (let i = 0; i < 10; i++) {
						// Random date to iterate along with every possible weekday
						const randomRefDate = getRandomDateTime();

						// Loop through each weekday from 1 to 7 with random date specified in the outer loop
						for (let weekday = 1; weekday <= 7; weekday++) {
							// Call the eachDayOfWeek() method with the refDate and refWeekday options
							const dates = dateRange.getWeek({
								refDate: randomRefDate,
								refWeekday: weekday,
							}).dates;

							// Expect that one of the dates in the array matches the refDate option
							expect(
								dates.find(
									(date) => date.toISODate() === randomRefDate.toISODate(),
								),
							).toBeTruthy();

							// Expect that the first date in the array matches the refWeekday option
							expect(dates[0].weekday).toEqual(weekday);

							// Expect the first day in the array is a refDate or before or the refDate
							expect(dates[0].valueOf()).toBeLessThanOrEqual(
								randomRefDate.valueOf(),
							);
						}
					}
				});

				test("getWeek starts on a refDate or starts on a date that is before the refDate", () => {
					const dateRange = new DateRange();

					for (let i = 0; i < 10; i++) {
						const randomRefDate = getRandomDateTime();
						const randomRefWeekday = getRandomWeekday();
						const dates = dateRange.getWeek({
							refDate: randomRefDate,
							refWeekday: randomRefWeekday,
						}).dates;

						expect(dates[0].valueOf()).toBeLessThanOrEqual(
							randomRefDate.valueOf(),
						);
					}
				});

				test("each date of an array should start at the beginning of the day", () => {
					const dateRange = new DateRange();

					for (let i = 0; i < 10; i++) {
						const randomRefDate = getRandomDateTime();
						const randomRefWeekday = getRandomWeekday();

						const dates = dateRange.getWeek({
							refDate: randomRefDate,
							refWeekday: randomRefWeekday,
						}).dates;

						dates.forEach((date) => {
							expect(date.toISO()).toBe(date.startOf("day").toISO());
						});
					}
				});

				test("Monday is the first day of the array with specified refDate option", () => {
					const dateRange = new DateRange();

					for (let i = 0; i < 10; i++) {
						const randomRefDate = getRandomDateTime();

						const dates = dateRange.getWeek({
							refDate: randomRefDate,
						}).dates;

						expect(dates[0].weekday).toEqual(WEEKDAY.Monday);
					}
				});
			});

			describe("with offset specified", () => {
				test("length of the extended array is equal default array plus offset", () => {
					const startOffset = 2;
					const endOffset = 2;

					const defaultWeekRange = new DateRange().getWeek();
					const extendedWeekRange = new DateRange().getWeek({
						startOffset,
						endOffset,
					});

					expect(
						defaultWeekRange.dates.length + startOffset + endOffset,
					).toEqual(extendedWeekRange.dates.length);

					//with specified refDate
					const refDate = DateTime.fromISO("2020-01-01");
					const weekRange2 = new DateRange().getWeek({
						refDate,
					});
					const extendedWeekRange2 = new DateRange().getWeek({
						refDate,
						startOffset,
						endOffset,
					});

					expect(weekRange2.dates.length + startOffset + endOffset).toEqual(
						extendedWeekRange2.dates.length,
					);
				});

				describe("with startOffset", () => {
					test("the range is extended by adding extra days at the beginning of the array, with a one-day interval between each day", () => {
						const startOffset = 5;
						const refDate = DateTime.fromISO("2020-01-01");

						const defaultWeekRange = new DateRange().getWeek({
							refDate,
						}).dates;
						const extendedWeekRange = new DateRange().getWeek({
							refDate,
							startOffset,
						}).dates;

						// find the index of the first element of the default range in the extended range
						const defaultRangeFirstIndex = extendedWeekRange.findIndex(
							(date) => date.equals(defaultWeekRange[0]),
						);

						// loop over the extended range from the first element of the
						// default range to the first element of the extended range
						for (let i = defaultRangeFirstIndex; i > 0; i--) {
							// check if the current element equals to the previous element plus one unit of time
							expect(extendedWeekRange[i].valueOf()).toEqual(
								extendedWeekRange[i - 1].plus({ days: 1 }).valueOf(),
							);
						}
					});
				});

				describe("with endOffset", () => {
					test("the range is extended by adding extra days at the end of the array, with a one-day interval between each day", () => {
						const endOffset = 2;
						const refDate = DateTime.fromISO("2020-01-01");

						const defaultWeekRange = new DateRange().getWeek({
							refDate,
						}).dates;
						const extendedWeekRange = new DateRange().getWeek({
							refDate,
							endOffset,
						}).dates;

						// find the index of the last element of the default range in the extended range
						const defaultRangeEndIndex = extendedWeekRange.findIndex((date) =>
							date.equals(defaultWeekRange[defaultWeekRange.length - 1]),
						);

						// loop over the extended range from the first element of the
						// default array to the first element of the extended range
						for (let i = defaultRangeEndIndex; i > 0; i--) {
							// check if the current element equals to the previous element plus one unit of time
							expect(extendedWeekRange[i].valueOf()).toEqual(
								extendedWeekRange[i - 1].plus({ days: 1 }).valueOf(),
							);
						}
					});
				});
			});
		});
	});
});

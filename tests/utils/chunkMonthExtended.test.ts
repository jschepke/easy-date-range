import { DateRange } from "../../src/dateRange";
import { chunkMonthExtended } from "../../src/utils";
import { DateTime } from "luxon";
import { describe, expect, expectTypeOf, it, test } from "vitest";

describe("chunkMonthExtended", () => {
	describe("input validation", () => {
		test("throws an error if no arguments are specified", () => {
			// @ts-expect-error: testing invalid input
			expect(() => chunkMonthExtended()).toThrowError();
		});
		test("throws an error if dateRange argument isn't instance of DateRage", () => {
			// @ts-expect-error: testing invalid input
			expect(() => chunkMonthExtended("invalid")).toThrowError();
		});
		test("throws an error if dateRange argument is valid DateRange instance but generated range is not type MONTH-EXTENDED", () => {
			expect(() =>
				chunkMonthExtended(new DateRange().getMonthExact()),
			).toThrowError();
		});
		test.each(["invalid", 1, {}, []])(
			"throws an error if the second argument is not valid. Tested value: %j",
			(value) => {
				expect(() =>
					chunkMonthExtended(new DateRange().getMonthExtended(), {
						// @ts-expect-error: testing invalid input
						nullNextPrevDates: value,
					}),
				).toThrowError();
			},
		);
	});

	describe("functionality", () => {
		const dateStrings = [
			"2023-01-01",
			"1990-05-24",
			"2015-12-31",
			"2008-07-14",
			"2021-04-26",
			"2003-09-11",
			"2019-10-30",
			"2006-02-28",
			"2014-06-15",
			"2020-08-08",
		];

		describe("With nullExtendedDates option set to false (default)", () => {
			describe.each(dateStrings)("with refDate: %s", (dateString) => {
				test("returns an array of DateTime arrays, each with a length of 7", () => {
					const chunk = chunkMonthExtended(
						new DateRange().getMonthExtended({
							refDate: new Date(dateString),
						}),
					);
					// check if the result is an array
					expectTypeOf(chunk).toBeArray();
					// check if each item in the chunk is an array of 7 DateTime objects
					chunk.forEach((dates) => {
						expectTypeOf(dates).toBeArray();
						expect(dates.length).toBe(7);
						dates.forEach((date) => {
							expect(date).toBeInstanceOf(DateTime);
						});
					});
				});

				test("chunk contains all dateTimes from the passed dateRange", () => {
					const dateRange = new DateRange().getMonthExtended({
						refDate: new Date(dateString),
					});
					const dateTimes = dateRange.toDateTimes();
					const chunk = chunkMonthExtended(dateRange);

					let index = 0;
					// loop through the chunk array and compare each element with the corresponding element in the dateTimes array
					chunk.forEach((dates) => {
						dates.forEach((date) => {
							expect(date).toEqual(dateTimes[index]);
							index++;
						});
					});

					// check if chunk has the same number of elements as the dateTimes
					expect(index).toBe(dateTimes.length);
				});
			});
		});

		describe("with nullExtendedDates option set to true", () => {
			describe.each(dateStrings)("with refDate: %s", (dateString) => {
				test("returns an array of DateTime or null arrays, each with a length of 7", () => {
					const chunk = chunkMonthExtended(
						new DateRange().getMonthExtended({ refDate: new Date(dateString) }),
						{ nullNextPrevDates: true },
					);
					// check if the result is an array
					expectTypeOf(chunk).toBeArray();
					// check if each item in the chunk is an array of 7 elements (DateTime or null)
					chunk.forEach((dates) => {
						expectTypeOf(dates).toBeArray();
						expect(dates.length).toBe(7);
						dates.forEach((date) => {
							date === null
								? expectTypeOf(date).toBeNull()
								: expect(date).toBeInstanceOf(DateTime);
						});
					});
				});

				test("chunk contains only current month dates, previous and next dates are null", () => {
					const dateRange = new DateRange().getMonthExtended();
					const currentMonth = dateRange.refDate.month;
					const dateTimes = dateRange.toDateTimes();
					const chunk = chunkMonthExtended(dateRange, {
						nullNextPrevDates: true,
					});

					// get the indexes of the dates that are not in the current month
					const getNextPrevIndexes = dateRange.dateTimes
						.map((dateTime, index) => {
							if (dateTime.month !== currentMonth) return index;
						})
						.filter((index) => index !== undefined);

					let index = 0;
					// loop through the chunk array and compare each element with the corresponding element in the dateTimes array
					chunk.forEach((dates) => {
						dates.forEach((date) => {
							if (getNextPrevIndexes.includes(index)) {
								expect(date).toBeNull();
							} else {
								expect(date).toEqual(dateTimes[index]);
							}
							index++;
						});
					});

					// check if chunk has the same number of elements as the dateTimes
					expect(index).toBe(dateTimes.length);
				});
			});
		});
	});
});

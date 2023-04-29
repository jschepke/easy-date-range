import { DateTime, DurationUnit } from "luxon";
import { describe, expect, test } from "vitest";

import { extendRange } from "../src/extendRange";
import { durationUnitKeys } from "../src/utils";

describe("extendRange", () => {
	describe("general functionality", () => {
		//test if the function returns an array of DateTime objects that represents the extended range
		test("should return an extended range", () => {
			//some valid values for the options
			const rangeToExtend = [
				DateTime.fromISO("2020-01-01"),
				DateTime.fromISO("2020-01-02"),
				DateTime.fromISO("2020-01-03"),
			];
			const timeUnit = "days";
			const startOffset = 2;
			const endOffset = 3;

			//call the function with the options and store the result
			const result = extendRange({
				rangeToExtend,
				timeUnit,
				startOffset,
				endOffset,
			});

			//expect the result to be an array of DateTime objects
			expect(Array.isArray(result)).toBe(true);
			expect(result.every((dt) => dt instanceof DateTime)).toBe(true);

			//expect the result to have the same length as the rangeToExtend plus the offset values
			expect(result.length).toBe(
				rangeToExtend.length + startOffset + endOffset,
			);

			// expect the result to contain the original rangeToExtend plus
			// the added elements at the start and end
			expect(result.slice(startOffset, -endOffset)).toEqual(rangeToExtend);
			expect(result[0]).toEqual(
				rangeToExtend[0].minus({ [timeUnit]: startOffset }),
			);
			expect(result[result.length - 1]).toEqual(
				rangeToExtend[rangeToExtend.length - 1].plus({
					[timeUnit]: endOffset,
				}),
			);
		});
	});

	describe("input validation", () => {
		test("should throw an error when rangeToExtend is invalid", () => {
			//some invalid values for rangeToExtend
			const invalidValues = [
				null,
				undefined,
				42,
				"foo",
				[1, 2, 3],
				[DateTime.local(), "bar"],
				[DateTime.invalid("invalid"), DateTime.local()],
			];

			//loop through the invalid values and expect the function to throw an error
			for (const value of invalidValues) {
				expect(() =>
					extendRange({
						// @ts-expect-error: testing invalid input
						rangeToExtend: value,
						timeUnit: "days",
						startOffset: 1,
						endOffset: 1,
					}),
				).toThrowError();
			}
		});

		test("should throw an error when startOffset is invalid", () => {
			//some invalid values for startOffset
			const invalidValues = [null, undefined, "foo", -1, -42, NaN, Infinity];

			//loop through the invalid values and expect the function to throw an error
			for (const value of invalidValues) {
				expect(() =>
					extendRange({
						rangeToExtend: [DateTime.local()],
						timeUnit: "days",
						// @ts-expect-error: testing invalid input
						startOffset: value,
						endOffset: 1,
					}),
				).toThrowError();
			}
		});

		test("should throw an error when endOffset is invalid", () => {
			//some invalid values for endOffset
			const invalidValues = [null, undefined, "foo", -1, -42, NaN, Infinity];

			//loop through the invalid values and expect the function to throw an error
			for (const value of invalidValues) {
				expect(() =>
					extendRange({
						rangeToExtend: [DateTime.local()],
						timeUnit: "days",
						startOffset: 1,
						// @ts-expect-error: testing invalid input
						endOffset: value,
					}),
				).toThrowError();
			}
		});

		test("should throw an error when timeUnit is invalid", () => {
			//some invalid values for timeUnit
			const invalidValues = [null, undefined, 42, "foo"];

			//loop through the invalid values and expect the function to throw an error
			for (const value of invalidValues) {
				expect(() =>
					extendRange({
						rangeToExtend: [DateTime.local()],
						// @ts-expect-error: testing invalid input
						timeUnit: value,
						startOffset: 1,
						endOffset: 1,
					}),
				).toThrowError();
			}
		});
	});

	describe("endOffset option", () => {
		// const timeUnits: DurationUnit[] = [`day`, 'days', 'hours', 'seconds'];
		const timeUnits: DurationUnit[] = durationUnitKeys;

		test("the extended range has the correct length and each element matches the expected date when timeUnit is days", () => {
			// arrange
			const rangeToExtend = [
				DateTime.fromISO("2020-01-01"),
				DateTime.fromISO("2020-01-02"),
				DateTime.fromISO("2020-01-03"),
			];
			const timeUnit = "days";
			const startOffset = 0;
			const endOffset = 2;

			// act
			const extendedRange = extendRange({
				rangeToExtend,
				timeUnit,
				startOffset,
				endOffset,
			});

			// assert
			expect(extendedRange.length).toBe(5);
			expect(extendedRange[0]).toEqual(DateTime.fromISO("2020-01-01"));
			expect(extendedRange[1]).toEqual(DateTime.fromISO("2020-01-02"));
			expect(extendedRange[2]).toEqual(DateTime.fromISO("2020-01-03"));
			expect(extendedRange[3]).toEqual(DateTime.fromISO("2020-01-04"));
			expect(extendedRange[4]).toEqual(DateTime.fromISO("2020-01-05"));
		});

		test.each(timeUnits)(
			"the extended range has the correct length and each element equals to the next element minus one unit of time when timeUnit is %s",
			(timeUnit) => {
				// arrange
				const rangeToExtend = [
					DateTime.fromISO("2020-01-01T00:00:00"),
					DateTime.fromISO("2020-01-01T01:00:00"),
					DateTime.fromISO("2020-01-01T02:00:00"),
				];
				const startOffset = 0;
				const endOffset = 2;

				// act
				const extendedRange = extendRange({
					rangeToExtend,
					timeUnit,
					startOffset,
					endOffset,
				});

				expect(extendedRange.length).toBe(5);

				// find the index of the last element of the original array in the extended range
				const lastIndex = extendedRange.findIndex((date) =>
					date.equals(rangeToExtend[rangeToExtend.length - 1]),
				);

				// loop over the extended range from the last element of the
				// original array to the last element of the extended range
				for (let i = lastIndex; i < extendedRange.length - 1; i++) {
					// check if the current element equals to the next element minus one unit of time
					expect(extendedRange[i]).toEqual(
						extendedRange[i + 1].minus({ [timeUnit]: 1 }),
					);
				}
			},
		);
	});

	describe("startOffset option", () => {
		// const timeUnits: DurationUnit[] = [`day`, 'days', 'hours', 'seconds'];
		const timeUnits: DurationUnit[] = durationUnitKeys;

		test("the extended range has the correct length and each element matches the expected date when timeUnit is days", () => {
			// arrange
			const rangeToExtend = [
				DateTime.fromISO("2020-01-01"),
				DateTime.fromISO("2020-01-02"),
				DateTime.fromISO("2020-01-03"),
			];
			const timeUnit = "days";
			const startOffset = 2;
			const endOffset = 0;

			// act
			const extendedRange = extendRange({
				rangeToExtend,
				timeUnit,
				startOffset,
				endOffset,
			});

			// assert
			expect(extendedRange.length).toBe(5);
			expect(extendedRange[0]).toEqual(DateTime.fromISO("2019-12-30"));
			expect(extendedRange[1]).toEqual(DateTime.fromISO("2019-12-31"));
			expect(extendedRange[2]).toEqual(DateTime.fromISO("2020-01-01"));
			expect(extendedRange[3]).toEqual(DateTime.fromISO("2020-01-02"));
			expect(extendedRange[4]).toEqual(DateTime.fromISO("2020-01-03"));
		});

		// tests for different time units
		test.each(timeUnits)(
			"the extended range has the correct length and each element equals to the previous element plus one unit of time when timeUnit is %s",
			(timeUnit) => {
				// arrange
				const rangeToExtend = [
					DateTime.fromISO("2020-01-01T00:00:00"),
					DateTime.fromISO("2020-01-01T01:00:00"),
					DateTime.fromISO("2020-01-01T02:00:00"),
				];
				const startOffset = 2;
				const endOffset = 0;

				const extendedRange = extendRange({
					rangeToExtend,
					timeUnit,
					startOffset,
					endOffset,
				});

				expect(extendedRange.length).toBe(5);

				// find the index of the first element of the original array in the extended range
				const firstIndex = extendedRange.findIndex((date) =>
					date.equals(rangeToExtend[0]),
				);

				// loop over the extended range from the first element of the
				// original array to the first element of the extended range
				for (let i = firstIndex; i > 0; i--) {
					// check if the current element equals to the previous element plus one unit of time
					expect(extendedRange[i].valueOf()).toEqual(
						extendedRange[i - 1].plus({ [timeUnit]: 1 }).valueOf(),
					);
				}
			},
		);
	});
});

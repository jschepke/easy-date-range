import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

import { WEEKDAY } from "../../src/constants";
import type { DateRangeOptions } from "../../src/dateRange";
import { isObject, isValidOffset, isValidWeekday } from "../../src/utils";
import { validateDateRangeOptions } from "../../src/validators/validateDateRangeOptions";

describe("validateDateRangeOptions", () => {
	const invalidInputValues = [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
	];

	const validDateRangeOptions: DateRangeOptions = {
		endOffset: 2,
		startOffset: 1,
		refDate: DateTime.fromISO("2021-01-01"),
		refWeekday: 2,
	};

	describe("Given no input to the function itself", () => {
		test("throws an error if value parameter is not specified", () => {
			// @ts-expect-error: testing invalid input
			expect(() => validateDateRangeOptions()).toThrowError();
		});
	});

	// test for no arguments passed for validation
	describe("Given undefined parameter input (no arguments passed for validation)", () => {
		test("doesn't return anything", () => {
			expect(validateDateRangeOptions(undefined)).toBeUndefined();
		});
	});

	describe("Given a non-object as input, except undefined", () => {
		const nonObjectValues = invalidInputValues.filter(
			(value) =>
				!isObject(value.invalidInput) && value.invalidInput !== undefined,
		);
		test.each(nonObjectValues)(
			"throws an error if input is $invalidInput",
			({ invalidInput }) => {
				expect(() => validateDateRangeOptions(invalidInput)).toThrowError();
			},
		);
	});

	describe("Given an object with unexpected properties", () => {
		test.each([{ test: "test" }, { test: "test", refDate: "test" }])(
			"throws an error if input is %o ",
			(object) => {
				expect(() => validateDateRangeOptions(object)).toThrowError();
			},
		);
	});

	describe("Given object with expected properties", () => {
		describe("refDate property", () => {
			describe("Given a valid refDate", () => {
				// values
				const validRefDateValues = [
					{ description: "current Date: new Date()", value: new Date() },
					{
						description: "specific Date: new Date(2021, 11, 25)",
						value: new Date(2021, 11, 25),
					},
					{
						description: "current DateTime: DateTime.now()",
						value: DateTime.now(),
					},
					{
						description: 'specific DateTime: DateTime.fromISO("2021-12-25")',
						value: DateTime.fromISO("2021-12-25"),
					},
				];

				// tests
				test.each(validRefDateValues)(
					`doesn't throw error if refDate is $description`,
					(item) => {
						expect(() =>
							validateDateRangeOptions({
								...validDateRangeOptions,
								refDate: item.value,
							}),
						).not.toThrowError();
					},
				);
			});

			describe("Given a non valid refDate", () => {
				// filter valid refDate values
				const filter = invalidInputValues.filter(
					(item) => item.invalidInput !== undefined,
				);

				// add invalid values specific to refDate
				const invalidRefDateValues = [
					{ invalidInput: new Date("invalid") },
					{ invalidInput: DateTime.invalid("invalid") },
					...filter,
				];

				test.each(invalidRefDateValues)(
					"throws an error if refDate is $invalidInput",
					({ invalidInput: invalidValue }) => {
						expect(() =>
							validateDateRangeOptions({ refDate: invalidValue }),
						).toThrowError();
					},
				);
			});
		});
	});

	describe("refWeekday property", () => {
		describe("Given a valid refWeekday", () => {
			// test for all valid values
			test.each([1, 2, 3, 4, 5, 6, 7])(
				"doesn't throw error if refWeekday is %d",
				(num) => {
					expect(() => validateDateRangeOptions({ refWeekday: num }));
				},
			);
		});

		describe("Given a non valid refWeekday", () => {
			// filter out valid refWeekday values
			const filter = invalidInputValues.filter(
				(item) =>
					!isValidWeekday(item.invalidInput) && item.invalidInput !== undefined,
			);
			// add invalid values specific to refWeekday
			const invalidRefWeekdayValues = [
				{ invalidInput: -1 },
				{ invalidInput: 0 },
				{ invalidInput: 8 },
				...filter,
			];

			test.each(invalidRefWeekdayValues)(
				"throws an error if refWeekday is $invalidInput",
				({ invalidInput }) => {
					expect(() =>
						validateDateRangeOptions({ refWeekday: invalidInput }),
					).toThrowError();
				},
			);
		});
	});

	describe("Offset properties", () => {
		const invalidOffsetValues = invalidInputValues.filter(
			(item) =>
				!isValidOffset(item.invalidInput) && item.invalidInput !== undefined,
		);

		const validOffsetValues = [0, 1, 123];

		describe("startOffset property", () => {
			describe("Given a valid startOffset", () => {
				test.each(validOffsetValues)(
					"doesn't throw error if startOffset is %d",
					(num) => {
						expect(() =>
							validateDateRangeOptions({
								...validDateRangeOptions,
								startOffset: num,
							}),
						).not.toThrowError();
					},
				);
			});

			describe("Given a non valid startOffset", () => {
				test.each(invalidOffsetValues)(
					"throws an error if startOffset is $invalidInput",
					({ invalidInput }) => {
						expect(() =>
							validateDateRangeOptions({
								...validDateRangeOptions,
								startOffset: invalidInput,
							}),
						).toThrowError();
					},
				);
			});
		});

		describe("endOffset property", () => {
			describe("Given a valid endOffset", () => {
				test.each(validOffsetValues)(
					"doesn't throw error if endOffset is %d",
					(num) => {
						expect(() =>
							validateDateRangeOptions({
								...validDateRangeOptions,
								endOffset: num,
							}),
						).not.toThrowError();
					},
				);
			});
			describe("Given a non valid endOffset", () => {
				test.each(invalidOffsetValues)(
					"throws an error if endOffset is $invalidInput",
					({ invalidInput }) => {
						expect(() =>
							validateDateRangeOptions({ endOffset: invalidInput }),
						).toThrowError();
					},
				);
			});
		});
	});

	describe("Mixed properties of the input object", () => {
		describe("Given an object with mixed expected properties with valid values", () => {
			// some valid inputs
			const validInputs: DateRangeOptions[] = [
				{
					refDate: DateTime.now(),
					refWeekday: WEEKDAY.Saturday,
					endOffset: 3,
					startOffset: 1,
				},
				{
					refDate: DateTime.now(),
					refWeekday: WEEKDAY.Monday,
					startOffset: 2,
					endOffset: 6,
				},
				{
					refWeekday: 3,
					refDate: new Date(2021, 11, 25),
					endOffset: 5,
					startOffset: 0,
				},
				{
					refDate: DateTime.fromObject({ year: 2025, month: 3, day: 30 }),
					refWeekday: 5,
					endOffset: 0,
					startOffset: 0,
				},

				{
					refDate: new Date(2022, 0, 1), // replaced with JS Date object
					refWeekday: WEEKDAY.Sunday,
					endOffset: 4,
					startOffset: 2,
				},
				{
					refDate: new Date(2018, 4, 1),
					refWeekday: WEEKDAY.Wednesday,
					endOffset: 3,
					startOffset: 0,
				},
			];

			test.each(validInputs)(`doesn't return anything for %s`, (input) => {
				expect(() => validateDateRangeOptions(input)).not.toThrowError();
				expect(validateDateRangeOptions(input)).toBeUndefined();
			});
		});

		describe("Given an object with mixed expected and unexpected properties", () => {
			const invalidInputs = [
				{
					refDate: DateTime.fromISO("invalid"), // invalid DateTime
					refWeekday: WEEKDAY.Saturday,
					endOffset: 3,
					startOffset: 1,
				},
				{
					refWeekday: WEEKDAY.Monday,
					startOffset: -1, // invalid offset
				},
				{
					refDate: new Date("test"), // invalid Date
					endOffset: 5,
				},
				{
					endOffset: "1", // invalid offset
					startOffset: 3,
				},
				{
					refDate: DateTime.now().plus({ days: 2 }),
					refWeekday: "friday", // invalid
				},
				{
					refDate: new Date(2022, 0, 1),
					refWeekday: null, // invalid
					endOffset: 4,
					startOffset: null, // invalid
				},
				{
					refWeekday: 9, // invalid
					endOffset: 3,
				},
				{
					refDate: DateTime.now().minus({ days: 2 }),
					startOffset: [], // invalid
				},
			];

			test.each(invalidInputs)(
				"throws an errors if unexpected property is provided: %s",
				(input) => {
					expect(() => validateDateRangeOptions(input)).toThrowError();
				},
			);
		});
	});
});

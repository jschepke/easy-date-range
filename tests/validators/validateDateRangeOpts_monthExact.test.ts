import { describe, expect, test } from "vitest";

import { DateTime } from "luxon";

import { WEEKDAY } from "../../src/constants";
import type {
	DateRangeOpts,
	DateRangeOpts_MonthExact,
} from "../../src/dateRange";
import { validateDateRangeOptions_monthExact } from "../../src/validators";

import {
	TestValues,
	isValidRefDateTestValues,
	offsetTestValues,
	weekdayTestValues,
} from "../testUtils";

describe("validateDateRangeOpts_monthExact", () => {
	describe("Input validation", () => {
		describe("Given no parameters", () => {
			test("throws an error parameters are not provided", () => {
				// @ts-expect-error: testing invalid input
				expect(() => validateDateRangeOptions_monthExact()).toThrowError();
			});
		});

		// test for no arguments passed for validation
		describe("Given parameter is undefined (no arguments passed for validation)", () => {
			test("doesn't return anything", () => {
				expect(validateDateRangeOptions_monthExact(undefined)).toBeUndefined();
			});
		});
	});

	describe("Functionality", () => {
		describe("Given unexpected value to options parameter", () => {
			const testValues = new TestValues().excludeByName(["undefined"]);
			test.each(testValues)(
				"throws an error if options param is $name",
				({ value }) => {
					expect(() =>
						validateDateRangeOptions_monthExact(value),
					).toThrowError();
				},
			);
		});
	});

	describe("Given object with expected properties", () => {
		describe("refDate property", () => {
			describe("Given a valid refDate", () => {
				describe("Given valid refDate values", () => {
					test.each(isValidRefDateTestValues.valid)(
						"doesn't throw error if refDate is $name",
						(value) => {
							expect(() =>
								validateDateRangeOptions_monthExact({
									refDate: value,
								}),
							).not.toThrowError();
						},
					);
				});

				describe("Given invalid refDate values", () => {
					test.each(isValidRefDateTestValues.invalid)(
						"throws an error if refDate is $name",
						({ value }) => {
							// exclude undefined from test values
							if (value === undefined) return;

							expect(() =>
								validateDateRangeOptions_monthExact({
									refDate: value,
								}),
							).toThrowError();
						},
					);
				});
			});
		});
	});

	describe("Offset properties", () => {
		const { valid } = offsetTestValues;
		// exclude undefined from test values
		const invalid = offsetTestValues.invalid.filter(
			(obj) => obj.name !== "undefined",
		);

		describe("startOffset property", () => {
			describe("Given a valid startOffset", () => {
				test.each(valid)(
					"doesn't throw error if startOffset is $name",
					(value) => {
						expect(() =>
							validateDateRangeOptions_monthExact({
								startOffset: value,
							}),
						).not.toThrowError();
					},
				);
			});

			describe("Given a non valid startOffset", () => {
				test.each(invalid)(
					"throws an error if startOffset is $name",
					({ value }) => {
						expect(() =>
							validateDateRangeOptions_monthExact({
								startOffset: value,
							}),
						).toThrowError();
					},
				);
			});
		});

		describe("endOffset property", () => {
			describe("Given a valid endOffset", () => {
				test.each(valid)(
					"doesn't throw error if endOffset is $name",
					(value) => {
						expect(() =>
							validateDateRangeOptions_monthExact({
								endOffset: value,
							}),
						).not.toThrowError();
					},
				);
			});
			describe("Given a non valid endOffset", () => {
				test.each(invalid)(
					"throws an error if endOffset is $name",
					({ value }) => {
						expect(() =>
							validateDateRangeOptions_monthExact({ endOffset: value }),
						).toThrowError();
					},
				);
			});
		});
	});

	describe("Mixed properties", () => {
		describe("Given an object with mixed valid properties", () => {
			// some valid inputs
			const opts: DateRangeOpts_MonthExact[] = [
				{
					refDate: DateTime.now(),
					endOffset: 3,
					startOffset: 1,
				},
				{
					refDate: DateTime.now(),
					startOffset: 2,
					endOffset: 6,
				},
				{
					refDate: new Date(2021, 11, 25),
					endOffset: 5,
					startOffset: 0,
				},
				{
					refDate: DateTime.fromObject({ year: 2025, month: 3, day: 30 }),
					endOffset: 0,
					startOffset: 0,
				},

				{
					refDate: new Date(2022, 0, 1),
					endOffset: 4,
					startOffset: 2,
				},
				{
					refDate: new Date(2018, 4, 1),
					endOffset: 3,
					startOffset: 0,
				},
			];

			test.each(opts)(`doesn't return anything for %s`, (input) => {
				expect(() =>
					validateDateRangeOptions_monthExact(input),
				).not.toThrowError();
				expect(validateDateRangeOptions_monthExact(input)).toBeUndefined();
			});
		});

		describe("Given an object with valid and non valid properties", () => {
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
				{
					invalid: "invalid",
				},
			];

			test.each(invalidInputs)(
				"throws an errors if non valid property is provided. Index of test object %#",
				(input) => {
					expect(() =>
						validateDateRangeOptions_monthExact(input),
					).toThrowError();
				},
			);
		});
	});
});

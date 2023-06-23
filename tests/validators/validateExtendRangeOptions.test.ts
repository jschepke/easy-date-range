import { describe, expect, test } from "vitest";

import { DateTime } from "luxon";

import type { ExtendRangeOptions } from "../../src/extendRange";

import { DURATION_UNITS } from "../../src/constants";
import { InvalidParameterError } from "../../src/errors";
import { validateExtendRangeOptions } from "../../src/validators/validateExtendRangeOptions";
import { offsetTestValues } from "../testUtils";
import { TestValues } from "../testUtils";

describe("validateExtendRangeOptions", () => {
	const validExtendRangeOptions: ExtendRangeOptions = {
		rangeToExtend: [DateTime.fromISO("2021-01-01")],
		timeUnit: "days",
		endOffset: 1,
		startOffset: 0,
	};

	describe("Given no input", () => {
		test("throws an error if input is not specified", () => {
			// @ts-expect-error: testing invalid input
			expect(() => validateExtendRangeOptions()).toThrowError();
		});
	});

	describe("Given a non-object as input", () => {
		test.each(new TestValues().getAll())(
			"throws an error if input is $name",
			({ value }) => {
				expect(() => validateExtendRangeOptions(value)).toThrowError();
			},
		);
	});

	describe("Given an object with unexpected properties", () => {
		test.each([{ test: "test" }, { test: "test", refDate: "test" }])(
			"throws an error if input is %o ",
			(object) => {
				expect(() => validateExtendRangeOptions(object)).toThrowError();
			},
		);
	});

	describe("Given object with expected properties", () => {
		describe("rangeToExtend property", () => {
			describe("Given a valid rangeToExtend value", () => {
				// some valid DateTime objects
				const validDate1 = DateTime.local(2021, 12, 25);
				const validDate2 = DateTime.local(2022, 1, 1);

				const validArrays = [
					{ rangeToExtend: [validDate1, validDate2] },
					{ rangeToExtend: [validDate2] },
				];

				test.each(validArrays)(
					"doesn't throw error if rangeToExtend is $rangeToExtend",
					({ rangeToExtend }) => {
						expect(() =>
							validateExtendRangeOptions({
								...validExtendRangeOptions,
								rangeToExtend,
							}),
						).not.toThrowError();
					},
				);
			});

			describe("Given a non-valid rangeToExtend value", () => {
				const values = [
					...new TestValues().getAll(),
					{ value: [DateTime.local(), "bar"], name: "invalid arr1" },
					{
						value: [DateTime.invalid("invalid"), DateTime.local()],
						name: "invalid arr2",
					},
					// valid JS Date objects
					{
						value: [new Date(), new Date(2021, 0, 1)],
						name: "invalid arr3",
					},
				];

				test.each(values)(
					"throws an error if rangeToExtend is $name",
					({ value }) => {
						expect(() =>
							validateExtendRangeOptions({
								rangeToExtend: value,
							}),
						).toThrowError(
							new InvalidParameterError(
								"rangeToExtend",
								value,
								"an array of DateTime",
							),
						);
					},
				);
			});
		});

		describe("timeUnit property", () => {
			describe("Given a valid timeUnit value", () => {
				test.each(DURATION_UNITS)(
					"doesn't throw error if timeUnit is %s",
					(timeUnit) => {
						expect(() =>
							validateExtendRangeOptions({
								...validExtendRangeOptions,
								timeUnit,
							} as ExtendRangeOptions),
						).not.toThrowError();
					},
				);
			});
			describe("Given a non-valid timeUnit value", () => {
				test.each(new TestValues().getAll())(
					"throws an error if timeUnit is $name",
					({ value }) => {
						expect(() => validateExtendRangeOptions(value)).toThrowError();
					},
				);
			});
		});

		describe("Offset properties", () => {
			const { invalid, valid } = offsetTestValues;

			describe("startOffset property", () => {
				describe("Given a valid startOffset", () => {
					test.each(valid)(
						"doesn't throw error if startOffset is %d",
						(startOffset) => {
							expect(() =>
								validateExtendRangeOptions({
									...validExtendRangeOptions,
									startOffset,
								} as ExtendRangeOptions),
							).not.toThrowError();
						},
					);
				});

				describe("Given a non valid startOffset", () => {
					test.each(invalid)(
						"throws an error if startOffset is $name",
						({ value }) => {
							expect(() =>
								validateExtendRangeOptions({
									startOffset: value,
								} as ExtendRangeOptions),
							).toThrowError();
						},
					);
				});
			});

			describe("endOffset property", () => {
				describe("Given a valid endOffset", () => {
					test.each(valid)(
						"doesn't throw error if endOffset is %d",
						(value) => {
							expect(() =>
								validateExtendRangeOptions({
									...validExtendRangeOptions,
									endOffset: value,
								} as ExtendRangeOptions),
							).not.toThrowError();
						},
					);
				});
				describe("Given a non valid endOffset", () => {
					test.each(invalid)(
						"throws an error if endOffset is $name",
						({ value }) => {
							expect(() =>
								validateExtendRangeOptions({
									endOffset: value,
								} as ExtendRangeOptions),
							).toThrowError();
						},
					);
				});
			});
		});
	});
});

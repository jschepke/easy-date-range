import { describe, expect, test } from "vitest";

import { validateExtendRangeOptions } from "../../src/validators";
import { DateTime } from "luxon";

import type { ExtendRangeOptions } from "../../src/extendRange";

import { DURATION_UNITS } from "../../src/constants";
import { InvalidParameterError } from "../../src/errors";
import { isObject, isValidOffset } from "../../src/utils";
import { invalidInputValues } from "../testUtils";

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
		const nonObjectValues = invalidInputValues.filter(
			(value) => !isObject(value.invalidInput),
		);
		test.each(nonObjectValues)(
			"throws an error if input is $invalidInput",
			({ invalidInput }) => {
				expect(() => validateExtendRangeOptions(invalidInput)).toThrowError();
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
				// invalid values with some additional ones specific for rangeToExtend
				const values = [
					...invalidInputValues,
					{ invalidInput: [DateTime.local(), "bar"] },
					{ invalidInput: [DateTime.invalid("invalid"), DateTime.local()] },
					// valid JS Date objects
					{ invalidInput: [new Date(), new Date(2021, 0, 1)] },
				];

				test.each(values)(
					"throws an error if rangeToExtend is $invalidInput",
					(value) => {
						expect(() =>
							validateExtendRangeOptions({
								rangeToExtend: value.invalidInput,
							}),
						).toThrowError(
							new InvalidParameterError(
								"rangeToExtend",
								value.invalidInput,
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
							}),
						).not.toThrowError();
					},
				);
			});
			describe("Given a non-valid timeUnit value", () => {
				test.each(invalidInputValues)(
					"throws an error if timeUnit is $invalidInput",
					({ invalidInput }) => {
						expect(() =>
							validateExtendRangeOptions(invalidInput),
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
						(startOffset) => {
							expect(() =>
								validateExtendRangeOptions({
									...validExtendRangeOptions,
									startOffset,
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
								validateExtendRangeOptions({ startOffset: invalidInput }),
							).toThrowError();
						},
					);
				});
			});

			describe("endOffset property", () => {
				describe("Given a valid endOffset", () => {
					test.each(validOffsetValues)(
						"doesn't throw error if endOffset is %d",
						(endOffset) => {
							expect(() =>
								validateExtendRangeOptions({
									...validExtendRangeOptions,
									endOffset,
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
								validateExtendRangeOptions({ endOffset: invalidInput }),
							).toThrowError();
						},
					);
				});
			});
		});
	});
});

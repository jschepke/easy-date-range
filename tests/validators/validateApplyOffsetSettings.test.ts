import { describe, expect, test } from "vitest";

import { DateTime } from "luxon";

import type { ApplyOffsetSettings } from "../../src/applyOffset";

import { DURATION_UNITS } from "../../src/constants";
import { InvalidParameterError } from "../../src/errors";
import { validateApplyOffsetSettings } from "../../src/validators/validateApplyOffsetSettings";
import { offsetTestValues } from "../testUtils";
import { TestValues } from "../testUtils";

describe("validateApplyOffsetSettings", () => {
	const validSettings: ApplyOffsetSettings = {
		rangeToAdjust: [DateTime.fromISO("2021-01-01")],
		timeUnit: "days",
		endOffset: 1,
		startOffset: 0,
	};

	describe("Given no input", () => {
		test("throws an error if input is not specified", () => {
			// @ts-expect-error: testing invalid input
			expect(() => validateApplyOffsetSettings()).toThrowError();
		});
	});

	describe("Given a non-object as input", () => {
		test.each(new TestValues().getAll())(
			"throws an error if input is $name",
			({ value }) => {
				expect(() => validateApplyOffsetSettings(value)).toThrowError();
			},
		);
	});

	describe("Given an object with unexpected properties", () => {
		test.each([{ test: "test" }, { test: "test", refDate: "test" }])(
			"throws an error if input is %o ",
			(object) => {
				expect(() => validateApplyOffsetSettings(object)).toThrowError();
			},
		);
	});

	describe("Given object with expected properties", () => {
		describe("rangeToAdjust property", () => {
			describe("Given a valid rangeToAdjust value", () => {
				// some valid DateTime objects
				const validDate1 = DateTime.local(2021, 12, 25);
				const validDate2 = DateTime.local(2022, 1, 1);

				const validArrays = [
					{ rangeToAdjust: [validDate1, validDate2] },
					{ rangeToAdjust: [validDate2] },
				];

				test.each(validArrays)(
					"doesn't throw error if rangeToAdjust is $rangeToAdjust",
					({ rangeToAdjust }) => {
						expect(() =>
							validateApplyOffsetSettings({
								...validSettings,
								rangeToAdjust,
							}),
						).not.toThrowError();
					},
				);
			});

			describe("Given a non-valid rangeToAdjust value", () => {
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
					"throws an error if rangeToAdjust is $name",
					({ value }) => {
						expect(() =>
							validateApplyOffsetSettings({
								rangeToAdjust: value,
							}),
						).toThrowError(
							new InvalidParameterError(
								"rangeToAdjust",
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
							validateApplyOffsetSettings({
								...validSettings,
								timeUnit,
							} as ApplyOffsetSettings),
						).not.toThrowError();
					},
				);
			});
			describe("Given a non-valid timeUnit value", () => {
				test.each(new TestValues().getAll())(
					"throws an error if timeUnit is $name",
					({ value }) => {
						expect(() => validateApplyOffsetSettings(value)).toThrowError();
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
								validateApplyOffsetSettings({
									...validSettings,
									startOffset,
								} as ApplyOffsetSettings),
							).not.toThrowError();
						},
					);
				});

				describe("Given a non valid startOffset", () => {
					test.each(invalid)(
						"throws an error if startOffset is $name",
						({ value }) => {
							expect(() =>
								validateApplyOffsetSettings({
									startOffset: value,
								} as ApplyOffsetSettings),
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
								validateApplyOffsetSettings({
									...validSettings,
									endOffset: value,
								} as ApplyOffsetSettings),
							).not.toThrowError();
						},
					);
				});
				describe("Given a non valid endOffset", () => {
					test.each(invalid)(
						"throws an error if endOffset is $name",
						({ value }) => {
							expect(() =>
								validateApplyOffsetSettings({
									endOffset: value,
								} as ApplyOffsetSettings),
							).toThrowError();
						},
					);
				});
			});
		});
	});
});

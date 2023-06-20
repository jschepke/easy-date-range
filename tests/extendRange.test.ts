import { DateTime, DurationUnit } from "luxon";
import { describe, expect, test } from "vitest";

import { DURATION_UNITS } from "../src/constants";
import { ExtendRangeOptions, extendRange } from "../src/extendRange";
import { TestValues } from "./testUtils";

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

		describe("offsets", () => {
			describe("startOffset", () => {
				describe("Given invalid startOffset value", () => {
					test.each(
						new TestValues().excludeByName([
							"integer 0",
							"negative integer -1",
							"integer 1",
						]),
					)("throws an error if startOffset is $name", ({ value }) => {
						expect(() =>
							extendRange({
								rangeToExtend: [
									DateTime.fromISO("2020-01-01"),
									DateTime.fromISO("2020-01-02"),
									DateTime.fromISO("2020-01-03"),
								],
								timeUnit: "day",
								endOffset: 0,
								startOffset: value,
							}),
						).toThrowError();
					});
				});

				describe("Given valid startOffset value", () => {
					test.each([-2, -1, 0, 1, 100])(
						"doesn't throw an error if starOffset is %s",
						(value) => {
							expect(() =>
								extendRange({
									rangeToExtend: [
										DateTime.fromISO("2020-01-01"),
										DateTime.fromISO("2020-01-02"),
										DateTime.fromISO("2020-01-03"),
									],
									timeUnit: "day",
									endOffset: 0,
									startOffset: value,
								}),
							).not.toThrowError();
						},
					);
				});

				describe("Given negative startOffset value that exceeds the date range", () => {
					test.each([
						{ startOffset: -1, rangeToExtend: [DateTime.now()] },
						{
							startOffset: -10,
							rangeToExtend: [
								DateTime.fromISO("2020-01-01"),
								DateTime.fromISO("2020-01-02"),
								DateTime.fromISO("2020-01-03"),
							],
						},
					])(
						"throws an error for startOffset $startOffset and range of $rangeToExtend.length dates",
						({ rangeToExtend, startOffset }) => {
							expect(() =>
								extendRange({
									rangeToExtend,
									startOffset,
									endOffset: 0,
									timeUnit: "day",
								}),
							).toThrowError();
						},
					);
				});
			});

			describe("endOffset", () => {
				describe("Given invalid endOffset value", () => {
					test.each(
						new TestValues().excludeByName([
							"integer 0",
							"negative integer -1",
							"integer 1",
						]),
					)("throws an error if endOffset is $name", ({ value }) => {
						expect(() =>
							extendRange({
								rangeToExtend: [
									DateTime.fromISO("2020-01-01"),
									DateTime.fromISO("2020-01-02"),
									DateTime.fromISO("2020-01-03"),
								],
								timeUnit: "day",
								endOffset: value,
								startOffset: 0,
							}),
						).toThrowError();
					});
				});

				describe("Given valid endOffset value", () => {
					test.each([-2, -1, 0, 1, 100])(
						"doesn't throw an error if endOffset is %d",
						(value) => {
							expect(() =>
								extendRange({
									rangeToExtend: [
										DateTime.fromISO("2020-01-01"),
										DateTime.fromISO("2020-01-02"),
										DateTime.fromISO("2020-01-03"),
									],
									timeUnit: "day",
									endOffset: value,
									startOffset: 0,
								}),
							).not.toThrowError();
						},
					);
				});

				describe("Given negative endOffset value that exceeds the date range", () => {
					test.each([
						{ endOffset: -1, rangeToExtend: [DateTime.now()] },
						{
							endOffset: -10,
							rangeToExtend: [
								DateTime.fromISO("2020-01-01"),
								DateTime.fromISO("2020-01-02"),
								DateTime.fromISO("2020-01-03"),
							],
						},
					])(
						"throws an error for endOffset $endOffset and range of $rangeToExtend.length dates",
						({ rangeToExtend, endOffset }) => {
							expect(() =>
								extendRange({
									rangeToExtend,
									endOffset,
									startOffset: 0,
									timeUnit: "day",
								}),
							).toThrowError();
						},
					);
				});
			});

			describe("Negative offsets overlap", () => {
				test.each([
					{
						startOffset: -1,
						endOffset: -1,
						rangeToExtend: [DateTime.now(), DateTime.now()],
					},
					{
						startOffset: -1,
						endOffset: -2,
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
					},
					{
						startOffset: -2,
						endOffset: -2,
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
					},
				])(
					"throws an error if negative offsets ($startOffset, $endOffset) exceeds date range length ($rangeToExtend.length)",
					({ startOffset, endOffset, rangeToExtend }) => {
						expect(() =>
							extendRange({
								startOffset,
								endOffset,
								rangeToExtend,
								timeUnit: "day",
							}),
						).toThrowError("Negative values of startOffset");
					},
				);
			});
		});

		test("throws an error when timeUnit is invalid", () => {
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

	describe("Functionality", () => {
		describe("timeUnit", () => {
			const timeUnits: DurationUnit[] = DURATION_UNITS;

			describe("Extend range using each time unit", () => {
				test.each(timeUnits)(
					"the extended range has the correct length and matches unit of time: %s",
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
		});

		describe("endOffset", () => {
			const testData: Array<
				ExtendRangeOptions & {
					expectedLength: number;
					expectedRange: DateTime[];
				}
			> = [
				{
					rangeToExtend: [
						DateTime.fromISO("2020-01-01"),
						DateTime.fromISO("2020-01-02"),
						DateTime.fromISO("2020-01-03"),
					],
					endOffset: 2,
					startOffset: 0,
					timeUnit: "day",
					expectedLength: 5,
					expectedRange: [
						DateTime.fromISO("2020-01-01"),
						DateTime.fromISO("2020-01-02"),
						DateTime.fromISO("2020-01-03"),
						DateTime.fromISO("2020-01-04"),
						DateTime.fromISO("2020-01-05"),
					],
				},
				{
					rangeToExtend: [
						DateTime.fromISO("2020-01-01"),
						DateTime.fromISO("2020-01-02"),
						DateTime.fromISO("2020-01-03"),
					],
					endOffset: -2,
					startOffset: 0,
					timeUnit: "day",
					expectedLength: 1,
					expectedRange: [DateTime.fromISO("2020-01-01")],
				},
			];

			describe.each(testData)(
				"the extended range has the correct length and each element matches the expected date",
				({
					endOffset,
					timeUnit,
					rangeToExtend,
					startOffset,
					expectedLength,
					expectedRange,
				}) => {
					const extendedRange = extendRange({
						rangeToExtend,
						timeUnit,
						startOffset,
						endOffset,
					});
					test("date range has the correct length", () => {
						console.log(extendedRange.length);
						expect(extendedRange.length).toBe(expectedLength);
					});

					test("each date of extended range matches expected one", () => {
						for (let i = 0; i < expectedLength; i++) {
							expect(extendedRange[i]).toEqual(expectedRange[i]);
						}
					});
				},
			);
		});

		describe("startOffset", () => {
			const testData: Array<
				ExtendRangeOptions & {
					expectedLength: number;
					expectedRange: DateTime[];
				}
			> = [
				{
					rangeToExtend: [
						DateTime.fromISO("2020-01-03"),
						DateTime.fromISO("2020-01-04"),
						DateTime.fromISO("2020-01-05"),
					],
					endOffset: 0,
					startOffset: 2,
					timeUnit: "day",
					expectedLength: 5,
					expectedRange: [
						DateTime.fromISO("2020-01-01"),
						DateTime.fromISO("2020-01-02"),
						DateTime.fromISO("2020-01-03"),
						DateTime.fromISO("2020-01-04"),
						DateTime.fromISO("2020-01-05"),
					],
				},
				{
					rangeToExtend: [
						DateTime.fromISO("2020-01-01"),
						DateTime.fromISO("2020-01-02"),
						DateTime.fromISO("2020-01-03"),
					],
					endOffset: 0,
					startOffset: -2,
					timeUnit: "day",
					expectedLength: 1,
					expectedRange: [DateTime.fromISO("2020-01-03")],
				},
			];

			describe.each(testData)(
				"the extended range has the correct length and each element matches the expected date",
				({
					endOffset,
					expectedLength,
					expectedRange,
					rangeToExtend,
					startOffset,
					timeUnit,
				}) => {
					const extendedRange = extendRange({
						rangeToExtend,
						timeUnit,
						startOffset,
						endOffset,
					});
					test("date range has the correct length", () => {
						console.log(extendedRange.length);
						expect(extendedRange.length).toBe(expectedLength);
					});

					test("each date of extended range matches expected one", () => {
						for (let i = 0; i < expectedLength; i++) {
							expect(extendedRange[i]).toEqual(expectedRange[i]);
						}
					});
				},
			);
		});

		describe("Both offsets", () => {
			describe("Given valid data", () => {
				const testData: Array<
					ExtendRangeOptions & {
						expectedLength: number;
						expectedRange: DateTime[];
					}
				> = [
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
						],
						endOffset: 2,
						startOffset: 2,
						timeUnit: "day",
						expectedLength: 7,
						expectedRange: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
							DateTime.fromISO("2020-01-06"),
							DateTime.fromISO("2020-01-07"),
						],
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
						endOffset: -1,
						startOffset: -1,
						timeUnit: "day",
						expectedLength: 1,
						expectedRange: [DateTime.fromISO("2020-01-02")],
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
						endOffset: 2,
						startOffset: -2,
						timeUnit: "day",
						expectedLength: 1,
						expectedRange: [
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
						],
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
						],
						endOffset: -2,
						startOffset: 2,
						timeUnit: "day",
						expectedLength: 1,
						expectedRange: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
					},
				];

				describe.each(testData)(
					"Test index %#",
					({
						endOffset,
						expectedLength,
						expectedRange,
						rangeToExtend,
						startOffset,
						timeUnit,
					}) => {
						const extendedRange = extendRange({
							rangeToExtend,
							timeUnit,
							startOffset,
							endOffset,
						});

						test("date range has correct length", () => {
							expect(extendedRange.length).toBe(expectedRange.length);
						});
						test("each date of extended range matches expected one", () => {
							for (let i = 0; i < expectedLength; i++) {
								expect(extendedRange[i]).toEqual(expectedRange[i]);
							}
						});
					},
				);
			});

			describe("Given invalid data", () => {
				const testData: Array<ExtendRangeOptions> = [
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
						],
						endOffset: 2,
						startOffset: -3,
						timeUnit: "day",
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
						endOffset: -3,
						startOffset: 2,
						timeUnit: "day",
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-01"),
							DateTime.fromISO("2020-01-02"),
							DateTime.fromISO("2020-01-03"),
						],
						endOffset: -1,
						startOffset: -2,
						timeUnit: "day",
					},
					{
						rangeToExtend: [
							DateTime.fromISO("2020-01-03"),
							DateTime.fromISO("2020-01-04"),
							DateTime.fromISO("2020-01-05"),
						],
						endOffset: -2,
						startOffset: -1,
						timeUnit: "day",
					},
				];

				describe.each(testData)(
					"Test index %#",
					({ endOffset, rangeToExtend, startOffset, timeUnit }) => {
						test("throws an error", () => {
							expect(() =>
								extendRange({
									rangeToExtend,
									timeUnit,
									startOffset,
									endOffset,
								}),
							).toThrowError();
						});
					},
				);
			});
		});
	});
});

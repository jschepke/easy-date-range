import { describe, expect, test } from "vitest";

import { isValidDateTimeArray } from "../../src/utils/isValidDateTimeArray";
import { isValidDateTimeArrayTestValues } from "../testUtils";

describe("isValidDateTimeArray", () => {
	describe("Given a valid DateTime array", () => {
		test.each(isValidDateTimeArrayTestValues.valid)(
			"returns true for valid DateTime: $validInput",
			({ validInput }) => {
				expect(isValidDateTimeArray(validInput)).toBe(true);
			},
		);
	});
	describe("Given a non-valid DateTime array and values", () => {
		test.each(isValidDateTimeArrayTestValues.invalid)(
			"returns false for value: $invalidInput",
			({ invalidInput }) => {
				expect(isValidDateTimeArray(invalidInput)).toBe(false);
			},
		);
	});
});

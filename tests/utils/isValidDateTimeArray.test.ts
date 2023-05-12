import { describe, expect, test } from "vitest";

import { isValidDateTimeArray } from "../../src/utils/isValidDateTimeArray";
import { isValidDateTimeArrayTestValues } from "../testUtils";

describe("isValidDateTimeArray", () => {
	describe("Given a valid DateTime array", () => {
		test.each(isValidDateTimeArrayTestValues.valid)(
			"returns true for valid DateTime: $value",
			({ value }) => {
				expect(isValidDateTimeArray(value)).toBe(true);
			},
		);
	});
	describe("Given a non-valid DateTime array and values", () => {
		test.each(isValidDateTimeArrayTestValues.invalid)(
			"returns false for value: $name",
			({ value }) => {
				expect(isValidDateTimeArray(value)).toBe(false);
			},
		);
	});
});

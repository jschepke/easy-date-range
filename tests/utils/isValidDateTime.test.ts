import { describe, expect, test } from "vitest";

import { isValidDateTime } from "../../src/utils/isValidDateTime";
import { isValidDateTimeTestValues } from "../testUtils";

describe("isValidDateTime", () => {
	describe("Given a valid DateTime", () => {
		test.each(isValidDateTimeTestValues.valid)(
			"returns true for valid DateTime: %s",
			(dateTime) => {
				expect(isValidDateTime(dateTime)).toBe(true);
			},
		);
	});
	describe("Given a non-valid DateTime", () => {
		test.each(isValidDateTimeTestValues.invalid)(
			"returns false for value: $invalidInput",
			({ invalidInput }) => {
				expect(isValidDateTime(invalidInput)).toBe(false);
			},
		);
	});
});

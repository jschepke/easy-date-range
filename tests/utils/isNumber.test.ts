import { describe, expect, test } from "vitest";

import { isNumber } from "../../src/utils/isNumber";
import { isNumberTestValues } from "../testUtils";

describe("isNumber", () => {
	describe("Given valid number", () => {
		test.each(isNumberTestValues.valid)(
			"returns true for valid number: %d",
			(value) => {
				expect(isNumber(value)).toBe(true);
			},
		);
	});

	describe("Given invalid number", () => {
		test.each(isNumberTestValues.invalid)(
			"returns false for invalid number: $name",
			({ value }) => {
				expect(isNumber(value)).toBe(false);
			},
		);
	});
});

import { describe, expect, test } from "vitest";

import { isValidRefDate } from "../../src/utils/isValidRefDate";
import { isValidRefDateTestValues } from "../testUtils";

describe("isValidRefDate", () => {
	describe("Given valid refDate values", () => {
		test.each(isValidRefDateTestValues.valid)(
			"returns true for value: %d",
			(value) => {
				expect(isValidRefDate(value)).toBe(true);
			},
		);
	});

	describe("Given invalid refDate values", () => {
		test.each(isValidRefDateTestValues.invalid)(
			"returns false for value: $name",
			({ value }) => {
				expect(isValidRefDate(value)).toBe(false);
			},
		);
	});
});

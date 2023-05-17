import { describe, expect, test } from "vitest";

import { isValidOffset } from "../../src/utils/isValidOffset";
import { offsetTestValues } from "../testUtils";

describe("isValidOffset", () => {
	describe("Given a valid offset values", () => {
		test.each(offsetTestValues.valid)("returns true for value: %j", (value) => {
			expect(isValidOffset(value)).toBe(true);
		});
	});
	describe("Given a non-valid offset values", () => {
		test.each(offsetTestValues.invalid)(
			"returns false for $name",
			({ value }) => {
				expect(isValidOffset(value)).toBe(false);
			},
		);
	});
});

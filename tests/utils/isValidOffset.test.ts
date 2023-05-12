import { describe, expect, test } from "vitest";

import { isValidOffset } from "../../src/utils/isValidOffset";
import { isValidOffsetTestValues } from "../testUtils";

describe("isValidOffset", () => {
	describe("Given a valid offset values", () => {
		test.each(isValidOffsetTestValues.valid)(
			"returns true for value: %j",
			(value) => {
				expect(isValidOffset(value)).toBe(true);
			},
		);
	});
	describe("Given a non-valid offset values", () => {
		test.each(isValidOffsetTestValues.invalid)(
			"returns false for $name",
			({ value }) => {
				expect(isValidOffset(value)).toBe(false);
			},
		);
	});
});

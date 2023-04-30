import { describe, expect, test } from "vitest";

import { isEmptyObject } from "../../src/utils/isEmptyObject";
import { isEmptyObjectTestValues } from "../testUtils";

describe("isEmptyObject", () => {
	describe("Given an empty object {}", () => {
		test("returns true", () => {
			expect(isEmptyObject({})).toBe(true);
		});
	});

	describe("Given non object and non empty object values", () => {
		test.each(isEmptyObjectTestValues.invalid)(
			"returns false for value of: $invalidInput",
			({ invalidInput }) => {
				expect(isEmptyObject(invalidInput)).toBe(false);
			},
		);
	});
});

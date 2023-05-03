import { describe, expect, it, test } from "vitest";

import { isObject } from "../../src/utils/isObject";
import { isObjectTestValues } from "../testUtils";

describe("isObject", () => {
	describe("Given a non object values", () => {
		test.each(isObjectTestValues.invalid)(
			"returns false for value: $invalidInput",
			({ invalidInput }) => {
				expect(isObject(invalidInput)).toBe(false);
			},
		);
	});

	describe("Given an object", () => {
		test.each(isObjectTestValues.valid)(
			"returns true for value: %d",
			(value) => {
				expect(isObject(value)).toBe(true);
			},
		);
	});
});

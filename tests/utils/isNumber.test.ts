import { describe, expect, test } from "vitest";

import { isNumber } from "../../src/utils/isNumber";

describe("isNumber", () => {
	test("should return true for inputs that are valid numbers", () => {
		const inputs = [0, 1, -1, 0.5, -0.5];
		for (const input of inputs) {
			expect(isNumber(input)).toBe(true);
		}
	});

	test("should return false for inputs that are not valid numbers", () => {
		const inputs = ["a", true, null, undefined, {}, [], NaN, Infinity];
		for (const input of inputs) {
			expect(isNumber(input)).toBe(false);
		}
	});
});

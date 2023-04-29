import { describe, expect, test } from "vitest";

import { isValidWeekday } from "../../src/utils/isValidWeekday";

describe("isValidWeekday", () => {
	test("should return true for valid weekdays", () => {
		expect(isValidWeekday(1)).toBe(true);
		expect(isValidWeekday(3)).toBe(true);
		expect(isValidWeekday(7)).toBe(true);
	});

	test("should return false for invalid weekdays", () => {
		expect(isValidWeekday(0)).toBe(false);
		expect(isValidWeekday(8)).toBe(false);
		expect(isValidWeekday("Monday")).toBe(false);
		expect(isValidWeekday(null)).toBe(false);
		expect(isValidWeekday(undefined)).toBe(false);
	});
});

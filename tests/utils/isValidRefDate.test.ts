import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

import { isValidRefDate } from "../../src/utils/isValidRefDate";

describe("isValidRefDate", () => {
	test("should return true for valid Date objects", () => {
		const date = new Date();
		expect(isValidRefDate(date)).toBe(true);
	});

	test("should return true for valid DateTime objects", () => {
		const date = DateTime.local();
		expect(isValidRefDate(date)).toBe(true);
	});

	test("should return false for invalid Date objects", () => {
		const date = new Date("invalid");
		expect(isValidRefDate(date)).toBe(false);
	});

	test("should return false for invalid DateTime objects", () => {
		const date = DateTime.invalid("invalid");
		expect(isValidRefDate(date)).toBe(false);
	});

	test("should return false for other types of values", () => {
		const values = [null, undefined, "string", 123, true, {}, []];
		for (const value of values) {
			expect(isValidRefDate(value)).toBe(false);
		}
	});
});

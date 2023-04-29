import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

import { getRandomDateTime } from "../../src/utils";

describe("getRandomDateTime", () => {
	// Test that the function returns a valid DateTime object
	test("should return a valid DateTime object", () => {
		const date = getRandomDateTime();
		expect(date).toBeInstanceOf(DateTime);
		expect(date.isValid).toBe(true);
	});

	// Test that the function returns a date within the given range
	test("should return a date within the given range", () => {
		const start = DateTime.fromISO("2020-01-01");
		const end = DateTime.fromISO("2020-12-31");
		const date = getRandomDateTime(start, end);
		expect(date.valueOf()).toBeGreaterThanOrEqual(start.valueOf());
		expect(date.valueOf()).toBeLessThanOrEqual(end.valueOf());
	});

	// Test that the function throws an error if the start or end date are invalid
	test("should throw an error if the start or end date are invalid", () => {
		const invalidDate = DateTime.fromISO("invalid");
		expect(() => getRandomDateTime(invalidDate)).toThrow();
		expect(() => getRandomDateTime(undefined, invalidDate)).toThrow();
	});

	// Test that the function throws an error if the start date is after the end date
	test("should throw an error if the start date is after the end date", () => {
		const start = DateTime.fromISO("2021-01-01");
		const end = DateTime.fromISO("2020-12-31");
		expect(() => getRandomDateTime(start, end)).toThrow();
	});
});

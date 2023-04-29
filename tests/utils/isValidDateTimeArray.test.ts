import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

import { isValidDateTimeArray } from "../../src/utils/isValidDateTimeArray";

// some valid and invalid DateTime objects for testing
const validDate1 = DateTime.local(2021, 12, 25);
const validDate2 = DateTime.local(2022, 1, 1);
const invalidDate1 = DateTime.invalid("wrong format");
const invalidDate2 = DateTime.fromISO("2021-13-01");

// some valid and invalid arrays for testing
const validArray1 = [validDate1, validDate2];
const validArray2 = [validDate2];
const invalidArray1 = [validDate1, invalidDate1];
const invalidArray2 = [invalidDate2];
const invalidArray3 = [];
const invalidArray4 = [1, 2, 3];
const invalidArray5 = ["a", "b", "c"];

describe("isValidDateTimeArray", () => {
	// test for valid arrays
	test("should return true for valid arrays of DateTime objects", () => {
		expect(isValidDateTimeArray(validArray1)).toBe(true);
		expect(isValidDateTimeArray(validArray2)).toBe(true);
	});

	// test for invalid arrays
	test("should return false for invalid arrays of DateTime objects", () => {
		expect(isValidDateTimeArray(invalidArray1)).toBe(false);
		expect(isValidDateTimeArray(invalidArray2)).toBe(false);
		expect(isValidDateTimeArray(invalidArray3)).toBe(false);
		expect(isValidDateTimeArray(invalidArray4)).toBe(false);
		expect(isValidDateTimeArray(invalidArray5)).toBe(false);
	});

	// test for non-array values
	test("should return false for non-array values", () => {
		expect(isValidDateTimeArray(null)).toBe(false);
		expect(isValidDateTimeArray(undefined)).toBe(false);
		expect(isValidDateTimeArray(42)).toBe(false);
		expect(isValidDateTimeArray("foo")).toBe(false);
		expect(isValidDateTimeArray({})).toBe(false);
		expect(isValidDateTimeArray(validDate1)).toBe(false);
		expect(isValidDateTimeArray(invalidDate1)).toBe(false);
	});
});

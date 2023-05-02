import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

import { findDateTime } from "../../src/utils/findDateTime";

// sample dates and arrays for testing
const date1 = DateTime.fromISO("2021-01-01");
const date2 = DateTime.fromISO("2021-02-02");
const date3 = DateTime.fromISO("2021-03-03");
const date4 = DateTime.invalid;
const array1 = [date1, date2, date3];
const array2 = [date2, date3];
const array3 = [date3];
const array4: DateTime[] = [];
const array5 = [date1, "", 1, {}];
const arrray6 = [date1, date2, date3, date4];

describe("isDateTimeInArray", () => {
	test("date1 is in array1", () => {
		expect(findDateTime(date1, array1)).toBe(date1);
	});

	test("date1 is not in array2", () => {
		expect(findDateTime(date1, array2)).toBe(null);
	});

	test("date2 is in array2", () => {
		expect(findDateTime(date2, array2)).toBe(date2);
	});

	test("date2 is not in array3", () => {
		expect(findDateTime(date2, array3)).toBe(null);
	});

	test("date3 is in array3", () => {
		expect(findDateTime(date3, array3)).toBe(date3);
	});

	test("returns null for empty array", () => {
		expect(findDateTime(date1, array4)).toBe(null);
	});

	test("error is thrown for invalid date", () => {
		// @ts-expect-error: testing invalid input
		expect(() => findDateTime("2021-01-01", array1)).toThrowError();
	});

	test("error is thrown for invalid array", () => {
		// @ts-expect-error: testing invalid input
		expect(() => findDateTime(date1, ["2021-01-01"])).toThrowError();
	});

	test("error is thrown for invalid array element", () => {
		// @ts-expect-error: testing invalid input
		expect(() => findDateTime(date1, array5)).toThrowError();
	});

	test("error is thrown for array with invalid date", () => {
		// @ts-expect-error: testing invalid input
		expect(() => findDateTime(date4, array6)).toThrowError();
	});
});

import { describe, expect, test } from "vitest";

import { isValidWeekday } from "../../src/utils/isValidWeekday";
import { weekdayTestValues } from "../testUtils";

describe("isValidWeekday", () => {
	describe("Given valid weekday", () => {
		test.each(weekdayTestValues.valid)(
			"returns true for valid weekday value: %d",
			(value) => {
				expect(isValidWeekday(value)).toBe(true);
			},
		);
	});

	describe("Given invalid weekday", () => {
		test.each(weekdayTestValues.invalid)(
			"returns false for invalid weekday value: $name",
			({ value }) => {
				expect(isValidWeekday(value)).toBe(false);
			},
		);
	});
});

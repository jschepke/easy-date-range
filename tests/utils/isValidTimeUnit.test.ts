import { describe, expect, test } from "vitest";

import { DURATION_UNITS } from "../../src/constants";
import { isValidTimeUnit } from "../../src/utils/isValidTimeUnit";

describe("isValidTimeUnit", () => {
	describe("Given a valid time unit", () => {
		test.each(DURATION_UNITS)(
			"returns true for valid time unit: %s",
			(timeUnit) => {
				expect(isValidTimeUnit(timeUnit)).toBe(true);
			},
		);
	});

	describe("Given a non-valid time unit", () => {
		test.each(["foo", "bar", "baz", "", null, undefined])(
			"returns false for invalid time unit: %s",
			(timeUnit) => {
				expect(isValidTimeUnit(timeUnit)).toBe(false);
			},
		);
	});
});

import { describe, expect, test } from "vitest";

import { isValidDate } from "../../src/utils/isValidDate";
import { isValidDateTestValues } from "../testUtils";

describe("isValidDate", () => {
	describe("Given a valid date", () => {
		test.each(isValidDateTestValues.valid)(
			"returns true for valid date: %s",
			(date) => {
				expect(isValidDate(date)).toBe(true);
			},
		);
	});
	describe("Given a non-valid date", () => {
		test.each(isValidDateTestValues.invalid)(
			"returns false for value: $invalidInput",
			({ invalidInput }) => {
				expect(isValidDate(invalidInput)).toBe(false);
			},
		);
	});
});

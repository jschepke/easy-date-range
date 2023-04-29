import { describe, expect, it } from "vitest";

import { isValidDate } from "../../src/utils/isValidDate";

describe("isValidDate", () => {
	it("should return true if the input is a valid Date object", () => {
		const date = new Date("2022-04-06T12:00:00.000Z");
		expect(isValidDate(date)).toBe(true);
	});

	it("should return false if the input is not a Date object", () => {
		const date = "2022-04-06T12:00:00.000Z";
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is an invalid Date object", () => {
		const date = new Date("invalid-date");
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is a valid date string", () => {
		const date = "2022-04-06T12:00:00.000Z";
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is an invalid date string", () => {
		const date = "invalid-date";
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is a number", () => {
		const date = 12345;
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is null", () => {
		const date = null;
		expect(isValidDate(date)).toBe(false);
	});

	it("should return false if the input is undefined", () => {
		const date = undefined;
		expect(isValidDate(date)).toBe(false);
	});
});

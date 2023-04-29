import { describe, expect, it } from "vitest";

import { isObject } from "../../src/utils/isObject";

describe("isObject", () => {
	const nonObjectValues = [
		null,
		undefined,
		[],
		123,
		-123,
		"123abc",
		true,
		false,
		new Date(),
		() => {
			return {};
		},
	];

	it.each(nonObjectValues)(
		"should return false for non object value: %s",
		(value) => {
			expect(isObject(value)).toBe(false);
		},
	);
	it.each([{}, { prop: 123, prop2: "abc" }])(
		"should return true for object: %s",
		(value) => {
			expect(isObject(value)).toBe(true);
		},
	);
});

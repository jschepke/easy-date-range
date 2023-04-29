import { describe, expect, it } from "vitest";

import { isEmptyObject } from "../../src/utils/isEmptyObject";

describe("isEmptyObject", () => {
	const invalidValues = [
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

	it.each(invalidValues)(
		"should return false for not object value: %s",
		(value) => {
			expect(isEmptyObject(value)).toBe(false);
		},
	);

	it('should return false for not empty object: { prop: 123, prop2: "abc" }', () => {
		expect(isEmptyObject({ prop: 123, prop2: "abc" })).toBe(false);
	});

	it("should return true for empty object: {}", () => {
		expect(isEmptyObject({})).toBe(true);
	});
});

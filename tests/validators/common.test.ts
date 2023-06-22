import { validateObjectArgument } from "../../src/validators/common";
import { TestValues } from "../testUtils";
import { describe, expect, test } from "vitest";

describe("Common validators", () => {
	describe("validateObjectArgument", () => {
		describe("Given non valid argument", () => {
			test.each(new TestValues().excludeByName(["object { a: 1, b: 'foo' }"]))(
				"throw an error for argument: $name",
				({ value }) => {
					expect(() => validateObjectArgument(value)).toThrowError();
				},
			);
		});
		describe("Given valid argument", () => {
			test.each([{ a: "test" }, { 1: 1 }, { test: () => "test" }])(
				"doesn't throw or return anything for argument: %s",
				(obj) => {
					expect(validateObjectArgument(obj)).toBeUndefined();
				},
			);
		});
	});
});

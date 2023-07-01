import { RANGE_TYPE } from "../../src/constants";
import {
	validateObjectArgument,
	validateRangeType,
} from "../../src/validators/common";
import { TestValues } from "../testUtils";
import { describe, expect, test } from "vitest";

describe("Common validators", () => {
	describe("validateRangeType", () => {
		describe("Given non valid argument", () => {
			test.each(new TestValues().excludeByName(["string 'test'"]))(
				"throws an error for argument: $name",
				({ value }) => {
					expect(() => validateRangeType(value)).toThrowError();
				},
			);
		});

		describe("Given valid argument", () => {
			const rangeTypes = Object.values(RANGE_TYPE);
			console.log(rangeTypes);

			test.each(rangeTypes)(
				"doesn't return anything for valid rangeType: %s",
				(rangeType) => {
					expect(validateRangeType(rangeType)).toBeUndefined();
				},
			);
		});
	});

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

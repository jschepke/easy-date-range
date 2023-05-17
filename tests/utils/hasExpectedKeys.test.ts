import { hasExpectedKeys } from "../../src/utils";
import { TestValues } from "../testUtils";
import { describe, expect, test } from "vitest";

describe("hasExpectedKeys", () => {
	describe("Input validation", () => {
		describe("Given invalid object parameter", () => {
			const testValues = new TestValues().excludeByName([
				"empty object {}",
				"object { a: 1, b: 'foo' }",
			]);
			test.each(testValues)(
				"throws an error if object param is $name",
				({ value }) => {
					// with default mode
					expect(() => hasExpectedKeys(value, [])).toThrowError();
					// with strict mode
					expect(() => hasExpectedKeys(value, [], "strict")).toThrowError();
				},
			);
		});
		describe("Given invalid keys parameter", () => {
			const testValues = new TestValues().excludeByName([
				"empty array []",
				`array of strings ["test", "test2"]`,
			]);
			test.each(testValues)(
				"throws an error if keys param is $name",
				({ value }) => {
					// with default mode
					expect(() => hasExpectedKeys({}, value)).toThrowError();
					// with strict mode
					expect(() => hasExpectedKeys({}, value, "strict")).toThrowError();
				},
			);
		});
		describe("Given invalid mode parameter", () => {
			const testValues = new TestValues().excludeByName(["undefined"]);
			test.each(testValues)(
				"throws an error if keys param is $name",
				({ value }) => {
					expect(() => hasExpectedKeys({}, [], value)).toThrowError();
				},
			);
		});
	});

	describe("Functionality", () => {
		describe("With default mode", () => {
			test("should return true if the object has all the expected keys", () => {
				const object = { name: "Alice", age: 25, occupation: "engineer" };
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys)).toBe(true);
			});

			test("should return false if the object is missing any of the expected keys", () => {
				const object = { name: "Bob", age: 30 };
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys)).toBe(false);
			});

			test("should return true if the object has extra keys besides the expected ones", () => {
				const object = {
					name: "Charlie",
					age: 35,
					occupation: "teacher",
					hobby: "reading",
				};
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys)).toBe(true);
			});
		});

		describe("With strict mode", () => {
			test("should return true if the object has all and only the expected keys", () => {
				const object = { name: "Alice", age: 25, occupation: "engineer" };
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys, "strict")).toBe(true);
			});

			test("should return false if the object is missing any of the expected keys", () => {
				const object = { name: "Bob", age: 30 };
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys, "strict")).toBe(false);
			});

			test("should return false if the object has extra keys besides the expected ones", () => {
				const object = {
					name: "Charlie",
					age: 35,
					occupation: "teacher",
					hobby: "reading",
				};
				const keys = ["name", "age", "occupation"];
				expect(hasExpectedKeys(object, keys, "strict")).toBe(false);
			});
		});
	});
});

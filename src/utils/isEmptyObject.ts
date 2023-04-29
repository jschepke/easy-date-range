import { isObject } from "./isObject";

/**
 * Checks if a value is a "true" object and it is empty.
 *
 * @remarks Excludes other objects such as arrays, functions, dates, etc.
 *
 * @param value - The value to check.
 * @returns True if the value is a true object of type Object and it's empty, false otherwise.
 */
export function isEmptyObject(value: unknown): boolean {
	if (isObject(value) && Object.values(value).length === 0) {
		return true;
	} else {
		return false;
	}
}

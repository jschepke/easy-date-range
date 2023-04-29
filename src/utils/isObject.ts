/**
 * Checks if a value is a "true" object. Wether empty or not.
 *
 * @remarks Excludes other objects such as arrays, functions, dates, etc.
 *
 * @param value - The value to check.
 * @returns True if the value is a true object of type Object, false otherwise.
 */
export function isObject(value: unknown): value is object {
	if (
		value === null ||
		typeof value !== "object" ||
		value.constructor !== Object
	) {
		return false;
	} else {
		return true;
	}
}

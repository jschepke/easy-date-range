import { isValidDateTime } from "./isValidDateTime";

/**
 * Checks if a value is a valid array of DateTime objects.
 *
 * @param value - The value to check.
 * @returns True if the value is an array and every item is a valid DateTime, false otherwise.
 */
export function isValidDateTimeArray(value: unknown): boolean {
	if (
		Array.isArray(value) &&
		value.length !== 0 &&
		value.every((item) => isValidDateTime(item))
	) {
		return true;
	} else {
		return false;
	}
}

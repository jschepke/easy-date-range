/**
 * Checks if a value is a valid offset (an integer)
 *
 * @param value - The value to check.
 * @returns True if the value is a an integer, false otherwise.
 */
export function isValidOffset(value: unknown): boolean {
	return typeof value === "number" && Number.isInteger(value);
}

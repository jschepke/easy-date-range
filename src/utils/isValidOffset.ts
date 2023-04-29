/**
 * Checks if a value is a valid offset.
 * @param value - The value to check.
 * @returns True if the value is a non-negative integer, false otherwise.
 */
export function isValidOffset(value: unknown): boolean {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Checks if the input is a number, including integers and decimals.
 *
 * @param input - The input to be checked
 * @returns A boolean indicating whether the input is a integer or decimal number.
 */
export function isNumber(input: unknown): input is number {
	return typeof input === "number" && Number.isFinite(input);
}

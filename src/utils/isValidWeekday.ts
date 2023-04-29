import { isNumber } from "./isNumber";

/**
 * Checks if a given value is a number from 1 to 7.
 *
 * @param weekday - The weekday to check.
 * @returns True if weekday is a number from 1 to 7, false otherwise.
 */
export function isValidWeekday(weekday: unknown): boolean {
	return isNumber(weekday) && weekday >= 1 && weekday <= 7;
}

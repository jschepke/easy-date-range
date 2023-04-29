import { DateTime } from "luxon";

/**
 * Checks if a given value is a valid DateTime object.
 * @param date - The value to check.
 * @returns True if the value is a valid DateTime object, false otherwise.
 */
export function isValidDateTime(date: unknown): date is DateTime {
	if (date instanceof DateTime && date.isValid) {
		return true;
	} else {
		return false;
	}
}

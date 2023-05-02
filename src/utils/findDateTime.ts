import { DateTime } from "luxon";

import { InvalidParameterError } from "../errors";
import { isValidDateTime } from "./isValidDateTime";

/**
 * Finds and returns a DateTime object in an array that matches the given DateTime.
 *
 * @remarks Function uses DateTime.equals() to compare dates which is strick equality check:
 *
 * "*Equality check Two DateTimes are equal if and only if they represent the same millisecond,
 * have the same zone and location, and are both valid.
 * To compare just the millisecond values, use +dt1 === +dt2.*"
 * ({@link https://moment.github.io/luxon/api-docs/index.html#datetimeequals | DateTime equals})
 *
 * @param dateTime - The DateTime to check.
 * @param array - The array of dates to search in.
 * @returns The matching DateTime object if found, or null otherwise.
 * @throws Error if the dateTime or the array is invalid.
 */
export function findDateTime(
	dateTime: DateTime,
	array: DateTime[],
): DateTime | null {
	// Check if date is a valid DateTime object
	if (!isValidDateTime(dateTime)) {
		throw new InvalidParameterError(
			"dateTime parameter",
			dateTime,
			"a valid DateTime object",
		);
	}
	// Check if array is an array of DateTime objects
	if (
		!Array.isArray(array) ||
		!array.every((element) => isValidDateTime(element))
	) {
		throw new InvalidParameterError(
			"array parameter",
			array,
			"an array of valid DateTime objects",
		);
	}
	// Check if array is empty
	if (array.length === 0) {
		return null;
	}

	// Loop through the array of dates and return the first match
	for (let i = 0; i < array.length; i++) {
		if (dateTime.equals(array[i])) {
			return array[i];
		}
	}
	return null;
}

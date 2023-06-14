import type { RangeOptionsDays } from "../dateRange";
import { InvalidParameterError } from "../errors";
import { isEmptyObject } from "../utils/isEmptyObject";
import { isObject } from "../utils/isObject";
import { PropertiesMap } from "../utils/types";
import {
	validateDaysCount,
	validateEndOffset,
	validateRefDate,
	validateStartOffset,
} from "./common";

const dateRangeOptionsKeysMap: PropertiesMap<RangeOptionsDays> = {
	endOffset: "endOffset",
	refDate: "refDate",
	startOffset: "startOffset",
	daysCount: "daysCount",
};

/**
 * Validates the `options` param of the `getDays()` method.
 *
 * Throws an error if any properties of options object are
 * invalid or the parameter itself is invalid.
 */
export function validateDateRangeOptions_days(value: unknown): void {
	// rome-ignore lint/style/noArguments: <explanation>
	if (arguments.length === 0) {
		throw new InvalidParameterError(
			"value parameter",
			value,
			"a single parameter for further validation",
		);
	}

	if (value === undefined) {
		return;
	}
	const expectedKeys = Object.values(dateRangeOptionsKeysMap);

	// check if value is an object and has any properties
	if (
		(value !== undefined && !isObject(value)) ||
		(value !== undefined && isEmptyObject(value))
	) {
		throw new InvalidParameterError(
			"options parameter",
			value,
			`either no arguments or an object with one or more of these properties: ${expectedKeys.join(
				", ",
			)}`,
		);
	}

	// check if passed param object has any of the not matching keys
	const notMatchingKeys = Object.keys(value).filter(
		(prop) => !(prop in dateRangeOptionsKeysMap),
	);

	if (notMatchingKeys.length > 0) {
		throw new InvalidParameterError(
			"options parameter",
			value,
			`an object with the following properties only: ${expectedKeys.join(
				", ",
			)}`,
		);
	}

	// get the expected properties from the input value
	const { refDate, startOffset, endOffset, daysCount } =
		value as RangeOptionsDays;

	// handle refDate property
	refDate !== undefined && validateRefDate(refDate);

	// handle startOffset property
	startOffset !== undefined && validateStartOffset(startOffset);

	// handle endOffset property
	endOffset !== undefined && validateEndOffset(endOffset);

	// handle daysCount property
	daysCount !== undefined && validateDaysCount(daysCount);
}

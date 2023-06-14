import { RangeOptions } from "../dateRange";
import { InvalidParameterError } from "../errors";
import { isEmptyObject } from "../utils/isEmptyObject";
import { isObject } from "../utils/isObject";
import { PropertiesMap } from "../utils/types";
import {
	validateEndOffset,
	validateRefDate,
	validateRefWeekday,
	validateStartOffset,
} from "./common";

const dateRangeOptionsKeysMap: PropertiesMap<RangeOptions> = {
	endOffset: "endOffset",
	refDate: "refDate",
	refWeekday: "refWeekday",
	startOffset: "startOffset",
};

/**
 * Validates the date range options parameter.
 *
 * Throws an error if any properties of options object are
 * invalid or the parameter itself is invalid.
 */
export function validateRangeOptions(value: unknown): void {
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
	const expectedProperties = Object.values(dateRangeOptionsKeysMap);

	// check if value is an object and has any properties
	if (
		(value !== undefined && !isObject(value)) ||
		(value !== undefined && isEmptyObject(value))
	) {
		throw new InvalidParameterError(
			"options parameter",
			value,
			`either no arguments or an object with one or more of these properties: ${expectedProperties.join(
				", ",
			)}`,
		);
	}

	// check if value has any of the not matching properties
	const notMatchingProperties = Object.keys(value).filter(
		(prop) => !(prop in dateRangeOptionsKeysMap),
	);

	if (notMatchingProperties.length > 0) {
		throw new InvalidParameterError(
			"options parameter",
			value,
			`an object with the following properties only: ${expectedProperties.join(
				", ",
			)}`,
		);
	}

	// get the expected properties from the input value
	const { refDate, refWeekday, startOffset, endOffset } = value as RangeOptions;

	// handle refDate property
	refDate !== undefined && validateRefDate(refDate);

	// handle refWeekday property
	refWeekday !== undefined && validateRefWeekday(refWeekday);

	// handle startOffset property
	startOffset !== undefined && validateStartOffset(startOffset);

	// handle endOffset property
	endOffset !== undefined && validateEndOffset(endOffset);
}

import { DateRangeOptions } from "../dateRange";
import { InvalidParameterError } from "../errors";
import { isEmptyObject } from "../utils/isEmptyObject";
import { isObject } from "../utils/isObject";
import { isValidOffset } from "../utils/isValidOffset";
import { isValidRefDate } from "../utils/isValidRefDate";
import { isValidWeekday } from "../utils/isValidWeekday";
import { PropertiesMap } from "../utils/types";

const dateRangeOptionsKeysMap: PropertiesMap<DateRangeOptions> = {
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
export function validateDateRangeOptions(value: unknown): void {
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
	const { refDate, refWeekday, startOffset, endOffset } =
		value as DateRangeOptions;

	// handle refDate property
	if (refDate !== undefined && !isValidRefDate(refDate)) {
		// if (!isValidRefDate(refDate)) {
		throw new InvalidParameterError(
			"refDate",
			refDate,
			"Date object or luxon DateTime object.",
		);
	}

	// handle refWeekday property
	if (refWeekday !== undefined && !isValidWeekday(refWeekday)) {
		throw new InvalidParameterError(
			"refWeekday",
			refWeekday,
			"a number between 1 and 7.",
		);
	}

	// handle startOffset property
	if (startOffset !== undefined && !isValidOffset(startOffset)) {
		throw new InvalidParameterError(
			"startOffset",
			startOffset,
			"a number >= 0",
		);
	}

	// handle endOffset property
	if (endOffset !== undefined && !isValidOffset(endOffset)) {
		throw new InvalidParameterError("endOffset", endOffset, "a number >= 0");
	}
}

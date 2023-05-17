import { InvalidParameterError } from "../errors";
import type { ExtendRangeOpts } from "../extendRange";
import type { PropertiesMap } from "../utils";
import {
	isEmptyObject,
	isObject,
	isValidDateTimeArray,
	isValidTimeUnit,
} from "../utils";

import { validateEndOffset, validateStartOffset } from "./common";

const extendRangeOptionsKeysMap: PropertiesMap<ExtendRangeOpts> = {
	rangeToExtend: "rangeToExtend",
	startOffset: "startOffset",
	endOffset: "endOffset",
	timeUnit: "timeUnit",
};
const expectedProperties = Object.values(extendRangeOptionsKeysMap);

export function validateExtendRangeOpts(value: unknown): void {
	// check if value is an object and has any properties
	if (!isObject(value) || isEmptyObject(value)) {
		throw new InvalidParameterError(
			"options parameter",
			value,
			`an object with all of the following properties: ${expectedProperties.join(
				", ",
			)}`,
		);
	}

	// check if the value has any of the not matching properties
	const notMatchingProperties = Object.keys(value).filter(
		(prop) => !(prop in extendRangeOptionsKeysMap),
	);

	if (notMatchingProperties.length > 0) {
		throw new InvalidParameterError(
			"ExtendDateRange options parameter",
			value,
			`an object with the following properties: ${expectedProperties.join(
				", ",
			)}`,
		);
	}

	// get the expected properties from the input value
	const { endOffset, rangeToExtend, startOffset, timeUnit } =
		value as ExtendRangeOpts;

	// handle rangeToExtend
	if (!isValidDateTimeArray(rangeToExtend)) {
		throw new InvalidParameterError(
			"rangeToExtend",
			rangeToExtend,
			"an array of DateTime",
		);
	}

	// handle timeUnit
	if (!isValidTimeUnit(timeUnit)) {
		throw new InvalidParameterError(
			"timeUnit",
			timeUnit,
			"a string that is a DurationUnit",
			'DurationUnit is a string that represents a unit of time, such as "years", "months", "days", etc.`',
		);
	}

	//handle startOffset
	validateStartOffset(startOffset);

	// handle endOffset
	validateEndOffset(endOffset);
}

import type { ApplyOffsetSettings } from "../applyOffset";
import { InvalidParameterError } from "../errors";
import type { PropertiesMap } from "../utils";
import {
	isEmptyObject,
	isObject,
	isValidDateTimeArray,
	isValidTimeUnit,
} from "../utils";

import { validateEndOffset, validateStartOffset } from "./common";

const applyOffsetSettingsKeysMap: PropertiesMap<ApplyOffsetSettings> = {
	rangeToAdjust: "rangeToAdjust",
	startOffset: "startOffset",
	endOffset: "endOffset",
	timeUnit: "timeUnit",
};
const expectedProperties = Object.values(applyOffsetSettingsKeysMap);

export function validateApplyOffsetSettings(value: unknown): void {
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
		(prop) => !(prop in applyOffsetSettingsKeysMap),
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
	const { endOffset, rangeToAdjust, startOffset, timeUnit } =
		value as ApplyOffsetSettings;

	// handle rangeToAdjust
	if (!isValidDateTimeArray(rangeToAdjust)) {
		throw new InvalidParameterError(
			"rangeToAdjust",
			rangeToAdjust,
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

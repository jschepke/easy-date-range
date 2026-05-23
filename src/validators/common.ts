import { RANGE_TYPE } from "../constants";
import {
	InvalidEndOffsetError,
	InvalidParameterError,
	InvalidRefDateError,
	InvalidRefWeekdayError,
	InvalidStartOffsetError,
} from "../errors";
import {
	isObject,
	isValidOffset,
	isValidRefDate,
	isValidWeekday,
} from "../utils";

/**
 * Validates an object argument.
 *
 * @remarks
 * Throws an {@link InvalidParameterError} if the input is not an object.
 *
 * @param input - The input to be validated.
 * @throws {@link InvalidParameterError}
 * @returns void
 */
export const validateObjectArgument = (input: unknown): void => {
	if (!isObject(input)) {
		throw new InvalidParameterError("provided argument", input, "an object");
	}
};

export const validateAllowedProperties = (
	input: object,
	allowedProperties: string[],
): void => {
	const unknownProperties = Object.keys(input).filter(
		(prop) => !allowedProperties.includes(prop),
	);

	if (unknownProperties.length > 0) {
		throw new InvalidParameterError(
			"provided argument",
			input,
			`an object with only the following properties: ${allowedProperties.join(
				", ",
			)}`,
			`Unknown properties: ${unknownProperties.join(", ")}`,
		);
	}
};

export const validateStartOffset = (startOffset: unknown): void => {
	if (!isValidOffset(startOffset)) {
		throw new InvalidStartOffsetError(startOffset);
	}
};

export const validateEndOffset = (endOffset: unknown): void => {
	if (!isValidOffset(endOffset)) {
		throw new InvalidEndOffsetError(endOffset);
	}
};

export const validateRefWeekday = (refWeekday: unknown): void => {
	if (!isValidWeekday(refWeekday)) {
		throw new InvalidRefWeekdayError(refWeekday);
	}
};

export const validateRefDate = (refDate: unknown): void => {
	if (!isValidRefDate(refDate)) {
		throw new InvalidRefDateError(refDate);
	}
};

export const validateRangeType = (rangeType: unknown) => {
	if (typeof rangeType !== "string") {
		throw new InvalidParameterError("rangeType param", rangeType, "a string");
	}

	// Check if the rangeType param is one of the values in RangeType
	if (!Object.values(RANGE_TYPE).includes(rangeType as RANGE_TYPE)) {
		throw new InvalidParameterError(
			"rangeType param",
			rangeType,
			`one of the following values: ${Object.values(RANGE_TYPE)
				.map((value) => `"${value}"`)
				.join(", ")}`,
		);
	}
};

export const validateDaysCount = (daysCount: unknown) => {
	if (typeof daysCount !== "number") {
		throw new InvalidParameterError("daysCount param", daysCount, "a number");
	}

	if (!Number.isInteger(daysCount) || daysCount < 1) {
		throw new InvalidParameterError(
			"daysCount param",
			daysCount,
			"a positive integer",
		);
	}
};

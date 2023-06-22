import { RANGE_TYPE } from "../constants";
import {
	InvalidEndOffsetError,
	InvalidParameterError,
	InvalidRefDateError,
	InvalidRefWeekdayError,
	InvalidStartOffsetError,
} from "../errors";
import {
	isEmptyObject,
	isObject,
	isValidOffset,
	isValidRefDate,
	isValidWeekday,
} from "../utils";

/**
 * Validates an object argument.
 *
 * @remarks
 * Throws an {@link InvalidParameterError} if the input is not an object or an empty object.
 *
 * @param input - The input to be validated.
 * @throws {@link InvalidParameterError}
 * @returns void
 */
export const validateObjectArgument = (input: unknown): void => {
	if (!isObject(input) || isEmptyObject(input)) {
		throw new InvalidParameterError("provided argument", input, "a non object");
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
	// Check if the rangeType param is a string
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
	// Check if the rangeType param is a string
	if (typeof daysCount !== "number") {
		throw new InvalidParameterError("daysCount param", daysCount, "a number");
	}

	if (!Number.isInteger(daysCount) || daysCount < 0) {
		throw new InvalidParameterError(
			"daysCount param",
			daysCount,
			"a non-negative integer",
		);
	}
};

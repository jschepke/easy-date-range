import { validateExtendRangeOptions } from "./validators/validateExtendRangeOptions";
import { DateTime, type DurationUnit } from "luxon";

/**
 * Options for `extendRange` function.
 */
export interface ExtendRangeOptions {
	/**
	 * The range of DateTime objects to extend.
	 */
	rangeToExtend: DateTime[];
	/**
	 * The unit of time to use for extending the range.
	 *
	 * @example 'days', 'months' etc.
	 */
	timeUnit: DurationUnit;
	/**
	 * The number of units to add to the start of the range.
	 */
	startOffset: number;
	/**
	 * The number of units to add to the end of the range.
	 */
	endOffset: number;
}

/**
 * A function that extends an array of dates from DateRange.
 *
 * Works by adding or subtracting a specified number of time units to the
 * start or end of the range.
 *
 * @param options - The {@link ExtendRangeOptions} for extending the range.
 * @returns A new array of DateTime objects that represents the extended range.
 * @throws ValidationError - If any of the options are invalid.
 */
export function extendRange(options: ExtendRangeOptions): DateTime[] {
	//validate input options
	validateExtendRangeOptions(options);

	const { rangeToExtend, timeUnit, endOffset, startOffset } = options;

	if (rangeToExtend.length + endOffset < 1) {
		throw new Error(
			`Negative endOffset (${endOffset}) exceeds the date range length (${rangeToExtend.length}).`,
		);
	}

	if (rangeToExtend.length + startOffset < 1) {
		throw new Error(
			`Negative startOffset (${startOffset}) exceeds the date range length (${rangeToExtend.length}).`,
		);
	}

	if (
		startOffset < 0 &&
		endOffset < 0 &&
		startOffset + endOffset + rangeToExtend.length < 1
	) {
		throw new Error(
			`Negative values of startOffset (${startOffset}) and endOffset (${endOffset}) exceeds the date range length (${rangeToExtend.length}).`,
		);
	}

	// extend the range
	const extendedRange = [...rangeToExtend];
	const firstDate = extendedRange[0];
	const lastDate = extendedRange[extendedRange.length - 1];

	if (startOffset < 0) {
		for (let i = 0; i > startOffset; i--) {
			extendedRange.shift();
		}
	} else {
		for (let i = 1; i > 0 && i <= startOffset; i++) {
			const newDate = firstDate.minus({ [timeUnit]: i });
			extendedRange.unshift(newDate);
		}
	}

	if (endOffset < 0) {
		for (let i = 0; i > endOffset; i--) {
			extendedRange.pop();
		}
	} else {
		for (let i = 1; i > 0 && i <= endOffset; i++) {
			const newDate = lastDate.plus({ [timeUnit]: i });
			extendedRange.push(newDate);
		}
	}

	return extendedRange;
}

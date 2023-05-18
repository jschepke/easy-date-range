import { validateExtendRangeOpts } from "./validators/validateExtendRangeOpts";
import { DateTime, type DurationUnit } from "luxon";

/**
 * Options for `extendRange` function.
 */
export interface ExtendRangeOpts {
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
 * @param options - The {@link ExtendRangeOpts} for extending the range.
 * @returns A new array of DateTime objects that represents the extended range.
 * @throws ValidationError - If any of the options are invalid.
 */
export function extendRange(options: ExtendRangeOpts): DateTime[] {
	//validate input options
	validateExtendRangeOpts(options);

	const { rangeToExtend, timeUnit, endOffset, startOffset } = options;

	// extend the range
	const extendedRange = [...rangeToExtend];
	const firstDate = extendedRange[0];
	const lastDate = extendedRange[extendedRange.length - 1];

	for (let i = 1; i > 0 && i <= startOffset; i++) {
		const newDate = firstDate.minus({ [timeUnit]: i });
		extendedRange.unshift(newDate);
	}
	for (let i = 1; i > 0 && i <= endOffset; i++) {
		const newDate = lastDate.plus({ [timeUnit]: i });
		extendedRange.push(newDate);
	}

	return extendedRange;
}

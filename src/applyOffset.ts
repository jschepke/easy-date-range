import { validateApplyOffsetSettings } from "./validators/validateApplyOffsetSettings";
import { DateTime, type DurationUnit } from "luxon";

export interface ApplyOffsetSettings {
	/**
	 * The range of DateTimes to which offsets are applied.
	 */
	rangeToAdjust: DateTime[];
	/**
	 * The unit of time to use with applying the offset.
	 *
	 * @example 'days', 'months' etc.
	 */
	timeUnit: DurationUnit;
	/**
	 * The number of time units to add to the start of the range.
	 */
	startOffset: number;
	/**
	 * The number of time units to add to the end of the range.
	 */
	endOffset: number;
}

/**
 * Shifts the start or end of a date range by a given offset.
 *
 * @remarks
 * Works by adding or subtracting a specified number of time units to the
 * start or end of the range.
 *
 * @param settings - An object that contains the date range, the offsets and the time unit to apply.
 * See {@link ApplyOffsetSettings} for more details.
 * @returns A new array of DateTimes.
 * @throws ValidationError - If any of the options are invalid.
 */
export function applyOffset(settings: ApplyOffsetSettings): DateTime[] {
	//validate input settings
	validateApplyOffsetSettings(settings);

	const { rangeToAdjust, timeUnit, endOffset, startOffset } = settings;

	// validate exceeding offsets
	if (rangeToAdjust.length + endOffset < 1) {
		throw new Error(
			`Negative endOffset (${endOffset}) exceeds the date range length (${rangeToAdjust.length}).`,
		);
	}

	if (rangeToAdjust.length + startOffset < 1) {
		throw new Error(
			`Negative startOffset (${startOffset}) exceeds the date range length (${rangeToAdjust.length}).`,
		);
	}

	if (
		startOffset < 0 &&
		endOffset < 0 &&
		startOffset + endOffset + rangeToAdjust.length < 1
	) {
		throw new Error(
			`Negative values of startOffset (${startOffset}) and endOffset (${endOffset}) exceeds the date range length (${rangeToAdjust.length}).`,
		);
	}

	// apply the offsets
	const adjustedRange = [...rangeToAdjust];
	const firstDate = adjustedRange[0];
	const lastDate = adjustedRange[adjustedRange.length - 1];

	if (startOffset < 0) {
		for (let i = 0; i > startOffset; i--) {
			adjustedRange.shift();
		}
	} else {
		for (let i = 1; i > 0 && i <= startOffset; i++) {
			const newDate = firstDate.minus({ [timeUnit]: i });
			adjustedRange.unshift(newDate);
		}
	}

	if (endOffset < 0) {
		for (let i = 0; i > endOffset; i--) {
			adjustedRange.pop();
		}
	} else {
		for (let i = 1; i > 0 && i <= endOffset; i++) {
			const newDate = lastDate.plus({ [timeUnit]: i });
			adjustedRange.push(newDate);
		}
	}

	return adjustedRange;
}

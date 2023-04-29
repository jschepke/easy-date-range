import { DateTime } from "luxon";

import { WEEKDAY } from "./constants";
import { extendRange } from "./extendRange";
import { isValidRefDate } from "./utils/isValidRefDate";
import { isValidWeekday } from "./utils/isValidWeekday";
import { validateDateRangeOptions } from "./validators/validateDateRangeOptions";

/**
 * Options for the DateRange methods.
 */
export interface DateRangeOptions {
	/**
	 * The reference date to calculate the range from.
	 *
	 * @remarks
	 * Must be a Date object or luxon DateTime object.
	 * Defaults to current time.
	 *
	 * @example //TODO
	 * ```
	 * new DateRange().week({ refDate: DateTime.fromISO('2023-05-15') });
	 * ```
	 */
	refDate?: DateTime | Date;

	/**
	 * The reference weekday to start the range from.
	 *
	 *@remarks
	 * Must be an integer from 1 (Monday) to 7 (Sunday).
	 * Defaults to Monday.
	 *
	 *@example //TODO
	 * ```
	 * // the range will start from Sunday
	 * new DateRange().week({refDate: someDate, refWeekday: Weekday.Sunday });
	 * ```
	 */
	refWeekday?: WEEKDAY;

	/**
	 * The number of time units to add before the start of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer. Defaults to 0.
	 */
	startOffset?: number;

	/**
	 * The number of time units to add after the end of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer. Defaults to 0.
	 */
	endOffset?: number;
}

// TODO
/* interface IDateRange {
  dates: DateTime[];
  getLuxonDates(): DateTime[];
  toMilliseconds(): number[];
  eachDayOfWeek(config?: DateRangeOptions): DateRange;
  eachDayOfMonth(config?: DateRangeOptions): DateRange;
} */

export class DateRange {
	//TODO add an interface so the class can implement it

	/**
	 * @remarks Default value for DateRange instance is to current time.
	 */
	private _refDate: DateTime;

	/**
	 * @remarks Default value for DateRange instance is 1 (Monday)
	 */
	private _refWeekday: WEEKDAY;

	/**
	 * Default value for startOffset
	 */
	private _startOffset: number;

	/**
	 * Default value for endOffset
	 */
	private _endOffset: number;

	/**
	 * Instance date storage.
	 */
	private _dates: DateTime[];

	//todo add tsdoc description to the constructor
	constructor() {
		// rome-ignore lint/style/noArguments: <explanation>
		if (arguments.length > 0) {
			throw new Error("DateRange constructor does not accept any parameters");
		}

		this._refDate = DateTime.now();
		this._refWeekday = WEEKDAY.Monday;
		this._startOffset = 0;
		this._endOffset = 0;
		this._dates = [];
	}

	// Todo add tsdoc descriptions to getters
	// todo add offset getters
	// todo remove dates geter. Dates should only be accessible with methods eg 'toJSDates'

	get refDate(): DateTime {
		return this._refDate;
	}

	get refWeekday(): WEEKDAY {
		return this._refWeekday;
	}

	get dates(): DateTime[] {
		return this._dates;
	}

	/*================================ VALIDATION METHODS ==============================*/

	//TODO adjust info about re-export when the lib is ready
	/**
	 * Checks if a given value is a valid reference date.
	 *
	 * @remarks A reference date can be either a `Date` object or a `DateTime` object.
	 * This function is re-exported from utilities module for convenience of use.
	 *
	 * @param refDate - The value to check.
	 * @returns True if the value is a valid reference date, false otherwise.
	 */
	public isValidRefDate(refDate: unknown): boolean {
		return isValidRefDate(refDate);
	}

	//TODO adjust info about re-export when the lib is ready
	/**
	 * Checks if a weekday is a number from 1 to 7.
	 *
	 * @remarks This function is re-exported from utilities module for convenience of use.
	 *
	 * @param weekday - The weekday to check.
	 * @returns True if weekday is a number from 1 to 7, false otherwise.
	 */
	public isValidRefWeekday(weekday: unknown): boolean {
		return isValidWeekday(weekday);
	}

	/*================================ CONVERTING METHODS ==============================*/

	/**
	 * Returns an array of Luxon DateTime objects
	 */
	toLuxonDates(): DateTime[] {
		return this._dates;
	}

	/**
	 * Returns an array of JavaScript Date objects
	 */
	toJSDates(): Date[] {
		return this._dates.map((date) => date.toJSDate());
	}

	/**
	 * Returns an array of dates in milliseconds format
	 *
	 * @returns Array of milliseconds
	 */
	toMilliseconds(): number[] {
		return this._dates.map((date) => date.valueOf());
	}

	/**
	 * Returns an array of dates in ISOTime format
	 *
	 * @returns Array of dates in ISOTime format
	 */
	// toISOTime(): string[] {
	// 	return this._dates.map((date) => date.toISOTime());
	// }

	/**
	 * @returns Array of dates in ISODate format
	 */
	// toISODate(): string[] {
	// 	return this._dates.map((date) => date.toISODate());
	// }

	/**
	 * @returns Array of dates in ISO format
	 */
	// toISO(): string[] {
	// 	return this._dates.map((date) => date.toISO());
	// }

	// ..other converting methods

	/*================================ TIME RANGE METHODS ==============================*/

	/**
	 * Creates an array of dates for each day of a week range based on a reference date.
	 *
	 * @remarks
	 * By default, the range starts on Monday before or on the reference date
	 * and ends on Sunday after or on the reference date.
	 * Each date is set to the start of the day (midnight).
	 *
	 * The date range can be customized by passing an `options` object with different parameters.
	 *
	 * @param options - {@link DateRangeOptions}
	 * @returns The `DateRange` instance with the dates array populated.
	 *
	 * @example //TODO
	 */
	public eachDayOfWeek(options?: DateRangeOptions): DateRange {
		validateDateRangeOptions(options);

		const {
			refDate = this._refDate,
			refWeekday = this._refWeekday,
			startOffset = this._startOffset,
			endOffset = this._endOffset,
		} = options || {};

		// Set date at the beginning of a day
		let firstDayOfRange: DateTime;
		if (refDate instanceof Date) {
			firstDayOfRange = DateTime.fromJSDate(refDate).startOf("day");
		} else {
			firstDayOfRange = refDate.startOf("day");
		}

		// Find the first date of a week range
		while (firstDayOfRange.weekday !== refWeekday) {
			firstDayOfRange = firstDayOfRange.minus({ days: 1 });
		}

		const dateRange: DateTime[] = [];

		let currentDay = firstDayOfRange;
		while (dateRange.length < 7) {
			dateRange.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// apply offset if specified
		if (startOffset || endOffset) {
			const extendedDateRange = extendRange({
				rangeToExtend: dateRange,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._dates = [...extendedDateRange];

			return this;
		} else {
			this._dates = [...dateRange];
			return this;
		}
	}

	//TODO
	public eachDayOfMonth(options?: DateRangeOptions): DateRange {
		validateDateRangeOptions(options);

		const {
			refDate = this._refDate,
			refWeekday = this._refWeekday,
			startOffset = this._startOffset,
			endOffset = this._endOffset,
		} = options || {};

		// Set the fist date of month
		let firstDayOfMonth: DateTime;
		if (refDate instanceof Date) {
			firstDayOfMonth = DateTime.fromJSDate(refDate).startOf("month");
		} else {
			firstDayOfMonth = refDate.startOf("month");
		}

		// Find the first date of a 35 days range aligned with month
		let firstDayOfRange: DateTime = firstDayOfMonth;
		while (firstDayOfRange.weekday !== refWeekday) {
			firstDayOfRange = firstDayOfRange.minus({ days: 1 });
		}

		const dateRange: DateTime[] = [];

		let currentDay = firstDayOfRange;
		while (dateRange.length < 35) {
			dateRange.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// apply offset if specified
		if (startOffset || endOffset) {
			const extendedDateRange = extendRange({
				rangeToExtend: dateRange,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._dates = [...extendedDateRange];

			return this;
		} else {
			this._dates = [...dateRange];
			return this;
		}
	}

	days(/* number of days */) {
		//...
	}
}

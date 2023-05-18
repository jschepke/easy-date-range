import { DateTime } from "luxon";

import { RANGE_TYPE, WEEKDAY } from "./constants";
import { InvalidParameterError } from "./errors";
import { extendRange } from "./extendRange";
import { isValidOffset, isValidRefDate, isValidWeekday } from "./utils";
import { validateDateRangeOptions_monthExact } from "./validators";
import { validateDateRangeOpts } from "./validators/validateDateRangeOpts";

/**
 * Options for the DateRange methods.
 */
export interface DateRangeOpts {
	/**
	 * The reference date to calculate the range from.
	 *
	 * @remarks
	 * Must be a Date object or luxon DateTime object.
	 * Defaults to current time.
	 *
	 * @example
	 * ```
	 * // with DateTime
	 * new DateRange().getWeek({ refDate: DateTime.fromISO('2023-05-15') });
	 *
	 * // with Date
	 * new DateRange().getWeek({ refDate: new Date("2023-05-15") });
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
	 *@example
	 * ```
	 * // with WEEKDAY enum. The range will start from Sunday
	 * new DateRange().getWeek({refWeekday: WEEKDAY.Sunday });
	 * // the equivalent with a number
	 * new DateRange().getWeek({ refWeekday: 7 });
	 * ```
	 */
	refWeekday?: WEEKDAY;

	/**
	 * The number of time units to add before the start of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer. Defaults to 0.
	 *
	 * For `getWeek()` and `getMonth()` methods the time unit is `day`.
	 *
	 * @example
	 * ```
	 * // set reference date ('Fri, Jan 10, 2020')
	 * const refDate = DateTime.fromObject({ year: 2020, month: 1, day: 10 });
	 *
	 * // without startOffset
	 * const weekRange1 = new DateRange().getWeek({ refDate });
	 * weekRange1.dates[0]; // 'Mon, Jan 6, 2020'
	 *
	 * // with startOffset
	 * const weekRange2 = new DateRange().getWeek({
	 * 	refDate,
	 * 	startOffset: 5,
	 * });
	 * weekRange2.dates[0]; // 'Wed, Jan 1, 2020'
	 * ```
	 */
	startOffset?: number;

	/**
	 * The number of time units to add after the end of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer. Defaults to 0.
	 *
	 *  For `getWeek()` and `getMonth()` methods the time unit is `day`.
	 *
	 * @example
	 * ```
	 * // set reference date ('Fri, Jan 10, 2020')
	 * const refDate = DateTime.fromObject({ year: 2020, month: 1, day: 10 });
	 *
	 * // without endOffset
	 * const weekRange1 = new DateRange().getWeek({ refDate });
	 * // last date of the range
	 * weekRange1.dates[weekRange1.dates.length - 1]; // 'Sun, Jan 12, 2020'
	 *
	 * // with endOffset
	 * const weekRange2 = new DateRange().getWeek({
	 * 	refDate,
	 * 	endOffset: 5,
	 * });
	 * // last date of the range
	 * weekRange2.dates[weekRange2.dates.length - 1]; // 'Fri, Jan 17, 2020'
	 * ```
	 */
	endOffset?: number;
}

/**
 * Options for the DateRange `getMonthExact()` method.
 */
export type DateRangeOpts_MonthExact = Omit<DateRangeOpts, "refWeekday">;

export class DateRange {
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

	/**
	 * Type of current generated date range.
	 */
	private _rangeType: RANGE_TYPE | undefined;

	/**
	 * DateRange is an entry point for creating and storing a range of dates.
	 *
	 * @remarks
	 * The dates can be generated with a get methods.
	 *
	 * The constructor does not accept any parameters. If any parameters are passed, an InvalidParameterError is thrown.
	 */
	constructor() {
		// rome-ignore lint/style/noArguments: check specifically for no arguments
		if (arguments.length > 0) {
			throw new InvalidParameterError(
				"parameter passed to DateRange instance",
				// rome-ignore lint/style/noArguments: check specifically for no arguments
				arguments.length === 1 ? arguments[0] : [...arguments],
				"no parameters",
				"Option parameters should be specified within DateRange methods.",
			);
		}

		// default values for the instance
		this._refDate = DateTime.now();
		this._refWeekday = WEEKDAY.Monday;
		this._startOffset = 0;
		this._endOffset = 0;
		this._dates = [];
		this._rangeType = undefined;
	}

	/**
	 * Gets the reference date for this instance.
	 * @returns The reference date.
	 */
	get refDate(): DateTime {
		return this._refDate;
	}

	/**
	 * Gets the reference weekday for this instance.
	 * @returns The reference weekday.
	 */
	get refWeekday(): WEEKDAY {
		return this._refWeekday;
	}

	/**
	 * Gets the array of dates for this instance.
	 * @returns The array of dates as Luxon DateTime objects.
	 */
	get dates(): DateTime[] {
		return this._dates;
	}

	/**
	 * Gets the start offset for this instance.
	 * @returns The start offset.
	 */
	get startOffset(): number {
		return this._startOffset;
	}

	/**
	 * Gets the end offset for this instance.
	 * @returns The end offset.
	 */
	get endOffset(): number {
		return this._endOffset;
	}

	/**
	 * Gets the type of the current-range generated for the instance.
	 *
	 * @remarks
	 * The type is a {@link RANGE_TYPE} that represents the duration of the range.
	 *
	 * If `undefined`, that means the range has not been created yet.
	 *
	 * @returns The type of the current-range or undefined if no range is created.
	 */
	get rangeType(): RANGE_TYPE | undefined {
		return this._rangeType;
	}

	/*================================ VALIDATION METHODS ==============================*/

	/**
	 * Checks if a given value is a valid reference date.
	 *
	 * @remarks A reference date can be either a `Date` object or a `DateTime` object.
	 *
	 * @param refDate - The value to check.
	 * @returns True if the value is a valid reference date, false otherwise.
	 */
	public isValidRefDate(refDate: unknown): boolean {
		return isValidRefDate(refDate);
	}

	/**
	 * Checks if a weekday is a number from 1 to 7.
	 *
	 * @param weekday - The value to check.
	 * @returns True if weekday is a number from 1 to 7, false otherwise.
	 */
	public isValidRefWeekday(weekday: unknown): boolean {
		return isValidWeekday(weekday);
	}

	/**
	 * Checks if the value is a valid offset (non-negative integer).
	 *
	 * @param offset - The value to check.
	 * @returns True if the value is a non-negative integer, false otherwise.
	 */
	public isValidOffset(offset: unknown): boolean {
		return isValidOffset(offset);
	}

	/*================================ CONVERTING METHODS ==============================*/

	/**
	 * Returns an array of Luxon DateTime objects
	 */
	toDateTimes(): DateTime[] {
		return this._dates;
	}

	/**
	 * Returns an array of JavaScript Date objects
	 */
	toDates(): Date[] {
		return this._dates.map((date) => date.toJSDate());
	}

	/*================================ TIME RANGE METHODS ==============================*/

	/**
	 * Creates an array of dates for each day of a week range based on a reference date.
	 *
	 * @remarks
	 * By default, the range starts on Monday before or on the reference date and ends
	 * on Sunday after or on the reference date.
	 * Each date is set to the start of the day (midnight).
	 *
	 * The date range can be customized by passing an `options` object with different parameters.
	 *
	 * @param options - {@link DateRangeOpts}
	 * @returns The `DateRange` instance with the dates array populated.
	 *
	 * @example //TODO
	 */
	public getWeek(options?: DateRangeOpts): DateRange {
		validateDateRangeOpts(options);

		const rangeType = RANGE_TYPE.Week;

		const {
			refDate = this.refDate,
			refWeekday = this.refWeekday,
			startOffset = this.startOffset,
			endOffset = this.endOffset,
		} = options || {};

		// Update instance members if specified and different from current one
		if (refWeekday !== this.refWeekday) {
			this._refWeekday = refWeekday;
		}
		if (refDate !== this.refDate) {
			this._refDate =
				refDate instanceof Date ? DateTime.fromJSDate(refDate) : refDate;
		}
		if (startOffset !== this.startOffset) {
			this._startOffset = startOffset;
		}
		if (endOffset !== this.endOffset) {
			this._endOffset = endOffset;
		}
		if (rangeType !== this.rangeType) {
			this._rangeType = rangeType;
		}

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
	public getMonth(options?: DateRangeOpts): DateRange {
		validateDateRangeOpts(options);

		const rangeType = RANGE_TYPE.MonthWeekExtended;

		const {
			refDate = this._refDate,
			refWeekday = this._refWeekday,
			startOffset = this._startOffset,
			endOffset = this._endOffset,
		} = options || {};

		// Update instance members if specified and different from current one
		if (refWeekday !== this._refWeekday) {
			this._refWeekday = refWeekday;
		}
		if (refDate !== this._refDate) {
			this._refDate =
				refDate instanceof Date ? DateTime.fromJSDate(refDate) : refDate;
		}
		if (startOffset !== this._startOffset) {
			this._startOffset = startOffset;
		}
		if (endOffset !== this._endOffset) {
			this._endOffset = endOffset;
		}
		if (rangeType !== this.rangeType) {
			this._rangeType = rangeType;
		}

		// Find the last weekday of the range
		const lastWeekday = refWeekday - 1 === 0 ? 7 : refWeekday - 1;

		// Find the first and the last day of the month
		let firstDayOfMonth: DateTime;
		let lastDayOfMonth: DateTime;

		if (refDate instanceof Date) {
			firstDayOfMonth = DateTime.fromJSDate(refDate).startOf("month");
			lastDayOfMonth = DateTime.fromJSDate(refDate).endOf("month");
		} else {
			firstDayOfMonth = refDate.startOf("month");
			lastDayOfMonth = refDate.endOf("month");
		}

		const dateRange: DateTime[] = [];

		// Find the first date of a range aligned with a begging of a week
		let firstDayOfRange: DateTime = firstDayOfMonth;
		while (firstDayOfRange.weekday !== refWeekday) {
			firstDayOfRange = firstDayOfRange.minus({ days: 1 });
		}

		// Loop over the dates to the last day of month
		let currentDay = firstDayOfRange;
		while (currentDay.valueOf() < lastDayOfMonth.valueOf()) {
			dateRange.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// Find the last date of a range aligned with an ending of a week
		while (dateRange[dateRange.length - 1].weekday !== lastWeekday) {
			dateRange.push(dateRange[dateRange.length - 1].plus({ days: 1 }));
		}

		// Apply offset if specified
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

	getMonthExact(options?: DateRangeOpts_MonthExact): DateRange {
		validateDateRangeOptions_monthExact(options);

		const rangeType = RANGE_TYPE.MonthExact;

		const {
			refDate = this._refDate,
			startOffset = this._startOffset,
			endOffset = this._endOffset,
		} = options || {};

		// Update instance members if specified and different from current one
		if (refDate !== this._refDate) {
			this._refDate =
				refDate instanceof Date ? DateTime.fromJSDate(refDate) : refDate;
		}
		if (startOffset !== this._startOffset) {
			this._startOffset = startOffset;
		}
		if (endOffset !== this._endOffset) {
			this._endOffset = endOffset;
		}
		if (rangeType !== this.rangeType) {
			this._rangeType = rangeType;
		}

		// Find the first and the last day of the month
		let firstDayOfMonth: DateTime;
		let lastDayOfMonth: DateTime;

		if (refDate instanceof Date) {
			firstDayOfMonth = DateTime.fromJSDate(refDate).startOf("month");
			lastDayOfMonth = DateTime.fromJSDate(refDate).endOf("month");
		} else {
			firstDayOfMonth = refDate.startOf("month");
			lastDayOfMonth = refDate.endOf("month");
		}

		const dateRange: DateTime[] = [];

		let currentDay = firstDayOfMonth;
		while (currentDay.valueOf() < lastDayOfMonth.valueOf()) {
			dateRange.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// Apply offset if specified
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
		//todo
		console.info("not implemented");
		return;
	}

	next() {
		switch (this.rangeType) {
			case "week": {
				const nextRefDate = this.refDate.plus({ days: 7 });

				const options: Required<DateRangeOpts> = {
					refDate: nextRefDate,
					refWeekday: this.refWeekday,
					startOffset: this.startOffset,
					endOffset: this.endOffset,
				};

				this.getWeek(options);
				break;
			}
			case "month-week-extended": {
				const { year, month } = this.refDate;
				const nextRefDate = DateTime.fromObject({
					year,
					month: month + 1,
				});

				const options: Required<DateRangeOpts> = {
					refWeekday: this.refWeekday,
					refDate: nextRefDate,
					startOffset: this.startOffset,
					endOffset: this.endOffset,
				};
				this.getMonth(options);
				break;
			}
			case "month-exact": {
				const { year, month } = this.refDate;
				const nextRefDate = DateTime.fromObject({
					year,
					month: month + 1,
				});

				const options: Required<DateRangeOpts_MonthExact> = {
					refDate: nextRefDate,
					startOffset: this.startOffset,
					endOffset: this.endOffset,
				};
				this.getMonthExact(options);
				break;
			}
			case "days": {
				//todo
				throw new Error("not implemented");
			}
		}
	}
}

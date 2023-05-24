import { DateTime } from "luxon";

import { RANGE_TYPE, WEEKDAY } from "./constants";
import { InvalidParameterError } from "./errors";
import { extendRange } from "./extendRange";
import { isValidOffset, isValidRefDate, isValidWeekday } from "./utils";
import { validateDateRangeOptions_monthExact } from "./validators";
import { validateDateRangeOpts } from "./validators/validateDateRangeOpts";
import { validateDateRangeOptions_days } from "./validators/validateDateRangeOpts_days";

interface DateRangeAllOpts
	extends DateRangeOpts,
		DateRangeOpts_Days,
		DateRangeOpts_MonthExact {}

export interface DateRangeMembers extends Required<DateRangeAllOpts> {
	rangeType: RANGE_TYPE;
	dates: DateTime[];
	isNext: boolean;
}

interface DateRangeDefaults
	extends Omit<DateRangeMembers, "rangeType">,
		Partial<Pick<DateRangeMembers, "rangeType">> {}

const dateRangeDefaults: DateRangeDefaults = {
	rangeType: undefined,
	daysCount: 0,
	endOffset: 0,
	get refDate() {
		return DateTime.now();
	},
	refWeekday: WEEKDAY.Monday,
	startOffset: 0,
	dates: [],
	isNext: false,
};

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

/**
 * Options for the DateRange `getDays()` method.
 */
export type DateRangeOpts_Days = Omit<DateRangeOpts, "refWeekday"> & {
	daysCount?: number;
};

export class DateRange {
	/**
	 * refDate of the instance.
	 *
	 * @remarks Default to current time.
	 */
	private _refDate: DateTime | undefined;

	/**
	 * refWeekday of the instance.
	 *
	 * @remarks Default to 1 (Monday)
	 */
	private _refWeekday: WEEKDAY | undefined;

	/**
	 * startOffset of the instance.
	 *
	 * @remarks Default to 0
	 */
	private _startOffset: number | undefined;

	/**
	 * endOffset of the instance.
	 *
	 * @remarks Default to 0
	 */
	private _endOffset: number | undefined;

	/**
	 * Instance date storage.
	 */
	private _dates: DateTime[] | undefined;

	/**
	 * Type of current generated date range.
	 */
	private _rangeType: RANGE_TYPE | undefined;

	/**
	 * Count of days used with getDays() method.
	 */
	private _daysCount: number | undefined;

	/**
	 * Indicates whether the `next()` method should be applied to the range.
	 */
	private _isNext: boolean | undefined;

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
	}

	/**
	 * Gets the reference date for this instance.
	 *
	 * @returns The reference date.
	 */
	get refDate(): DateTime {
		if (this._refDate === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access refDate before it has been initialized. Call one of the getMethods to generate the range and set the refDate.",
			);
		}
		return this._refDate;
	}

	/**
	 * Gets the reference weekday for this instance.
	 *
	 * @returns The reference weekday.
	 */
	get refWeekday(): WEEKDAY {
		if (this._refWeekday === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access refWeekday before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._refWeekday;
	}

	/**
	 * Gets the array of dates for this instance.
	 *
	 * @returns The array of dates as Luxon DateTime objects.
	 */
	get dates(): DateTime[] {
		if (this._dates === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access dates before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._dates;
	}

	/**
	 * Gets the start offset for this instance.
	 *
	 * @returns The start offset.
	 */
	get startOffset(): number {
		if (this._startOffset === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access startOffset before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._startOffset;
	}

	/**
	 * Gets the end offset for this instance.
	 *
	 * @returns The end offset.
	 */
	get endOffset(): number {
		if (this._endOffset === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access endOffset before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._endOffset;
	}

	/**
	 * Gets the days count used with `getDays()` method for this instance.
	 *
	 * @returns Number of days applied on `getDays()`.
	 */
	get daysCount(): number {
		if (this._daysCount === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access daysCount before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._daysCount;
	}

	/**
	 * Gets the type of the current date range generated for the instance.
	 *
	 * @remarks
	 * The type is a {@link RANGE_TYPE} that represents the duration of the range.
	 *
	 * If `undefined`, that means the range has not been created yet.
	 *
	 * @returns The type of the current date range or undefined if no range is created.
	 */
	get rangeType(): RANGE_TYPE {
		if (this._rangeType === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access rangeType before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._rangeType;
	}

	// todo: add description
	get isNext() {
		if (this._isNext === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access isNext before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._isNext;
	}

	private _setMembers(members: DateRangeMembers) {
		const {
			rangeType,
			refDate,
			refWeekday,
			startOffset,
			endOffset,
			daysCount,
			dates,
			isNext,
		} = members;

		// Update instance members if different from current one

		// this._rangeType = rangeType;
		if (rangeType !== this._rangeType) {
			this._rangeType = rangeType;
		}
		if (refDate !== this._refDate) {
			this._refDate =
				refDate instanceof Date ? DateTime.fromJSDate(refDate) : refDate;
		}
		if (refWeekday !== this._refWeekday) {
			this._refWeekday = refWeekday;
		}
		if (startOffset !== this._startOffset) {
			this._startOffset = startOffset;
		}
		if (endOffset !== this._endOffset) {
			this._endOffset = endOffset;
		}
		if (daysCount !== this._daysCount) {
			this._daysCount = daysCount;
		}
		if (isNext !== this._isNext) {
			this._isNext = isNext;
		}

		this._dates = dates;
	}

	/*================================ Utility METHODS ==============================*/

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
		return this.dates;
	}

	/**
	 * Returns an array of JavaScript Date objects
	 */
	toDates(): Date[] {
		return this.dates.map((date) => date.toJSDate());
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

		const {
			refDate = dateRangeDefaults.refDate,
			refWeekday = dateRangeDefaults.refWeekday,
			startOffset = dateRangeDefaults.startOffset,
			endOffset = dateRangeDefaults.endOffset,
		} = options || {};

		const dateRangeMembers: DateRangeMembers = {
			rangeType: RANGE_TYPE.Week,
			dates: [],
			refDate,
			refWeekday,
			endOffset,
			startOffset,
			isNext: dateRangeDefaults.isNext,
			daysCount: dateRangeDefaults.daysCount,
		};

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

		const dates = dateRangeMembers.dates;

		let currentDay = firstDayOfRange;
		while (dates.length < 7) {
			dates.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// apply offset if specified
		if (startOffset || endOffset) {
			const extendedDateRange = extendRange({
				rangeToExtend: dates,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._setMembers({ ...dateRangeMembers, dates: [...extendedDateRange] });

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	//TODO
	public getMonth(options?: DateRangeOpts): DateRange {
		validateDateRangeOpts(options);

		const {
			refDate = dateRangeDefaults.refDate,
			refWeekday = dateRangeDefaults.refWeekday,
			startOffset = dateRangeDefaults.startOffset,
			endOffset = dateRangeDefaults.endOffset,
		} = options || {};

		const dateRangeMembers: DateRangeMembers = {
			rangeType: RANGE_TYPE.MonthWeekExtended,
			dates: [],
			refDate,
			refWeekday,
			endOffset,
			startOffset,
			isNext: dateRangeDefaults.isNext,
			daysCount: dateRangeDefaults.daysCount,
		};

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

		const dates = dateRangeMembers.dates;

		// Find the first date of a range aligned with a begging of a week
		let firstDayOfRange: DateTime = firstDayOfMonth;
		while (firstDayOfRange.weekday !== refWeekday) {
			firstDayOfRange = firstDayOfRange.minus({ days: 1 });
		}

		// Loop over the dates to the last day of month
		let currentDay = firstDayOfRange;
		while (currentDay.valueOf() < lastDayOfMonth.valueOf()) {
			dates.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// Find the last date of a range aligned with an ending of a week
		while (dates[dates.length - 1].weekday !== lastWeekday) {
			dates.push(dates[dates.length - 1].plus({ days: 1 }));
		}

		// Apply offset if specified
		if (startOffset || endOffset) {
			const extendedDateRange = extendRange({
				rangeToExtend: dates,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._setMembers({ ...dateRangeMembers, dates: [...extendedDateRange] });

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	getMonthExact(options?: DateRangeOpts_MonthExact): DateRange {
		validateDateRangeOptions_monthExact(options);

		const {
			refDate = dateRangeDefaults.refDate,
			startOffset = dateRangeDefaults.startOffset,
			endOffset = dateRangeDefaults.endOffset,
		} = options || {};

		const dateRangeMembers: DateRangeMembers = {
			rangeType: RANGE_TYPE.MonthExact,
			dates: [],
			refDate,
			refWeekday: dateRangeDefaults.refWeekday,
			endOffset,
			startOffset,
			isNext: dateRangeDefaults.isNext,
			daysCount: dateRangeDefaults.daysCount,
		};

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

		const dates = dateRangeMembers.dates;

		let currentDay = firstDayOfMonth;
		while (currentDay.valueOf() < lastDayOfMonth.valueOf()) {
			dates.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// Apply offset if specified
		if (startOffset || endOffset) {
			// Apply offset if specified
			const extendedDateRange = extendRange({
				rangeToExtend: dates,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._setMembers({ ...dateRangeMembers, dates: [...extendedDateRange] });

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	getDays(options?: DateRangeOpts_Days): DateRange {
		validateDateRangeOptions_days(options);

		const {
			refDate = dateRangeDefaults.refDate,
			startOffset = dateRangeDefaults.startOffset,
			endOffset = dateRangeDefaults.endOffset,
			daysCount = 1,
		} = options || {};

		const dateRangeMembers: DateRangeMembers = {
			rangeType: RANGE_TYPE.Days,
			dates: [],
			refDate,
			refWeekday: dateRangeDefaults.refWeekday,
			endOffset,
			startOffset,
			isNext: dateRangeDefaults.isNext,
			daysCount,
		};

		// Set date at the beginning of a day
		let firstDayOfRange: DateTime;
		if (refDate instanceof Date) {
			firstDayOfRange = DateTime.fromJSDate(refDate).startOf("day");
		} else {
			firstDayOfRange = refDate.startOf("day");
		}

		const dates = dateRangeMembers.dates;

		let currentDay = firstDayOfRange;
		while (dates.length < daysCount) {
			dates.push(currentDay);
			currentDay = currentDay.plus({ day: 1 });
		}

		// apply offset if specified
		if (startOffset || endOffset) {
			const extendedDateRange = extendRange({
				rangeToExtend: dates,
				timeUnit: "days",
				startOffset,
				endOffset,
			});

			this._setMembers({ ...dateRangeMembers, dates: [...extendedDateRange] });

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	next(DateRange: DateRange) {
		if (!DateRange) {
			// Todo: Review and refactor the error
			throw new Error("DateRange not specified");
		}
		if (!DateRange.rangeType) {
			// Todo: Refactor to custom error. Review the error message.
			throw new Error(
				"The 'next()' method cannot be applied on empty empty range. Generate the range with one of the get methods first.",
			);
		}
		const {
			refDate,
			startOffset,
			endOffset,
			refWeekday,
			rangeType,
			daysCount,
			dates,
		} = DateRange;

		switch (rangeType) {
			case RANGE_TYPE.Week: {
				const nextRefDate = refDate.plus({ days: 7 });

				const options: Required<DateRangeOpts> = {
					refDate: nextRefDate,
					refWeekday: refWeekday,
					startOffset: startOffset,
					endOffset: endOffset,
				};

				this.getWeek(options);
				this._isNext = true;

				return this;
			}
			case RANGE_TYPE.MonthExact: {
				const { year, month } = refDate;
				const nextRefDate = DateTime.fromObject({
					year,
					month: month + 1,
				});

				const options: Required<DateRangeOpts_MonthExact> = {
					refDate: nextRefDate,
					startOffset: startOffset,
					endOffset: endOffset,
				};
				this.getMonthExact(options);
				this._isNext = true;

				return this;
			}
			case RANGE_TYPE.MonthWeekExtended: {
				const { year, month } = refDate;
				const nextRefDate = DateTime.fromObject({
					year,
					month: month + 1,
				});

				const options: Required<DateRangeOpts> = {
					refWeekday: refWeekday,
					refDate: nextRefDate,
					startOffset: startOffset,
					endOffset: endOffset,
				};

				this.getMonth(options);
				this._isNext = true;

				return this;
			}
			case RANGE_TYPE.Days: {
				const lastDate = dates[dates.length - 1];
				const nextRefDate = lastDate.plus({ day: 1 });

				console.log({
					lastDate: lastDate.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
					nextRefDate: nextRefDate.toLocaleString(
						DateTime.DATETIME_MED_WITH_WEEKDAY,
					),
				});

				const options: Required<DateRangeOpts_Days> = {
					daysCount,
					endOffset,
					startOffset,
					refDate: nextRefDate,
				};

				this.getDays(options);
				this._isNext = true;

				return this;
			}
			default:
				throw new Error("not implemented");
		}
	}
}

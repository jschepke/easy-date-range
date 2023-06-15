import { DateTime } from "luxon";

import { RANGE_TYPE, WEEKDAY } from "./constants";
import {
	EmptyDateRangeError,
	InvalidDateRangeError,
	InvalidParameterError,
	MissingArgumentError,
} from "./errors";
import { extendRange } from "./extendRange";
import { isValidOffset, isValidRefDate, isValidWeekday } from "./utils";
import { validateRangeOptionsMonthExact } from "./validators";
import { validateRangeOptions } from "./validators/validateRangeOptions";
import { validateDateRangeOptions_days } from "./validators/validateRangeOptionsDays";

interface OptionsAll
	extends OptionsDays,
		OptionsMonthExact,
		OptionsMonthExtended,
		OptionsWeek {}

export interface DateRangeMembers extends Required<OptionsAll> {
	rangeType: RANGE_TYPE;
	dates: DateTime[];
	isNext: boolean;
}
// DateRangeDefaults inherits DateRangeMembers but makes ‘rangeType’ optional.
interface DateRangeDefaults
	extends Pick<Partial<DateRangeMembers>, "rangeType">,
		Omit<DateRangeMembers, "rangeType"> {}

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

// Todo: Change the offset option to accept also negative values.
export interface Offset {
	/**
	 * The number of days to add before the the first date of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer.
	 *
	 * This will be change to accept also negative values.
	 *
	 * @defaultValue `0`
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
	 * The number of days to add after the the last date of the range.
	 *
	 * @remarks
	 * Must be a non-negative integer.
	 *
	 * This will be change to accept also negative values.
	 *
	 * @defaultValue `0`
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

interface RefDate {
	/**
	 * The reference date to calculate the range.
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
}

interface RefWeekday {
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
}

interface DaysCount {
	/**
	 * The number of days to be included in the range generated with `getDays` method.
	 */
	daysCount?: number;
}

interface OptionsWeek extends RefDate, RefWeekday, Offset {}

interface OptionsDays extends RefDate, DaysCount, Offset {}

interface OptionsMonthExact extends RefDate, Offset {}

interface OptionsMonthExtended extends RefDate, RefWeekday, Offset {}

/**
 * DateRange is the core component of easy-date-range. It provides various methods and properties for generating and handling date ranges.
 *
 * @remarks
 * To use the class, an instance must be created and initialized with one of the range generator methods.
 */
export class DateRange {
	/**
	 * refDate of the instance.
	 *
	 * @remarks Default to current time.
	 */
	private _refDate: DateTime | undefined;

	/**
	 * refWeekday of the instance.
	 */
	private _refWeekday: WEEKDAY | undefined;

	/**
	 * startOffset of the instance.
	 */
	private _startOffset: number | undefined;

	/**
	 * endOffset of the instance.
	 */
	private _endOffset: number | undefined;

	/**
	 * The instance date storage.
	 */
	private _dates: DateTime[] | undefined;

	/**
	 * The type of a current generated date range.
	 */
	private _rangeType: RANGE_TYPE | undefined;

	/**
	 * Count of days used with getDays() method.
	 */
	private _daysCount: number | undefined;

	/**
	 * Indicates whether the DateRange is generated with a `getNext` method.
	 */
	private _isNext: boolean | undefined;

	/**
	 * Indicates whether the DateRange is generated with a `getPrevious` method.
	 */
	private _isPrevious: boolean | undefined;

	/**
	 * DateRange is an entry point for creating and storing a range of dates.
	 *
	 * @remarks
	 * The dates can be generated with get methods.
	 *
	 * The constructor does not accept any parameters.
	 */
	constructor() {
		// rome-ignore lint/style/noArguments: check specifically for empty arguments array
		if (arguments.length > 0) {
			throw new InvalidParameterError(
				"parameter passed to DateRange instance",
				// rome-ignore lint/style/noArguments: check specifically for empty arguments array
				arguments.length === 1 ? arguments[0] : [...arguments],
				"no parameters",
				"Option parameters should be specified within DateRange methods.",
			);
		}
	}

	/**
	 * The reference date for this instance.
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
	 * The reference weekday for this instance.
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
	 * The array of luxon DateTimes for this instance.
	 *
	 * @remarks
	 * To get JS Dates use `toJSDates()` method.
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
	 * The start offset for this instance.
	 */
	public get startOffset(): number {
		if (this._startOffset === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access startOffset property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._startOffset;
	}

	/**
	 * The end offset for this instance.
	 */
	public get endOffset(): number {
		if (this._endOffset === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access endOffset property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._endOffset;
	}

	/**
	 * The days count used with `getDays()` method for this instance.
	 */
	public get daysCount(): number {
		if (this._daysCount === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access daysCount property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._daysCount;
	}

	/**
	 * The type of range generated for this instance.
	 *
	 * @remarks
	 * See {@link RANGE_TYPE| the RANGE_TYPE enum} for more details.
	 *
	 * If `undefined`, the range has not been created yet.
	 *
	 */
	public get rangeType(): RANGE_TYPE {
		if (this._rangeType === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access rangeType property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._rangeType;
	}

	/**
	 * A boolean that indicates whether DateRange is created with a `getNext` method.
	 */
	public get isNext() {
		if (this._isNext === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access isNext property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._isNext;
	}

	/**
	 * A boolean that indicates whether DateRange is created with a `getPrevious` method.
	 */
	public get isPrevious() {
		if (this._isPrevious === undefined) {
			// Todo: Refactor to custom error
			throw new Error(
				"You try to access isPrevious property before it has been initialized. Call one of the getMethods to generate the range and set instance members.",
			);
		}
		return this._isNext;
	}

	/**
	 * Sets or updates the instance members of the DateRange object.
	 *
	 * @param members - An object containing the properties of the DateRange object to be set or updated.
	 * @private
	 * */
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
	 * @remarks A reference date can be either a JS `Date` object or a Luxon `DateTime` object.
	 *
	 * @param refDate - The value to check.
	 * @returns True if the value is a valid reference date, false otherwise.
	 */
	public isValidRefDate(refDate: unknown): boolean {
		return isValidRefDate(refDate);
	}

	/**
	 * Checks if a given value is a valid weekday (integer from 1 to 7).
	 *
	 * @param weekday - The value to check.
	 * @returns True if weekday is an integer from 1 to 7, false otherwise.
	 */
	public isValidRefWeekday(weekday: unknown): boolean {
		return isValidWeekday(weekday);
	}

	/**
	 * Checks if a given value is a valid offset (non-negative integer).
	 *
	 * @param offset - The value to check.
	 * @returns True if the value is a non-negative integer, false otherwise.
	 */
	public isValidOffset(offset: unknown): boolean {
		return isValidOffset(offset);
	}

	/*================================ CONVERTING METHODS ==============================*/

	/**
	 * Returns an array of dates generated for the instance as Luxon DateTime objects.
	 */
	public toDateTimes(): DateTime[] {
		return this.dates;
	}

	/**
	 * Returns an array of dates generated for the instance as JS Date objects.
	 */
	public toDates(): Date[] {
		return this.dates.map((date) => date.toJSDate());
	}

	/*================================ TIME RANGE METHODS ==============================*/

	/**
	 * Creates a single week range.
	 *
	 * @remarks
	 * - By default, the method starts the range on Monday before or on the reference date and ends
	 * it on Sunday after or on the reference date.
	 *
	 * - If not specified, the reference date is set to the current time.
	 *
	 * - Each date is set to the start of the day (midnight).
	 *
	 * @param options - An optional object to customize the date range.
	 * @returns The `DateRange` with generated dates.
	 *
	 * @example
	 *  ```
	 * // get current week starting on Monday
	 * const week1 = new DateRange().getWeek();
	 *
	 * // get week based on a refDate and starting on Sunday
	 * const week2 = new DateRange().getWeek({
	 * 	refDate: new Date("2023-01-10"),
	 * 	refWeekday: WEEKDAY.Sunday,
	 * });
	 * // Generated dates:👇
	 * // Sunday, January 8, 2023 at 12:00:00 AM
	 * // Monday, January 9, 2023 at 12:00:00 AM
	 * // Tuesday, January 10, 2023 at 12:00:00 AM
	 * // Wednesday, January 11, 2023 at 12:00:00 AM
	 * // Thursday, January 12, 2023 at 12:00:00 AM
	 * // Friday, January 13, 2023 at 12:00:00 AM
	 * // Saturday, January 14, 2023 at 12:00:00 AM
	 * ```
	 */
	public getWeek(options?: OptionsWeek): DateRange {
		validateRangeOptions(options);

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

			this._setMembers({
				...dateRangeMembers,
				dates: [...extendedDateRange],
			});

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	/**
	 *
	 * Creates a single month range extended to include the full weeks.
	 *
	 * @remarks
	 *
	 * - By default, the method starts the range on Monday before or on the first day of the month and ends
	 * it on Sunday after or on the last day of the month.
	 *
	 * - If not specified, the reference date is set to the current time.
	 *
	 * - Each date is set to the start of the day (midnight).
	 *
	 * @param options - An optional object to customize the date range.
	 * @returns The `DateRange` with generated dates.
	 * @example
	 *  ```
	 * // Get current month extended to full weeks
	 * const monthExtended1 = new DateRange().getMonthExtended();
	 *
	 * // Get month extended to full weeks based on a refDate and starting on Wednesday
	 * const monthExtended2 = new DateRange().getMonthExtended({
	 * 	refDate: new Date("2023-01-10"),
	 * 	refWeekday: WEEKDAY.Wednesday,
	 * });
	 * // Generated dates:
	 * // Wednesday, December 28, 2022 at 12:00:00 AM -> The first date of the range
	 * // Thursday, December 29, 2022 at 12:00:00 AM
	 * // Friday, December 30, 2022 at 12:00:00 AM
	 * // ...
	 * // Tuesday, January 31, 2023 at 12:00:00 AM -> The last date of the range
	 * ```
	 */
	public getMonthExtended(options?: OptionsMonthExtended): DateRange {
		validateRangeOptions(options);

		const {
			refDate = dateRangeDefaults.refDate,
			refWeekday = dateRangeDefaults.refWeekday,
			startOffset = dateRangeDefaults.startOffset,
			endOffset = dateRangeDefaults.endOffset,
		} = options || {};

		const dateRangeMembers: DateRangeMembers = {
			rangeType: RANGE_TYPE.MonthExtended,
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

			this._setMembers({
				...dateRangeMembers,
				dates: [...extendedDateRange],
			});

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	/**
	 * Creates a single month range, from the first to the last day of the month.
	 *
	 * @remarks
	 *
	 * - By default, the method starts the range on the first day of the month and ends
	 * it on the last day of the month.
	 *
	 * - If not specified, the reference date is set to the current time.
	 *
	 * - Each date is set to the start of the day (midnight).
	 *
	 * @param options - An optional object to customize the date range.
	 * @returns The `DateRange` with generated dates.
	 * @example
	 *  ```
	 * // Get current month
	 * const month1 = new DateRange().getMonthExact();
	 *
	 * // Get month with specified refDate
	 * const month2 = new DateRange().getMonthExact({
	 * 	refDate: new Date("2023-01-10"),
	 * });
	 * // Generated dates:
	 * // Sunday, January 1, 2023 at 12:00:00 AM -> The first date of the range
	 * // Monday, January 2, 2023 at 12:00:00 AM
	 * // Tuesday, January 3, 2023 at 12:00:00 AM
	 * // ...
	 * // Tuesday, January 31, 2023 at 12:00:00 AM -> The last date of the range
	 *
	 * // Get month with specified refDate and offsets
	 * const month3 = new DateRange().getMonthExact({
	 * 	refDate: new Date("2023-01-10"),
	 * 	startOffset: 2,
	 * 	endOffset: 2,
	 * });
	 * // Friday, December 30, 2022 at 12:00:00 AM  -> The range starts 2 days before default first day
	 * // Saturday, December 31, 2022 at 12:00:00 AM
	 * // Sunday, January 1, 2023 at 12:00:00 AM
	 * // ...
	 * // Tuesday, January 31, 2023 at 12:00:00 AM
	 * // Wednesday, February 1, 2023 at 12:00:00 AM
	 * // Thursday, February 2, 2023 at 12:00:00 AM -> The range ends 2 days after default last day
	 * ```
	 */
	public getMonthExact(options?: OptionsMonthExact): DateRange {
		validateRangeOptionsMonthExact(options);

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

			this._setMembers({
				...dateRangeMembers,
				dates: [...extendedDateRange],
			});

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	/**
	 * Creates a range of custom number of days.
	 *
	 * @remarks
	 * - The reference date is a starting point of the range.
	 *
	 * - If not specified, the reference date is set to the current day.
	 *
	 * - The length of the range can be specified with the `daysCount` property in the `options` object.
	 * If not specified, the range will be created with a single date.
	 *
	 * - Each date is set to the start of the day (midnight).
	 *
	 * @param options - An optional object to customize the date range.
	 * @returns The DateRange with generated dates.
	 * @example
	 * ```
	 * // Get a current date
	 * const range1 = new DateRange().getDays();
	 *
	 * // Get a range of 10 days starting on 2023-01-10
	 * const range2 = new DateRange().getDays({
	 * 	daysCount: 10,
	 * 	refDate: new Date("2023-01-10"),
	 * });
	 * // Generated dates:
	 * // January 10, 2023 at 12:00:00 AM
	 * // January 11, 2023 at 12:00:00 AM
	 * // January 12, 2023 at 12:00:00 AM
	 * // January 13, 2023 at 12:00:00 AM
	 * // January 14, 2023 at 12:00:00 AM
	 * // January 15, 2023 at 12:00:00 AM
	 * // January 16, 2023 at 12:00:00 AM
	 * // January 17, 2023 at 12:00:00 AM
	 * // January 18, 2023 at 12:00:00 AM
	 * // January 19, 2023 at 12:00:00 AM
	 * ```
	 */
	public getDays(options?: OptionsDays): DateRange {
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

			this._setMembers({
				...dateRangeMembers,
				dates: [...extendedDateRange],
			});

			return this;
		} else {
			this._setMembers(dateRangeMembers);

			return this;
		}
	}

	/**
	 *
	 * Generates the next range based on given one.
	 *
	 * @remarks
	 * The method takes a DateRange object and based on its range type,
	 * sets the refDate to a date that can generate the new range.
	 *
	 * It copies the options used to adjust the given range and applies them to the new range.
	 *
	 * The method shifts the refDate to the next one as follows:
	 * - for a range generated with getDays, the refDate is incremented by the daysCount property.
	 * - for a range generated with getWeek, the refDate is incremented by 7 days.
	 * - for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the next month.
	 *
	 * In all cases, the refDate is set to the start of the day (midnight).
	 *
	 * To check whether the DaterRange is generated with a getNext method, access the `isNext` property of a DateRange instance.
	 *
	 * @param dateRange - A DateRange object with a generated range.
	 * @returns The DateRange with generated dates.
	 * @throws an error if DateRange is not provided or the range is not initialized.
	 *
	 * @example
	 * ```
	 * // example with a "WEEK" range
	 * const week = new DateRange().getWeek({ refDate: new Date("2023-01-10") });
	 * week.dates; // dates from Mon, 01/09/2023 to Sun, 01/15/2023
	 *
	 * const weekNext = new DateRange().getNext(week);
	 * weekNext.dates; // dates from Mon, 01/16/2023 to Sun, 01/22/2023
	 * ```
	 */
	public getNext(dateRange: DateRange): DateRange {
		if (dateRange === undefined) {
			throw new MissingArgumentError("dateRange", "DateRange.getNext()");
		}

		if (!(dateRange instanceof DateRange)) {
			throw new InvalidDateRangeError(dateRange);
		}

		// The rangeType property is only defined after the range is initialized,
		// so accessing it before that will throw an error.
		// We use try/catch to catch that error and throw a custom EmptyDateRangeError instead,
		// indicating that the getNext / getPrevious method cannot be used on an empty range.
		try {
			dateRange.rangeType;
		} catch (error) {
			throw new EmptyDateRangeError("getNext method");
		}

		const {
			refDate,
			startOffset,
			endOffset,
			refWeekday,
			rangeType,
			daysCount,
		} = dateRange;

		switch (rangeType) {
			case RANGE_TYPE.Week: {
				const nextRefDate = refDate.startOf("day").plus({ days: 7 });

				const options: Required<OptionsWeek> = {
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
				const nextRefDate = refDate.startOf("month").plus({ month: 1 });

				const options: Required<OptionsMonthExact> = {
					refDate: nextRefDate,
					startOffset,
					endOffset,
				};
				this.getMonthExact(options);
				this._isNext = true;

				return this;
			}
			case RANGE_TYPE.MonthExtended: {
				const nextRefDate = refDate.startOf("month").plus({ month: 1 });

				const options: Required<OptionsMonthExtended> = {
					refWeekday,
					refDate: nextRefDate,
					startOffset,
					endOffset,
				};

				this.getMonthExtended(options);
				this._isNext = true;

				return this;
			}
			case RANGE_TYPE.Days: {
				const nextRefDate = refDate.startOf("day").plus({ day: daysCount });

				const options: Required<OptionsDays> = {
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

	/**  Generates the previous range based on given one.
	 *
	 * @remarks
	 *
	 * The method takes a DateRange object and based on its range type,
	 * sets the refDate to a date that can generate the new range.
	 *
	 * It copies the options used to adjust the given range and applies them to the new range.
	 *
	 * The method shifts the refDate to the previous one as follows:
	 *   - for a range generated with getDays, the refDate is decremented by the daysCount property.
	 *   - for a range generated with getWeek, the refDate is decremented by 7 days.
	 *   - for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the previous month.
	 *
	 * In all cases, the refDate is set to the start of the day (midnight).
	 *
	 * To check whether the DaterRange is generated with a getPrevious method, access the `isPrevious` property of a DateRange instance.
	 *
	 * @param dateRange - A DateRange object with a generated range range.
	 * @returns The DateRange object with a generated range of the same type and options as the given one but with shifted dates.
	 * @throws an error if DateRange is not provided or the range is not initialized.
	 *
	 * @example
	 * ```
	 * // example with a "WEEK" range
	 * const week = new DateRange().getWeek({ refDate: new Date("2023-01-10") });
	 * week.dates; // dates from Mon, 01/09/2023, to Sun, 01/15/2023
	 *
	 * const weekPrevious = new DateRange().getPrevious(week);
	 * weekPrev.dates; // dates from Mon, 01/02/2023 to Sun, 01/08/2023
	 * ```
	 */
	public getPrevious(dateRange: DateRange) {
		if (dateRange === undefined) {
			throw new MissingArgumentError("dateRange", "DateRange.getPrevious");
		}

		if (!(dateRange instanceof DateRange)) {
			throw new InvalidDateRangeError(dateRange);
		}

		// The rangeType property is only defined after the range is initialized,
		// so accessing it before that will throw an error.
		// We use try/catch to catch that error and throw a custom EmptyDateRangeError instead,
		// indicating that the getNext / getPrevious method cannot be used on an empty range.
		try {
			dateRange.rangeType;
		} catch (error) {
			throw new EmptyDateRangeError("getPrevious method");
		}

		const {
			refDate,
			startOffset,
			endOffset,
			refWeekday,
			rangeType,
			daysCount,
		} = dateRange;

		switch (rangeType) {
			case RANGE_TYPE.Week: {
				const nextRefDate = refDate.startOf("day").minus({ days: 7 });

				const options: Required<OptionsWeek> = {
					refDate: nextRefDate,
					refWeekday: refWeekday,
					startOffset: startOffset,
					endOffset: endOffset,
				};

				this.getWeek(options);
				this._isPrevious = true;

				return this;
			}
			case RANGE_TYPE.MonthExact: {
				const nextRefDate = refDate.startOf("month").minus({ month: 1 });

				const options: Required<OptionsMonthExact> = {
					refDate: nextRefDate,
					startOffset,
					endOffset,
				};
				this.getMonthExact(options);
				this._isPrevious = true;

				return this;
			}
			case RANGE_TYPE.MonthExtended: {
				const nextRefDate = refDate.startOf("month").minus({ month: 1 });

				const options: Required<OptionsMonthExtended> = {
					refWeekday,
					refDate: nextRefDate,
					startOffset,
					endOffset,
				};

				this.getMonthExtended(options);
				this._isPrevious = true;

				return this;
			}
			case RANGE_TYPE.Days: {
				const nextRefDate = refDate.startOf("day").minus({ day: daysCount });

				const options: Required<OptionsDays> = {
					daysCount,
					endOffset,
					startOffset,
					refDate: nextRefDate,
				};

				this.getDays(options);
				this._isPrevious = true;

				return this;
			}
			default:
				throw new Error("not implemented");
		}
	}
}

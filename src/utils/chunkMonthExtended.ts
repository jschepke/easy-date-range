import { RANGE_TYPE } from "../constants";
import { DateRange } from "../dateRange";
import { InvalidParameterError, MissingArgumentError } from "../errors";
import { DateTime } from "luxon";

/**
 * Options for the `chunkMonthExtended` function.
 */
interface ChunkMonthExtendedOptions {
	/**
	 * If set to `true`, the resulting chunks will have `null` values for dates
	 * that do not belong to the same month as the reference date.
	 * If set to `false` or not provided, the resulting chunks will only contain
	 * valid `DateTime` objects and no `null` values.
	 */
	nullNextPrevDates?: boolean;
}

/**
 * Splits the given `DateRange` into chunks of `DateTime` arrays, each containing
 * a week's worth of dates. Optionally, the chunks can be extended with `null`
 * values for dates that do not belong to the same month as the reference date.
 *
 * @param dateRange - The `DateRange` to be split into chunks.
 * @param options - (Optional) The {@link ChunkMonthExtendedOptions} to customize the chunking behavior.
 * @returns An array of arrays containing the chunks of `DateTime` objects.
 * If `options.nullNextPrevDates` is `true`, the chunks may contain `null` values for dates
 * that do not belong to the same month as the reference date.
 * If `options.nullNextPrevDates` is `false` or not provided, the chunks will only contain
 * valid `DateTime` objects and no `null` values.
 *
 * @throws {MissingArgumentError}
 * When `dateRange` is not provided.
 * @throws {Error}
 * When `dateRange` is not an instance of `DateRange` or has an invalid range type.
 * @throws {InvalidParameterError}
 * When `options.nullNextPrevDates` is provided but not a boolean value.
 *
 * @example
 * // Example: Splitting the current month into chunks with `null` values for dates outside the month.
 * const dateRange = new DateRange().getMonthExtended();
 * // dateRange is a `DateRange` for the current month, extended to full weeks.
 *
 * const result = chunkMonthExtended(dateRange, { nullNextPrevDates: true });
 * // result will be an array of arrays, each containing a week's worth of dates,
 * // with `null` values for dates that do not belong to the same month as the reference date.
 */
export function chunkMonthExtended(
	dateRange: DateRange,
	options?: ChunkMonthExtendedOptions & { nullNextPrevDates: false },
): DateTime[][];

// Function overload for the main function signature
export function chunkMonthExtended(
	dateRange: DateRange,
	options: ChunkMonthExtendedOptions & { nullNextPrevDates: true },
): (DateTime | null)[][];

// Function overload for the main function signature
export function chunkMonthExtended(
	dateRange: DateRange,
	options?: ChunkMonthExtendedOptions,
): (DateTime | null)[][] | DateTime[][];

// Function implementation
export function chunkMonthExtended(
	dateRange: DateRange,
	options?: ChunkMonthExtendedOptions,
): (DateTime | null)[][] | DateTime[][] {
	if (dateRange === undefined) {
		throw new MissingArgumentError("dateRange", "chunkMonthExtended");
	}
	if (
		!(dateRange instanceof DateRange) ||
		dateRange.rangeType !== RANGE_TYPE.MonthExtended
	) {
		throw new Error(
			'The dateRange argument must be an instance of the DateRange class, with a generated range of type: "MONTH-EXTENDED"',
		);
	}

	const nullNextPrevDates = options?.nullNextPrevDates ?? false;

	if (typeof nullNextPrevDates !== "boolean") {
		throw new InvalidParameterError(
			"nullNextPrevDates",
			nullNextPrevDates,
			"boolean",
		);
	}

	const dateTimes = [...dateRange.toDateTimes()];

	const result: DateTime[][] = [];

	for (let i = 0; i < dateTimes.length; i += 7) {
		const chunk = dateTimes.slice(i, i + 7);
		result.push(chunk);
	}

	if (nullNextPrevDates) {
		const resultWithNulls: (DateTime | null)[][] = [...result];

		const { month } = dateRange.refDate;
		// handle first chunk
		result[0].forEach((dateTime, index) => {
			if (dateTime.month !== month) {
				resultWithNulls[0][index] = null;
			}
		});

		// handle last chunk
		result[result.length - 1].forEach((dateTime, index) => {
			if (dateTime.month !== month) {
				resultWithNulls[resultWithNulls.length - 1][index] = null;
			}
		});

		return resultWithNulls;
	}
	return result;
}

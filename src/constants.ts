import { DurationUnit } from "luxon";

export enum WEEKDAY {
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
	Sunday = 7,
}

/**
 * An enum that represents the type of range for a DateRange object.
 *
 * It can be one of the following values:
 * - `Week`: The range is a single week.
 * - `MonthExact`: The range is a single month, starting from the first day to the last day of the month.
 * - `MonthExtended`: The range is a single month,
 * but extended to include the full weeks that contain the first and last days of the month.
 * - `Days`: The range is a custom number of days.
 */
export enum RANGE_TYPE {
	Week = "WEEK",
	MonthExact = "MONTH-EXACT",
	MonthExtended = "MONTH-EXTENDED",
	Days = "DAYS",
}

export const DURATION_UNITS: DurationUnit[] = [
	"day",
	"days",
	"hour",
	"hours",
	"millisecond",
	"milliseconds",
	"minute",
	"minutes",
	"month",
	"months",
	"quarter",
	"quarters",
	"second",
	"seconds",
	"week",
	"weeks",
	"year",
	"years",
];

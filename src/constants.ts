import { DurationUnit } from "luxon";

/**
 * An enum that represents the weekdays as numbers from 1 to 7.
 */
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
 * An enum that represents the type of date range that is generated and stored by DateRange instance.
 *
 * It corresponds to the range generator method used to create the range:
 * - `WEEK` for `getWeek`
 * - `MONTH-EXACT` for `getMonthExact`
 * - `MONTH-EXTENDED` for `getMonthExtended`
 * - `DAYS` for `getDays`
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

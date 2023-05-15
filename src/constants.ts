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

export enum RANGE_TYPE {
	Week = "week",
	MonthExact = "month-exact",
	MonthWeekExtended = "month-week-extended",
	Days = "days",
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

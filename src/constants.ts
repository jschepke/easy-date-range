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

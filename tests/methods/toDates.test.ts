import { DateRange } from "../../src/dateRange";
import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";

describe("toDateTimes", () => {
	const data: { range: DateRange; expectedLength: number }[] = [
		{ expectedLength: 1, range: new DateRange().getDays() },
		{ expectedLength: 7, range: new DateRange().getWeek() },
		{
			expectedLength: 31,
			range: new DateRange().getMonthExact({ refDate: new Date("2023-01-01") }),
		},
		{
			expectedLength: 42,
			range: new DateRange().getMonthExtended({
				refDate: new Date("2023-01-01"),
			}),
		},
	];
	test("throws an error if the DateRange instance is empty", () => {
		expect(() => new DateRange().toDates()).toThrowError();
	});
	test.each(data)(
		"returns an array with $expectedLength JS Dates",

		({ expectedLength, range }) => {
			const dateTimes = range.toDates();
			expect(dateTimes.length).toBe(expectedLength);
			dateTimes.forEach((elem) => expect(elem).toBeInstanceOf(Date));
		},
	);
});

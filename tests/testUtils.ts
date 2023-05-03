import { DateTime } from "luxon";

// some JS Date objects
const date1 = new Date(); // current date and time
const date2 = new Date(2022, 0, 1); // January 1st, 2022
const date3 = new Date("2021-12-25T12:00:00Z"); // December 25th, 2021 at noon UTC
// invalid JS Date objects
const invalidDate1 = new Date("2023-13-01");
const invalidDate2 = new Date("foo");
const invalidDate3 = new Date(NaN);

// some DateTime objects
const dt1 = DateTime.now(); // current date and time
const dt2 = DateTime.local(2022, 1, 1); // January 1st, 2022 in local time zone
const dt3 = DateTime.fromISO("2021-12-25T12:00:00Z"); // December 25th, 2021 at noon UTC
// invalid DateTime objects
const invalidDt1 = DateTime.invalid("wrong format");
const invalidDt2 = DateTime.fromISO("2021-13-01");

export const invalidInputValues = [
	{ invalidInput: null },
	{ invalidInput: undefined },
	{ invalidInput: NaN },
	{ invalidInput: Infinity },
	{ invalidInput: [] },
	{ invalidInput: {} },
	{ invalidInput: { a: 1, b: "" } },
	{ invalidInput: 1 },
	{ invalidInput: 2.5 },
	{ invalidInput: -1 },
	{ invalidInput: [1] },
	{ invalidInput: "test" },
	{ invalidInput: "2021-12-25" },
	{ invalidInput: ["test"] },
	{ invalidInput: true },
	{ invalidInput: false },
	{ invalidInput: date1 },
	{ invalidInput: dt1 },
];

export const weekdayTestValues = {
	valid: [1, 2, 3, 4, 5, 6, 7],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		// { invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
	],
};

export const isNumberTestValues = {
	valid: [0, 1, -1, 0.5, -0.5],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		// { invalidInput: 1 },
		// { invalidInput: 2.5 },
		// { invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
	],
};

export const isEmptyObjectTestValues = {
	valid: [],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		// { invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
	],
};

export const isValidRefDateTestValues = {
	valid: [date1, date2, date3, dt1, dt2, dt3],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
		// { invalidInput: date1 },
		// { invalidInput: dt1 },
		// additional invalid inputs
		{ invalidInput: invalidDate1 },
		{ invalidInput: invalidDate2 },
		{ invalidInput: invalidDate3 },
	],
};

export const isObjectTestValues = {
	valid: [{}, { a: 1, b: "" }],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		// { invalidInput: {} },
		// { invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
		{ invalidInput: date1 },
		{ invalidInput: dt1 },
	],
};

export const isValidDateTestValues = {
	valid: [date1, date2, date3],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
		// { invalidInput: date1 },
		// { invalidInput: dt1 },
	],
};
export const isValidDateTimeTestValues = {
	valid: [dt1, dt2, dt3],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
		{ invalidInput: date1 },
		// { invalidInput: dt1 },
	],
};

export const isValidDateTimeArrayTestValues = {
	valid: [[dt1, dt2, dt3], [dt1, dt2], [dt1]],
	invalid: [
		{ invalidInput: null },
		{ invalidInput: undefined },
		{ invalidInput: NaN },
		{ invalidInput: Infinity },
		{ invalidInput: [] },
		{ invalidInput: {} },
		{ invalidInput: { a: 1, b: "" } },
		{ invalidInput: 1 },
		{ invalidInput: 2.5 },
		{ invalidInput: -1 },
		{ invalidInput: [1] },
		{ invalidInput: "test" },
		{ invalidInput: "2021-12-25" },
		{ invalidInput: ["test"] },
		{ invalidInput: true },
		{ invalidInput: false },
		{ invalidInput: date1 },
		// { invalidInput: dt1 },
		// additional invalid inputs
		{ invalidInput: date2 },
		{ invalidInput: invalidDt1 },
		{ invalidInput: invalidDt2 },
	],
};

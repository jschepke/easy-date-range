
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

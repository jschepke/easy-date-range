enum ErrorCode {
	INVALID_PARAMS = "INVALID_PARAMS",
	// Add more codes as needed
}

class CalendarGridError extends Error {
	code: string;

	/**
	 * Creates a new instance of CalendarRangeError.
	 *
	 * @param code - The {@link ErrorCode} of the error.
	 * @param message - The message of the error.
	 */
	constructor(code: string, message: string) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidParameterError extends CalendarGridError {
	paramName: string;
	paramValue: unknown;
	expected: string;
	description?: string;

	/**
	 * Creates a new instance of InvalidParameterError.
	 *
	 * @param paramName - The name of the invalid parameter.
	 * @param paramValue - The value of the invalid parameter.
	 * @param expected - The expected type or format of the parameter value.
	 * @param description - An optional description of the validation error.
	 *
	 * @example
	 * ```
	 * // create an instance of InvalidParameterError with some sample parameters
	 *  const error = new InvalidParameterError(
	 * 	"foo",
	 * 	42,
	 * 	"string",
	 * 	"This option is required for the operation.",
	 * );
	 * // log the error to the console
	 * console.log(error)
	 * //-> Error: The value of the foo is invalid. You passed 42, but string is expected. This option is required for the operation.
	 * ```
	 */
	constructor(
		paramName: string,
		paramValue: unknown,
		expected: string,
		description?: string,
	) {
		const message = `The value of the ${paramName} is invalid. \nYou passed ${JSON.stringify(
			paramValue,
		)}, but ${expected} is expected.${description ? ` \n${description}` : ""}`;

		super(ErrorCode.INVALID_PARAMS, message);
		this.paramName = paramName;
		this.paramValue = paramValue;
		this.expected = expected;
		this.description = description;
	}
}

export class InvalidStartOffsetError extends InvalidParameterError {
	/**
	 * Represents an error that occurs when the startOffset parameter is invalid.
	 * @param paramValue - The value of the startOffset parameter that caused the error.
	 */
	constructor(paramValue: unknown) {
		const paramName = "startOffset";
		const expected = "a number >= 0";
		super(paramName, paramValue, expected);
	}
}

export class InvalidEndOffsetError extends InvalidParameterError {
	/**
	 * Represents an error that occurs when the endOffset parameter is invalid.
	 * @param paramValue - The value of the endOffset parameter that caused the error.
	 */
	constructor(paramValue: unknown) {
		const paramName = "endOffset";
		const expected = "a number >= 0";
		super(paramName, paramValue, expected);
	}
}

export class InvalidRefWeekdayError extends InvalidParameterError {
	/**
	 * Represents an error that occurs when the refWeekday parameter is invalid.
	 * @param paramValue - The value of the refWeekday parameter that caused the error.
	 */
	constructor(paramValue: unknown) {
		const paramName = "refWeekday";
		const expected = "a number between 1 and 7.";
		super(paramName, paramValue, expected);
	}
}

export class InvalidRefDateError extends InvalidParameterError {
	/**
	 * Represents an error that occurs when the refDate parameter is invalid.
	 * @param paramValue - The value of the refDate parameter that caused the error.
	 */
	constructor(paramValue: unknown) {
		const paramName = "refDate";
		const expected = "Date object or luxon DateTime object.";
		super(paramName, paramValue, expected);
	}
}

// console.log(new InvalidRefDateError("test"))

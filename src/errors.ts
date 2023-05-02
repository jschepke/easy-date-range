class CalendarRangeError extends Error {
	code: string;

	/**
	 * Creates a new instance of CalendarRangeError.
	 *
	 * @param code - The code of the error. //TODO implement code enum for other scenarios
	 * @param message - The message of the error.
	 */
	constructor(code: string, message: string) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidParameterError extends CalendarRangeError {
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

		super("validation", message);
		this.paramName = paramName;
		this.paramValue = paramValue;
		this.expected = expected;
		this.description = description;
	}
}

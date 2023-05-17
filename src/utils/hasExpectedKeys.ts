import { isObject } from ".";
import { InvalidParameterError } from "../errors";
import { z } from "zod";

/**
 * Checks if an object has all the expected keys and optionally no extra keys.
 *
 * @param object - The object to check.
 * @param keys - The array of expected keys.
 * @param mode - The mode of checking. If "default", only checks for the presence of expected keys. If “strict”, also checks that the object does not have any extra keys.
 * @returns True if the object has all the expected keys and optionally no extra keys, false otherwise.
 * @throws InvalidParameterError if any of the parameters are invalid.
 */
export function hasExpectedKeys(
	object: unknown,
	keys: string[],
	mode: "default" | "strict" = "default",
): boolean {
	// validate object param
	if (!isObject(object)) {
		throw new InvalidParameterError("object param", object, "valid object");
	}

	// validate keys param
	try {
		z.string().array().parse(keys);
	} catch (error) {
		throw new InvalidParameterError(
			"keys parameter",
			keys,
			"an array of strings",
		);
	}

	// validate mode param
	try {
		z.enum(["default", "strict"]).parse(mode);
	} catch (error) {
		throw new InvalidParameterError(
			"mode parameter",
			mode,
			'"default" or "strict"',
		);
	}

	if (mode === "strict") {
		if (keys.length !== Object.keys(object).length) {
			// Return false if there are missing or extra keys
			return false;
		}
	}

	for (const key of keys) {
		if (!Object.keys(object).includes(key)) {
			// Return false if any property is missing
			return false;
		}
	}
	// This will only be reached if all properties are present and expected
	return true;
}

import { describe, expect, test } from "vitest";

import { getRandomWeekday } from "../../src/utils";

describe("getRandomWeekday", () => {
	test("returns a number between 1 and 7, inclusive", () => {
		const result = getRandomWeekday();
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(7);
	});

	test("returns each number between 1 and 7 over multiple calls", () => {
		const weekdays = new Set<number>();
		// let iterations = 0;
		while (weekdays.size < 7) {
			weekdays.add(getRandomWeekday());
			//   iterations++;
		}
		// console.log(`Test completed in ${iterations} iterations`);
		expect(weekdays.size).toBe(7);
		expect(weekdays).toContain(1);
		expect(weekdays).toContain(2);
		expect(weekdays).toContain(3);
		expect(weekdays).toContain(4);
		expect(weekdays).toContain(5);
		expect(weekdays).toContain(6);
		expect(weekdays).toContain(7);
	});
});

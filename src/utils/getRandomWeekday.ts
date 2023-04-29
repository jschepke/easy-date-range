/**
 * Returns a random integer between 1 and 7, inclusive, representing a weekday.
 *
 * 1 represents Monday, 2 represents Tuesday, and so on, up to 7 which represents Sunday.
 */
export function getRandomWeekday(): number {
  return Math.floor(Math.random() * 7) + 1;
}

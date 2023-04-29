/**
 * A type that maps each property name of a given type T to itself.
 *
 * @remarks
 * This can be useful for creating lookup tables or enums from existing types.
 *
 * @example
 * ```
 * // with a tuple
 * type Color = 'red' | 'green' | 'blue';
 *
 * const colorMap: PropertiesMap<Color> = {
 *   red: 'red',
 *   green: 'green',
 *   blue: 'blue'
 * };
 *
 * // or with an interface
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 * const personMap: PropertiesMap<Person> = {
 *   name: 'name',
 *   age: 'age',
 * };
 *
 * // then we can reuse the map values, for example
 * Object.values(personMap).map(//...)
 * ```
 */
export type PropertiesMap<T> = {
  [Key in keyof Required<T>]: Key;
};

# easy-date-range

easy-date-range is a simple, easy to use library for creating date ranges which can be used as a foundation for building all sorts of calendars, schedulers, date lists and more.

## Features

### Single reference date

easy-date-range simplifies the creation of date ranges by using methods that only need **one reference date**. The range you get is determined by the method you choose, and the reference date that belongs to it.

### Descriptive API

Here is a brief summary of core functionalities: the range generators:

- [`getDays`](#getdays) creates a range of custom number of days.
- [`getMonthExact`](#getmonthexact) creates a month range, from the first to the last day of the month.
- [`getMonthExtended`](#getmonthextended) creates a month range extended to include the full weeks.
- [`getWeek`](#getweek) creates a week range that starts on Monday.
- [`getNext`](#getnext) and [`getPrevious`](#getprevious) enable easy shifting of any range passed into them.

### Easy to customize

All range generators use the current day as a reference date unless specified otherwise. It can be easily customized by passing an `options` object where you can also set other settings such as offsets, start of the week or days count.

### Type-Safe

easy-date-range is written entirely in [TypeScript] for type safety and other benefits such as autocomplete features in your code editor. Works with no issues in plain JavaScript environment, too.

### Date and time made easy with Luxon

easy-date-range uses [Luxon] as a peer dependency for date handling. Luxon is a powerful and modern library for working with dates and times in JavaScript. It offers a consistent and fluent API, as well as support for various formats and locales.

easy-date-range supports both Luxon and native JavaScript dates as inputs and outputs.

### More features to come

At the moment, easy-date-range provides basic functionality for creating date ranges that cover full days. In the future, I plan to add more functions for creating ranges that span other intervals such as hours and minutes, or months and years.

## Installation

To install easy-date-range, run:

```bash
npm install easy-date-range luxon
```

## Usage

### Basic usage

```ts
import { DateRange } from 'easy-date-range';

// create a range of current week starting on Monday
const currentWeek = new DateRange().getWeek();

// create a range of a week with specifying reference date
const week = new DateRange().getWeek({ refDate: new Date('2023-01-01') });
```

Then to access dates array use:

```ts
// 'toDateTimes' method for an array of Luxon DateTimes
currentWeek.toDateTimes().forEach((date) => console.log(date.toString()));

// 'toDates' method for an array of JS Dates
currentWeek.toDates().forEach((date) => console.log(date.toString()));

// you can also use a getter property 'dates' for Luxon DateTimes
currentWeek.dates.forEach((date) => console.log(date.toString()));
```

### Customize the range

You can customize the range with an `options` object passed to a range generator.

Common options available for all methods:

- `refDate` for setting the reference date,
- `startOffset` for setting the number of days to add before the first date of the range
- `endOffset` for setting the number of days to add after the last date of the range.

Specific options depending on the method and type of range it generates:

- `refWeekday` for setting the weekday to start the range from. Available with `getWeek` and `getMonthExtended` methods
- `daysCount` for setting the number of days with `getDays` method

**_Note:_** The offset is applied after the range is created; or in other words, it comes after all other options. Think of it as a way to add or subtract days from your range as a final touch.

Here is a brief example showing how you can customize the range.

```ts
// set a month range of January 2023 extended to full weeks with customized refWeekday and offsets
const monthExtended = new DateRange().getMonthExtended({
  refDate: new Date('2023-01-01'),
  refWeekday: WEEKDAY.Sunday,
  startOffset: 2,
  endOffset: 2,
});
```

The range from the above example will include dates that span across all the days of January 2023 extended to start from Friday, Dec 30, 2022 and end on Monday, Feb 6, 2023.

The first and the last two days in the range come from offset settings. Without the offset, the first day of the range would be Jan 1, 2023 (Sunday - as specified with `refWeekday`) and the last day would be Feb 4, 2023 (Saturday).

## API

### **DateRange class**

DateRange is the core component of easy-date-range. It provides various methods and properties for generating and handling date ranges.

To use the class, **an instance must be created and initialized with one of the [range generator methods](#range-generators).**

#### Properties

| Property    | Type                           | Default value  | Description                                                                        |
| ----------- | ------------------------------ | -------------- | ---------------------------------------------------------------------------------- |
| daysCount   | number                         | 0              | The days count value for the range generated by [getDays](#getdays).               |
| endOffset   | number                         | 0              | The end offset value for current generated range.                                  |
| rangeType   | [RANGE_TYPE](#range_type-enum) | not applicable | The type of current generated range.                                               |
| refDate     | [DateTime]                     | current day    | The reference date for current generated range.                                    |
| refWeekday  | [WEEKDAY](#weekday-enum)       | 1              | The reference weekday value for current generated range.                           |
| startOffset | number                         | 0              | The start offset value for current generated range.                                |
| isNext      | boolean                        | false          | A boolean that indicates whether DateRange is created with a `getNext` method.     |
| isPrevious  | boolean                        | false          | A boolean that indicates whether DateRange is created with a `getPrevious` method. |

> **Note:** All the properties are defined once the date range is initialized, regardless of whether they are relevant for the current range or not.

#### Methods

##### Range generators

| Method                                | Description                                                                |
| ------------------------------------- | -------------------------------------------------------------------------- |
| [getDays](#getdays)                   | Creates a range of custom number of days.                                  |
| [getMonthExact](#getmonthexact)       | Creates a single month range, from the first to the last day of the month. |
| [getMonthExtended](#getmonthextended) | Creates a single month range extended to include the full weeks.           |
| [getWeek](#getweek)                   | Creates a single week range.                                               |
| [getNext](#getnext)                   | Creates the next range based on given one.                                 |
| [getPrevious](#getprevious)           | Creates the previous range based on given one.                             |

##### Utilities

| Method                                  | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| [isValidOffset](#isvalidoffset)         | Checks if the value is a valid offset.             |
| [isValidRefDate](#isvalidrefdate)       | Checks if a given value is a valid reference date. |
| [isValidRefWeekday](#isvalidrefweekday) | Checks if a given value is a valid weekday         |

##### Date array getters

| Method                      | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| [toDates](#todates)         | Returns an array of dates generated for the instance as JS Date objects.        |
| [toDateTimes](#todatetimes) | Returns an array of dates generated for the instance as Luxon DateTime objects. |

### **getDays**

Creates a range of custom number of days.

The reference date is a starting point of the range.

The reference date is set to the current day if not specified otherwise.

The length of the range can be specified with the `daysCount` property in the `options` object. If not specified, the range will be created with a single date.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getDays(options?: OptionsDays): DateRange
```

#### **Parameters**

| Parameter | Type                                  | Description                       |
| --------- | ------------------------------------- | --------------------------------- |
| options   | [OptionsDays](#optionsdays-interface) | An object to configure the range. |

Options properties

| Property                          | Type                 | Description                                                       |
| --------------------------------- | -------------------- | ----------------------------------------------------------------- |
| [refDate](#refdate-interface)     | [DateTime] \| [Date] | The reference date to calculate the range.                        |
| [daysCount](#dayscount-interface) | number               | The number of days to include in the range.                       |
| [startOffset](#offset-interface)  | number               | The number of days to add before the the first date of the range. |
| [endOffset](#offset-interface)    | number               | The number of days to add after the the last date of the range.   |

#### **Returns:**

[`DateRange`](#daterange-class)

#### **Examples**

```ts
// Get a current date
const range1 = new DateRange().getDays();

// Get a range of 10 days starting on 2023-01-10
const range2 = new DateRange().getDays({
  daysCount: 10,
  refDate: new Date('2023-01-10'),
});
// Generated dates:
// January 10, 2023 at 12:00:00 AM
// January 11, 2023 at 12:00:00 AM
// January 12, 2023 at 12:00:00 AM
// January 13, 2023 at 12:00:00 AM
// January 14, 2023 at 12:00:00 AM
// January 15, 2023 at 12:00:00 AM
// January 16, 2023 at 12:00:00 AM
// January 17, 2023 at 12:00:00 AM
// January 18, 2023 at 12:00:00 AM
// January 19, 2023 at 12:00:00 AM
```

### **getMonthExact**

Creates a single month range, from the first to the last day of the month.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getMonthExact(options?: OptionsMonthExact): DateRange
```

#### **Parameters**

| Parameter | Type                                              | Description                       |
| --------- | ------------------------------------------------- | --------------------------------- |
| options   | [OptionsMonthExact](#optionsmonthexact-interface) | An object to configure the range. |

Options properties

| Property                         | Type                 | Description                                                       |
| -------------------------------- | -------------------- | ----------------------------------------------------------------- |
| [refDate](#refdate-interface)    | [DateTime] \| [Date] | The reference date to calculate the range.                        |
| [startOffset](#offset-interface) | number               | The number of days to add before the the first date of the range. |
| [endOffset](#offset-interface)   | number               | The number of days to add after the the last date of the range.   |

#### **Returns:**

[`DateRange`](#daterange-class)

#### **Examples**

```ts
// Get current month
const currentMonthExact = new DateRange().getMonthExact();
```

```ts
// Get month with specified refDate
const monthExact = new DateRange().getMonthExact({
  refDate: new Date('2023-01-10'),
});
// Generated dates:
// Sun, January 1, 2023 at 12:00:00 AM -> The first date of the range
// Mon, January 2, 2023 at 12:00:00 AM
// Tue, January 3, 2023 at 12:00:00 AM
// ...
// Tue, January 31, 2023 at 12:00:00 AM -> The last date of the range
```

```ts
// Get month with specified refDate and offsets
const month3 = new DateRange().getMonthExact({
  refDate: new Date('2023-01-10'),
  startOffset: 2,
  endOffset: 2,
});
// Fri, December 30, 2022 at 12:00:00 AM  -> The range starts 2 days before default first day
// Sat, December 31, 2022 at 12:00:00 AM
// Sun, January 1, 2023 at 12:00:00 AM
// ...
// Tue, January 31, 2023 at 12:00:00 AM
// Wed, February 1, 2023 at 12:00:00 AM
// Thu, February 2, 2023 at 12:00:00 AM -> The range ends 2 days after default last day
```

### **getMonthExtended**

Creates a single month range extended to include the full weeks.

By default, the method starts the range on Monday before or on the first day of the month and ends it on Sunday after or on the last day of the month.

The end of the week will also be shifted accordingly if the start of the week is changed to a different day than Monday.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getMonthExtended(options?: OptionsMonthExtended): DateRange
```

#### **Parameters**

| Parameter | Type                                                    | Description                       |
| --------- | ------------------------------------------------------- | --------------------------------- |
| options   | [OptionsMonthExtended](#optionsmonthextended-interface) | An object to configure the range. |

Options properties

| Property                            | Type                     | Description                                                       |
| ----------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| [refDate](#refdate-interface)       | [DateTime] \| [Date]     | The reference date to calculate the range.                        |
| [refWeekday](#refweekday-interface) | [WEEKDAY](#weekday-enum) | The reference weekday to start the range from.                    |
| [startOffset](#offset-interface)    | number                   | The number of days to add before the the first date of the range. |
| [endOffset](#offset-interface)      | number                   | The number of days to add after the the last date of the range.   |

#### **Returns:**

[`DateRange`](#daterange-class)

#### **Examples**

```ts
// Get current month extended to full weeks
const currentMonthExtended = new DateRange().getMonthExtended();

// Get month extended to full weeks based on a refDate and starting on Wednesday
const monthExtended = new DateRange().getMonthExtended({
  refDate: new Date('2023-01-10'),
  refWeekday: WEEKDAY.Wednesday,
});

// Generated dates:
// Wed, December 28, 2022 at 12:00:00 AM -> The first date of the range
// Thu, December 29, 2022 at 12:00:00 AM
// Fri, December 30, 2022 at 12:00:00 AM
// ...
// Tue, January 31, 2023 at 12:00:00 AM -> The last date of the range
```

### **getWeek**

Creates a single week range.

By default, the method starts the range on Monday before or on the reference date and ends it on Sunday after or on the reference date.

The end of the week will also be shifted accordingly if the start of the week is changed to a different day than Monday.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getWeek(options?: RangeOptions): DateRange
```

#### **Parameters**

| Parameter | Type                                    | Description                       |
| --------- | --------------------------------------- | --------------------------------- |
| options   | [RangeOptions](#rangeoptions-interface) | An object to configure the range. |

Options properties

| Property                            | Type                     | Description                                                       |
| ----------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| [refDate](#refdate-interface)       | [DateTime] \| [Date]     | The reference date to calculate the range.                        |
| [refWeekday](#refweekday-interface) | [WEEKDAY](#weekday-enum) | The reference weekday to start the range from.                    |
| [startOffset](#offset-interface)    | number                   | The number of days to add before the the first date of the range. |
| [endOffset](#offset-interface)      | number                   | The number of days to add after the the last date of the range.   |

#### **Returns:**

[`DateRange`](#daterange-class)

#### **Examples**

```ts
// get current week starting on Monday
const currentWeek = new DateRange().getWeek();

// get week based on a refDate and starting on Sunday
const week2 = new DateRange().getWeek({
  refDate: new Date('2023-01-10'),
  refWeekday: WEEKDAY.Sunday,
});
// Generated dates:👇
// Sun, January 8, 2023 at 12:00:00 AM
// Mon, January 9, 2023 at 12:00:00 AM
// Tue, January 10, 2023 at 12:00:00 AM
// Wed, January 11, 2023 at 12:00:00 AM
// Thu, January 12, 2023 at 12:00:00 AM
// Fri, January 13, 2023 at 12:00:00 AM
// Sat, January 14, 2023 at 12:00:00 AM
```

### **getNext**

Generates the next range based on given one.

The method takes the `refDate` and [`rangeType`](#range_type-enum) from the `DateRange` argument and assigns a new `refDate` which can produce a new range that is one interval after the current one.

The method shifts the refDate to the next one as follows:

- for a range generated with getDays, the refDate is incremented by the daysCount property.
- for a range generated with getWeek, the refDate is incremented by 7 days.
- for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the next month.

The options used to adjust the given range are copied and applied to the new range.

In all cases, the refDate is set to the start of the day (midnight).

To check whether the DaterRange is generated with a `getNext` method, access the `isNext` property of a DateRange instance.

#### **Signature**

```ts
public getNext(dateRange: DateRange): DateRange
```

#### **Parameters**

| Parameter | Type                          | Description                                |
| --------- | ----------------------------- | ------------------------------------------ |
| dateRange | [DateRange](#daterange-class) | A DateRange object with initialized range. |

#### **Returns:**

[`DateRange`](#daterange-class)

### **getPrevious**

Generates the previous range based on given one.

The method takes the `refDate` and [`rangeType`](#range_type-enum) from the `DateRange` argument and assigns a new `refDate` which can produce a new range that is one interval after the current one.

The method shifts the refDate to the previous one as follows:

- for a range generated with getDays, the refDate is decremented by the daysCount property.
- for a range generated with getWeek, the refDate is decremented by 7 days.
- for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the previous month.

The options used to adjust the given range are copied and applied to the new range.

In all cases, the refDate is set to the start of the day (midnight).

To check whether the DaterRange is generated with a `getPrevious` method, access the `isPrevious` property of a DateRange instance.

#### **Signature**

```ts
public getPrevious(dateRange: DateRange): DateRange
```

#### **Parameters**

| Parameter | Type                          | Description                                |
| --------- | ----------------------------- | ------------------------------------------ |
| dateRange | [DateRange](#daterange-class) | A DateRange object with initialized range. |

#### **Returns:**

[`DateRange`](#daterange-class)

### **isValidOffset**

Checks if a given value is a valid offset (non-negative integer).

#### **Signature**

```ts
public isValidOffset(offset: unknown): boolean
```

#### **Parameters**

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| offset    | unknown | The value to check. |

#### **Returns:**

`boolean` - True if the value is a non-negative integer, false otherwise.

### **isValidRefDate**

Checks if a given value is a valid reference date.

#### **Signature**

```ts
public isValidRefDate(refDate: unknown): boolean
```

#### **Parameters**

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| refDate   | unknown | The value to check. |

#### **Returns:**

`boolean` - True if the value is a valid reference date, false otherwise.

### **isValidRefWeekday**

Checks if a given value is a valid weekday (integer from 1 to 7).

#### **Signature**

```ts
public isValidRefWeekday(weekday: unknown): boolean
```

#### **Parameters**

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| weekday   | unknown | The value to check. |

#### **Returns:**

`boolean` - True if the value is a valid weekday, false otherwise.

### **toDates**

Returns an array of dates generated for the instance as JS Date objects.

#### **Signature**

```ts
public toDates(): Date[]
```

#### **Parameters**

The methods doesn't accept parameters.

#### **Returns:**

`Date[]` - An array of JavaScript Dates.

### **toDateTimes**

Returns an array of dates generated for the instance as Luxon DateTime objects.

#### **Signature**

```ts
public toDateTimes(): DateTime[]
```

#### **Parameters**

The methods doesn't accept parameters.

#### **Returns:**

`DateTime[]` - An array of Luxon DateTimes.

## Interfaces

### RangeOptions interface

```ts
interface RangeOptions {
  /**
   * The reference date to calculate the range.
   *
   * @remarks
   * Must be a Date object or luxon DateTime object.
   *
   * Defaults to current time.
   */
  refDate?: DateTime | Date;

  /**
   * The reference weekday to start the range from.
   *
   *@remarks
   * Must be an integer from 1 (Monday) to 7 (Sunday).
   *
   * Defaults to Monday.
   */
  refWeekday?: WEEKDAY;

  /**
   * The number of days to add before the the first date of the range.
   *
   * @remarks
   * Must be a non-negative integer.
   *
   * This will be change to accept also negative values.
   *
   * @defaultValue `0`
   *
   */
  startOffset?: number;

  /**
   * The number of days to add after the the last date of the range.
   *
   * @remarks
   * Must be a non-negative integer.
   *
   * This will be change to accept also negative values.
   *
   * @defaultValue `0`
   */
  endOffset?: number;
}
```

### RangeOptionsMonthExact interface

```ts
/**
 * Options for the DateRange `getMonthExact()` method.
 */
export type RangeOptionsMonthExact = Omit<RangeOptions, 'refWeekday'>;
```

### RangeOptionsDays interface

```ts
/**
 * Options for the DateRange `getDays()` method.
 */
export type RangeOptionsDays = Omit<RangeOptions, 'refWeekday'> & {
  daysCount?: number;
};
```

### DaysCount interface

```ts
interface DaysCount {
  /**
   * The number of days to be included in the range generated with `getDays` method.
   */
  daysCount?: number;
}
```

### Offset interface

````ts
export interface Offset {
  /**
   * The number of days to add before the the first date of the range.
   *
   * @remarks
   * Must be a non-negative integer.
   *
   * This will be change to accept also negative values.
   *
   * @defaultValue `0`
   *
   * @example
   * ```
   * // set reference date ('Fri, Jan 10, 2020')
   * const refDate = DateTime.fromObject({ year: 2020, month: 1, day: 10 });
   *
   * // without startOffset
   * const weekRange1 = new DateRange().getWeek({ refDate });
   * weekRange1.dates[0]; // 'Mon, Jan 6, 2020'
   *
   * // with startOffset
   * const weekRange2 = new DateRange().getWeek({
   * 	refDate,
   * 	startOffset: 5,
   * });
   * weekRange2.dates[0]; // 'Wed, Jan 1, 2020'
   * ```
   */
  startOffset?: number;

  /**
   * The number of days to add after the the last date of the range.
   *
   * @remarks
   * Must be a non-negative integer.
   *
   * This will be change to accept also negative values.
   *
   * @defaultValue `0`
   *
   * @example
   * ```
   * // set reference date ('Fri, Jan 10, 2020')
   * const refDate = DateTime.fromObject({ year: 2020, month: 1, day: 10 });
   *
   * // without endOffset
   * const weekRange1 = new DateRange().getWeek({ refDate });
   * // last date of the range
   * weekRange1.dates[weekRange1.dates.length - 1]; // 'Sun, Jan 12, 2020'
   *
   * // with endOffset
   * const weekRange2 = new DateRange().getWeek({
   * 	refDate,
   * 	endOffset: 5,
   * });
   * // last date of the range
   * weekRange2.dates[weekRange2.dates.length - 1]; // 'Fri, Jan 17, 2020'
   * ```
   */
  endOffset?: number;
}
````

### RefDate interface

````ts
interface RefDate {
  /**
   * The reference date to calculate the range.
   *
   * @remarks
   * Must be a Date object or luxon DateTime object.
   * Defaults to current time.
   *
   * @example
   * ```
   * // with DateTime
   * new DateRange().getWeek({ refDate: DateTime.fromISO('2023-05-15') });
   *
   * // with Date
   * new DateRange().getWeek({ refDate: new Date("2023-05-15") });
   * ```
   */
  refDate?: DateTime | Date;
}
````

### RefWeekday interface

````ts
interface RefWeekday {
  /**
   * The reference weekday to start the range from.
   *
   * @remarks
   * Must be an integer from 1 (Monday) to 7 (Sunday).
   * Defaults to Monday.
   *
   *@example
   * ```
   * // with WEEKDAY enum. The range will start from Sunday
   * new DateRange().getWeek({refWeekday: WEEKDAY.Sunday });
   * // the equivalent with a number
   * new DateRange().getWeek({ refWeekday: 7 });
   * ```
   */
  refWeekday?: WEEKDAY;
}
````

### OptionsDays interface

```ts
interface OptionsDays extends RefDate, DaysCount, Offset {}
```

### OptionsWeek interface

```ts
interface OptionsWeek extends RefDate, RefWeekday, Offset {}
```

### OptionsMonthExact interface

```ts
interface OptionsMonthExact extends RefDate, Offset {}
```

### OptionsMonthExtended interface

```ts
interface OptionsMonthExtended extends RefDate, RefWeekday, Offset {}
```

## Enums

### RANGE_TYPE enum

```ts
/**
 * An enum that represents the type of date range that is generated and stored by DateRange instance.
 *
 * It corresponds to the range generator method used to create the range:
 * - `WEEK` for `getWeek`
 * - `MONTH-EXACT` for `getMonthExact`
 * - `MONTH-EXTENDED` for `getMonthExtended`
 * - `DAYS` for `getDays`
 */
export enum RANGE_TYPE {
  Week = 'WEEK',
  MonthExact = 'MONTH-EXACT',
  MonthExtended = 'MONTH-EXTENDED',
  Days = 'DAYS',
}
```

### WEEKDAY enum

```ts
/**
 * An enum that represents the weekdays as numbers from 1 to 7.
 */
export enum WEEKDAY {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}
```

## License

easy-date-range is licensed under the MIT license.

[DateTime]: https://moment.github.io/luxon/api-docs/index.html#datetime
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[TypeScript]: https://www.typescriptlang.org/
[Luxon]: https://moment.github.io/luxon

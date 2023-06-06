# easy-date-range

easy-date-range is a simple, easy to use library for creating date ranges which can be used as a foundation for building all sorts of calendars, schedulers, date lists and more.

## Features

### Single reference date

The key feature of easy-date-range is that methods used for generating ranges are based on a **single reference date** and a set of assumptions specific for range type.

### Descriptive API

Date ranges can be generated with several of get methods:

- [`getWeek`](#getweek) creates a week range. By default, the start of the week is Monday.
- [`getMonthExact`](#getmonthexact) creates a month range, from the first to the last day of the month.
- [`getMonthExtended`](#getmonthextended) creates a month range extended to include the full weeks. By default, the start of the range is Monday.
- [`getDays`](#getdays) creates a range of custom number of days.
- `next` and `prev` methods allow to easily shift any range passed to them as an argument.

### Easy to customize

By default all get methods use the current day as a reference date. It can be easily customized by passing an `options` object where you can also specify other settings such as offset, start of the week or days count.

### Only one dependency

easy-date-range uses [Luxon](https://moment.github.io/luxon) as a peer dependency for date handling. Luxon is a powerful and modern library for working with dates and times in JavaScript. It offers a consistent and fluent API, as well as support for various formats and locales.

easy-date-range accepts both Luxon and native JavaScript dates as input.

```ts
// create a range with a JavaScript Date as the reference date
const dr = new DateRange().getWeek({ refDate: new Date('2023-01-01') });

// create a range with a Luxon DateTime as the reference date
const dr = new DateRange().getWeek({ refDate: DateTime.fromISO('2023-01-01') });
```

Once the range is created you can access dates either way:

```ts
// get Luxon DateTimes with `toDateTime` method or with a getter property `dates`
dr.toDateTimes();
dr.dates;

// get JS Dates
dr.toDates();
```

### 100% TypeScript

easy-date-range is written entirely in [TypeScript](https://www.typescriptlang.org/) so you can enjoy the type safety it provides and other benefits such as autocomplete features in your code editor. Works with no issues in plain JavaScript environment, too.

### More features to come

At the moment, easy-date-range provides basic methods for creating date ranges that cover full days. In the future, I plan to add more methods for creating ranges that span other intervals such as hours and minutes, or months and years.

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
// 'toDateTimes` for an array of Luxon DateTimes
currentWeek.toDateTimes().forEach((date) => console.log(date.toString()));

// 'toDates' for an array of JS Dates
currentWeek.toDates().forEach((date) => console.log(date.toString()));

// you can also use a getter property 'dates' for Luxon DateTimes
currentWeek.dates.forEach((date) => console.log(date.toString()));
```

### Customize the range

You can customize the range with `options` object passed to a method.

Common options available for all methods:

- `refDate` for setting the reference date,
- `startOffset` for setting the number of days to add before the the first date of the range
- `endOffset` for setting the number of days to add after the the last date of the range.

Specific options depending on the method and type of range it generates:

- `refWeekday` for setting the weekday to start the range from. Available with `getWeek` and `getMonthExtended` methods
- `daysCount` for setting the number of days with `getDays` method

_Note_: The offset is applied after the range is created, or in other words, it comes after all other options. Think of it as a way to add or subtract days from your range as a final touch.

### Customize the range2

You can customize the range with an `options` object passed to a method.

Common options available for all methods:

- `refDate` for setting the reference date,
- `startOffset` for setting the number of days to add before the first date of the range
- `endOffset` for setting the number of days to add after the last date of the range.

Specific options depending on the method and type of range it generates:

- `refWeekday` for setting the weekday to start the range from. Available with getWeek and getMonthExtended methods
- `daysCount` for setting the number of days with getDays method

**_Note:_** The offset is applied after the range is created; or in other words, it comes after all other options. Think of it as a way to add or subtract days from your range as a final touch.

Here is a brief example.

```ts
// set a month range of January 2023 extended to full weeks with customized  refWeekday and offsets
const monthExtended = new DateRange().getMonthExtended({
  refDate: new Date('2023-01-01'),
  refWeekday: WEEKDAY.Sunday,
  startOffset: 2,
  endOffset: 2,
});
```

The range from the above example will include dates that span across all the days of January 2023 extended to start from Friday, Dec 30, 2022 and end on Monday, Feb 6, 2023.

The first and last two days in the range come from offset settings. Without the offset, the day that start the range would be Sunday, Jan 1, 2023, as specified with `refWeekday` and the last day would be Saturday, Feb 4, 2023

## API

### **getWeek**

```ts
public getWeek(rangeOptions?: RangeOpts): DateRange
```

options: [RangeOpts](#rangeopts)

Creates a single week range.

- By default, the method starts the range on Monday before or on the reference date and ends it on Sunday after or on the reference date.
- If not specified, the reference date is set to the current time.
- Each date is set to the start of the day (midnight).

Examples

```ts
// get current week starting on Monday
const currentWeek = new DateRange().getWeek();

// get week based on a refDate and starting on Sunday
const week2 = new DateRange().getWeek({
  refDate: new Date('2023-01-10'),
  refWeekday: WEEKDAY.Sunday,
});
// Generated dates:👇
// Sunday, January 8, 2023 at 12:00:00 AM
// Monday, January 9, 2023 at 12:00:00 AM
// Tuesday, January 10, 2023 at 12:00:00 AM
// Wednesday, January 11, 2023 at 12:00:00 AM
// Thursday, January 12, 2023 at 12:00:00 AM
// Friday, January 13, 2023 at 12:00:00 AM
// Saturday, January 14, 2023 at 12:00:00 AM
```

### **getMonthExact**

```ts
public getMonthExact(rangeOptions?: RangeOptsMonthExact): DateRange
```

`options`: [RangeOptsMonthExact](#getmonthexact)

Creates a single month range, from the first to the last day of the month.

- By default, the method starts the range on the first day of the month and ends it on the last day of the month.
- If not specified, the reference date is set to the current time.
- Each date is set to the start of the day (midnight).
- The method can customize the date range by accepting a rangeOptions object.

Examples

```ts
// Get current month
const currentMonthExact = new DateRange().getMonthExact();

// Get month with specified refDate
const monthExact = new DateRange().getMonthExact({
  refDate: new Date('2023-01-10'),
});
// Generated dates:
// Sunday, January 1, 2023 at 12:00:00 AM -> The first date of the range
// Monday, January 2, 2023 at 12:00:00 AM
// Tuesday, January 3, 2023 at 12:00:00 AM
// ...
// Tuesday, January 31, 2023 at 12:00:00 AM -> The last date of the range

// Get month with specified refDate and offsets
const month3 = new DateRange().getMonthExact({
  refDate: new Date('2023-01-10'),
  startOffset: 2,
  endOffset: 2,
});
// Friday, December 30, 2022 at 12:00:00 AM  -> The range starts 2 days before default first day
// Saturday, December 31, 2022 at 12:00:00 AM
// Sunday, January 1, 2023 at 12:00:00 AM
// ...
// Tuesday, January 31, 2023 at 12:00:00 AM
// Wednesday, February 1, 2023 at 12:00:00 AM
// Thursday, February 2, 2023 at 12:00:00 AM -> The range ends 2 days after default last day
```

### **getMonthExtended**

```ts
public getMonthExtended(rangeOptions?: RangeOpts): DateRange
```

`options`: [RangeOpts](#rangeopts)

Creates a single month range extended to include the full weeks.

- By default, the method starts the range on Monday before or on the first day of the month and ends it on Sunday after or on the last day of the month.
- If not specified, the reference date is set to the current time.
- Each date is set to the start of the day (midnight).
- The method can customize the range by accepting a `options` object.

Examples

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

### **getDays**

```ts
public getDays(options?: RangeOptsDays): DateRange
```

Creates a range of custom number of days.

Options: [RangeOptsDays](#rangeoptsdays)

Features:

- The reference date is a starting point of the range.
- If not specified, the reference date is set to the current time.
- The length of the range can be specified with the `daysCount` property in the `rangeOptions` object. If not specified, the range will be created with a single date.
- Each date is set to the start of the day (midnight).
- The range can be adjusted with the rangeOptions object passed to the method.

Examples:

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

### **next**

```ts
public next(dateRange: DateRange): DateRange
```

Generates the next range based on given one.

The method takes a DateRange object and based on its range type, sets the refDate to a date that can generate the new range.

It copies the options used to adjust the given range and applies them to the new range.

The method shifts the refDate to the next one as follows:

- for a range generated with getDays, the refDate is incremented by the daysCount property.
- for a range generated with getWeek, the refDate is incremented by 7 days.
- for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the next month.

### **prev**

## Interfaces

### RangeOpts

```ts
interface RangeOpts {
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

### RangeOptsMonthExact

```ts
/**
 * Options for the DateRange `getMonthExact()` method.
 */
export type RangeOptsMonthExact = Omit<RangeOpts, 'refWeekday'>;
```

### RangeOptsDays

```ts
/**
 * Options for the DateRange `getDays()` method.
 */
export type RangeOptsDays = Omit<RangeOpts, 'refWeekday'> & {
  daysCount?: number;
};
```

## License

easy-date-range is licensed under the MIT license.

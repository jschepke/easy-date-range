# easy-date-range

easy-date-range is a simple, easy to use library for creating date ranges which can be used as a foundation for building all sorts of calendars, schedulers, date lists and more.

## Features

### Single reference date

easy-date-range lets you create various date ranges with its methods: the main concept is that each method only requires a **single reference date** to calculate the range.

### Descriptive API

Here is a brief summary of core functionalities: the range generators:

- [`getWeek`](#getweek) creates a week range that starts on Monday.
- [`getMonthExact`](#getmonthexact) creates a month range, from the first to the last day of the month.
- [`getMonthExtended`](#getmonthextended) creates a month range extended to include the full weeks.
- [`getDays`](#getdays) creates a range of custom number of days.
- [`next`](#next) and [`prev`](#prev) methods enable easy shifting of any range passed into them.

**The reference date is always part of the range.** For example, if you use `getWeek` with today’s date as the reference date, you will get a range that includes today and six other days starting from Monday.

### Easy to customize

All range generators use the current day as a reference date unless specified otherwise. It can be easily customized by passing an `options` object where you can also set other settings such as offsets, start of the week or days count.

### 100% TypeScript

easy-date-range is written entirely in [TypeScript](https://www.typescriptlang.org/) for type safety and other benefits such as autocomplete features in your code editor. Works with no issues in plain JavaScript environment, too.

### Date and time made easy with Luxon

easy-date-range uses [Luxon](https://moment.github.io/luxon) as a peer dependency for date handling. Luxon is a powerful and modern library for working with dates and times in JavaScript. It offers a consistent and fluent API, as well as support for various formats and locales.

easy-date-range accepts both Luxon and native JavaScript dates:

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

### More features to come

At the moment, easy-date-range provides basic functionality for creating date ranges that cover full days. In the future, I plan to add more methods for creating ranges that span other intervals such as hours and minutes, or months and years.

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

You can customize the range with an `options` object passed to a range generator.

Common options available for all methods:

- `refDate` for setting the reference date,
- `startOffset` for setting the number of days to add before the first date of the range
- `endOffset` for setting the number of days to add after the last date of the range.

Specific options depending on the method and type of range it generates:

- `refWeekday` for setting the weekday to start the range from. Available with getWeek and getMonthExtended methods
- `daysCount` for setting the number of days with `getDays` method

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

The first and last two days in the range come from offset settings. Without the offset, the day that start the range would be Jan 1, 2023, (Sunday - as specified with `refWeekday`) and the last day would be Feb 4, 2023 (Saturday).

## API

### **getWeek**

Creates a single week range.

By default, the method starts the range on Monday before or on the reference date and ends it on Sunday after or on the reference date.

The end of the week will also be shifted accordingly if the start of the week is changed to a different day than Monday.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getWeek(rangeOptions?: RangeOpts): DateRange
```

#### **Parameters**

| Parameter    | Type                    | Description                       |
| ------------ | ----------------------- | --------------------------------- |
| rangeOptions | [RangeOpts](#rangeopts) | An object to configure the range. |

#### **Returns:**

`DateRange`

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
// Sunday, January 8, 2023 at 12:00:00 AM
// Monday, January 9, 2023 at 12:00:00 AM
// Tuesday, January 10, 2023 at 12:00:00 AM
// Wednesday, January 11, 2023 at 12:00:00 AM
// Thursday, January 12, 2023 at 12:00:00 AM
// Friday, January 13, 2023 at 12:00:00 AM
// Saturday, January 14, 2023 at 12:00:00 AM
```

### **getMonthExact**

Creates a single month range, from the first to the last day of the month.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getMonthExact(rangeOptions?: RangeOptsMonthExact): DateRange
```

#### **Parameters**

| Parameter    | Type                                        | Description                       |
| ------------ | ------------------------------------------- | --------------------------------- |
| rangeOptions | [RangeOptsMonthExact](#rangeoptsmonthexact) | An object to configure the range. |

#### **Returns:**

`DateRange`

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
// Sunday, January 1, 2023 at 12:00:00 AM -> The first date of the range
// Monday, January 2, 2023 at 12:00:00 AM
// Tuesday, January 3, 2023 at 12:00:00 AM
// ...
// Tuesday, January 31, 2023 at 12:00:00 AM -> The last date of the range
```

```ts
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

Creates a single month range extended to include the full weeks.

By default, the method starts the range on Monday before or on the first day of the month and ends it on Sunday after or on the last day of the month.

The end of the week will also be shifted accordingly if the start of the week is changed to a different day than Monday.

The reference date is set to the current day if not specified otherwise.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getMonthExtended(rangeOptions?: RangeOpts): DateRange
```

#### **Parameters**

| Parameter    | Type                                        | Description                       |
| ------------ | ------------------------------------------- | --------------------------------- |
| rangeOptions | [RangeOptsMonthExact](#rangeoptsmonthexact) | An object to configure the range. |

#### **Returns:**

`DateRange`

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

### **getDays**

Creates a range of custom number of days.

The reference date is a starting point of the range.

The reference date is set to the current day if not specified otherwise.

The length of the range can be specified with the `daysCount` property in the `rangeOptions` object. If not specified, the range will be created with a single date.

Each date is set to the start of the day (midnight).

#### **Signature**

```ts
public getDays(options?: RangeOptsDays): DateRange
```

#### **Parameters**

| Parameter    | Type                            | Description                       |
| ------------ | ------------------------------- | --------------------------------- |
| rangeOptions | [RangeOptsDays](#rangeoptsdays) | An object to configure the range. |

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

### **next**

Generates the next range based on given one.

The method takes a DateRange object and based on its range type, sets the refDate to a date that can generate the new range.

It copies the options used to adjust the given range and applies them to the new range.

The method shifts the refDate to the next one as follows:

- for a range generated with getDays, the refDate is incremented by the daysCount property.
- for a range generated with getWeek, the refDate is incremented by 7 days.
- for a range generated with getMonthExact and getMonthExtended, the refDate is set to the first day of the next month.

#### **Signature**

```ts
public next(dateRange: DateRange): DateRange
```

#### **Parameters**

| Parameter | Type           | Description                                |
| --------- | -------------- | ------------------------------------------ |
| dateRange | [DateRange](#) | A DateRange object with initialized range. |

### **prev**

Generates the previous range based on given one.

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

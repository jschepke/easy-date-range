# easy-date-range

easy-date-range is a simple, easy to use library for creating date ranges which can be used as a foundation for building all sorts of calendars, schedulers, date lists and more.

## Features

### Single reference date

The key feature of easy-date-range is that methods used for generating ranges are based on a **single reference date** and a set of assumptions specific for each method.

### Descriptive API

Date ranges can be generated with several of get methods:

- `getWeek` creates a week range that contains the reference date. By default, the start of the week is Monday.
- `getMonthExact` creates a month range, from the first to the last day of the month.
- `getMonthExtended` creates a month range extended to include the full weeks. By default, the start of the range is Monday.
- `getDays` creates a range of custom number of days.
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

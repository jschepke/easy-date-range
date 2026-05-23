# easy-date-range

Small TypeScript library for generating calendar-friendly date ranges: days,
weeks, exact months and months extended to full weeks.

The library is intentionally narrow. It is useful as a foundation for simple
calendar views, worklists, dashboards and date grouping. It is not a booking
engine, recurrence engine or full scheduler.

## Installation

```bash
npm install easy-date-range luxon
```

`luxon` is a peer dependency. `easy-date-range` accepts JavaScript `Date`
objects and Luxon `DateTime` objects as inputs, and returns Luxon `DateTime`
objects by default.

## Quick Start

```ts
import { DateRange, WEEKDAY } from "easy-date-range";

const week = new DateRange().getWeek({
	refDate: new Date("2026-05-14"),
	refWeekday: WEEKDAY.Monday,
});

week.dateTimes.forEach((dateTime) => {
	console.log(dateTime.toISODate());
});
```

Use `toDates()` when JavaScript `Date` objects are needed:

```ts
const jsDates = week.toDates();
```

## Public API

The root package exports:

```ts
import {
	DateRange,
	RANGE_TYPE,
	WEEKDAY,
	chunkMonthExtended,
	type OptionsDays,
	type OptionsMonthExact,
	type OptionsMonthExtended,
	type OptionsWeek,
} from "easy-date-range";
```

### `DateRange`

Create an instance and initialize it with one range generator:

```ts
new DateRange().getDays(options);
new DateRange().getWeek(options);
new DateRange().getMonthExact(options);
new DateRange().getMonthExtended(options);
new DateRange().getNext(dateRange);
new DateRange().getPrevious(dateRange);
```

After initialization, the instance exposes:

```ts
dateRange.dateTimes; // readonly DateTime[]
dateRange.toDateTimes(); // readonly DateTime[]
dateRange.toDates(); // Date[]
dateRange.refDate;
dateRange.refWeekday;
dateRange.startOffset;
dateRange.endOffset;
dateRange.daysCount;
dateRange.rangeType;
dateRange.isNext;
dateRange.isPrevious;
```

`dateTimes` and `toDateTimes()` return readonly copies. Mutating the returned
array does not mutate the `DateRange` instance.

### Options

All range generators accept an optional object. Passing `{}` is valid and uses
defaults. Unknown option properties throw a runtime error, which helps catch
misspellings in JavaScript code.

Common options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `refDate` | `DateTime \| Date` | current date/time | Reference date used to calculate the range. |
| `startOffset` | `number` | `0` | Integer offset applied to the beginning of the range. |
| `endOffset` | `number` | `0` | Integer offset applied to the end of the range. |

Method-specific options:

| Method | Option | Type | Default |
| --- | --- | --- | --- |
| `getDays` | `daysCount` | positive integer | `1` |
| `getWeek` | `refWeekday` | `WEEKDAY` / `1..7` | `WEEKDAY.Monday` |
| `getMonthExtended` | `refWeekday` | `WEEKDAY` / `1..7` | `WEEKDAY.Monday` |

### Offsets

Offsets are integer day adjustments applied after the base range is generated.

- Positive `startOffset` adds dates before the range.
- Negative `startOffset` removes dates from the beginning.
- Positive `endOffset` adds dates after the range.
- Negative `endOffset` removes dates from the end.

Negative offsets cannot remove the whole range.

```ts
const range = new DateRange().getMonthExact({
	refDate: new Date("2026-05-14"),
	startOffset: 2,
	endOffset: -2,
});
```

## Recipes

### Current Week

```ts
const currentWeek = new DateRange().getWeek();
```

### Sunday-First Week

```ts
const sundayFirst = new DateRange().getWeek({
	refWeekday: WEEKDAY.Sunday,
});
```

### Exact Month

```ts
const may = new DateRange().getMonthExact({
	refDate: new Date("2026-05-14"),
});
```

### Month Grid

Use `getMonthExtended()` for calendar grids that need complete weeks.

```ts
const monthGridRange = new DateRange().getMonthExtended({
	refDate: new Date("2026-05-14"),
	refWeekday: WEEKDAY.Monday,
});
```

### Month Chunks

`chunkMonthExtended()` splits a month-extended range into week rows.

```ts
const range = new DateRange().getMonthExtended({
	refDate: new Date("2026-05-14"),
});

const weeks = chunkMonthExtended(range);
```

Set `nullNextPrevDates` to replace dates outside the reference month with
`null`.

```ts
const weeks = chunkMonthExtended(range, {
	nullNextPrevDates: true,
});
```

### Previous And Next Ranges

```ts
const current = new DateRange().getWeek({
	refDate: new Date("2026-05-14"),
});

const previous = new DateRange().getPrevious(current);
const next = new DateRange().getNext(current);
```

### Worklist Buckets

Use ranges to group tasks, reviews or deadlines into simple operational
buckets.

```ts
import { DateTime } from "luxon";

const tasks = [
	{ title: "Review procedure", dueDate: DateTime.fromISO("2026-05-14") },
	{ title: "Approve record", dueDate: DateTime.fromISO("2026-05-20") },
];

const thisWeek = new DateRange().getWeek({
	refDate: DateTime.now(),
});

const thisWeekMillis = new Set(
	thisWeek.dateTimes.map((dateTime) => dateTime.toMillis()),
);

const dueThisWeek = tasks.filter((task) =>
	thisWeekMillis.has(task.dueDate.startOf("day").toMillis()),
);
```

## Limitations

`easy-date-range` does not provide:

- recurrence rules;
- event storage;
- booking or reservation conflict detection;
- resource availability;
- drag-and-drop scheduler UI;
- timezone policy beyond Luxon `DateTime` behavior.

For full scheduling and resource planning, use a dedicated calendar/scheduler
library and treat `easy-date-range` as a small helper for date projections.

## v2 Migration Notes

`easy-date-range@2.0.0` contains intentional breaking changes:

- `dateTimes` and `toDateTimes()` return readonly array copies.
- Unknown properties in range generator options now throw runtime errors.
- Empty `{}` options are valid and use defaults.
- `getDays({ daysCount: 0 })` is invalid; `daysCount` must be at least `1`.
- `@types/luxon` is installed as a package dependency so generated declaration
  files can reference Luxon types correctly.

## Development

```bash
npm run test:run
npm run coverage
npm run lint
npm run build
npm run smoke:pack
```

`smoke:pack` builds the package, checks the dry-run npm package contents and
verifies both ESM and CJS runtime imports.

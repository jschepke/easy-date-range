## [1.3.1](https://github.com/jschepke/easy-date-range/compare/v1.3.0...v1.3.1) (2024-02-22)


### chore

* **deps:** bump peer dependency luxon from 3.3 to 3.4 ([fde57f1](https://github.com/jschepke/easy-date-range/commit/fde57f10d82bdb7d7e482a31f5a1e5d0bdb9a267))

# [1.3.0](https://github.com/jschepke/easy-date-range/compare/v1.2.1...v1.3.0) (2023-07-28)


### feat

* introduce chunkMonthExtended util function ([9e8a51b](https://github.com/jschepke/easy-date-range/commit/9e8a51bffdf6034f52da3444a825cae0dc92e85c))

## [1.2.1](https://github.com/jschepke/easy-date-range/compare/v1.2.0...v1.2.1) (2023-07-27)


### chore

* add semantic-release to scripts and config ([bddb82b](https://github.com/jschepke/easy-date-range/commit/bddb82b8dcdaa0d2aa41e24a896b930324a65b1a))
* update release config ([b241202](https://github.com/jschepke/easy-date-range/commit/b241202c7bf5f53ba81f630fee0dce376c94115f))

# [1.2.0](https://github.com/jschepke/easy-date-range/compare/v1.1.0...v1.2.0) (2023-07-05)


### Bug Fixes

* include types in exports in package.json ([f666e3d](https://github.com/jschepke/easy-date-range/commit/f666e3d935414189e3230ca2ce05c6080a177f2c))


### Features

* add emptyDir function to vite config ([84a155a](https://github.com/jschepke/easy-date-range/commit/84a155ac8d4ff3502c4bb1d5f48f0678c8bbf2db))

# [1.1.0](https://github.com/jschepke/easy-date-range/compare/v1.0.0...v1.1.0) (2023-07-03)


### Features

* add build to workflow ([44bcf5f](https://github.com/jschepke/easy-date-range/commit/44bcf5ff04770164f86291210656c06923ca74a6))

# 1.0.0 (2023-07-03)


### Bug Fixes

* add integer check to isValidWeekday function ([272dd8f](https://github.com/jschepke/easy-date-range/commit/272dd8ff6f06207ee02397516d70ee1500ef3717))
* correct typo in findDateTime.test.ts ([18b56fb](https://github.com/jschepke/easy-date-range/commit/18b56fbc5f8641590df3c6a6e52d4c3adcb61bcd))
* getPrevious and isPrevious ([ee3e94f](https://github.com/jschepke/easy-date-range/commit/ee3e94f70aeef2cfa2ede628c19c74c8394d6084))


* feat(dateRange)!: update DateRange class ([0e4b847](https://github.com/jschepke/easy-date-range/commit/0e4b847f4e032f33dc463b44ff1e661ebbac7a44))


### Features

* add commitlint and husky ([1a757d9](https://github.com/jschepke/easy-date-range/commit/1a757d9469e7411303b34c07c35d48eca44697b2))
* add exports to index.ts ([d93aa30](https://github.com/jschepke/easy-date-range/commit/d93aa3058922a93910b2df118fa555ccdf1bb2b8))
* add findDateTime function and test suite ([3515619](https://github.com/jschepke/easy-date-range/commit/35156196a75636d19396c617bfd8bae2f5283eac))
* add new validation errors ([1f10401](https://github.com/jschepke/easy-date-range/commit/1f104016f58ac38ee46be4afae6cf0142868d44a))
* add range type to constants ([eefff58](https://github.com/jschepke/easy-date-range/commit/eefff58a036635222a2214106db6543c86b9152d))
* add zod library ([9434325](https://github.com/jschepke/easy-date-range/commit/94343251dd71680cb86e76ce42b57d21aaaf526b))
* **DateRange:** constructor and methods update ([23ba093](https://github.com/jschepke/easy-date-range/commit/23ba09394d0e674cc948de2c4e5546714b39ee99))
* **errors:** add more custom errors ([58c327b](https://github.com/jschepke/easy-date-range/commit/58c327bef104e97b812803c3826eef0a83fc5bbd))
* **extendRange:** implement negative offsets ([c6cf56f](https://github.com/jschepke/easy-date-range/commit/c6cf56f6cc52ec58752a72418a3337cd44d5b047))
* implement TestValues class ([f9706a1](https://github.com/jschepke/easy-date-range/commit/f9706a15f2fa711fe78038760a29e0268ef492d3))
* rename function and interface ([0045919](https://github.com/jschepke/easy-date-range/commit/00459193e097d58686515913a967657ec3ef9054))
* update testUtils.ts ([81e3f95](https://github.com/jschepke/easy-date-range/commit/81e3f95f537b7a4966a5b95d739f03f853be5806))
* **utils:** add hasExpectedKeys utility function ([322bc08](https://github.com/jschepke/easy-date-range/commit/322bc08e9698429fee1f4b57f83d54cec5edc6bd))
* **utils:** add validateObjectArgument function ([9fdb066](https://github.com/jschepke/easy-date-range/commit/9fdb06673bb515d6acf3b09ffc32ba1823c4df07))
* **utils:** change isValidOffset function ([026ba07](https://github.com/jschepke/easy-date-range/commit/026ba0775eccb468611850fc83e1c0e9ac91d3b1))
* **validators:** add common validators ([a11244d](https://github.com/jschepke/easy-date-range/commit/a11244d9c9c984b6a5708b3664d5a84909d9f0a6))
* **validators:** add new validator function ([e2b6cd6](https://github.com/jschepke/easy-date-range/commit/e2b6cd69a554f272847b0b6704d1fadfdbd00f96))
* **validators:** add validateDaysCount ([0ac3f36](https://github.com/jschepke/easy-date-range/commit/0ac3f36523a3760c7f3ac4fcd6c2d814c605d4da))


### BREAKING CHANGES

* Renamed methods eachDayOfMonth() and eachDayOfWeek()
to getMonth() and getWeek(), respectively.

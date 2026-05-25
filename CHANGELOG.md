# 1.1.2 (2026-05-25)

* removed `null` from `SharedState` — `lastTimestamp` and `counterStart` now initialized to concrete values, eliminating nullish coalescing from the hot path
* simplified `isEqual` to a single expression, removing redundant `isNil` guards
* removed redundant `!isNaN()` check from `isValidInRange` — NaN already fails the range comparison
* removed unused internal `isNil` utility
* updated TypeScript `target` and `lib` to `ES2022` to align with the Node.js `>=18` engine requirement
* added `skipLibCheck: true` to `tsconfig.json` for faster builds


# 1.1.1 (2026-05-25)

* added `.editorconfig` for consistent cross-editor formatting
* added `.nvmrc` pinning Node.js 22 (LTS) for local development
* added `.github/release.yml` for automated GitHub release note categorization by PR label
* added OpenSSF Scorecard workflow (`scorecard.yml`) for automated security posture scoring
* added `c8` devDependency and `test:coverage` npm script for V8-native code coverage
* updated CI workflow to run coverage on Node 22 and upload the lcov report as a build artifact


# 1.1.0 (2026-05-24)

* rewrote entire codebase in TypeScript
* replaced legacy ESLint rc config with flat config (`eslint.config.js`) using `typescript-eslint`
* added TypeScript declarations for all public types (`Drop`, `RaindropOptions`, `RaindropMaterials`, `DecodedMaterials`)
* updated all dependencies to current versions
* updated Node.js engine requirement to `>=18`
* updated license year and README with TypeScript usage examples


# 1.0.3 (2016-01-18)

* removed unnecessary buffer function (legacy)
* organized code to util functions and some renames
* removed hexId from decoded func response


# 1.0.2 (2016-01-17)

* moved mutable data values to separate namespace


# 1.0.1 (2016-01-17)

* removed CoffeeScript and CoffeeLint dependencies
* remove Gulp dependency
* converted all source code to ES6 and node dependency of 4.2+
* broke apart all code into logical separations with focus on function-oriented, testability, and data mutability
* updated Travis configuration for new node version
* conformed all code to very strict ESLint standards
* updated ESLint and IntEncoder to current versions

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

# Contributing to Raindrop

Thank you for your interest in contributing! This document covers everything you need to get started.

## Prerequisites

- [Node.js](https://nodejs.org) >= 18
- npm >= 9

## Setup

```bash
git clone https://github.com/codemouse/raindrop.git
cd raindrop
npm install
```

## Development

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm test` | Run the test suite |
| `npm run lint` | Run ESLint |
| `npm run example` | Run the usage example |

All three checks must pass before opening a pull request.

## Project structure

```
src/           TypeScript source
  config.ts    Hex layout configuration
  constants.ts Numeric constants
  encoder.ts   Base-N encode/decode wrapper
  raindrop.ts  Core ID generation logic
  shared.ts    Module-level mutable state (timestamp, counter)
  util.ts      Pure utility functions
  version.ts   Package version constant
test/          Test suite (node:test)
examples/      Runnable usage demos
dist/          Compiled output (generated, not committed)
```

## Making changes

1. Fork the repository and create a feature branch from `main`.
2. Make your changes with focused, atomic commits.
3. Add or update tests for any changed behavior.
4. Run `npm test`, `npm run build`, and `npm run lint` — all must pass.
5. Update `CHANGELOG.md` if the change is user-facing.
6. Open a pull request against `main`.

## Commit messages

Use the imperative mood and keep the subject line under 72 characters:

```
fix: correct counter modulus to include full 24-bit range
feat: add optional processId default from os.pid()
docs: update README usage example
```

Prefixes: `fix`, `feat`, `docs`, `refactor`, `test`, `chore`.

## Reporting bugs

Use the [bug report template](https://github.com/codemouse/raindrop/issues/new?template=bug_report.yml).

## Suggesting features

Use the [feature request template](https://github.com/codemouse/raindrop/issues/new?template=feature_request.yml).

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Please be respectful and constructive.

## License

By contributing, you agree your contributions will be licensed under the project's [MIT License](LICENSE).

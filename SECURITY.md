# Security Policy

## Supported versions

Only the latest release receives security fixes.

| Version | Supported |
|---------|-----------|
| 1.x (latest) | Yes |
| < 1.x | No |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Report vulnerabilities privately via GitHub's built-in security advisory feature:
[https://github.com/codemouse/raindrop/security/advisories/new](https://github.com/codemouse/raindrop/security/advisories/new)

Include as much of the following as possible:

- Type of issue (e.g. information disclosure, denial of service)
- Affected version(s)
- Minimal reproduction steps or proof-of-concept code
- Impact assessment — what an attacker could achieve

You will receive a response within **7 days**. If the issue is confirmed, a patch will be released as soon as possible depending on severity.

## Scope

This package is a pure ID-generation utility with no network I/O, no file system access, and no eval-like constructs. The attack surface is narrow; nonetheless, reports relating to the following are in scope:

- Predictable or biased output that could compromise identifier uniqueness guarantees
- Prototype pollution or other supply-chain risks introduced via dependencies
- Denial-of-service via crafted inputs to `decode()`

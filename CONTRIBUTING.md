# Contributing to gign

First off, thank you for considering contributing to gign! It's people like you that make gign such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## CI/CD Guidelines

To ensure code quality and a smooth development process, we have a robust CI/CD pipeline in place.

1. **Security First**: All dependencies will be checked using `npm audit` and Snyk. Please do not commit any sensitive information. Use environment variables if needed.
2. **Test Everything**:
   - All new features and bug fixes must include unit tests. We strive for a minimum 80% test coverage.
   - Run tests locally with `npm test` and check coverage with `npm run test:coverage`.
3. **Code Quality**:
   - The code is formatted with Prettier and linted with ESLint. Run `npm run format` and `npm run lint` before committing your changes.
   - Code must follow **SOLID**, **DRY**, **KISS**, and **YAGNI** principles.
   - Files should not exceed 180 lines of code.
4. **Pull Requests**:
   - Create a PR against the `main` or `develop` branch.
   - Ensure all CI checks (lint, test, build) pass successfully.
   - Staging deployments happen automatically on PR creation.
   - Manual approval is required for Production deployments once merged to `main`.

## Local Development

1. Fork the repository and clone it locally.
2. Run `npm ci` to install dependencies.
3. Use `npm run build` to build the CLI locally using `esbuild`.
4. Create your changes in a branch.
5. Push to your fork and submit a PR!

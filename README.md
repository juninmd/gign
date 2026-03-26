# GIGN

[![CI/CD Pipeline](https://github.com/juninmd/gign/actions/workflows/ci.yml/badge.svg)](https://github.com/juninmd/gign/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/juninmd/gign/branch/main/graph/badge.svg)](https://codecov.io/gh/juninmd/gign)
[![NPM Version](https://img.shields.io/npm/v/gign.svg)](https://npmjs.org/package/gign)
[![NPM Downloads](https://img.shields.io/npm/dm/gign.svg)](https://npmjs.org/package/gign)
[![GitHub issues](https://img.shields.io/github/issues/juninmd/gign.svg)](https://github.com/juninmd/gign/issues)
[![GitHub forks](https://img.shields.io/github/forks/juninmd/gign.svg)](https://github.com/juninmd/gign/network)

```
  ________.__
 /  _____/|__| ____   ____
/   \  ___|  |/ ___\ /    \
\    \_\  \  / /_/  >   |  \
 \______  /__\___  /|___|  /
        \/  /_____/      \/

```

- `gign` generate a automatic `.gitignore` file for your project.

## Requisites

- Node 8 `for(Await/Async)`

## How to Install?

```bash
$ yarn global add gign
```

## How to use?

```bash
$ gign <path>
```

## Thanks

We use the gitignore.io api  
http://gitignore.io/

## Beta Suport

- Windows, Linux and Mac
- Node JS
- Typescript

## Help Gign

You can help to improve the tool!  
Include one new pattern on `pattern.json` or `manual.json`  
I will wait for your P.R. ;D

## Development

```bash
# Install dependencies
$ npm install

# Run tests
$ npm test

# Check coverage
$ npm run test:coverage

# Run linter
$ npm run lint

# Format code
$ npm run format
```

## CI/CD and Deployment Process

This project uses GitHub Actions to automate CI/CD processes. The pipeline includes the following stages:

1. **Lint and Format**: Code quality checks are enforced using ESLint and Prettier.
2. **Security Checks**: Dependencies are scanned via `npm audit` and Snyk.
3. **Test**: Unit and integration tests are executed via Jest with an 80% coverage threshold. Coverage is uploaded to Codecov.
4. **Build**: The code is bundled and minified using `esbuild` for an optimized build artifact.
5. **Staging Deploy**: Deploys a staging instance automatically on Pull Request or when merging to `develop`.
6. **Production Deploy**: Pushes to `main` require a manual approval environment gate, which deploys the final production code (typically to npm), with Slack notifications for Success and Failure.

### Environment Variables

The pipeline uses the following GitHub Secrets for operation:

- `SNYK_TOKEN`: Access token for the Snyk Security action to perform dependency audits.
- `SLACK_WEBHOOK`: The Webhook URL mapped to a Slack channel for notifying deployments and pipeline statuses.

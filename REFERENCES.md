# References

This document catalogs the external references, upstream repositories, and specifications used in **gign**.

## Upstream & Templates

- [github/gitignore](https://github.com/github/gitignore): Source of truth for official `.gitignore` templates used to populate `src/data/templates.json`.
- [gitignore.io (Toptal Developers)](https://www.toptal.com/developers/gitignore): Initial inspiration for tag-based gitignore compilation and rules.

## Tooling & CI/CD

- [semantic-release](https://github.com/semantic-release/semantic-release): Fully automated version management and package publishing based on Conventional Commits.
- [npm Provenance Documentation](https://docs.npmjs.com/generating-provenance-statements): Guide on publishing packages with cryptographically verifiable build provenance via OpenID Connect (OIDC) on GitHub Actions.
- [esbuild](https://esbuild.github.io/): Extremely fast JavaScript and TypeScript bundler used for building the single distribution bundle in `dist/`.
- [TypeScript](https://www.typescriptlang.org/): Type safety and modern ECMAScript features.
- [Jest](https://jestjs.io/): Delightful JavaScript Testing Framework with VM modules ESM support.

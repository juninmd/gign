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

## Templates e releases

- Os templates ficam em `src/data/templates.json` (gerados de [github/gitignore](https://github.com/github/gitignore), CC0) e `src/data/rules.json` (aliases e regras extras). Para atualizar: `npm run sync:templates`.
- Releases são automáticas via [release-please](https://github.com/googleapis/release-please): use commits no padrão Conventional Commits (`feat:` → minor, `fix:` → patch, `feat!:`/`BREAKING CHANGE` → major, ou minor enquanto a versão for 0.x). A cada push no `master` o bot abre/atualiza um PR "chore(master): release X.Y.Z" com changelog e bump de versão. Ao mergear esse PR, a tag e a release são criadas e o workflow `release.yml` valida (lint + testes) e publica no npm com provenance. Requer o secret `NPM_TOKEN` e a opção _Settings → Actions → General → Allow GitHub Actions to create and approve pull requests_.

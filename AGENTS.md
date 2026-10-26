# AGENTS.md - GIGN

## Tech Stack

- **Language**: TypeScript (Node.js)
- **Runtime**: Node.js 20+
- **Build**: esbuild (single bundle in `dist/`)
- **Testing**: Jest
- **Linting**: ESLint
- **CI**: GitHub Actions
- **Coverage**: Codecov
- **Package Manager**: npm

## Project Structure

```
index.ts              # CLI entry
src/actions/          # generateFile (orchestration)
src/util/             # project detection (project.ts), templates/dedupe (templates.ts), os
src/data/             # bundled templates.json (github/gitignore) and rules.json (aliases + extra lines)
scripts/              # sync-templates.mjs (refreshes templates.json)
tests/                # Jest tests
dist/                 # Compiled output
```

## Key Dependencies

- None at runtime: templates are bundled, no external API is called.

## Commands

```bash
npm test              # Run Jest tests
npm run lint          # ESLint
npm run build         # Build distribution
npm run sync:templates # Refresh src/data/templates.json from github/gitignore
gign <path>           # Generate .gitignore
```

## Conventions

- ESM modules (type: module)
- CLI tool pattern with global install
- Detection lives in `pattern.json` / `manual.json`; ignore content lives in `src/data/`
- Releases: Conventional Commits drive semantic-release (`.github/workflows/release.yml`); pushing to `master` automatically tags, releases and publishes to npm with provenance (needs the `NPM_TOKEN` secret). No manual PR approval required. Never bump `package.json` version by hand.

<!-- base-actions-main-policy -->

## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.

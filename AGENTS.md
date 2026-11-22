# AGENTS.md - GIGN

GIGN is a Node.js CLI that generates a `.gitignore` for a project: it detects the project type and writes the matching
templates from github/gitignore, bundled in the package. No runtime dependencies and no network calls.

## Stack

- **Language**: TypeScript, ESM (`"type": "module"`), Node.js 20+ (`engines`)
- **Build**: esbuild, one bundle in `dist/` (`prepack` builds it before publishing)
- **Tests**: Jest with `--experimental-vm-modules`; **lint**: ESLint; **format**: Prettier
- **Package manager**: npm (`package-lock.json`)
- **CI**: GitHub Actions (`validate.yml`, `security.yml`, `sast.yml`, `release.yml`)

## Project Structure

```
index.ts              # CLI entry
src/actions/          # generateFile (orchestration)
src/util/             # project detection (project.ts), templates/dedupe (templates.ts), os, preserve
src/data/             # bundled templates.json (github/gitignore) and rules.json (aliases + extra lines)
pattern.json          # detection patterns by file name (ships as data)
manual.json           # manual detection rules (tag, search by filename and path)
scripts/              # sync-templates.mjs (refreshes templates.json), check-readme.mjs (README check)
tests/                # Jest tests; tests/fixtures/node-ts is a sample project
dist/                 # build output (generated, not committed)
```

## Commands

```bash
npm ci                    # install from package-lock.json
npm test                  # Jest
npm run test:coverage     # Jest with coverage (no upload step in CI)
npm run lint              # ESLint
npm run format:check      # Prettier check (npm run format writes)
npm run build             # esbuild bundle into dist/
npm run check:readme      # validates README.md
npm run sync:templates    # refreshes src/data/templates.json from github/gitignore
gign <path>               # generates .gitignore for the project at <path> (after a global install)
```

## Key Dependencies

- None at runtime: templates are bundled, and no external API is called.

## Conventions

- ESM modules (`type: module`); CLI tool pattern with global install (`bin`: `dist/index.js`).
- Detection lives in `pattern.json` and `manual.json`; ignore content lives in `src/data/`.
- Releases: Conventional Commits drive semantic-release (`.github/workflows/release.yml`). Pushing to `master` automatically
  tags, releases and publishes to npm with provenance (needs the `NPM_TOKEN` secret). No manual PR approval is required.
- Never bump the `package.json` version by hand.

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

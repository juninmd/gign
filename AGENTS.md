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

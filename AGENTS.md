# AGENTS.md - GIGN

## Tech Stack

- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js 8+
- **CLI**: Commander (built-in)
- **Testing**: Jest
- **Linting**: ESLint
- **CI**: GitHub Actions
- **Coverage**: Codecov
- **Package Manager**: npm

## Project Structure

```
src/                  # Source code
  index.js            # Main logic
test/                 # Test files
dist/                 # Compiled output
```

## Key Dependencies

- loading-indicator (CLI spinner)
- node-fetch (v3, ESM)

## Commands

```bash
npm test              # Run Jest tests
npm run lint          # ESLint
npm run build         # Build distribution
gign <path>           # Generate .gitignore
```

## Conventions

- ESM modules (type: module)
- Node.js 8+ Async/Await
- CLI tool pattern with global install

## Environment Variables

- `GITIGNORE_API_URL` - Custom gitignore API endpoint

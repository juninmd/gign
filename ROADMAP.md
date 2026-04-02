# Product Roadmap: gign

## 1. Vision & Goals

**Vision:** To provide developers with a frictionless, zero-configuration CLI tool that automatically generates the most accurate and up-to-date `.gitignore` files for their projects.

**Goals:**

- Simplify project initialization by reliably detecting project environments (languages, frameworks, IDEs).
- Provide robust fallbacks and overrides to ensure developers always get the configuration they need.
- Foster a community-driven repository of ignore patterns.
- Maintain a secure, modern, and high-performance continuous integration pipeline.

## 2. Current Status

The project is currently in its early stages (v0.0.3) and provides foundational CLI capabilities:

- Generates `.gitignore` files by calling the `gitignore.io` API based on user-provided path or current directory.
- Supports manual configuration and basic project detection through `pattern.json` and `manual.json`.
- Cross-platform support (Windows, Linux, macOS).
- Currently functional but lacks comprehensive test coverage, robust error handling, and offline capabilities.
- The CI/CD pipeline requires routine maintenance and updates to align with the latest standard GitHub Actions (Issue #47).

## 3. Quarterly Roadmap

### Q1: Foundation & Reliability

- **High Priority:** Establish a comprehensive automated test suite and CI/CD pipeline (e.g., GitHub Actions) to prevent regressions.
- **High Priority:** Implement robust error handling (e.g., when the `gitignore.io` API is unreachable or rate-limited).
- **Medium Priority:** Update internal GitHub Actions dependencies to their latest major versions (e.g., `actions/checkout@v4`, `actions/setup-node@v4`) to ensure pipeline security and performance (Issue #47).
- **Medium Priority:** Refactor the codebase towards modern JS standards (ES6+) to improve maintainability and onboarding for new contributors.
- **Low Priority:** Standardize console output (e.g., clear success/failure messages, colored output).

### Q2: Core Feature Enhancements

- **High Priority:** Develop an "Interactive Mode" to prompt users to select languages/frameworks when automatic detection is ambiguous or fails.
- **Medium Priority:** Implement a local caching mechanism to reduce redundant API calls and speed up generation.
- **Low Priority:** Introduce an "Append/Merge Mode" to safely merge new templates into an existing `.gitignore` without overwriting custom user rules.

### Q3: Offline Capabilities & Configuration

- **High Priority:** Develop an offline fallback mechanism containing bundled, high-frequency templates (e.g., Node, Python, macOS, Windows) for offline usage.
- **Medium Priority:** Support local directory configuration overrides (e.g., `.gignrc.json`) allowing teams to define custom baseline ignores.
- **Low Priority:** Improve project detection logic by expanding `pattern.json` through automated scraping of popular boilerplates.

### Q4: Ecosystem & Community

- **High Priority:** Create comprehensive, user-friendly documentation (e.g., GitHub Pages) covering advanced usage and contribution guides.
- **Medium Priority:** Build a plugin or extension system to allow third-party tools to hook into the `gign` generation process.
- **Low Priority:** Technical debt reduction and dependency updates.

## 4. Feature Details

### Feature: CI/CD Pipeline Modernization (Issue #47)

- **User Value Proposition:** Ensures that the build and deployment pipeline remains fast, secure, and compatible with the latest GitHub Actions runners, preventing build rot.
- **Technical Approach:** Review all workflows in `.github/workflows/` and bump actions (`checkout`, `setup-node`, `upload-artifact`, `download-artifact`, `codecov-action`) to their latest major versions. Ensure tests pass on the newer node versions configured.
- **Success Criteria:** CI workflows execute successfully without deprecation warnings regarding Node.js versions or outdated actions.
- **Estimated Effort:** Small

### Feature: Interactive Mode

- **User Value Proposition:** Helps developers who aren't sure exactly which environment tags to use, offering a guided experience to ensure a complete `.gitignore`.
- **Technical Approach:** Integrate a CLI prompt library (like `inquirer.js` or `prompts`) to present selectable lists of common frameworks and environments when invoked without a specific path or when detection is inconclusive.
- **Success Criteria:** A user can run `gign -i` and successfully generate a `.gitignore` purely through CLI prompts.
- **Estimated Effort:** Medium

### Feature: Caching and Offline Fallback

- **User Value Proposition:** Ensures the tool is incredibly fast for repeated runs and remains fully functional even on airplanes, during network outages, or if the upstream API goes down.
- **Technical Approach:**
  - Cache successful API responses locally (e.g., in `~/.gign/cache`).
  - Ship a static snapshot of the top 50 most common `gitignore.io` templates as part of the NPM package.
- **Success Criteria:** `gign` executes successfully within milliseconds for cached queries and can generate standard files without a network connection.
- **Estimated Effort:** Large

### Feature: Append/Merge Mode

- **User Value Proposition:** Developers often realize they need to ignore additional environments after a project has started. This allows them to update their `.gitignore` without losing manually added custom rules.
- **Technical Approach:** Parse the existing `.gitignore` file, fetch the new rules, and perform a diff/merge operation to append only missing lines while preserving existing structure.
- **Success Criteria:** Running `gign --append` adds new ignore patterns without deleting pre-existing custom lines.
- **Estimated Effort:** Medium

## 5. Dependencies & Risks

- **Reliance on gitignore.io API:** `gign` is currently heavily dependent on the availability and stability of a third-party API.
  - _Mitigation:_ The planned Q2/Q3 caching and offline fallback features are critical to mitigating this risk.
- **Maintenance of Detection Patterns:** The tech ecosystem moves fast. Keeping `pattern.json` and `manual.json` accurate requires constant updates.
  - _Mitigation:_ Make it extremely easy for the community to contribute new patterns (clear documentation), potentially build a script to automate checking for stale patterns against the upstream API, and explore automated scraping of popular boilerplates to discover new patterns.

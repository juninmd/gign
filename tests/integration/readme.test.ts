import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

describe('README Examples and Output Tests', () => {
  const readmePath = path.join(rootDir, 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  beforeAll(() => {
    // Ensure project is built
    execSync('npm run build', { cwd: rootDir, stdio: 'ignore' });
  });

  it('should match the CLI output documented in README for tests/fixtures/node-ts fixture', () => {
    const fixtureDir = path.join(rootDir, 'tests/fixtures/node-ts');

    // Run gign CLI on the fixture
    const cliOutput = execSync(`node dist/index.js ${fixtureDir}`, { cwd: rootDir }).toString().trim();

    // Extract output block from README
    const outputMatch = readmeContent.match(/Exemplo de saída:\s*```text\s*([\s\S]*?)\s*```/);
    expect(outputMatch).not.toBeNull();

    const expectedReadmeOutput = outputMatch![1]!.trim();

    // Normalize output paths for comparison (e.g., replace absolute leading dir prefix)
    const normalizePath = (str: string) =>
      str.replace(/generated at .*?\/tests\/fixtures\/node-ts/g, 'generated at /path/tests/fixtures/node-ts');

    expect(normalizePath(cliOutput)).toBe(normalizePath(expectedReadmeOutput));
  });

  it('should execute .gignrc.json example from README and match expected .gitignore output', () => {
    const tempDir = path.join(__dirname, 'temp-gignrc-test');

    // Extract .gignrc.json block from README
    const gignrcMatch = readmeContent.match(/### Exemplo com `\.gignrc\.json`[\s\S]*?```json\s*([\s\S]*?)\s*```/);
    expect(gignrcMatch).not.toBeNull();
    const gignrcJson = JSON.parse(gignrcMatch![1]!.trim());

    // Extract expected .gitignore block from README
    const gitignoreMatch = readmeContent.match(
      /### Resultado esperado no `\.gitignore`[\s\S]*?```gitignore\s*([\s\S]*?)\s*```/,
    );
    expect(gitignoreMatch).not.toBeNull();
    const expectedGitignoreSnippet = gitignoreMatch![1]!.trim();

    // Setup test environment
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(path.join(tempDir, '.git'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'config'), { recursive: true });

    fs.writeFileSync(path.join(tempDir, '.gignrc.json'), JSON.stringify(gignrcJson, null, 2));
    fs.writeFileSync(path.join(tempDir, 'meuarquivo.txt'), 'hello');
    fs.writeFileSync(path.join(tempDir, 'config/app.json'), JSON.stringify({ build: { outDir: 'custom-dist/' } }));

    try {
      execSync(`node ${path.join(rootDir, 'dist/index.js')} ${tempDir}`, { stdio: 'ignore' });

      const gitignoreContent = fs.readFileSync(path.join(tempDir, '.gitignore'), 'utf8');

      // Verify that the generated .gitignore contains the exact expected snippet
      expect(gitignoreContent).toContain(expectedGitignoreSnippet);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should execute package.json#gign example from README and match expected .gitignore output', () => {
    const tempDir = path.join(__dirname, 'temp-pkgjson-test');

    // Extract package.json block from README
    const pkgjsonMatch = readmeContent.match(
      /### Exemplo equivalente no `package\.json`[\s\S]*?```json\s*([\s\S]*?)\s*```/,
    );
    expect(pkgjsonMatch).not.toBeNull();
    const pkgJson = JSON.parse(pkgjsonMatch![1]!.trim());

    // Extract expected .gitignore block from README
    const gitignoreMatch = readmeContent.match(
      /### Resultado esperado no `\.gitignore`[\s\S]*?```gitignore\s*([\s\S]*?)\s*```/,
    );
    expect(gitignoreMatch).not.toBeNull();
    const expectedGitignoreSnippet = gitignoreMatch![1]!.trim();

    // Setup test environment
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(path.join(tempDir, '.git'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'config'), { recursive: true });

    fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2));
    fs.writeFileSync(path.join(tempDir, 'meuarquivo.txt'), 'hello');
    fs.writeFileSync(path.join(tempDir, 'config/app.json'), JSON.stringify({ build: { outDir: 'custom-dist/' } }));

    try {
      execSync(`node ${path.join(rootDir, 'dist/index.js')} ${tempDir}`, { stdio: 'ignore' });

      const gitignoreContent = fs.readFileSync(path.join(tempDir, '.gitignore'), 'utf8');

      // Verify that the generated .gitignore contains the exact expected snippet
      expect(gitignoreContent).toContain(expectedGitignoreSnippet);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('CLI Integration Tests', () => {
  const testDir = path.join(__dirname, 'test-project');
  const gitignorePath = path.join(testDir, '.gitignore');

  beforeAll(() => {
    // Setup a dummy project directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({ name: 'test-project' }));
    // Create a dummy node_modules directory to trigger node tag and manual paths if relevant
    fs.mkdirSync(path.join(testDir, 'node_modules'));

    // Create a dummy .git directory to avoid warning
    fs.mkdirSync(path.join(testDir, '.git'));
  });

  afterAll(() => {
    // Cleanup
    if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath);
    if (fs.existsSync(path.join(testDir, 'package.json'))) fs.unlinkSync(path.join(testDir, 'package.json'));
    if (fs.existsSync(path.join(testDir, 'node_modules'))) fs.rmdirSync(path.join(testDir, 'node_modules'));
    if (fs.existsSync(path.join(testDir, '.git'))) fs.rmdirSync(path.join(testDir, '.git'));
    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
  });

  it('should generate a .gitignore file using the CLI', () => {
    // Build the CLI output just in case it isn't built
    execSync('npm run build', { stdio: 'ignore' });

    // Run the built CLI via node
    const output = execSync(`node dist/index.js ${testDir}`).toString();

    // Expect output to contain generated logs
    expect(output).toContain('[gign] generated at');

    // Verify the .gitignore was actually created
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

    // node_modules is ignored by default via manual tags in project.js matching node tag
    expect(gitignoreContent).toContain('node_modules');
  });

  it('should print usage when path is not provided', () => {
    const output = execSync('node dist/index.js').toString();
    expect(output).toContain('[gign] use "gign <path>"');
  });
});

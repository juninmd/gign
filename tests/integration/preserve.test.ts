import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('CLI keeps hand-written rules', () => {
  let dir: string;
  const file = () => path.join(dir, '.gitignore');
  const run = () => execSync(`node dist/index.js "${dir}"`, { stdio: 'pipe' });

  beforeAll(() => {
    execSync('npm run build', { stdio: 'ignore' });
  });

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gign-preserve-'));
    fs.mkdirSync(path.join(dir, '.git'));
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('does not delete rules of an existing .gitignore and is idempotent across runs', () => {
    fs.writeFileSync(file(), 'secret-notes/\n.env\n');

    run();
    const first = fs.readFileSync(file(), 'utf8');
    expect(first).toContain('### Custom rules (preserved) ###\nsecret-notes/');
    expect(first.match(/^\.env$/gm)).toHaveLength(1);

    run();
    expect(fs.readFileSync(file(), 'utf8')).toBe(first);
  });

  it('keeps a rule appended to the end of a generated .gitignore', () => {
    // Appending is the natural way to add a rule; it lands under the last generated section.
    run();
    fs.appendFileSync(file(), 'my-scratch/\n');

    run();
    const regenerated = fs.readFileSync(file(), 'utf8');
    expect(regenerated).toContain('### Custom rules (preserved) ###\nmy-scratch/');

    run();
    expect(fs.readFileSync(file(), 'utf8')).toBe(regenerated);
  });
});

import fs from 'fs';
import os from 'os';
import path from 'path';
import { readCustomRules } from '../../src/util/preserve.js';

describe('custom rules preservation', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gign-preserve-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('returns nothing when there is no .gitignore yet', () => {
    expect(readCustomRules(path.join(dir, '.gitignore'))).toEqual([]);
  });

  it('keeps every rule of a hand-written file', () => {
    const file = path.join(dir, '.gitignore');
    fs.writeFileSync(file, '# mine\nsecret-notes/\n\n*.bak\n');
    expect(readCustomRules(file)).toEqual(['secret-notes/', '*.bak']);
  });

  it('does not treat generated sections as custom', () => {
    const file = path.join(dir, '.gitignore');
    fs.writeFileSync(file, '### node ###\nnode_modules/\n\n### Custom rules (preserved) ###\nmine/\n');
    expect(readCustomRules(file)).toEqual(['mine/']);
  });

  it('keeps rules under headers gign never writes (gitignore.io, hand-written titles)', () => {
    const file = path.join(dir, '.gitignore');
    fs.writeFileSync(
      file,
      '### Node ###\nnode_modules/\n\n### My stuff ###\nsecret-notes/\n\n### node ###\ndist/\n\n### Environment and secrets ###\n.env\n\n### api (project) ###\nout/\n',
    );
    expect(readCustomRules(file)).toEqual(['node_modules/', 'secret-notes/']);
  });
});

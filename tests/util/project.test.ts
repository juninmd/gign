import { jest } from '@jest/globals';

jest.unstable_mockModule('fs', () => ({
  default: {
    readdirSync: jest.fn(),
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
  },
}));

describe('project utility', () => {
  let project: typeof import('../../src/util/project.js').default;
  let fs: typeof import('fs');

  beforeAll(async () => {
    fs = (await import('fs')).default;
    project = (await import('../../src/util/project.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
    console.error = jest.fn();

    // Reset mocks
    (fs.readdirSync as jest.Mock).mockReturnValue([]);
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
  });

  it('should detect tags based on pattern.json and warn if .git is missing', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['package.json']);
    const [tags, ignorePaths] = project('/dummy');

    expect(console.warn).toHaveBeenCalledWith('[gign] Initialize a git repository, use "git init" command');
    // Assuming pattern.json matches package.json to node
    expect(tags).toContain('node');
  });

  it('should support .gignrc.json', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['.git', '.gignrc.json', 'custom.txt']);
    (fs.existsSync as jest.Mock).mockImplementation(
      (filepath: unknown) => typeof filepath === 'string' && filepath.endsWith('.gignrc.json'),
    );
    (fs.readFileSync as jest.Mock).mockImplementation((filepath: unknown) => {
      if (typeof filepath === 'string' && filepath.endsWith('.gignrc.json')) {
        return JSON.stringify({ pattern: [{ customtag: ['custom.txt'] }] });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(tags).toContain('customtag');
  });

  it('should support package.json gign config', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['.git', 'package.json']);
    (fs.existsSync as jest.Mock).mockImplementation(
      (filepath: unknown) => typeof filepath === 'string' && filepath.endsWith('package.json'),
    );
    (fs.readFileSync as jest.Mock).mockImplementation((filepath: unknown) => {
      if (typeof filepath === 'string' && filepath.endsWith('package.json')) {
        return JSON.stringify({ gign: { pattern: [{ pkgtag: ['package.json'] }] } });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(tags).toContain('pkgtag');
    expect(tags).toContain('node'); // from the default pattern.json
  });

  it('should catch error when reading invalid JSON', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['.git', '.gignrc.json', 'package.json']);
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.readFileSync as jest.Mock).mockImplementation((filepath: unknown) => {
      if (typeof filepath === 'string' && filepath.endsWith('.gignrc.json')) return 'invalid-json';
      if (typeof filepath === 'string' && filepath.endsWith('package.json')) return 'invalid-json';
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[gign] Failed to parse .gignrc.json'));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[gign] Failed to parse package.json'));
  });

  it('should catch error when reading invalid struct JSON', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['.git', '.gignrc.json', 'dummy.json']);
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.readFileSync as jest.Mock).mockImplementation((filepath: unknown) => {
      if (typeof filepath === 'string' && filepath.endsWith('.gignrc.json')) {
        return JSON.stringify({
          manual: [
            {
              tag: 'custommanual',
              search: [{ filename: 'dummy.json', struct: 'foo.bar' }],
            },
          ],
        });
      }
      if (typeof filepath === 'string' && filepath.endsWith('dummy.json')) {
        return 'invalid-json'; // To cause JSON.parse failure in manual processing
      }
      return '';
    });

    project('/dummy/dir');

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[gign] error on model of custommanual'));
  });

  it('should handle struct and paths in manual.json', () => {
    // Inject custom config to act as manual since we can't easily mock the original required json without jest.mock
    (fs.readdirSync as jest.Mock).mockReturnValue(['.git', '.gignrc.json', 'dummy.json']);
    (fs.existsSync as jest.Mock).mockImplementation(
      (filepath: unknown) =>
        typeof filepath === 'string' && (filepath.endsWith('.gignrc.json') || filepath.endsWith('dummy.json')),
    );
    (fs.readFileSync as jest.Mock).mockImplementation((filepath: unknown) => {
      if (typeof filepath === 'string' && filepath.endsWith('.gignrc.json')) {
        return JSON.stringify({
          manual: [
            {
              tag: 'custommanual',
              search: [{ filename: 'dummy.json', struct: 'foo.bar' }],
            },
            {
              tag: 'pathmanual',
              search: [{ filename: 'dummy.json', path: 'ignored_dir' }],
            },
          ],
        });
      }
      if (typeof filepath === 'string' && filepath.endsWith('dummy.json')) {
        return JSON.stringify({ foo: { bar: 'some_ignored_value' } });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(ignorePaths.custommanual.values).toContain('some_ignored_value');
    expect(ignorePaths.pathmanual.values).toContain('ignored_dir');
  });
});

const project = require('../../src/util/project');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('project utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
    console.error = jest.fn();

    // Reset mocks
    fs.readdirSync.mockReturnValue([]);
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue('{}');
  });

  it('should detect tags based on pattern.json and warn if .git is missing', () => {
    fs.readdirSync.mockReturnValue(['package.json']);
    const [tags, ignorePaths] = project('/dummy');

    expect(console.warn).toHaveBeenCalledWith('[gign] Initialize a git repository, use "git init" command');
    // Assuming pattern.json matches package.json to node
    expect(tags).toContain('node');
  });

  it('should support .gignrc.json', () => {
    fs.readdirSync.mockReturnValue(['.git', '.gignrc.json', 'custom.txt']);
    fs.existsSync.mockImplementation((filepath) => filepath.endsWith('.gignrc.json'));
    fs.readFileSync.mockImplementation((filepath) => {
      if (filepath.endsWith('.gignrc.json')) {
        return JSON.stringify({ pattern: [{ customtag: ['custom.txt'] }] });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(tags).toContain('customtag');
  });

  it('should support package.json gign config', () => {
    fs.readdirSync.mockReturnValue(['.git', 'package.json']);
    fs.existsSync.mockImplementation((filepath) => filepath.endsWith('package.json'));
    fs.readFileSync.mockImplementation((filepath) => {
      if (filepath.endsWith('package.json')) {
        return JSON.stringify({ gign: { pattern: [{ pkgtag: ['package.json'] }] } });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(tags).toContain('pkgtag');
    expect(tags).toContain('node'); // from the default mocked pattern.json
  });

  it('should handle struct and paths in manual.json', () => {
    // Inject custom config to act as manual since we can't easily mock the original required json without jest.mock
    fs.readdirSync.mockReturnValue(['.git', '.gignrc.json', 'dummy.json']);
    fs.existsSync.mockImplementation(
      (filepath) => filepath.endsWith('.gignrc.json') || filepath.endsWith('dummy.json'),
    );
    fs.readFileSync.mockImplementation((filepath) => {
      if (filepath.endsWith('.gignrc.json')) {
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
      if (filepath.endsWith('dummy.json')) {
        return JSON.stringify({ foo: { bar: 'some_ignored_value' } });
      }
      return '';
    });

    const [tags, ignorePaths] = project('/dummy/dir');

    expect(ignorePaths.custommanual.values).toContain('some_ignored_value');
    expect(ignorePaths.pathmanual.values).toContain('ignored_dir');
  });
});

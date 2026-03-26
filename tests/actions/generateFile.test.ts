import { jest } from '@jest/globals';

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn(),
    statSync: jest.fn(),
    appendFileSync: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/util/os.js', () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule('../../src/util/project.js', () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule('../../src/util/download.js', () => ({
  default: jest.fn(),
}));

describe('generateFile action', () => {
  let fs: any;
  let path: any;
  let os: any;
  let project: any;
  let download: any;
  let generateFile: any;

  beforeAll(async () => {
    fs = (await import('fs')).default;
    path = (await import('path')).default;
    os = (await import('../../src/util/os.js')).default;
    project = (await import('../../src/util/project.js')).default;
    download = (await import('../../src/util/download.js')).default;
    generateFile = (await import('../../src/actions/generateFile.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('should warn if directory does not exist', async () => {
    fs.existsSync.mockReturnValue(false);

    await generateFile('/invalid/dir');

    expect(console.warn).toHaveBeenCalledWith('[gign] Directory does not exist');
  });

  it('should generate file with tags and manual ignores', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ isDirectory: () => true });
    os.mockReturnValue('linux');
    project.mockReturnValue([['node', 'react'], { custom: { values: ['ignored_dir'] } }]);
    download.mockResolvedValue(path.resolve('/dummy/.gitignore'));
    fs.appendFileSync.mockImplementation(() => {});

    await generateFile('/dummy');

    expect(os).toHaveBeenCalled();
    expect(project).toHaveBeenCalledWith(path.resolve('/dummy'));
    expect(download).toHaveBeenCalledWith({
      directory: path.resolve('/dummy'),
      tags: ['linux', 'node', 'react'],
    });

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      path.resolve('/dummy/.gitignore'),
      expect.stringContaining('# custom\r\nignored_dir\r\n'),
    );

    expect(console.info).toHaveBeenCalledWith(`[gign] generated at ${path.resolve('/dummy/.gitignore')}`);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[gign] tags: linux,node,react'));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[gign] manual tags: custom'));
  });

  it('should handle nothing detected', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ isDirectory: () => true });
    os.mockReturnValue('linux');
    project.mockReturnValue([[], {}]);
    download.mockResolvedValue(path.resolve('/dummy/.gitignore'));

    await generateFile('/dummy');

    // It should log security defaults
    expect(console.info).toHaveBeenCalledWith('[gign] nothing detected (only security defaults applied)');
  });

  it('should handle errors gracefully', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ isDirectory: () => true });
    os.mockImplementation(() => {
      throw new Error('OS Error');
    });

    await generateFile('/dummy');

    expect(console.error).toHaveBeenCalledWith('[gign] Error: OS Error');
  });
});

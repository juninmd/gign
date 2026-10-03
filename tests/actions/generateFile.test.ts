import { jest } from '@jest/globals';

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn(),
    statSync: jest.fn(),
    writeFileSync: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/util/os.js', () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule('../../src/util/project.js', () => ({
  default: jest.fn(),
}));

describe('generateFile action', () => {
  let fs: typeof import('fs');
  let path: typeof import('path');
  let os: jest.Mock<() => string>;
  let project: jest.Mock<() => any[]>;
  let generateFile: typeof import('../../src/actions/generateFile.js').default;

  beforeAll(async () => {
    fs = (await import('fs')).default;
    path = (await import('path')).default;
    os = (await import('../../src/util/os.js')).default as unknown as jest.Mock<() => string>;
    project = (await import('../../src/util/project.js')).default as unknown as jest.Mock<() => any[]>;
    generateFile = (await import('../../src/actions/generateFile.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('should warn if directory does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await generateFile('/invalid/dir');

    expect(console.warn).toHaveBeenCalledWith('[gign] Directory does not exist');
  });

  it('should generate file with tags and manual ignores', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
    os.mockReturnValue('linux');
    project.mockReturnValue([['node', 'react'], { custom: { values: ['ignored_dir'] } }]);

    await generateFile('/dummy');

    expect(os).toHaveBeenCalled();
    expect(project).toHaveBeenCalledWith(path.resolve('/dummy'));
    const [outputPath, content] = (fs.writeFileSync as jest.Mock).mock.calls[0] as [string, string];
    expect(outputPath).toBe(path.resolve('/dummy/.gitignore'));
    expect(content).toContain('### linux ###');
    expect(content).toContain('### node ###\n');
    expect(content).toContain('node_modules');
    expect(content).toContain('### custom (project) ###\nignored_dir\n');
    expect(content).toContain('### Environment and secrets ###');
    expect(content).toContain('secrets/');

    expect(console.info).toHaveBeenCalledWith(`[gign] generated at ${path.resolve('/dummy/.gitignore')}`);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[gign] tags: linux,node,react'));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[gign] manual tags: custom'));
  });

  it('should handle nothing detected', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
    os.mockReturnValue('linux');
    project.mockReturnValue([[], {}]);

    await generateFile('/dummy');

    expect(fs.writeFileSync).toHaveBeenCalledWith(path.resolve('/dummy/.gitignore'), expect.stringContaining('*.pem'));
    // It should log security defaults
    expect(console.info).toHaveBeenCalledWith('[gign] nothing detected (only OS and security defaults applied)');
  });

  it('should handle errors gracefully', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
    os.mockImplementation(() => {
      throw new Error('OS Error');
    });

    await generateFile('/dummy');

    expect(console.error).toHaveBeenCalledWith('[gign] Error: OS Error');
  });

  it('should handle non-Error exceptions gracefully', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
    os.mockImplementation(() => {
      throw 'String Error';
    });

    await generateFile('/dummy');

    expect(console.error).toHaveBeenCalledWith('[gign] Error: String Error');
  });
});

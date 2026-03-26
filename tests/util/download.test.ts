import { jest } from '@jest/globals';

jest.unstable_mockModule('fs', () => ({
  default: {
    writeFileSync: jest.fn(),
  },
}));

jest.unstable_mockModule('path', () => ({
  default: {
    join: jest.fn(),
  },
}));

jest.unstable_mockModule('loading-indicator', () => ({
  default: {
    start: jest.fn(),
    stop: jest.fn(),
  },
}));

const mockFetch = jest.fn();
jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch,
}));

describe('download utility', () => {
  let fs: any;
  let path: any;
  let loading: any;
  let downloadFile: any;

  beforeAll(async () => {
    fs = (await import('fs')).default;
    path = (await import('path')).default;
    loading = (await import('loading-indicator')).default;
    downloadFile = (await import('../../src/util/download.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download tags and save to .gitignore', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('node_modules\n.env'),
    } as never);
    fs.writeFileSync.mockImplementation(() => {});
    path.join.mockReturnValue('/dummy/.gitignore');
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['node', 'react'], directory: '/dummy' };
    const result = await downloadFile(options);

    expect(loading.start).toHaveBeenCalledWith('Download...');
    expect(mockFetch).toHaveBeenCalledWith('https://www.toptal.com/developers/gitignore/api/node,react');
    expect(fs.writeFileSync).toHaveBeenCalledWith('/dummy/.gitignore', 'node_modules\n.env');
    expect(loading.stop).toHaveBeenCalledWith('timer');
    expect(result).toBe('/dummy/.gitignore');
  });

  it('should handle non-ok fetch response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as never);
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['invalid'], directory: '/dummy' };

    await expect(downloadFile(options)).rejects.toThrow(
      'Download failed: Failed to fetch from gitignore.io: Not Found',
    );
    expect(loading.stop).toHaveBeenCalledWith('timer');
  });

  it('should handle download errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error') as never);
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['invalid'], directory: '/dummy' };

    await expect(downloadFile(options)).rejects.toThrow('Download failed: Network Error');
    expect(loading.stop).toHaveBeenCalledWith('timer');
  });
});

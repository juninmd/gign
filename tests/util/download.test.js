const fs = require('fs');
const path = require('path');
const loading = require('loading-indicator');

jest.mock('fs');
jest.mock('path');
jest.mock('loading-indicator');

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');
const downloadFile = require('../../src/util/download');

describe('download utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download tags and save to .gitignore', async () => {
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('node_modules\n.env')
    });
    fs.writeFileSync.mockImplementation(() => {});
    path.join.mockReturnValue('/dummy/.gitignore');
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['node', 'react'], directory: '/dummy' };
    const result = await downloadFile(options);

    expect(loading.start).toHaveBeenCalledWith('Download...');
    expect(fetch).toHaveBeenCalledWith('https://www.toptal.com/developers/gitignore/api/node,react');
    expect(fs.writeFileSync).toHaveBeenCalledWith('/dummy/.gitignore', 'node_modules\n.env');
    expect(loading.stop).toHaveBeenCalledWith('timer');
    expect(result).toBe('/dummy/.gitignore');
  });

  it('should handle non-ok fetch response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found'
    });
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['invalid'], directory: '/dummy' };

    await expect(downloadFile(options)).rejects.toThrow('Download failed: Failed to fetch from gitignore.io: Not Found');
    expect(loading.stop).toHaveBeenCalledWith('timer');
  });

  it('should handle download errors', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['invalid'], directory: '/dummy' };

    await expect(downloadFile(options)).rejects.toThrow('Download failed: Network Error');
    expect(loading.stop).toHaveBeenCalledWith('timer');
  });
});

const fs = require('fs');
const path = require('path');
const loading = require('loading-indicator');

jest.mock('fs');
jest.mock('path');
jest.mock('loading-indicator');

// We have to mock 'download' before importing the file because it fails internally otherwise
jest.mock('download', () => jest.fn());
const downloadFile = require('../../src/util/download');
const download = require('download');

describe('download utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download tags and save to .gitignore', async () => {
    download.mockResolvedValue('node_modules\n.env');
    fs.writeFileSync.mockImplementation(() => {});
    path.join.mockReturnValue('/dummy/.gitignore');
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['node', 'react'], directory: '/dummy' };
    const result = await downloadFile(options);

    expect(loading.start).toHaveBeenCalledWith('Download...');
    expect(download).toHaveBeenCalledWith('https://www.gitignore.io/api/node,react');
    expect(fs.writeFileSync).toHaveBeenCalledWith('/dummy//.gitignore', 'node_modules\n.env');
    expect(loading.stop).toHaveBeenCalledWith('timer');
    expect(result).toBe('/dummy/.gitignore');
  });

  it('should handle download errors', async () => {
    download.mockRejectedValue(new Error('Network Error'));
    loading.start.mockReturnValue('timer');
    loading.stop.mockImplementation(() => {});

    const options = { tags: ['invalid'], directory: '/dummy' };

    await expect(downloadFile(options)).rejects.toThrow('Network Error');
    expect(loading.stop).toHaveBeenCalledWith('timer');
  });
});

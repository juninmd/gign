const os = require('../../src/util/os');
const osModule = require('os');

jest.mock('os');

describe('os utility', () => {
  it('should return "windows" for Windows_NT', () => {
    osModule.type.mockReturnValue('Windows_NT');
    expect(os()).toBe('windows');
  });

  it('should return "linux" for Linux', () => {
    osModule.type.mockReturnValue('Linux');
    expect(os()).toBe('linux');
  });

  it('should return "macos" for other OS like Darwin', () => {
    osModule.type.mockReturnValue('Darwin');
    expect(os()).toBe('macos');
  });
});

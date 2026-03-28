import { jest } from '@jest/globals';

jest.unstable_mockModule('os', () => ({
  default: {
    type: jest.fn(),
  },
}));

describe('os utility', () => {
  let osModule: typeof import('os');
  let getOS: typeof import('../../src/util/os.js').default;

  beforeAll(async () => {
    osModule = (await import('os')).default;
    getOS = (await import('../../src/util/os.js')).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "windows" for Windows_NT', () => {
    (osModule.type as jest.Mock).mockReturnValue('Windows_NT');
    expect(getOS()).toBe('windows');
  });

  it('should return "linux" for Linux', () => {
    (osModule.type as jest.Mock).mockReturnValue('Linux');
    expect(getOS()).toBe('linux');
  });

  it('should return "macos" for other OS like Darwin', () => {
    (osModule.type as jest.Mock).mockReturnValue('Darwin');
    expect(getOS()).toBe('macos');
  });
});

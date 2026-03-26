import os from 'os';

export default function getOS(): string {
  switch (os.type()) {
    case 'Windows_NT':
      return 'windows';
    case 'Linux':
      return 'linux';
    default:
      return 'macos';
  }
}

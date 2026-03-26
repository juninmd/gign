import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import loading from 'loading-indicator';

interface DownloadOptions {
  tags: string[];
  directory: string;
}

export default async function downloadFile(options: DownloadOptions): Promise<string> {
  const timer = loading.start('Download...');
  try {
    const res = await fetch(`https://www.toptal.com/developers/gitignore/api/${options.tags.join(',')}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch from gitignore.io: ${res.statusText}`);
    }
    const data = await res.text();
    loading.stop(timer);
    const outputPath = path.join(options.directory, '.gitignore');
    fs.writeFileSync(outputPath, data);
    return outputPath;
  } catch (err: any) {
    loading.stop(timer);
    throw new Error(`Download failed: ${err.message}`);
  }
}

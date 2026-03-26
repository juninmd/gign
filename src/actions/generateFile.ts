import getOS from '../util/os.js';
import downloadFile from '../util/download.js';
import getProjectTags from '../util/project.js';
import fs from 'fs';
import path from 'path';

export default async function generateFile(dir: string): Promise<void> {
  try {
    if (!dir || typeof dir !== 'string') {
      console.warn('[gign] Invalid directory path');
      return;
    }

    const resolvedDir = path.resolve(dir);

    if (!fs.existsSync(resolvedDir)) {
      console.warn('[gign] Directory does not exist');
      return;
    }

    const stat = fs.statSync(resolvedDir);
    if (!stat.isDirectory()) {
      console.warn('[gign] Path is not a directory');
      return;
    }

    const tags: string[] = [getOS()];

    const [projectTags, ignoreManual] = getProjectTags(resolvedDir);

    tags.push(...projectTags);

    const outputPath = await downloadFile({
      directory: resolvedDir,
      tags,
    });

    let structManual = '';
    Object.keys(ignoreManual).forEach((q) => {
      const i = ignoreManual[q];
      if (i) {
        structManual += `# ${q}${os.EOL}${i.values.join(os.EOL)}${os.EOL}`;
      }
    });

    if (structManual) fs.appendFileSync(outputPath, structManual);

    const securityLines = `
# Environment and secrets
.env
.env.local
.env.*.local
*.key
*.pem
*.p12
secrets/
config/secrets.yml
`;
    fs.appendFileSync(outputPath, securityLines);

    if (Object.keys(ignoreManual).length === 0 && projectTags.length === 0) {
      console.info(`[gign] nothing detected (only security defaults applied)`);
      return;
    }

    console.info(`[gign] generated at ${outputPath}`);
    if (projectTags.length > 0) console.info(`[gign] tags: ${tags.join(',')}`);
    if (Object.keys(ignoreManual).length > 0)
      console.info(`[gign] manual tags: ${Object.keys(ignoreManual).join(',')}`);
  } catch (ex: any) {
    console.error(`[gign] Error: ${ex.message}`);
  }
}

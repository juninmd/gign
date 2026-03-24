const os = require('../util/os');
const download = require('../util/download');
const project = require('../util/project');
const fs = require('fs');
const path = require('path');

async function doit(dir) {
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

    let tags = [os()];

    let [projectTags, ignoreManual] = project(resolvedDir);

    tags.push(...projectTags);

    let outputPath = await download({
      directory: resolvedDir,
      tags,
    });

    let structManual = '';
    Object.keys(ignoreManual).map((q) => {
      let i = ignoreManual[q];
      structManual += `# ${q}\r\n${i.values.join('\r\n')}`;
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

    if (Object.keys(ignoreManual).length == 0 && projectTags.length == 0) {
      console.info(`[gign] nothing detected (only security defaults applied)`);
      return;
    }

    console.info(`[gign] generated at ${outputPath}`);
    if (projectTags.length > 0) console.info(`[gign] tags: ${tags}`);
    if (Object.keys(ignoreManual).length > 0) console.info(`[gign] manual tags: ${Object.keys(ignoreManual)}`);
  } catch (ex) {
    console.error(`[gign] Error: ${ex.message}`);
  }
}

module.exports = (dir) => {
  return doit(dir);
};

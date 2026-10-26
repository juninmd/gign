import fs from 'fs';
import path from 'path';
import getOS from '../util/os.js';
import getProjectTags from '../util/project.js';
import { buildSections, renderSections } from '../util/templates.js';

const SECURITY_LINES = [
  '.env',
  '.env.*',
  '!.env.example',
  '!.env.sample',
  '!.env.template',
  '.env.local',
  '.env.*.local',
  '*.key',
  '*.pem',
  '*.p12',
  '*.pfx',
  '*.jks',
  '*.keystore',
  'id_rsa',
  'id_ed25519',
  'credentials.json',
  'service-account*.json',
  'secrets/',
  'config/secrets.yml',
  '*.tfvars',
];

/** Writes the .gitignore for `dir`. Resolves to false when the run failed. */
export default async function generateFile(dir: string): Promise<boolean> {
  try {
    if (!dir || typeof dir !== 'string') {
      console.warn('[gign] Invalid directory path');
      return false;
    }

    const resolvedDir = path.resolve(dir);

    if (!fs.existsSync(resolvedDir)) {
      console.warn('[gign] Directory does not exist');
      return false;
    }

    if (!fs.statSync(resolvedDir).isDirectory()) {
      console.warn('[gign] Path is not a directory');
      return false;
    }

    const [projectTags, ignoreManual] = getProjectTags(resolvedDir);
    const tags = [getOS(), ...projectTags];

    const { sections, missing } = buildSections(tags);
    const manualTags = Object.keys(ignoreManual);
    for (const tag of manualTags) {
      sections.push({ title: `${tag} (project)`, lines: ignoreManual[tag]?.values ?? [] });
    }
    sections.push({ title: 'Environment and secrets', lines: SECURITY_LINES });

    const outputPath = path.join(resolvedDir, '.gitignore');
    fs.writeFileSync(outputPath, renderSections(sections));

    if (manualTags.length === 0 && projectTags.length === 0) {
      console.info(`[gign] nothing detected (only OS and security defaults applied)`);
      return true;
    }

    console.info(`[gign] generated at ${outputPath}`);
    if (projectTags.length > 0) console.info(`[gign] tags: ${tags.join(',')}`);
    if (manualTags.length > 0) console.info(`[gign] manual tags: ${manualTags.join(',')}`);
    if (missing.length > 0) console.info(`[gign] no bundled rules for: ${missing.join(',')}`);
    return true;
  } catch (ex: unknown) {
    console.error(`[gign] Error: ${ex instanceof Error ? ex.message : String(ex)}`);
    return false;
  }
}

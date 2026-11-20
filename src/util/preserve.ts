import fs from 'fs';
import templates from '../data/templates.json' with { type: 'json' };
import rules from '../data/rules.json' with { type: 'json' };

export const CUSTOM_TITLE = 'Custom rules (preserved)';
export const SECURITY_TITLE = 'Environment and secrets';

const HEADER = /^### (.+) ###$/;
const gignTitles = new Set([...Object.keys(templates), ...Object.keys(rules), SECURITY_TITLE]);

/**
 * Only headers gign itself writes mark a regenerated section. gitignore.io ("### Node ###") and
 * hand-written files use the same shape, and their rules must not be dropped.
 */
const isGeneratedHeader = (line: string): boolean => {
  const title = HEADER.exec(line)?.[1];
  return title !== undefined && (gignTitles.has(title) || title.endsWith(' (project)'));
};
const isPattern = (line: string): boolean => line.trim() !== '' && !line.trimStart().startsWith('#');

/**
 * Returns the rules of an existing .gitignore that gign would otherwise destroy: every rule of a
 * hand-written file (no gign section header yet), or the rules kept under the preserved section of
 * a previous run. Rules in gign-generated sections are regenerated, so they are not returned.
 */
export function readCustomRules(file: string): string[] {
  let content: string;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return [];
    throw error;
  }

  const lines = content.split(/\r?\n/);
  const custom: string[] = [];
  let inCustom = true;
  for (const line of lines) {
    if (line === `### ${CUSTOM_TITLE} ###`) inCustom = true;
    else if (isGeneratedHeader(line)) inCustom = false;
    else if (HEADER.test(line)) inCustom = true;
    else if (inCustom && isPattern(line)) custom.push(line.trimEnd());
  }
  return custom;
}

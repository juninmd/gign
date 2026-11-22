import fs from 'fs';
import templates from '../data/templates.json' with { type: 'json' };
import rules from '../data/rules.json' with { type: 'json' };
import type { Section } from './templates.js';

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
 * hand-written file (no gign section header yet), the rules kept under the preserved section of
 * a previous run, and rules the user added inside a section that `generated` writes again (e.g.
 * appended at the end of the file). Sections not regenerated in this run are dropped entirely.
 */
export function readCustomRules(file: string, generated: Section[] = []): string[] {
  let content: string;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return [];
    throw error;
  }

  const lines = content.split(/\r?\n/);
  const custom: string[] = [];
  const regenerated = new Map(generated.map(({ title, lines: rules }) => [title, new Set(rules.map((r) => r.trim()))]));
  // Decides whether a rule under the current header is the user's; regenerated rules are not.
  let isCustom = (_rule: string): boolean => true;
  for (const line of lines) {
    if (line === `### ${CUSTOM_TITLE} ###` || (HEADER.test(line) && !isGeneratedHeader(line))) isCustom = () => true;
    else if (isGeneratedHeader(line)) {
      const known = regenerated.get(HEADER.exec(line)?.[1] ?? '');
      isCustom = known ? (rule) => !known.has(rule) : () => false;
    } else if (isPattern(line) && isCustom(line.trim())) custom.push(line.trimEnd());
  }
  return custom;
}

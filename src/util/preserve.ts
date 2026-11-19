import fs from 'fs';

export const CUSTOM_TITLE = 'Custom rules (preserved)';

const GENERATED_HEADER = /^### .+ ###$/;
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
  const generated = lines.some((line) => GENERATED_HEADER.test(line));
  const custom: string[] = [];
  let inCustom = !generated;
  for (const line of lines) {
    if (GENERATED_HEADER.test(line)) inCustom = line === `### ${CUSTOM_TITLE} ###`;
    else if (inCustom && isPattern(line)) custom.push(line.trimEnd());
  }
  return custom;
}

import templates from '../data/templates.json' with { type: 'json' };
import rules from '../data/rules.json' with { type: 'json' };

export interface Section {
  title: string;
  lines: string[];
}

interface Rule {
  use?: string[];
  lines?: string[];
}

const bundled = templates as Record<string, string>;
const bundledRules = rules as Record<string, Rule>;

const isPattern = (line: string): boolean => line.trim() !== '' && !line.trimStart().startsWith('#');

/**
 * Resolves the bundled ignore rules of a tag: its own template (if any), the templates it reuses
 * and its curated extra lines. Returns an empty array when the tag has nothing bundled.
 */
export function resolveTag(tag: string): string[] {
  const rule = bundledRules[tag];
  const sources = [bundled[tag], ...(rule?.use ?? []).map((name) => bundled[name])];
  const lines = sources.filter((s): s is string => Boolean(s)).flatMap((s) => s.split('\n'));
  if (rule?.lines?.length) lines.push(...rule.lines);
  return lines;
}

/**
 * Joins sections into a single .gitignore body. Patterns repeated by later sections are dropped
 * (and blocks left without patterns are removed), so overlapping templates do not duplicate rules.
 */
export function renderSections(sections: Section[]): string {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const { title, lines } of sections) {
    const blocks: string[][] = [[]];
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (line.trim() === '') blocks.push([]);
      else blocks[blocks.length - 1]!.push(line);
    }

    const kept: string[][] = [];
    for (const block of blocks) {
      const hadPatterns = block.some(isPattern);
      const filtered = block.filter((line) => {
        if (!isPattern(line)) return true;
        const key = line.trim();
        // Negations depend on position, so they are never treated as duplicates
        if (key.startsWith('!')) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      if (filtered.length > 0 && (!hadPatterns || filtered.some(isPattern))) kept.push(filtered);
    }

    if (kept.length === 0) continue;
    out.push(`### ${title} ###`, ...kept.flatMap((block, i) => (i === 0 ? block : ['', ...block])), '');
  }

  return out.length ? `${out.join('\n').trimEnd()}\n` : '';
}

/** Builds the sections for the given tags, also reporting tags that have no bundled rules. */
export function buildSections(tags: string[]): { sections: Section[]; missing: string[] } {
  const sections: Section[] = [];
  const missing: string[] = [];
  for (const tag of new Set(tags)) {
    const lines = resolveTag(tag);
    if (lines.length === 0) missing.push(tag);
    else sections.push({ title: tag, lines });
  }
  return { sections, missing };
}

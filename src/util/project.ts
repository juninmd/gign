import fs from 'fs';
import path from 'path';
import pattern from '../../pattern.json' with { type: 'json' };
import manual from '../../manual.json' with { type: 'json' };

export interface IgnorePaths {
  [key: string]: { values: string[] };
}

export interface PatternConfig {
  [key: string]: string[];
}

export interface ManualSearch {
  filename: string;
  path?: string;
  struct?: string;
}

export interface ManualConfig {
  tag: string;
  search: ManualSearch[];
}

interface CustomConfig {
  pattern?: PatternConfig[];
  manual?: ManualConfig[];
}

const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const globCache = new Map<string, RegExp>();

/** Converts a simple glob (`*` and `?`) into an anchored regular expression. */
function globToRegExp(glob: string): RegExp {
  let regex = globCache.get(glob);
  if (!regex) {
    const source = glob
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    regex = new RegExp(`^${source}$`);
    globCache.set(glob, regex);
  }
  return regex;
}

/** Returns the entries of `dir` matching `query` (glob on names, or exact relative path when it has a slash). */
function findMatches(dir: string, files: string[], query: string): string[] {
  if (query.includes('/') || query.includes('\\')) {
    return fs.existsSync(path.join(dir, query)) ? [query] : [];
  }
  if (query.includes('*') || query.includes('?')) {
    const regex = globToRegExp(query);
    return files.filter((f) => regex.test(f));
  }
  return files.includes(query) ? [query] : [];
}

function readCustomConfig(file: string, label: string, pick: (json: any) => CustomConfig | undefined): CustomConfig {
  if (!fs.existsSync(file)) return {};
  try {
    return pick(JSON.parse(fs.readFileSync(file, 'utf8'))) ?? {};
  } catch (error: unknown) {
    console.warn(`[gign] Failed to parse ${label}: ${errorMessage(error)}`);
    return {};
  }
}

function accessAttrObj(obj: Record<string, unknown>, struct: string): unknown {
  return struct.split('.').reduce<unknown>((current, attr) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[attr] : undefined;
  }, obj);
}

export default function getProjectTags(dir: string): [string[], IgnorePaths] {
  const tags = new Set<string>();
  const ignorePaths: IgnorePaths = {};

  const files = fs.readdirSync(dir);

  if (!files.includes('.git')) {
    console.warn('[gign] Initialize a git repository, use "git init" command');
  }

  const customConfigs = [
    readCustomConfig(path.join(dir, '.gignrc.json'), '.gignrc.json', (json) => json),
    readCustomConfig(path.join(dir, 'package.json'), 'package.json', (json) => json?.gign),
  ];
  const customPatterns = customConfigs.flatMap((c) => (Array.isArray(c.pattern) ? c.pattern : []));
  const customManuals = customConfigs.flatMap((c) => (Array.isArray(c.manual) ? c.manual : []));

  const allPatterns = [...pattern, ...customPatterns] as PatternConfig[];
  const allManuals = [...manual, ...customManuals] as ManualConfig[];

  for (const entry of allPatterns) {
    const key = Object.keys(entry)[0];
    if (!key || tags.has(key) || !Array.isArray(entry[key])) continue;
    if (entry[key].some((query) => findMatches(dir, files, query).length > 0)) tags.add(key);
  }

  const addValue = (tag: string, value: string) => {
    const bucket = (ignorePaths[tag] ??= { values: [] });
    if (!bucket.values.includes(value)) bucket.values.push(value);
  };

  for (const item of allManuals) {
    if (!item?.tag || !Array.isArray(item.search)) continue;
    for (const query of item.search) {
      const matchedFiles = findMatches(dir, files, query.filename);
      if (matchedFiles.length === 0) continue;

      // Register the tag even when nothing is collected, mirroring the detection result
      ignorePaths[item.tag] ??= { values: [] };

      if (query.struct) {
        for (const file of matchedFiles) {
          try {
            const obj = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
            const found = accessAttrObj(obj as Record<string, unknown>, query.struct);
            const values = Array.isArray(found) ? found : [found];
            values
              .filter((v): v is string => typeof v === 'string' && v.length > 0)
              .forEach((v) => addValue(item.tag, v));
          } catch (error: unknown) {
            console.error(
              `[gign] error on model of ${item.tag}, struct: ${query.struct}, file: ${file}: ${errorMessage(error)}`,
            );
          }
        }
      } else if (query.path) {
        addValue(item.tag, query.path);
      }
    }
  }

  return [[...tags], ignorePaths];
}

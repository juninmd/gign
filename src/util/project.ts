import fs from 'fs';
import path from 'path';
import pattern from '../../pattern.json' with { type: 'json' };
import manual from '../../manual.json' with { type: 'json' };

export interface IgnorePaths {
  [key: string]: { values: string[] };
}

export default function getProjectTags(dir: string): [string[], IgnorePaths] {
  const tags: string[] = [];
  const ignorePaths: IgnorePaths = {};

  const files = fs.readdirSync(dir);

  if (!files.includes('.git')) {
    console.warn('[gign] Initialize a git repository, use "git init" command');
  }

  // Load custom configuration if available
  const customPattern: any[] = [];
  const customManual: any[] = [];
  const customConfigPath = path.join(dir, '.gignrc.json');
  if (fs.existsSync(customConfigPath)) {
    try {
      const customConfig = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
      if (customConfig.pattern && Array.isArray(customConfig.pattern)) {
        customPattern.push(...customConfig.pattern);
      }
      if (customConfig.manual && Array.isArray(customConfig.manual)) {
        customManual.push(...customConfig.manual);
      }
    } catch (error: any) {
      console.warn(`[gign] Failed to parse .gignrc.json: ${error.message}`);
    }
  }

  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.gign) {
        if (pkg.gign.pattern && Array.isArray(pkg.gign.pattern)) {
          customPattern.push(...pkg.gign.pattern);
        }
        if (pkg.gign.manual && Array.isArray(pkg.gign.manual)) {
          customManual.push(...pkg.gign.manual);
        }
      }
    } catch (error: any) {
      console.warn(`[gign] Failed to parse package.json: ${error.message}`);
    }
  }

  const allPatterns = [...pattern, ...customPattern];
  const allManuals = [...manual, ...customManual];

  allPatterns.forEach((q: any) => {
    const key = Object.keys(q)[0];
    if (!key) return;
    const itens: string[] = q[key];
    const hasMatch = itens.some((r: string) => {
      if (r.startsWith('*')) {
        const ext = r.substring(1);
        return files.some((f) => f.endsWith(ext));
      }
      if (r.endsWith('*')) {
        const prefix = r.substring(0, r.length - 1);
        return files.some((f) => f.startsWith(prefix));
      }
      if (r.includes('/') || r.includes('\\')) {
        return fs.existsSync(path.join(dir, r));
      }
      return files.includes(r);
    });
    if (hasMatch && !tags.includes(key)) tags.push(key);
  });

  allManuals.forEach((item: any) => {
    item.search.forEach((q: any) => {
      let matchedFiles: string[] = [];
      if (q.filename.startsWith('*')) {
        const ext = q.filename.substring(1);
        matchedFiles = files.filter((f) => f.endsWith(ext));
      } else if (q.filename.endsWith('*')) {
        const prefix = q.filename.substring(0, q.filename.length - 1);
        matchedFiles = files.filter((f) => f.startsWith(prefix));
      } else {
        if (q.filename.includes('/') || q.filename.includes('\\')) {
          if (fs.existsSync(path.join(dir, q.filename))) {
            matchedFiles = [q.filename];
          }
        } else if (files.includes(q.filename)) {
          matchedFiles = [q.filename];
        }
      }

      if (matchedFiles.length > 0) {
        if (!ignorePaths[item.tag]) {
          ignorePaths[item.tag] = { values: [] };
        }

        if (q.struct) {
          matchedFiles.forEach((f) => {
            try {
              const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
              ignorePaths[item.tag]!.values.push(acessAttrObj(obj, q.struct));
            } catch (error: any) {
              console.error(`[gign] error on model of ${item.tag}, struct: ${q.struct}, file: ${f}`);
            }
          });
        } else if (q.path) {
          ignorePaths[item.tag]!.values.push(q.path);
        }
      }
    });
  });

  return [tags, ignorePaths];
}

function acessAttrObj(obj: any, struct: string): any {
  const attrs = struct.split('.');
  let current = obj;
  attrs.forEach((att) => {
    if (current) current = current[att];
  });
  return current;
}

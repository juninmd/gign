#!/usr/bin/env node
// Regenerates src/data/templates.json from the public github/gitignore repository (CC0-1.0).
// Usage: node scripts/sync-templates.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'templates.json');
const tmp = mkdtempSync(path.join(tmpdir(), 'gign-templates-'));

try {
  execFileSync('git', ['clone', '--depth', '1', 'https://github.com/github/gitignore.git', tmp], { stdio: 'inherit' });

  const found = [];
  const walk = (dir, depth) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, depth + 1);
      else if (entry.name.endsWith('.gitignore'))
        found.push({ name: entry.name.slice(0, -10).toLowerCase(), full, depth });
    }
  };
  walk(tmp, 0);

  // Shallower files win on name clashes (root > Global > community/*)
  found.sort((a, b) => a.depth - b.depth || a.full.localeCompare(b.full));
  const templates = {};
  for (const { name, full } of found) {
    templates[name] ??= readFileSync(full, 'utf8').replace(/\r\n/g, '\n').trimEnd();
  }

  const sorted = Object.fromEntries(Object.entries(templates).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(outFile, `${JSON.stringify(sorted, null, 1)}\n`);
  console.info(`[sync] ${Object.keys(sorted).length} templates -> ${path.relative(process.cwd(), outFile)}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

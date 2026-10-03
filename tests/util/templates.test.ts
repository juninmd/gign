import { buildSections, renderSections, resolveTag } from '../../src/util/templates.js';

describe('templates utility', () => {
  it('resolves bundled templates, reused templates and extra lines', () => {
    expect(resolveTag('node')).toContain('node_modules/');
    expect(resolveTag('vite')).toEqual(expect.arrayContaining(['node_modules/', 'dist-ssr/']));
    expect(resolveTag('androidstudio').join('\n')).toContain('.idea');
  });

  it('returns nothing for unknown tags', () => {
    expect(resolveTag('definitely-not-a-tag')).toEqual([]);
  });

  it('builds sections and reports missing tags without duplicates', () => {
    const { sections, missing } = buildSections(['node', 'node', 'unknown-tag']);
    expect(sections.map((s) => s.title)).toEqual(['node']);
    expect(missing).toEqual(['unknown-tag']);
  });

  it('drops patterns repeated by later sections and orphaned comments', () => {
    const output = renderSections([
      { title: 'a', lines: ['# first', 'dist/', '.DS_Store'] },
      { title: 'b', lines: ['# repeated', 'dist/', '', '# kept', 'build/'] },
    ]);
    expect(output).toBe('### a ###\n# first\ndist/\n.DS_Store\n\n### b ###\n# kept\nbuild/\n');
  });

  it('keeps negations and skips sections that end up empty', () => {
    const output = renderSections([
      { title: 'a', lines: ['.vscode/*', '!.vscode/settings.json'] },
      { title: 'b', lines: ['.vscode/*', '!.vscode/settings.json'] },
      { title: 'empty', lines: [] },
    ]);
    expect(output).toBe('### a ###\n.vscode/*\n!.vscode/settings.json\n\n### b ###\n!.vscode/settings.json\n');
    expect(renderSections([])).toBe('');
  });
});

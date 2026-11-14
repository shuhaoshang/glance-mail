import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const directory = new URL('../src/data/', import.meta.url);
const personas = new Map();
const sources = new Map(
  ['maya', 'daniel', 'sarah'].map((id) => {
    const data = JSON.parse(
      readFileSync(new URL(`${id}.json`, directory), 'utf8'),
    );
    personas.set(id, data);
    const filename = fileURLToPath(new URL(`${id}.json.check.ts`, directory));
    const source = [
      "import type { Persona } from './types';",
      `const persona = ${JSON.stringify(data, null, 2)} satisfies Persona & { id: '${id}'; $schema?: string };`,
      'export default persona;',
    ].join('\n');

    return [filename, source];
  }),
);

const options = {
  strict: true,
  noEmit: true,
  exactOptionalPropertyTypes: true,
  noUncheckedIndexedAccess: true,
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
  types: [],
};
const host = ts.createCompilerHost(options);
const readSourceFile = host.getSourceFile.bind(host);

// Virtual source files preserve JSON literal types without generated files.
host.getSourceFile = (filename, languageVersion, ...rest) => {
  const source = sources.get(filename);
  if (source !== undefined) {
    return ts.createSourceFile(filename, source, languageVersion);
  }
  return readSourceFile(filename, languageVersion, ...rest);
};

const program = ts.createProgram({
  rootNames: [...sources.keys()],
  options,
  host,
});
const diagnostics = ts.getPreEmitDiagnostics(program);

if (diagnostics.length > 0) {
  process.stderr.write(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, host),
  );
  process.exitCode = 1;
} else {
  const failures = [];
  for (const [id, persona] of personas) {
    const check = (condition, message) => {
      if (!condition) failures.push(`${id}.json: ${message}`);
    };
    const { items, goodToKnow, otherMail, doneBefore, watchlist } = persona;
    const expectedCoverage =
      items.filter((item) => !item.isNew).length +
      goodToKnow.length +
      otherMail.total +
      doneBefore.length;
    check(
      persona.coverage.emails === expectedCoverage,
      `coverage.emails must equal the morning item, Heads-up, Other mail, and done counts (expected ${expectedCoverage}, received ${persona.coverage.emails}).`,
    );
    const visibleRows = otherMail.rows.filter((row) => !row.isNew).length;
    check(
      otherMail.total >= visibleRows,
      `otherMail.total must cover all rows not marked isNew (at least ${visibleRows}, received ${otherMail.total}).`,
    );

    const watchIds = new Set(watchlist.map((entry) => entry.id));
    const emailIds = new Set(
      [...items, ...goodToKnow].map((entry) => entry.id),
    );
    const allIds = new Set();
    for (const [collection, entries] of [
      ['items', items],
      ['goodToKnow', goodToKnow],
      ['otherMail.rows', otherMail.rows],
    ]) {
      entries.forEach((entry, index) => {
        const path = `${collection}[${index}]`;
        check(
          !allIds.has(entry.id),
          `${path}.id duplicates email id "${entry.id}".`,
        );
        allIds.add(entry.id);
        if (entry.watch !== undefined)
          check(
            watchIds.has(entry.watch),
            `${path}.watch must reference a watchlist id (received "${entry.watch}").`,
          );
      });
    }
    watchlist.forEach((entry, index) => {
      const hasItem = entry.item !== undefined;
      const expectsItem = entry.news > 0;
      check(
        hasItem === expectsItem,
        `watchlist[${index}].item must be present exactly when news is greater than 0.`,
      );
      if (hasItem)
        check(
          emailIds.has(entry.item),
          `watchlist[${index}].item must reference an items or goodToKnow id (received "${entry.item}").`,
        );
    });
    goodToKnow.forEach((entry, index) => {
      const { pre, hl, post } = entry.fact.source;
      const emailText = entry.email.paras
        .map((paragraph) =>
          paragraph
            .map((segment) =>
              typeof segment === 'string' ? segment : segment.t,
            )
            .join(''),
        )
        .join('\n\n');
      check(
        emailText.includes(pre + hl + post),
        `goodToKnow[${index}].email must contain the exact fact.source sentence.`,
      );
    });
    otherMail.rows.forEach((row, index) => {
      check(
        row.paras.some((paragraph) =>
          paragraph.some(
            (segment) => typeof segment !== 'string' && segment.kind === 'judg',
          ),
        ),
        `otherMail.rows[${index}].paras must include at least one judg segment.`,
      );
    });
  }
  if (failures.length) {
    process.stderr.write(failures.join('\n') + '\n');
    process.exitCode = 1;
  } else {
    console.log(
      'Validated all three persona files against src/data/types.ts and the Version 2 relationships.',
    );
  }
}

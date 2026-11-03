import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const directory = new URL('../src/data/', import.meta.url);
const sources = new Map(
  ['maya', 'daniel', 'sarah'].map((id) => {
    const data = JSON.parse(
      readFileSync(new URL(`${id}.json`, directory), 'utf8'),
    );
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
  console.log('Validated all three persona files against src/data/types.ts.');
}

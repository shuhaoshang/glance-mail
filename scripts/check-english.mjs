import language from './american-spellings.json' with { type: 'json' };
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readlinkSync } from 'node:fs';

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
process.chdir(root);

const paths = execFileSync(
  'git',
  ['ls-files', '--cached', '--deduplicate', '-z'],
  {
    encoding: 'utf8',
  },
)
  .split('\0')
  .filter(Boolean);

const cjk =
  /[\u2e80-\u303f\u31c0-\u33ff\u3400-\u4dbf\u4e00-\u9fff\ufe30-\ufe4f\uff00-\uffef]|\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}|\p{Script=Bopomofo}/u;
const decoder = new TextDecoder('utf-8', { fatal: true });
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
const { words: spellings, legacyStoryPrefix } = language;
let failures = 0;

function report(path, message) {
  const escaped = JSON.stringify(path).replace(
    /[^\x20-\x7e]/gu,
    (character) => {
      return `\\u{${character.codePointAt(0).toString(16)}}`;
    },
  );
  console.error(`${escaped}: ${message}`);
  failures += 1;
}

function checkText(path, content) {
  const match = cjk.exec(content);
  if (match) {
    const line = content.slice(0, match.index).split('\n').length;
    const codePoint = match[0].codePointAt(0).toString(16).toUpperCase();
    report(path, `CJK character U+${codePoint} on line ${line}.`);
  }
  // The dictionary explicitly lists the forms it detects.
  if (path === 'scripts/american-spellings.json') return;
  for (const [index, line] of content.split('\n').entries()) {
    // A public bookmark still uses the previous story ID.
    const text =
      path === '.storybook/manager-head.html'
        ? line.replaceAll(legacyStoryPrefix, '')
        : line;
    const words =
      text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .match(/[a-z]+/g) ?? [];
    for (const word of new Set(words)) {
      if (Object.hasOwn(spellings, word)) {
        report(
          path,
          `Use "${spellings[word]}" instead of "${word}" on line ${index + 1}.`,
        );
      }
    }
  }
}

const stdin = process.argv.includes('--stdin');
if (stdin) checkText('stdin', readFileSync(0, 'utf8'));

for (const path of stdin ? [] : paths) {
  checkText('file path', path);

  let bytes;
  try {
    const stat = lstatSync(path);
    bytes = stat.isSymbolicLink()
      ? Buffer.from(readlinkSync(path), 'utf8')
      : readFileSync(path);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  if (
    bytes.subarray(0, pngSignature.length).equals(pngSignature) ||
    bytes.subarray(0, jpegSignature.length).equals(jpegSignature)
  ) {
    continue;
  }

  let content;
  try {
    content = decoder.decode(bytes);
  } catch {
    report(path, 'Expected UTF-8 text or a PNG/JPEG reference image.');
    continue;
  }

  checkText(path, content);
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(
    stdin
      ? 'American English check passed.'
      : `English check passed for ${paths.length} tracked paths.`,
  );
}

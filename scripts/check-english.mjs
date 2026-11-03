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

for (const path of paths) {
  if (cjk.test(path)) {
    report(path, 'CJK character in file path.');
  }

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

  const match = cjk.exec(content);
  if (match) {
    const line = content.slice(0, match.index).split('\n').length;
    const codePoint = match[0].codePointAt(0).toString(16).toUpperCase();
    report(path, `CJK character U+${codePoint} on line ${line}.`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`English check passed for ${paths.length} tracked paths.`);
}

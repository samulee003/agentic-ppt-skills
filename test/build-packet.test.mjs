import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { buildPacket, themeId } from '../skills/make-presentation/scripts/build-packet.mjs';

const execFileAsync = promisify(execFile);
const script = path.resolve(
  new URL('../skills/make-presentation/scripts/build-packet.mjs', import.meta.url).pathname,
);

const storyboard = `| Slide | Action title | Archetype | Audience job | Evidence ID | Speaker transition | Time | Main / backup |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Churn rose four points after the price change | data | See the problem | E1 | next | 2 | main |
| 2 | Three levers can win customers back | cards | Choose | — | next | 2 | main |
| 3 | Regional breakdown by quarter | data | Reference | E1 | — | 1 | backup |`;
const script_ = `| Page | Approved wording | Time |
| --- | --- | --- |
| 1 | Churn went up right after March. | 2 |`;
const brief = `- Deck type: \`decision\`\n- Primary audience: leadership team\n- Theme: \`editorial-minimal\`\n- Master or template file (\`.potx\`/\`.pptx\`) or brand guide: brand.potx`;

test('the packet lists main slides with titles, archetypes, sources, and notes', () => {
  const packet = buildPacket({ brief, storyboard, script: script_, theme: '# editorial-minimal\n...' });
  assert.match(packet, /- Deck type: `decision`/);
  assert.match(packet, /### Slide 1: Churn rose four points after the price change/);
  assert.match(packet, /- Archetype: data/);
  assert.match(packet, /- Sources: E1/);
  assert.match(packet, /- Speaker notes: Churn went up right after March\./);
  assert.match(packet, /- Speaker notes: \(to be written at stage-grill\)/);
  assert.match(packet, /Brand template: brand\.potx/);
  assert.match(packet, /# editorial-minimal/);
  assert.doesNotMatch(packet, /Regional breakdown/);
  assert.match(buildPacket({ storyboard, includeBackup: true }), /Regional breakdown/);
});

test('themeId reads the theme from the brief', () => {
  assert.equal(themeId('- Theme: `sticker-pop`'), 'sticker-pop');
  assert.equal(themeId('- Theme: (`make-presentation/themes/<id>.md`)'), null);
  assert.equal(themeId('- Theme: themes/aurora.md'), 'aurora');
});

test('CLI writes BUILD-PACKET.md with the shipped theme inlined', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'build-packet-'));
  try {
    await writeFile(path.join(root, 'STORYBOARD.md'), storyboard);
    await writeFile(path.join(root, 'PRESENTATION-BRIEF.md'), brief);
    await execFileAsync(process.execPath, [script, root]);
    const packet = await readFile(path.join(root, 'BUILD-PACKET.md'), 'utf8');
    assert.match(packet, /```json theme/);
    assert.match(packet, /"id": "editorial-minimal"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('old storyboards are rejected', () => {
  assert.throws(
    () => buildPacket({ storyboard: '| Slide | Main claim |\n| --- | --- |\n| 1 | x |' }),
    /needs "Action title" and "Archetype"/,
  );
});

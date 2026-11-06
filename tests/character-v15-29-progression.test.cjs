const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const auth = fs.readFileSync(path.join(root,'js/app/auth-character.js'),'utf8');
const characterRules = fs.readFileSync(path.join(root,'js/app/character-rules.js'),'utf8');
const trails = fs.readFileSync(path.join(root,'rules/trails-rules.js'),'utf8');
const index = fs.readFileSync(path.join(root,'index.html'),'utf8');
const css = fs.readFileSync(path.join(root,'css/character.css'),'utf8');

test('level up follows class resource gains from the rulebook', () => {
  assert.match(auth, /combatente:\s*\{[^}]*hpPerLevel:\s*4[^}]*pdPerLevel:\s*3[^}]*prPerLevel:\s*2/s);
  assert.match(auth, /especialista:\s*\{[^}]*hpPerLevel:\s*3[^}]*pdPerLevel:\s*3[^}]*prPerLevel:\s*2/s);
  assert.match(auth, /'arcanista-elemental':\s*\{[^}]*hpPerLevel:\s*2[^}]*pdPerLevel:\s*4[^}]*prPerLevel:\s*2/s);
  assert.match(auth, /const hpPerLevel=progression\.hpPerLevel\+vig/);
  assert.match(auth, /hpDelta:direction\*levels\*hpPerLevel/);
  assert.match(auth, /CHARACTER_LEVEL_MILESTONES/);
});

test('identity picker is searchable and trails are filtered by class relation', () => {
  assert.match(auth, /openCharacterIdentityPicker/);
  assert.match(auth, /character-choice-search/);
  assert.match(auth, /filter\(r=>r\.classId===classId\)/);
  assert.match(trails, /"classId": "combatente"/);
  assert.match(trails, /"classId": "especialista"/);
  assert.match(trails, /"classId": "arcanista-elemental"/);
});

test('PR is a real resonance_points field and RD remains separate', () => {
  assert.match(auth, /id="stat-pr"[^>]*resonance_points/);
  assert.match(auth, /<div class="mini-label">RD<\/div>\s*<input id="stat-rd"/s);
  assert.match(characterRules, /'stat-pr':'resonance_points'/);
  assert.match(auth, /resonance_points:\s*\(\)\s*=>\s*int\('stat-pr',3\)/);
});

test('unresolved milestones are surfaced instead of inventing mechanics', () => {
  assert.match(auth, /CHARACTER_LEVEL_MILESTONES/);
  assert.match(auth, /Escolhas manuais de atributos, poderes e habilidades não são apagadas automaticamente/);
});

test('mobile-first selector and cache bust are present', () => {
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*character-choice-modal/);
  assert.match(index, /auth-character\.js\?v=15\.42/);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const auth = fs.readFileSync(path.join(root,'js/app/auth-character.js'),'utf8');
const css = fs.readFileSync(path.join(root,'css/character.css'),'utf8');
const index = fs.readFileSync(path.join(root,'index.html'),'utf8');
const styles = fs.readFileSync(path.join(root,'styles.css'),'utf8');

test('origin cards expose description and mechanics without search or accordion', () => {
  assert.match(auth, /edf-origin-summary/);
  assert.match(auth, /rule\.description\|\|rule\.summary/);
  assert.doesNotMatch(auth, /data-choice-toggle/);
  assert.match(css, /edf-origin-details/);
});

test('trail cards are directly selectable and use trail-specific ability rules', () => {
  assert.match(auth, /edf-trail-option/);
  assert.match(auth, /r\.category==='habilidades-trilha'&&r\.trailId===rule\.id/);
  assert.match(auth, /edf-trail-ability-head/);
});

test('level uses direct 1-10 picker and class progression fallback', () => {
  assert.match(auth, /id="char-level-picker"/);
  assert.match(auth, /closest\('#char-level-picker'\)/);
  assert.match(auth, /window\.openLevelUpModal/);
  assert.match(auth, /applySelectedCharacterLevel\(target\)/);
  assert.match(auth, /'arcanista':'arcanista-elemental'/);
});

test('character assets are cache-busted together', () => {
  assert.match(index, /styles\.css\?v=15\.42/);
  assert.match(index, /rules-bundle\.js\?v=15\.42/);
  assert.match(index, /auth-character\.js\?v=15\.42/);
  assert.match(styles, /character\.css\?v=15\.42/);
});

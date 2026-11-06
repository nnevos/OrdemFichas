const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const auth = fs.readFileSync(path.join(root,'js/app/auth-character.js'),'utf8');
const css = fs.readFileSync(path.join(root,'css/character.css'),'utf8');

test('origin class and trail remain directly selectable from the character sheet', () => {
  assert.match(auth, /data-identity-picker=\"\$\{kind\}\"/);
  assert.match(auth, /identity-choice-display/);
  assert.match(auth, /openCharacterIdentityPicker/);
});

test('level is selected directly from 1 to 10 and applies immediately', () => {
  assert.match(auth, /getLevelSelectionPreview\(targetLevel\)/);
  assert.match(auth, /data-level-number=\"\$\{level\}\"/);
  assert.match(auth, /applySelectedCharacterLevel\(target\)/);
  assert.match(auth, /for\(let lvl=current\+1;lvl<=target;lvl\+\+\)/);
  assert.match(auth, /levels\*progression\.pdPerLevel/);
});

test('level down preserves spent current resources and never produces negative values', () => {
  assert.match(auth, /Math\.min\(oldHp,nextHpMax\)/);
  assert.match(auth, /Math\.min\(oldPd,nextPdMax\)/);
  assert.match(auth, /Math\.max\(0,oldPr\+p\.prDelta\)/);
  assert.match(auth, /Escolhas manuais de atributos, poderes e habilidades não são apagadas automaticamente/);
});

test('mobile controls remain touch friendly', () => {
  assert.match(css, /@media\(max-width:640px\)/);
  assert.match(css, /level-direct-select/);
  assert.match(css, /min-height:34px/);
});

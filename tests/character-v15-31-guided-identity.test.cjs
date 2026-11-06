const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const auth = fs.readFileSync(path.join(root,'js/app/auth-character.js'),'utf8');
const css = fs.readFileSync(path.join(root,'css/character.css'),'utf8');

test('identity fields open through a dedicated delegated click handler', () => {
  assert.match(auth, /closest\('\[data-identity-picker\]'\)/);
  assert.match(auth, /window\.openCharacterIdentityPicker\(kind\)/);
  assert.match(auth, /identity-choice-display/);
});

test('origin picker shows description and mechanics without requiring expansion', () => {
  assert.match(auth, /edf-origin-option/);
  assert.match(auth, /edf-origin-summary/);
  assert.match(auth, /rule\.description\|\|rule\.summary/);
  assert.match(auth, /applyOriginGuaranteedSkills/);
  assert.match(auth, /Perícias treinadas/);
});

test('class picker presents rule mechanics and trail picker is class-filtered', () => {
  assert.match(auth, /identity-class-card/);
  assert.match(auth, /edf-trail-option/);
  assert.match(auth, /filter\(r=>r\.classId===classId\)/);
  assert.match(auth, /Agora escolha uma trilha compatível/);
});

test('guided identity choice is saved immediately without redundant formation summary', () => {
  assert.match(auth, /await window\.saveCharacterData\(\{silent:true\}\)/);
  assert.doesNotMatch(auth, /renderCharacterFormationSummary/);
  assert.doesNotMatch(auth, /FORMAÇÃO EDF/);
});

test('picker is mobile first and class layout collapses to one column', () => {
  assert.match(css, /identity-picker-class \.identity-choice-list\{grid-template-columns:repeat\(3/);
  assert.match(css, /@media\(max-width:800px\).*identity-picker-class \.identity-choice-list.*grid-template-columns:1fr/s);
});

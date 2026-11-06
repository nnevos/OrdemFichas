const fs=require('fs');const assert=require('assert');const test=require('node:test');
const enemies=fs.readFileSync('js/combat/enemies.js','utf8');
const css=fs.readFileSync('css/features.css','utf8');
test('skill tree picker suspends and restores parent enemy editor',()=>{
  assert.match(enemies,/suspendEnemyEditorForTreePicker\(editor\)/);
  assert.match(enemies,/restoreEnemyEditorAfterTreePicker\(\)/);
  assert.match(enemies,/picker-suspended/);
  assert.match(enemies,/← Voltar à ficha/);
  assert.match(css,/\.picker-modal\.picker-suspended\{visibility:hidden!important;pointer-events:none!important\}/);
});

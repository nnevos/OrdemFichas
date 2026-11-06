const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const enemies=fs.readFileSync(path.join(root,'js/combat/enemies.js'),'utf8');
const events=fs.readFileSync(path.join(root,'js/core/event-actions.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/features.css'),'utf8');

test('bestiary editor exposes Skill Tree picker',()=>{
  assert.match(enemies,/Adicionar da Árvore/);
  assert.match(enemies,/openEnemySkillTreePicker/);
  assert.match(enemies,/enemySkillTreeCatalogV4/);
});

test('skill tree abilities preserve mechanics in enemy abilities JSON',()=>{
  assert.match(enemies,/source:'skill-tree'/);
  assert.match(enemies,/element:x\.element/);
  assert.match(enemies,/res:x\.res/);
  assert.match(enemies,/range:x\.range/);
  assert.match(enemies,/path:x\.path/);
  assert.match(enemies,/data-skill-meta/);
});

test('enemy tree ability enters normal combat resolution engine',()=>{
  assert.match(enemies,/skill:a/);
  assert.match(enemies,/resonanceInfo\?\.\(skillLike,actorRow\)/);
  assert.match(enemies,/resolutionInfo\?\.\(a\)/);
});

test('picker is searchable and mobile responsive',()=>{
  assert.match(enemies,/Buscar habilidade, caminho ou efeito/);
  assert.match(enemies,/filterEnemySkillTreePicker/);
  assert.match(css,/enemy-tree-skill-grid/);
  assert.match(css,/@media\(max-width:720px\)/);
});

test('new picker actions are allowed by delegated event system',()=>{
  for(const name of ['openEnemySkillTreePicker','closeEnemySkillTreePicker','filterEnemySkillTreePicker','addEnemySkillTreeAbility']) assert.match(events,new RegExp(name));
});

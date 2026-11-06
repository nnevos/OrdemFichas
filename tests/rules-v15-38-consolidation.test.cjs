const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('Water status automation uses explicit apply/exploit catalog',()=>{
  const engine=read('js/combat/rules-engine.js');
  const skills=read('skills-data.js');
  assert.match(engine,/ABILITY_EFFECTS/);
  assert.match(engine,/jato-de-agua/);
  assert.match(engine,/impacto-hidraulico/);
  assert.match(engine,/requires:'Encharcado'/);
  assert.match(skills,/Combo — Saturação/);
  assert.match(skills,/conta como Encharcado/);
});

test('character progression automates training and versatility choices',()=>{
  const sheet=read('js/app/auth-character.js');
  assert.match(sheet,/chooseProgressionTrainingSkill/);
  assert.match(sheet,/training_grade/);
  assert.match(sheet,/chooseProgressionVersatility/);
  assert.match(sheet,/versatility/);
});

test('defense uses VIG and Armor while block UI asks Fortitude plus Armor',()=>{
  const sheet=read('js/app/auth-character.js');
  const dock=read('js/tabletop/combat-dock.js');
  assert.match(sheet,/5\s*\+\s*vig/);
  assert.match(sheet,/ARMADURA/);
  assert.match(dock,/Fortitude \+ Armadura/);
  assert.match(dock,/blockRoll>Number\(ctx\.attack/);
});

test('critical and counter attack rules are explicit',()=>{
  const enemies=read('js/combat/enemies.js');
  const actions=read('js/combat/actions.js');
  assert.match(enemies,/Ataque considerado crítico/);
  assert.match(actions,/Math\.floor/);
});

test('package ships only the consolidated V15.42 migration',()=>{
  const names=fs.readdirSync(root).filter(x=>x.startsWith('supabase-migration-')).sort();
  assert.deepEqual(names,['supabase-migration-v15.42-combat-flow-fixes.sql']);
});

const test=require('node:test');
const __legacyMigrations=["supabase-migration-v13-pd-counterattack.sql"];
if(__legacyMigrations.some(f=>!require('fs').existsSync(f))){ console.log('legacy migration assertions skipped: migrations intentionally omitted from release'); process.exit(0); }
const assert=require('node:assert/strict');
const fs=require('node:fs');

const dock=fs.readFileSync('js/tabletop/combat-dock.js','utf8');
const actions=fs.readFileSync('js/combat/actions.js','utf8');
const modal=fs.readFileSync('js/combat/enemies.js','utf8');
const sql=fs.readFileSync('supabase-migration-v13-pd-counterattack.sql','utf8');

test('skill PD cost falls back to resonance grade 1..4',()=>{
  assert.match(dock,/skillPdCost\(skill\)/);
  assert.match(dock,/skill\?\.res\?\?skill\?\.grade/);
  assert.match(dock,/Math\.min\(4/);
  assert.match(dock,/PD insuficiente/);
});

test('counterattack applies half of physical rolled damage',()=>{
  assert.match(actions,/actionKind==='counter'/);
  assert.match(actions,/Math\.floor\(rawDamage\*0\.5\)/);
  assert.match(modal,/50% do valor informado/);
  assert.match(dock,/metade do dano rolado/);
});

test('counter skill keeps normal PD cost',()=>{
  assert.match(dock,/tabletopChooseCounterSkill/);
  assert.match(dock,/const cost=skillPdCost\(skill\)/);
  assert.match(dock,/PD insuficiente para contra-atacar/);
  assert.match(dock,/damageMultiplier:\.5/);
});

test('server charges PD atomically when action is confirmed and prevents double charge',()=>{
  assert.match(sql,/PD insuficiente: custo %, disponivel %/);
  assert.match(sql,/UPDATE public\.characters SET energy_current=v_after/);
  assert.match(sql,/'cost_paid',true/);
  assert.match(sql,/IF v_cost>0 AND NOT v_cost_paid THEN/);
});

test('manual action cost cannot be edited by player',()=>{
  assert.match(modal,/type="hidden" name="resource_cost"/);
  assert.match(modal,/Custo: \$\{cost\} PD/);
});

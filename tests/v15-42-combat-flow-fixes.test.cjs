const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

const combat=read('js/app/combat.js');
const persistence=read('js/tabletop/persistence.js');
const dock=read('js/tabletop/combat-dock.js');
const master=read('js/app/master.js');
const events=read('js/core/event-actions.js');
const sql=read('supabase-migration-v15.42-combat-flow-fixes.sql');

test('player history/effects use battle read RPCs and combat history is not admin-only',()=>{
  assert.match(combat,/get_battle_effects_v1542/);
  assert.match(combat,/get_battle_log_v1542/);
  assert.doesNotMatch(combat,/function renderCombatHistory\(\)\{\s*if\(currentRole!=='admin'\)return ''/);
  assert.match(persistence,/get_battle_effects_v1542/);
  assert.match(persistence,/get_battle_log_v1542/);
});

test('turn advancement is server authoritative and ticks timed effects on round wrap',()=>{
  assert.match(dock,/finish_turn_v1542/);
  assert.match(master,/finish_turn_v1542/);
  assert.match(sql,/status='pending'/);
  assert.match(sql,/rounds_remaining=1/);
  assert.match(sql,/rounds_remaining=e\.rounds_remaining-1/);
});

test('enemy counterattack window is visible and actionable for the master',()=>{
  assert.match(dock,/function enemyCounterPanel/);
  assert.match(dock,/tabletopChooseEnemyCounterAction/);
  assert.match(dock,/tabletopSkipEnemyCounterAttack/);
  assert.match(events,/tabletopChooseEnemyCounterAction/);
});

test('combat action retry is idempotent and client defense cannot reduce persisted defense',()=>{
  assert.match(sql,/v_existing_request/);
  assert.match(sql,/'duplicate',true/);
  assert.match(sql,/GREATEST\(COALESCE\(v_db_defense,0\),COALESCE\(v_context_defense,0\),0\)/);
});

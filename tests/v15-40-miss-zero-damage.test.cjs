const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const actions=fs.readFileSync('js/combat/actions.js','utf8');
const dock=fs.readFileSync('js/tabletop/combat-dock.js','utf8');
const sql=fs.readFileSync('supabase-migration-v15.42-combat-flow-fixes.sql','utf8');
test('miss is detected against target defense before reaction damage',()=>{assert.match(actions,/target_defense:targetDefense/);assert.match(actions,/data\?\.missed===true\|\|data\?\.hit_confirmed===false/);assert.match(sql,/v_hit:=COALESCE\(p_attack_result,0\)>=v_target_defense/);assert.match(sql,/'damage_applied',0,'effects_applied',0/);});
test('miss never applies on-hit effects',()=>{assert.match(sql,/hit_confirmed'\)::boolean,true\)=false/);assert.match(sql,/'skipped','miss'/);});
test('miss can persist counter window for target with reaction available',()=>{assert.match(sql,/'reason','attack_missed'/);assert.match(dock,/counter_available\?\.target_id/);assert.match(dock,/set_counter_window_v1540/);});

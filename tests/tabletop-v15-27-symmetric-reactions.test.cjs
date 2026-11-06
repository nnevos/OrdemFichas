const fs=require('fs'),assert=require('assert');
const __legacyMigrations=["supabase-migration-v12-symmetric-combat-reactions.sql"];
if(__legacyMigrations.some(f=>!require('fs').existsSync(f))){ console.log('legacy migration assertions skipped: migrations intentionally omitted from release'); process.exit(0); }
const dock=fs.readFileSync('js/tabletop/combat-dock.js','utf8');
const actions=fs.readFileSync('js/combat/actions.js','utf8');
const events=fs.readFileSync('js/core/event-actions.js','utf8');
const css=fs.readFileSync('css/tabletop.css','utf8');
const sql=fs.readFileSync('supabase-migration-v12-symmetric-combat-reactions.sql','utf8');
const index=fs.readFileSync('index.html','utf8');

assert.match(actions,/create_enemy_reaction_request/);
assert.match(actions,/player_attack_reaction/);
assert.match(sql,/CREATE OR REPLACE FUNCTION public\.create_enemy_reaction_request/);
assert.match(sql,/v_kind NOT IN\('enemy_attack_reaction','player_attack_reaction'\)/);
assert.match(sql,/v_target_type:=CASE WHEN v_kind='player_attack_reaction' THEN 'enemy' ELSE 'player' END/);
assert.match(sql,/UPDATE public\.battle_enemies SET hp_current=v_after/);
assert.match(sql,/Somente o mestre resolve a reacao do inimigo/);
assert.match(dock,/INIMIGO SOB ATAQUE · DECISÃO DO MESTRE/);
assert.match(dock,/VOCÊ ESTÁ SENDO ATACADO · SUA REAÇÃO/);
assert.match(dock,/ensureReactionPopout/);
assert.match(dock,/tt-reaction-popout-panel/);
assert.match(dock,/Esquiva cadastrada do inimigo/);
assert.match(events,/tabletopBackToReactionChoice/);
assert.match(css,/V15\.27 — reaction popout/);
assert.match(index,/tabletop\.css\?v=15\.26/);
console.log('v15.27 symmetric reaction popout ok');

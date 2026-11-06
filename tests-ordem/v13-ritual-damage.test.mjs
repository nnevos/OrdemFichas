import test from 'node:test';
import assert from 'node:assert/strict';
import {RITUALS,createFromCatalog,ritualDamageData} from '../ordem/catalog.mjs';
import {readFileSync} from 'node:fs';
test('Eletrocussão includes verified physical dice notation in the catalog',()=>{
 const ritual=RITUALS.find(r=>r.name==='Eletrocussão');
 assert.deepEqual(ritualDamageData(ritual),{damage:'3d6',discenteDamage:'6d6',verdadeiroDamage:'8d6'});
 assert.equal(createFromCatalog('rituals',ritual.id).damage,'3d6');
});
test('Existing custom ritual damage is preserved over catalog values',()=>{
 assert.equal(ritualDamageData({catalogId:'ritual-11',damage:'4d6'}).damage,'4d6');
});
test('Ritual UI exposes damage and clearly marks missing data',()=>{
 const source=readFileSync(new URL('../ordem/main.mjs',import.meta.url),'utf8');
 assert.match(source,/ritualDamageData\(r\)/);
 assert.match(source,/Dano: não cadastrado/);
});

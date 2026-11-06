import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const main=readFileSync(new URL('../ordem/main.mjs',import.meta.url),'utf8');
const catalog=readFileSync(new URL('../ordem/catalog.mjs',import.meta.url),'utf8');
test('rituais exibem dados de dano normal discente e verdadeiro quando cadastrados',()=>{
 assert.match(main,/\['Normal',ritualStats\.damage\]/);
 assert.match(main,/\['Discente',ritualStats\.discenteDamage\]/);
 assert.match(main,/\['Verdadeiro',ritualStats\.verdadeiroDamage\]/);
 assert.match(main,/op-ritual-damage/);
});
test('rituais têm edição compacta com remoção dentro do editor',()=>{
 assert.match(main,/data-action="toggle-ritual-edit"/);
 assert.match(main,/data-action="toggle-ritual-details"/);
 assert.match(main,/data-action="remove-ritual" data-i="\$\{i\}"/);
 assert.match(main,/\['damage','Dano normal'\]/);
});
test('catálogo mantém dados de dano apenas quando disponíveis',()=>{
 assert.match(catalog,/damage:ritualDamageData\(x\)\.damage/);
 assert.match(catalog,/discenteDamage:ritualDamageData\(x\)\.discenteDamage/);
});

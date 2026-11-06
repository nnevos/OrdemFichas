import test from 'node:test';
import assert from 'node:assert/strict';
import {RITUALS,WEAPONS,EQUIPMENT,CATALOG,createFromCatalog} from '../ordem/catalog.mjs';
import {SKILLS,initialCharacter,derive,validate} from '../ordem/rules.mjs';

test('catálogos possuem metadados separados e identificadores únicos',()=>{
 assert.equal(SKILLS.length,28);
 assert.equal(RITUALS.length,85);
 assert.equal(WEAPONS.length,41);
 assert.equal(EQUIPMENT.length,30);
 for(const group of [RITUALS,WEAPONS,EQUIPMENT])assert.equal(new Set(group.map(x=>x.id)).size,group.length);
 assert.equal(CATALOG.length,WEAPONS.length+EQUIPMENT.length);
});
test('ritual do catálogo mantém círculo, elemento e custo pelo motor',()=>{
 const entry=RITUALS.find(x=>x.name==='Tecer Ilusão');
 assert.ok(entry);assert.equal(entry.element,'CONHECIMENTO');assert.equal(entry.circle,1);
 const ritual=createFromCatalog('rituals',entry.id);
 assert.deepEqual({...ritual,note:'',catalogId:entry.id},ritual);
 assert.equal(ritual.circle,1);
});
test('arma do catálogo preenche os atributos relevantes do ataque',()=>{
 const entry=WEAPONS.find(x=>x.name==='Revólver');
 assert.ok(entry);assert.equal(entry.damage,'2d6');assert.equal(entry.critical,'19/x3');
 const attack=createFromCatalog('attacks',entry.id);
 assert.equal(attack.name,'Revólver');assert.equal(attack.damage,'2d6');
});
test('equipamentos do catálogo influenciam capacidade de carga',()=>{
 const entry=EQUIPMENT.find(x=>x.name==='Traje hazmat');assert.ok(entry);
 const item=createFromCatalog('items',entry.id);assert.equal(item.space,2);
 const c=initialCharacter();c.items=[item];assert.equal(derive(c).totalSpaces,2);
 c.items[0].qty=3;assert.equal(derive(c).totalSpaces,6);
 assert.ok(validate(c).warnings.length>=0);
});
test('modificar uma cópia não altera o catálogo',()=>{
 const entry=RITUALS[0];const one=createFromCatalog('rituals',entry.id),two=createFromCatalog('rituals',entry.id);
 one.name='Minha versão';assert.equal(two.name,entry.name);assert.equal(entry.name,RITUALS[0].name);
});

test('catálogo oferece resumo e origem para cada ritual',()=>{for(const r of RITUALS){assert.ok(r.summary?.length>=8, r.name);assert.ok([122,123].includes(r.page))}});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ABILITY_CATALOG,WEAPONS,createFromCatalog} from '../ordem/catalog.mjs';

const main=readFileSync(new URL('../ordem/main.mjs',import.meta.url),'utf8');
test('inventário armazena dano, crítico, alcance e tipo da arma',()=>{
 const base=WEAPONS.find(x=>x.name==='Revólver');
 assert.ok(base);
 const copy=createFromCatalog('items',base.id);
 assert.equal(copy.damage,base.damage);
 assert.equal(copy.critical,base.critical);
 assert.equal(copy.range,base.range);
 assert.equal(copy.damageType,base.damageType);
 copy.damage='1d8';
 assert.equal(base.damage,'2d6');
});
test('habilidades estão organizadas em classes, trilhas e origens',()=>{
 const groups=new Set(ABILITY_CATALOG.map(x=>x.group));
 for(const g of ['Combatente','Especialista','Ocultista','Origens','Poderes Paranormais'])assert.ok(groups.has(g));
 assert.equal(ABILITY_CATALOG.length,new Set(ABILITY_CATALOG.map(x=>x.id)).size);
 assert.ok(ABILITY_CATALOG.some(x=>x.group==='Combatente'&&x.track==='Aniquilador'));
 assert.ok(ABILITY_CATALOG.some(x=>x.group==='Especialista'&&x.track==='Médico de Campo'));
 assert.ok(ABILITY_CATALOG.some(x=>x.group==='Ocultista'&&x.track==='Conduíte'));
});
test('UI liga ações de seleção e edição de poderes e estatísticas dos itens',()=>{
 for(const marker of ['open-ability-catalog','ability-group','ability-track','ability-expand','ability-pick','data-ability-search','op-weapon-edit-grid','data-action="toggle-item"','data-collection="abilities"'])assert.ok(main.includes(marker),marker);
});

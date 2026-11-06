import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {initialCharacter,derive} from '../ordem/rules.mjs';
import {WEAPONS,createFromCatalog} from '../ordem/catalog.mjs';

const code=readFileSync(new URL('../ordem/main.mjs',import.meta.url),'utf8');

test('valores finais de defesa, esquiva e bloqueio podem ser ajustados sem substituir outros recursos',()=>{
 const c=initialCharacter();c.attrs.agi=3;c.skills.Reflexos=1;
 const automatic=derive(c);
 assert.equal(automatic.defense,13);
 c.defenseOverride=22;c.dodgeOverride=28;c.blockOverride=7;
 const changed=derive(c);
 assert.deepEqual([changed.defense,changed.dodge,changed.block],[22,28,7]);
 assert.equal(changed.pv,automatic.pv);
 c.defenseOverride=null;c.dodgeOverride=null;c.blockOverride=null;
 assert.deepEqual([derive(c).defense,derive(c).dodge,derive(c).block],[automatic.defense,automatic.dodge,automatic.block]);
});

test('as entradas oficiais de Faca e Fuzil de precisão contêm estatísticas',()=>{
 for(const name of ['Faca','Fuzil de precisão']){
  const x=WEAPONS.find(x=>x.name===name);
  assert.ok(x?.damage,`Faltam dados de ${name}`);
  assert.ok(x?.critical,`Falta crítico de ${name}`);
  assert.equal(createFromCatalog('items',x.id).damage,x.damage);
 }
});

test('fichas antigas recuperam dados faltantes por nome ou ID, mantendo ajustes feitos pelo jogador',()=>{
 assert.match(code,/function completeWeaponData\(item\)/);
 assert.match(code,/state\.characters=loaded\.characters\.map\(restoreCharacterCatalog\)/);
 assert.match(code,/characters:raw\.characters\.map\(restoreCharacterCatalog\)/);
 assert.match(code,/if\(merged\[key\]===undefined\|\|merged\[key\]===null\|\|merged\[key\]===''\)/);
});

test('rituais habilidades poderes e ataques podem ser removidos na ficha principal',()=>{
 assert.match(code,/data-action="remove-ritual" data-i="\$\{i\}"/);
 assert.match(code,/data-action="remove-ability" data-i="\$\{x\._index\}"/);
 assert.match(code,/data-action="remove-power" data-i="\$\{x\.index\}"/);
 assert.match(code,/data-action="remove-attack" data-i="\$\{i\}"/);
});


test('migração funcional de arma antiga recupera dano e crítico sem sobrescrever alterações',()=>{
 const begin=code.indexOf('export function completeWeaponData(item)');
 const end=code.indexOf('function restoreCharacterCatalog',begin);
 assert.ok(begin>0&&end>begin);
 const fragment=code.slice(begin,end).replace('export function','function');
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const migrated=runInNewContext(`${fragment};completeWeaponData({name:'Fuzil de precisão',type:'Arma',space:2,category:3})`,{WEAPONS,clean:norm,isWeaponItem:x=>x.type==='Arma'});
 assert.equal(migrated.damage,'2d10');
 assert.equal(migrated.critical,'19/x3');
 const preserved=runInNewContext(`${fragment};completeWeaponData({name:'Faca',type:'Arma',damage:'4d6',critical:'18/x3'})`,{WEAPONS,clean:norm,isWeaponItem:x=>x.type==='Arma'});
 assert.equal(preserved.damage,'4d6');
 assert.equal(preserved.critical,'18/x3');
});

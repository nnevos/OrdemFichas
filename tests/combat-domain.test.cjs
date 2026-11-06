const test = require('node:test');
const assert = require('node:assert/strict');
const CombatDomain = require('../js/combat/domain.js');

test('ajuste de recurso respeita 0 e o máximo da ficha', () => {
  assert.equal(CombatDomain.adjustResource(8, -20, 10), 0);
  assert.equal(CombatDomain.adjustResource(8, 20, 10), 10);
  assert.equal(CombatDomain.adjustResource(8, -3, 10), 5);
});

test('próximo turno avança e incrementa rodada apenas ao fechar a ordem', () => {
  const order = [{ label:'A' }, { label:'B' }, { label:'C' }];
  assert.deepEqual(CombatDomain.nextTurn(order, 0, 2), { turnIndex:1, round:2, actor:order[1], wrapped:false });
  assert.deepEqual(CombatDomain.nextTurn(order, 2, 2), { turnIndex:0, round:3, actor:order[0], wrapped:true });
});

test('efeitos temporários expiram, reduzem duração ou persistem sem duração', () => {
  const effects=[{id:'a',rounds_remaining:1},{id:'b',rounds_remaining:3},{id:'c',rounds_remaining:0}];
  const result=CombatDomain.tickEffects(effects);
  assert.deepEqual(result.expired.map(x=>x.id), ['a']);
  assert.equal(result.updated[0].rounds_remaining, 2);
  assert.deepEqual(result.persistent.map(x=>x.id), ['c']);
});

test('nomes e duração de condições são normalizados sem automatizar gameplay', () => {
  assert.equal(CombatDomain.conditionName('Congelado'), 'Congelado');
  assert.equal(CombatDomain.conditionName({name:'Lento'}), 'Lento');
  assert.equal(CombatDomain.conditionDuration({rounds:2}), 2);
  assert.equal(CombatDomain.conditionDuration('Congelado'), 0);
});

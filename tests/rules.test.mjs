import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES, RULE_BY_ID, searchRules, getRelatedRules } from '../rules/index.js';

test('todas as regras têm id e título e IDs são únicos', () => {
  const ids=RULES.map(r=>r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const rule of RULES) {
    assert.ok(rule.id && typeof rule.id === 'string');
    assert.ok(rule.title && typeof rule.title === 'string');
  }
});

test('API de relações ignora referências de conteúdo ainda não cadastradas sem quebrar a consulta', () => {
  for (const rule of RULES) {
    const related=getRelatedRules(rule);
    assert.ok(Array.isArray(related));
    assert.ok(related.every(item => RULE_BY_ID.has(item.id)));
  }
});

test('busca de regras encontra conceitos centrais de mesa', () => {
  const results=searchRules('como funciona esquiva', { limit:5 });
  assert.ok(results.length > 0);
  assert.ok(results.some(r => r.rule.id === 'esquiva'));
});

test('getRelatedRules retorna objetos de regra', () => {
  const related=getRelatedRules('esquiva');
  assert.ok(Array.isArray(related));
  assert.ok(related.every(r => r && typeof r.id === 'string'));
});

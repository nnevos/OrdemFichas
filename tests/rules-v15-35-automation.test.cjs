const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const basic=fs.readFileSync(path.join(root,'rules/basic-rules.js'),'utf8');
const resources=fs.readFileSync(path.join(root,'rules/resources-rules.js'),'utf8');
const conditions=fs.readFileSync(path.join(root,'rules/conditions-rules.js'),'utf8');
const combos=fs.readFileSync(path.join(root,'rules/combo-rules.js'),'utf8');
const combat=fs.readFileSync(path.join(root,'js/combat/actions.js'),'utf8');
const migration='';

test('resources separate PD, PR and Resonance execution',()=>{
  assert.match(resources,/PD é o recurso gasto para tentar usar habilidades/);
  assert.match(resources,/custo em PD é igual ao Grau\/RES/);
  assert.match(resources,/PR — Pontos de Ressonância/);
  assert.match(combat,/begin_combat_action_v1535/);
});

test('action economy distinguishes standard movement light free and reaction',()=>{
  assert.match(basic,/1 Ação Padrão/);
  assert.match(basic,/até 2 Ações Livres/);
  assert.match(basic,/1 Ação Leve/);
  assert.match(basic,/1 Reação por rodada/);
  assert.match(basic,/Ação de Movimento/);
});

test('status progressions and combo catalog are explicit',()=>{
  assert.match(conditions,/Queimando \+ Queimando se torna Em Chamas/);
  assert.match(conditions,/Resfriado \+ Resfriado se torna Congelando/);
  assert.match(combos,/"conditionId": "encharcado"/);
  assert.match(combos,/"appliedBy": \[\s*"jato-de-agua"/s);
  assert.match(combos,/"conditionId": "sobrecarregado"/);
  assert.match(conditions,/Saturado/);
  assert.match(conditions,/Saturado/);
});

test('counter attack revision is half damage with normal attack flow',()=>{
  assert.match(combat,/Contra-Ataque 50% dano/);
  assert.match(combat,/Math\.floor\(/);
});

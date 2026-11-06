const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('js/session-planner.js','utf8');
const sandbox={window:{},document:{},console,setTimeout:()=>{}};
vm.createContext(sandbox);vm.runInContext(code,sandbox);
const P=sandbox.window.SessionPlannerDomain;

test('preserva planejamento como atos e cenas',()=>{
  const source=`Sessao: Mansao dos Olhos
🎭 Ato 1 — Pos-Umbral
Cena 1: Retorno a Ordem
Os agentes retornam para a base.

📜 Ato 2 — A Missao
Cena 2: Briefing
Local: Mansao dos Olhos
Objetivo: investigar a casa.`;
  const p=P.parseNarrativePlan(source);
  assert.equal(p.outline.length,2);
  assert.equal(p.outline[0].scenes.length,1);
  assert.equal(p.outline[1].scenes.length,1);
  assert.equal(p.outline[1].scenes[0].title,'Briefing');
});

test('secoes numeradas viram cenas sem desmontar o documento',()=>{
  const p=P.parseNarrativePlan('1. Contexto e Preparacao\nTexto inicial.\n2. Chegada e Infiltracao\nTexto da chegada.');
  assert.equal(p.outline.length,1);
  assert.equal(p.outline[0].scenes.length,2);
  assert.equal(p.outline[0].scenes[0].title,'Contexto e Preparacao');
  assert.equal(p.outline[0].scenes[1].title,'Chegada e Infiltracao');
});

test('recursos ficam ligados a cena onde aparecem',()=>{
  const p=P.parseNarrativePlan('Cena 1: Porto\nLocal: Cais velho\nObjetivo: encontrar Darion\nInimigos:\n- 4 Afogados da Nevoa\n- 1 Vigia Afogado');
  const r=p.outline[0].scenes[0].resources;
  assert.equal(r.filter(x=>x.type==='location').length,1);
  assert.equal(r.filter(x=>x.type==='objective').length,1);
  assert.equal(r.filter(x=>x.type==='enemy').length,2);
});

test('prosa que menciona inimigos nao vira bestiario',()=>{
  const r=P.extractResources('Os inimigos devem agir de acordo com a cena. Quando criaturas saem da agua, descreva o medo.');
  assert.equal(r.filter(x=>x.type==='enemy').length,0);
});

test('bloco de ficha identifica inimigo com evidencia explicita',()=>{
  const r=P.extractResources('Guardioes do Sangue (NEX 40%)\nPV: 200 | DEF: 10 | Esquiva: 13 | Dano: 2d8');
  assert.equal(r.filter(x=>x.type==='enemy').length,1);
  assert.equal(r.find(x=>x.type==='enemy').text,'Guardioes do Sangue');
});

test('extrai quantidade e nome do rascunho sem criar copias',()=>{
  const e=P.parseEnemyDraft('4 Afogados da Nevoa — cobertos por algas');
  assert.equal(e.quantity,4);
  assert.equal(e.name,'Afogados da Nevoa');
});

test('guia rapido detecta teste no ponto do documento sem alterar o texto',()=>{
  const source='Voce entra no corredor. TESTE DE SANIDADE.\nDepois, o metal range.';
  const a=P.analyzeDocument(source);
  const mark=a.annotations.find(x=>x.type==='test');
  assert.ok(mark);
  assert.equal(mark.line,0);
  assert.match(mark.label,/Sanidade/i);
});

test('inimigo explicito vira lembrete mas prosa comum nao vira monstro',()=>{
  const source='Inimigos:\n- 4 Afogados da Nevoa\n\nOs inimigos restantes fogem pelo cais.';
  const a=P.analyzeDocument(source);
  const enemies=a.annotations.filter(x=>x.type==='enemy');
  assert.equal(enemies.length,1);
  assert.match(enemies[0].label,/Afogados/);
});

test('importador de bestiario interpreta estatisticas e ataques explicitos',()=>{
  const d=P.parseEnemyText('Guardiao do Sino\nPV: 80 | DEF: 14 | Esquiva: 9 | Deslocamento: 6m\nAtaque: Martelo — 2d8 de dano');
  assert.equal(d.name,'Guardiao do Sino');
  assert.equal(d.hp_max,80);
  assert.equal(d.defense,14);
  assert.equal(d.dodge,9);
  assert.equal(d.movement_speed,6);
  assert.equal(d.attacks.length,1);
  assert.equal(d.attacks[0].damage,'2d8');
});



test('importador completo preserva metadados de combate, condicoes e visibilidade',()=>{
  const source=`Nome: Guardiao das Cinzas
Subtitulo: Sentinela do Templo
PV: 85 | DEF: 14 | ESQ: 9 | ARM: 4 | RD: 2 | DESL: 9 | Nivel: 5
Categoria: elite
Elemento: fogo
Condicoes: Em Chamas
Visivel para jogadores: nome, PV, condicoes, deslocamento, ataques, habilidades

Ataques:
Ataque: Espada Incandescente
Acao: Acao Padrao
Teste: 1d20+7
Dano: 2d8+4
Efeito: Aplica Queimando no alvo.
Tipo: Ataque corpo a corpo
Alcance: 2m
Condicao: Queimando
Duracao: 2

Habilidades:
Habilidade: Explosao de Cinzas
Acao: Acao Padrao
Dano: 3d6
Efeito: Todos na area fazem teste de Vigor.
Tipo: Area
Alcance: 6m
Elemento: fogo
RES: 2
Condicoes: Queimando, Exposto
Duracao: 2
Requisito: Linha de visao`;
  const d=P.parseEnemyText(source);
  assert.equal(d.name,'Guardiao das Cinzas');
  assert.equal(d.subtitle,'Sentinela do Templo');
  assert.equal(d.block,4);
  assert.equal(d.damage_reduction,2);
  assert.deepEqual(Array.from(d.conditions),['Em Chamas']);
  assert.equal(d.visibility.attacks,true);
  assert.equal(d.visibility.defense,false);
  assert.equal(d.attacks[0].test,'1d20+7');
  assert.equal(d.attacks[0].action,'Ação Padrão');
  assert.equal(d.attacks[0].damage,'2d8+4');
  assert.deepEqual(Array.from(d.attacks[0].appliesConditions),['Queimando']);
  assert.equal(d.attacks[0].conditionRounds,2);
  assert.equal(d.abilities[0].type,'Area');
  assert.equal(d.abilities[0].range,'6m');
  assert.equal(d.abilities[0].element,'fogo');
  assert.equal(d.abilities[0].res,2);
  assert.deepEqual(Array.from(d.abilities[0].appliesConditions),['Queimando','Exposto']);
  assert.equal(d.abilities[0].prereq,'Linha de visao');
});

test('estrutura do documento detecta cenas sem desmontar o texto',()=>{
  const blocks=P.textToStructuredBlocks(`# Cena 1 — Chegada à Montanha de Gelo\nTexto.\n# Cena 2 — Investigação da Região\nTexto.`);
  const a=P.analyzeStructuredBlocks(blocks);
  assert.equal(a.annotations.filter(x=>x.type==='scene').map(x=>x.label).join('|'),'Cena 1 — Chegada à Montanha de Gelo|Cena 2 — Investigação da Região');
});

test('soldados elementais em secao de seguranca viram inimigos e habilidades nao',()=>{
  const source=`# Cena 4 — Segurança Elemental da Transmuta\n# Soldado Elemental — Fogo\nEspecialista em pressão ofensiva.\nHabilidades:\n### Rajada Flamejante\nAtaque à distância causando dano de fogo.\n### Sobrecarga Térmica\nAumenta o dano, mas deixa o usuário vulnerável.\n# Soldado Elemental — Água\nEspecialista em controle.\nHabilidades:\n### Correnteza\nEmpurra inimigos.`;
  const a=P.analyzeStructuredBlocks(P.textToStructuredBlocks(source));
  const enemies=a.annotations.filter(x=>x.type==='enemy');
  assert.equal(enemies.length,2);
  assert.equal(enemies[0].label,'Soldado Elemental — Fogo');
  assert.equal(enemies[0].draft.abilities.length,2);
  assert.equal(enemies[0].draft.abilities[0].name,'Rajada Flamejante');
  assert.equal(enemies.some(x=>/Rajada|Sobrecarga|Correnteza/.test(x.label)),false);
});

test('Vhalor e detectado como chefe contextual sem inventar atributos',()=>{
  const source=`# Cena 6 — O Guardião das Sombras\n## Nome: Vhalor, o Eclipse\nAntigo usuário elemental.\nElemento:\nSombras\n## Conceito\nManipula ausência de luz e medo.\n# Habilidades\n## Manto Sombrio\nCria uma camada de sombras.\n## Lâminas do Eclipse\nCria armas feitas de sombra.\n# Cena 7 — Descobertas Finais`;
  const a=P.analyzeStructuredBlocks(P.textToStructuredBlocks(source));
  const v=a.annotations.find(x=>x.type==='enemy'&&/Vhalor/.test(x.label));
  assert.ok(v);
  assert.equal(v.draft.hp_max,null);
  assert.equal(v.draft.defense,null);
  assert.equal(v.draft.rank,'chefe');
  assert.ok(v.draft.abilities.some(x=>x.name==='Manto Sombrio'));
});

test('objetivo principal usa itens da lista como lembretes',()=>{
  const source=`# Objetivo Principal\nApós seguirem as pistas, chegam à montanha.\nO objetivo é:\n- descobrir a verdadeira função da indústria;\n- encontrar informações sobre os Pilares.\n# Cena 1 — Chegada`;
  const a=P.analyzeStructuredBlocks(P.textToStructuredBlocks(source));
  const objectives=a.annotations.filter(x=>x.type==='objective');
  assert.equal(objectives.length,2);
  assert.match(objectives[0].label,/descobrir/i);
});

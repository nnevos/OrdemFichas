import fs from 'node:fs';
import path from 'node:path';
import abilities from '../rules/abilities-rules.js';
import trailAbilities from '../rules/trail-abilities-rules.js';
import combos from '../rules/combo-rules.js';

const ROOT=path.resolve(new URL('..',import.meta.url).pathname);
const OUT_MD=path.join(ROOT,'reports','BALANCE-REPORT-V15.39.md');
const OUT_JSON=path.join(ROOT,'reports','balance-v15.39.json');
fs.mkdirSync(path.dirname(OUT_MD),{recursive:true});

function norm(s=''){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function diceStats(text=''){
  const re=/(\d+)d(\d+)/gi;let m,totalAvg=0,totalMax=0,terms=[];
  while((m=re.exec(text))){const n=+m[1],d=+m[2];totalAvg+=n*(d+1)/2;totalMax+=n*d;terms.push(`${n}d${d}`);}
  return{avg:+totalAvg.toFixed(2),max:totalMax,terms};
}
function analyze(rule){
  const text=[rule.summary,rule.description,...(rule.mechanics||[])].join(' | ');
  const dice=diceStats(text),grade=Math.max(0,Math.min(4,Number(rule.grade)||0)),pd=grade||0;
  const p=norm(text), tags=(rule.tags||[]).map(norm);
  const aoe=/area|raio|linha de|adjacent/.test(p)||tags.some(x=>/area|multi-alvo|multi-hit/.test(x));
  const extraAction=/ataque adicional|acao adicional|agir novamente|ataque gratuito|\+\d+ ataques/.test(p);
  const persistent=/por rodada|duracao|duração|continuo|contínuo/.test(p);
  const execution=/menos de 50%|metade da vida|execuc/.test(p);
  const combo=/combo|se o alvo (ja|já) estiver|sobrecarregad|encharcad|marcad|caid|efeito elemental/.test(p)||tags.some(x=>x.includes('combo'));
  const burstIndex=pd?dice.avg/pd:dice.avg;
  const risk=[];
  if(pd&&burstIndex>=7)risk.push('dano/PD alto');
  if(dice.avg>=18)risk.push('muitos dados no texto');
  if(extraAction)risk.push('economia de ações');
  if(aoe&&dice.avg>=10)risk.push('dano + área');
  if(combo&&execution)risk.push('combo + execução');
  if(/cada impacto|cada ataque|por acerto/.test(p)&&dice.avg>=7)risk.push('multiplicação por hit');
  return{id:rule.id,title:rule.title,category:rule.category,element:rule.element||'',grade,pd,action:rule.action||'',diceAvg:dice.avg,diceMax:dice.max,diceTerms:dice.terms,aoe,extraAction,persistent,execution,combo,burstIndex:+burstIndex.toFixed(2),risk};
}
const rows=[...abilities,...trailAbilities].map(analyze);
const flagged=rows.filter(x=>x.risk.length).sort((a,b)=>b.risk.length-a.risk.length||b.burstIndex-a.burstIndex||b.diceAvg-a.diceAvg);
const byGrade={};for(const r of rows.filter(r=>r.grade)){(byGrade[r.grade]??=[]).push(r);}
const gradeSummary=Object.fromEntries(Object.entries(byGrade).map(([g,x])=>[g,{count:x.length,meanDice:+(x.reduce((s,r)=>s+r.diceAvg,0)/x.length).toFixed(2),meanEfficiency:+(x.reduce((s,r)=>s+r.burstIndex,0)/x.length).toFixed(2)}]));
const comboRows=combos.map(c=>({condition:c.conditionId,title:c.title,appliedBy:(c.appliedBy||[]).length,exploitedBy:(c.exploitedBy||[]).length})).sort((a,b)=>(b.appliedBy+b.exploitedBy)-(a.appliedBy+a.exploitedBy));
const data={version:'15.39',generatedAt:new Date().toISOString(),totalAbilities:rows.length,flaggedCount:flagged.length,gradeSummary,flagged,combos:comboRows};
fs.writeFileSync(OUT_JSON,JSON.stringify(data,null,2));

const md=[];
md.push('# Relatório de balanceamento EDF — V15.39','',
'> Relatório automático de triagem. **Não aplica nerfs/buffs automaticamente.** Sinalizações indicam pontos para playtest e revisão humana.','',
`- Habilidades analisadas: **${rows.length}**`,`- Habilidades sinalizadas: **${flagged.length}**`,`- Combos/status catalogados: **${comboRows.length}**`,'',
'## Médias por Grau','', '| Grau | Habilidades | Dados médios citados | Índice médio dados/PD |','|---:|---:|---:|---:|');
for(const [g,x] of Object.entries(gradeSummary))md.push(`| ${g} | ${x.count} | ${x.meanDice} | ${x.meanEfficiency} |`);
md.push('','## Pontos sinalizados','', '| Habilidade | Grau | Ação | Dados médios* | Índice/PD | Alertas |','|---|---:|---|---:|---:|---|');
for(const r of flagged.slice(0,80))md.push(`| ${r.title.replace(/\|/g,'/')} | ${r.grade||'-'} | ${r.action||'-'} | ${r.diceAvg} | ${r.pd?r.burstIndex:'-'} | ${r.risk.join(', ')} |`);
md.push('','\* “Dados médios” soma todas as expressões `XdY` encontradas no texto da habilidade. Isso é propositalmente conservador: efeitos condicionais podem não ocorrer juntos.','',
'## Rede de combos/status','', '| Status/Combo | Habilidades que aplicam | Habilidades que exploram |','|---|---:|---:|');
for(const c of comboRows)md.push(`| ${c.title.replace(/^Combos:\s*/,'')} | ${c.appliedBy} | ${c.exploitedBy} |`);
md.push('','## Critérios recomendados para playtest','',
'1. Comparar dano médio de uma ação de Grau N contra PV de inimigo equivalente; sinalizar quando uma única ação comum remover >40% do PV sem setup.','2. Comparar dano por PD, não apenas dano bruto; habilidades com área, multi-hit ou ações extras devem ser avaliadas separadamente.','3. Registrar taxa de sucesso de Esquiva por AGI e faixa de ataque. Alvo inicial: ~35–60% em encontros equivalentes; acima de 65% de forma recorrente merece revisão.','4. Medir quantas ações extras uma build consegue gerar por rodada. Mais de 2 ataques extras recorrentes exige atenção especial.','5. Combos que consomem setup devem superar ataques simples, mas não devem eliminar um inimigo equivalente sem janela real de resposta.');
fs.writeFileSync(OUT_MD,md.join('\n')+'\n');
console.log(JSON.stringify({out:OUT_MD,json:OUT_JSON,abilities:rows.length,flagged:flagged.length},null,2));

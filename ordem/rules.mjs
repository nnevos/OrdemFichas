/**
 * Motor mecanico independente - Ordem Paranormal RPG v1.2.
 * Referencias: Livro de Regras, paginas impressas 13-15, 16-23, 25, 29, 33,
 * 39-41, 51-53, 78, 88, 119. Textos do livro nao sao reproduzidos.
 */
export const VERSION = '1.2';
export const NEX_STEPS = [...Array.from({length: 19}, (_, i) => (i + 1) * 5), 99];
export const ATTRS = Object.freeze({agi:'Agilidade',for:'Força',int:'Intelecto',pre:'Presença',vig:'Vigor'});
export const CLASSES = Object.freeze({
 combatente:{title:'Combatente',pv:20,pe:2,san:12,pvStep:4,peStep:2,sanStep:3,mandatory:[],freeSkills:1,proficiency:'Armas simples, táticas; proteções leves'},
 especialista:{title:'Especialista',pv:16,pe:3,san:16,pvStep:3,peStep:3,sanStep:4,mandatory:[],freeSkills:7,proficiency:'Armas simples; proteções leves'},
 ocultista:{title:'Ocultista',pv:12,pe:4,san:20,pvStep:2,peStep:4,sanStep:5,mandatory:['Ocultismo','Vontade'],freeSkills:3,proficiency:'Armas simples'}
});
export const TRACKS = Object.freeze({
 combatente:['Aniquilador','Comandante de Campo','Guerreiro','Operações Especiais','Tropa de Choque'],
 especialista:['Atirador de Elite','Infiltrador','Médico de Campo','Negociador','Técnico'],
 ocultista:['Conduíte','Flagelador','Graduado','Intuitivo','Lâmina Paranormal']
});
// Livro p.19: nome, duas pericias e poder. Poderes narrativos dependem de arbitragem do mestre.
const ORIGIN_ROWS = [
 ['Acadêmico','Ciências','Investigação','Saber é Poder'],
 ['Agente de Saúde','Intuição','Medicina','Técnica Medicinal'],
 ['Amnésico',null,null,'Vislumbres do Passado'],
 ['Artista','Artes','Enganação','Magnum Opus'],
 ['Atleta','Acrobacia','Atletismo','110%'],
 ['Chef','Fortitude','Profissão','Ingrediente Secreto'],
 ['Criminoso','Crime','Furtividade','O Crime Compensa'],
 ['Cultista Arrependido','Ocultismo','Religião','Traços do Outro Lado'],
 ['Desgarrado','Fortitude','Sobrevivência','Calejado'],
 ['Engenheiro','Profissão','Tecnologia','Ferramenta Favorita'],
 ['Executivo','Diplomacia','Profissão','Processo Otimizado'],
 ['Investigador','Investigação','Percepção','Faro para Pistas'],
 ['Lutador','Luta','Reflexos','Mão Pesada'],
 ['Magnata','Diplomacia','Pilotagem','Patrocinador da Ordem'],
 ['Mercenário','Iniciativa','Intimidação','Posição de Combate'],
 ['Militar','Pontaria','Tática','Para Bellum'],
 ['Operário','Fortitude','Profissão','Ferramenta de Trabalho'],
 ['Policial','Percepção','Pontaria','Patrulha'],
 ['Religioso','Religião','Vontade','Acalentar'],
 ['Servidor Público','Intuição','Vontade','Espírito Cívico'],
 ['Teórico da Conspiração','Investigação','Ocultismo','Eu Já Sabia'],
 ['T.I.','Investigação','Tecnologia','Motor de Busca'],
 ['Trabalhador Rural','Adestramento','Sobrevivência','Desbravador'],
 ['Trambiqueiro','Crime','Enganação','Impostor'],
 ['Universitário','Atualidades','Investigação','Dedicação'],
 ['Vítima','Reflexos','Vontade','Cicatrizes Psicológicas']
];
export const ORIGINS = Object.freeze(ORIGIN_ROWS.map(([name,a,b,power])=>({name,skills:[a,b].filter(Boolean),power})));
export const SKILLS = Object.freeze([
 ['Acrobacia','agi',false,true],['Adestramento','pre',true],['Artes','pre',true],['Atletismo','for'],
 ['Atualidades','int'],['Ciências','int',true],['Crime','agi',true,true,true],['Diplomacia','pre'],
 ['Enganação','pre',false,false,true],['Fortitude','vig'],['Furtividade','agi',false,true],['Iniciativa','agi'],
 ['Intimidação','pre'],['Intuição','pre'],['Investigação','int'],['Luta','for'],
 ['Medicina','int',false,false,true],['Ocultismo','int',true],['Percepção','pre'],['Pilotagem','agi',true],
 ['Pontaria','agi'],['Profissão','int',true],['Reflexos','agi'],['Religião','pre',true],
 ['Sobrevivência','int'],['Tática','int',true],['Tecnologia','int',true,false,true],['Vontade','pre']
 ].map(([name,attr,requiresTraining=false,carga=false,kit=false])=>({name,attr,requiresTraining,carga,kit})));
export const SKILL_GRADES = Object.freeze({0:0,1:5,2:10,3:15});
export const PATENTS = Object.freeze([
 {name:'Recruta',min:0,limits:[2,0,0,0]},
 {name:'Operador',min:20,limits:[3,1,0,0]},
 {name:'Agente Especial',min:50,limits:[3,2,1,0]},
 {name:'Oficial de Operações',min:100,limits:[3,3,2,1]},
 {name:'Agente de Elite',min:200,limits:[3,3,3,2]}
]);
export const RITUAL_COST = Object.freeze({1:1,2:3,3:6,4:10});
const t = value => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0;
const bounded = (value,min,max) => Math.min(max,Math.max(min,t(value)));
export function nexTier(nex){ return NEX_STEPS.indexOf(Number(nex)) + 1; }
export function originOf(name){ return ORIGINS.find(o=>o.name===name) || null; }
export function patentOf(pp){ return PATENTS.filter(p=>p.min<=t(pp)).at(-1) || PATENTS[0]; }
export function ritualCircle(character){
 if(character.classId!=='ocultista') return 0;
 return character.nex>=85?4:character.nex>=55?3:character.nex>=25?2:1;
}
export function initialCharacter(){ return {
 id:'', name:'Novo Agente', player:'',concept:'',background:'',classId:'combatente',origin:'',track:'',nex:5,patentPoints:0,
 attrs:{agi:1,for:1,int:1,pre:1,vig:1}, current:{pv:null,pe:null,san:null},skills:{},
 classTraining:[],choices:{combatSkill:null,combatResist:null},powers:[],rituals:[],items:[],conditions:[],
 armorDefense:0,otherDefense:0,extraPV:0,extraPE:0,extraSAN:0,notes:'',lastEdited:null
}; }
export function effectiveGrade(character,name){
 const origin = originOf(character.origin);
 const mandatory = [...(origin?.skills || []),...(CLASSES[character.classId]?.mandatory||[]),...
  (character.classId==='combatente'?[character.choices?.combatSkill,character.choices?.combatResist]:[])].filter(Boolean);
 return Math.max(mandatory.includes(name)?1:0,bounded(character.skills?.[name]||0,0,3));
}
export function attrBudget(character){
 return 9+[20,50,80,95].filter(n=>character.nex>=n).length;
}
export function levelMilestones(character){
 const tiers=nexTier(character.nex);
 return {tier:tiers,attrCount:[20,50,80,95].filter(n=>character.nex>=n).length,
  powerNex:[15,30,45,60,75,90].filter(n=>character.nex>=n),
  trailNex:[10,40,65,99].filter(n=>character.nex>=n),
  gradeNex:[35,70].filter(n=>character.nex>=n),versatility:character.nex>=50};
}
export function derive(character){
 const c=CLASSES[character.classId];
 if(!c) throw new Error('Classe desconhecida');
 const n=nexTier(character.nex);
 if(!n) throw new Error('NEX invalido');
 const a=Object.fromEntries(Object.keys(ATTRS).map(k=>[k,bounded(character.attrs?.[k],0,99)]));
 let pv=c.pv+a.vig+(n-1)*(c.pvStep+a.vig)+t(character.extraPV);
 let pe=c.pe+a.pre+(n-1)*(c.peStep+a.pre)+t(character.extraPE);
 let san=c.san+(n-1)*c.sanStep+t(character.extraSAN);
 if(character.origin==='Cultista Arrependido')san-=c.san/2;
 if(character.origin==='Desgarrado')pv+=n;
 if(character.origin==='Vítima')san+=n;
 if(character.origin==='Universitário')pe+=1+[15,25,35,45,55,65,75,85,95].filter(x=>character.nex>=x).length;
 if(character.classId==='combatente'&&character.track==='Tropa de Choque'&&character.nex>=10)pv+=n;
 const totalSpaces=(character.items||[]).reduce((sum,item)=>sum+Math.max(0,t(item.space))*Math.max(1,t(item.qty||1)),0);
 const capacity=a.for===0?2:a.for*5;
 const overloaded=totalSpaces>capacity;
 const defense=10+a.agi+t(character.armorDefense)+t(character.otherDefense)+(character.origin==='Policial'?2:0)-(overloaded?5:0);
 const speed=Math.max(0,9-(overloaded?3:0));
 const current={pv:bounded(character.current?.pv??pv,0,Math.max(0,pv)),pe:bounded(character.current?.pe??pe,0,Math.max(0,pe)),san:bounded(character.current?.san??san,0,Math.max(0,san))};
 const skills=Object.fromEntries(SKILLS.map(s=>[s.name,{...s,grade:effectiveGrade(character,s.name),bonus:SKILL_GRADES[effectiveGrade(character,s.name)]}]));
 const limit=n+(character.origin==='Universitário'?1:0);
 const extraTraining=Math.max(0,c.freeSkills+a.int);
 const fixedTraining=[...(originOf(character.origin)?.skills||[]),...c.mandatory,...(character.classId==='combatente'?[character.choices?.combatSkill,character.choices?.combatResist]:[])].filter(Boolean);
 const manualGradeNames=Object.entries(character.skills||{}).filter(([name,grade])=>Number(grade)>0 && !fixedTraining.includes(name)).map(([name])=>name);
 return {attrs:a,pv:Math.max(0,pv),pe:Math.max(0,pe),san:Math.max(0,san),current,defense,speed,
  block:skills.Fortitude.grade?skills.Fortitude.bonus:0,
  dodge:defense+(skills.Reflexos.grade?skills.Reflexos.bonus:0),
  limitPE:limit,capacity,totalSpaces,overloaded,exceedsCapacity:totalSpaces>capacity*2,
  skills,extraTraining,manualTraining:manualGradeNames.length,patent:patentOf(character.patentPoints),
  ritualCircle:ritualCircle(character),milestones:levelMilestones(character)};
}
export function validate(character){
 const errors=[],warnings=[];
 let d;
 try{d=derive(character)}catch(e){return {errors:[e.message],warnings};}
 const sum=Object.values(d.attrs).reduce((a,b)=>a+b,0), budget=attrBudget(character);
 if(sum>budget)errors.push(`Atributos excedem o limite: ${sum}/${budget} pontos.`);
 if(sum<budget)warnings.push(`Faltam distribuir ${budget-sum} ponto(s) de atributo.`);
 const max=Math.min(5,3+levelMilestones(character).attrCount);
 if(Object.values(d.attrs).some(v=>v>max))errors.push(`Atributos nao podem exceder ${max} neste NEX.`);
 if(character.classId==='combatente'){
  if(!['Luta','Pontaria'].includes(character.choices?.combatSkill))warnings.push('Selecione Luta ou Pontaria na classe Combatente.');
  if(!['Fortitude','Reflexos'].includes(character.choices?.combatResist))warnings.push('Selecione Fortitude ou Reflexos na classe Combatente.');
 }
 if(character.nex>=10&&!TRACKS[character.classId].includes(character.track))warnings.push('Escolha uma trilha compatível com sua classe.');
 if(d.manualTraining>d.extraTraining)errors.push(`Pericias extras excedidas: ${d.manualTraining}/${d.extraTraining}.`);
 if(d.manualTraining<d.extraTraining)warnings.push(`Pericias de classe disponiveis: ${d.extraTraining-d.manualTraining}.`);
 const maxGrade=character.nex>=70?3:character.nex>=35?2:1;
 if(Object.values(d.skills).some(s=>s.grade>maxGrade))errors.push(`Grau de treinamento excede o limite base para NEX ${character.nex}%.`);
 const classUpgradeBase={combatente:2,especialista:5,ocultista:3}[character.classId]+d.attrs.int;
 const veterans=Object.values(d.skills).filter(s=>s.grade>=2).length;
 const experts=Object.values(d.skills).filter(s=>s.grade>=3).length;
 if(character.nex>=35 && veterans>classUpgradeBase*(character.nex>=70?2:1))
  warnings.push(`Quantidade de pericias veteranas/expert (${veterans}) acima das escolhas basicas de treinamento para este NEX; confira poderes que concedem treinamento extra.`);
 if(character.nex>=70 && experts>classUpgradeBase)
  warnings.push(`Quantidade de pericias expert (${experts}) acima das escolhas basicas do marco 70%; confira poderes que concedem treinamento extra.`);
 if(d.exceedsCapacity)errors.push('Itens excedem o dobro da capacidade de carga.');
 for(const [i,item] of (character.items||[]).entries()){
  if(!item.name?.trim())warnings.push(`Item ${i+1} sem nome.`);
  if(t(item.space)<0||t(item.qty)<1)errors.push(`Item ${i+1} com quantidade ou espacos invalidos.`);
 }
 const counts={1:0,2:0,3:0,4:0};
 for(const item of character.items||[])if(item.category>0 && counts[item.category]!=null)counts[item.category]+=Math.max(1,t(item.qty));
 for(let i=1;i<=4;i++)if(counts[i]>d.patent.limits[i-1])warnings.push(`Patente ${d.patent.name}: categoria ${i} usa ${counts[i]}/${d.patent.limits[i-1]} item(ns).`);
 for(const r of character.rituals||[]){
  if(!r.name?.trim())warnings.push('Ritual sem nome.');
  if(!(r.circle>=1&&r.circle<=4))errors.push('Ritual com circulo invalido.');
  if(character.classId==='ocultista'&&r.circle>d.ritualCircle)warnings.push(`Ritual ${r.name}: circulo ainda nao liberado.`);
 }
 const powerSlots=d.milestones.powerNex.length;
 if((character.powers||[]).length<powerSlots)warnings.push(`${powerSlots-(character.powers||[]).length} escolha(s) de poder de classe pendente(s).`);
 if(character.origin==='Amnésico')warnings.push('Origem Amnésico: mestre precisa determinar duas pericias treinadas.');
 return {errors,warnings};
}
export function rollPool(attribute,grade=0,extra=0,die=()=>Math.floor(Math.random()*20)+1){
 const effective=t(attribute)+t(extra);
 const count=effective<=0?2-effective:effective;
 if(count>100)throw new Error('Quantidade de dados fora do limite.');
 const dice=Array.from({length:count},()=>bounded(die(),1,20));
 const selected=effective<=0?Math.min(...dice):Math.max(...dice);
 return {dice,selected,total:selected+t(grade),keep:effective<=0?'menor':'maior'};
}
export function spend(character,resource,amount){
 if(!['pv','pe','san'].includes(resource))throw new Error('Recurso invalido.');
 const d=derive(character);
 const n=bounded(amount,0,9999);
 return {...character,current:{...d.current,[resource]:Math.max(0,d.current[resource]-n)}};
}
export function recover(character,resource,amount){
 if(!['pv','pe','san'].includes(resource))throw new Error('Recurso invalido.');
 const d=derive(character);
 const n=bounded(amount,0,9999);
 return {...character,current:{...d.current,[resource]:Math.min(d[resource],d.current[resource]+n)}};
}
export function changeNex(character,nex){
 if(!NEX_STEPS.includes(Number(nex)))throw new Error('NEX fora da progressao oficial');
 const current=derive(character).current;
 const next={...character,nex:Number(nex),current};
 const nextMax=derive(next);
 return {...next,current:{pv:Math.min(current.pv,nextMax.pv),pe:Math.min(current.pe,nextMax.pe),san:Math.min(current.san,nextMax.san)}};
}

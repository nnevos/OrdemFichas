import basic from './basic-rules.js';
import skills from './skills-rules.js';
import combat from './combat-rules.js';
import resources from './resources-rules.js';
import resonance from './resonance-rules.js';
import conditions from './conditions-rules.js';
import characterClasses from './classes-rules.js';
import trails from './trails-rules.js';
import trailAbilities from './trail-abilities-rules.js';
import origins from './origins-rules.js';
import equipment from './equipment-rules.js';
import elements from './elemental-rules.js';
import progression from './progression-rules.js';
import skillTree from './skill-tree-rules.js';
import abilities from './abilities-rules.js';
import combos from './combo-rules.js';
import reviewIssues from './review-issues.js';

export const RULE_CATEGORIES = {
  basico: 'Regras Básicas',
  'habilidades-trilha': 'Habilidades de Trilha',
  combate: 'Combate',
  recursos: 'Recursos',
  ressonancia: 'Ressonância',
  condicoes: 'Condições e Status',
  classes: 'Classes',
  trilhas: 'Trilhas',
  origens: 'Origens',
  equipamentos: 'Equipamentos',
  elementos: 'Elementos',
  personagem: 'Personagem e Progressão',
  'skill-tree': 'Skill Tree',
  habilidades: 'Habilidades',
  combos: 'Combos e Sinergias'
};

export const RULES = [
  ...basic, ...skills, ...combat, ...resources, ...resonance, ...conditions,
  ...characterClasses, ...trails, ...trailAbilities, ...origins, ...equipment,
  ...elements, ...progression, ...skillTree, ...abilities, ...combos
];
export const REVIEW_ISSUES = reviewIssues;
export const RULE_BY_ID = new Map(RULES.map(rule => [rule.id, rule]));

const STOP_WORDS = new Set([
  'a','ao','aos','as','como','com','da','das','de','do','dos','e','em','essa','esse','esta','este',
  'eu','funciona','funcionar','funcionam','me','meu','minha','na','nas','no','nos','o','os','ou','para',
  'pode','podem','posso','qual','quando','que','se','ser','tem','ter','um','uma','usar','uso','vez'
]);

const COMMON_QUESTIONS = {
  'esquiva': ['como funciona esquiva','como esquivar','qual teste uso para esquivar','posso desviar de um ataque'],
  'contra-ataque': ['como funciona contra ataque','quando posso contra atacar','como contra atacar'],
  'rd': ['como funciona rd','como reduzir dano','o que e reducao de dano'],
  'pr': ['como funciona pr','para que serve pr','como comprar habilidade','quantos pontos de ressonancia'],
  'pontos-de-ressonancia': ['como funciona pr','para que serve ponto de ressonancia','como comprar habilidade'],
  'ressonancia': ['como funciona ressonancia','como usar ressonancia'],
  'ressonancia-elemental': ['como funciona ressonancia','o que e ressonancia elemental'],
  'deslocamento': ['como funciona movimento','quanto posso andar','como funciona deslocamento'],
  'lento': ['o que reduz movimento','qual condicao reduz movimento'],
  'congelado': ['como funciona congelado','o que acontece quando fica congelado']
};

const QUERY_SYNONYMS = new Map(Object.entries({
  'desviar': ['esquiva'], 'desvio': ['esquiva'], 'esquivar': ['esquiva'],
  'reduzir dano': ['rd','reducao de dano'], 'resistencia dano': ['rd','reducao de dano'],
  'mana': ['pr','pontos de ressonancia'], 'pontos magia': ['pr','pontos de ressonancia'],
  'comprar habilidade': ['pr','skill tree','progressao'], 'comprar skill': ['pr','skill tree','progressao'],
  'movimento': ['deslocamento'], 'mover': ['deslocamento'],
  'acerto critico': ['critico'], 'falha critica': ['falha critica'],
  'queimar': ['em chamas'], 'molhado': ['encharcado'], 'eletrizado': ['sobrecarregado']
}));

function normalize(value='') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+\-\s]/g,' ').replace(/\s+/g,' ').trim();
}
function tokenize(value='') { return normalize(value).split(/\s+/).filter(t => t && !STOP_WORDS.has(t)); }
function unique(values=[]) { return [...new Set(values.filter(Boolean))]; }
function levenshtein(a='', b='') {
  a=normalize(a); b=normalize(b);
  if (!a) return b.length; if (!b) return a.length;
  const prev=Array.from({length:b.length+1},(_,i)=>i), cur=new Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    cur[0]=i;
    for(let j=1;j<=b.length;j++) cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    for(let j=0;j<=b.length;j++) prev[j]=cur[j];
  }
  return prev[b.length];
}
function fuzzySimilarity(a,b){
  const longest=Math.max(normalize(a).length,normalize(b).length,1);
  return 1-(levenshtein(a,b)/longest);
}

function buildSearchDoc(rule){
  const title=normalize(rule.title), id=normalize(rule.id);
  const aliases=(rule.aliases||[]).map(normalize);
  const keywords=(rule.keywords||[]).map(normalize);
  const questions=[...(rule.questions||[]),...(COMMON_QUESTIONS[rule.id]||[])].map(normalize);
  const mechanics=(rule.mechanics||[]).map(normalize);
  const examples=(rule.examples||[]).map(normalize);
  const meta=[rule.element,rule.grade,rule.type,rule.action,rule.range,rule.duration,rule.prerequisite,rule.path,rule.trail].map(normalize).filter(Boolean);
  const body=normalize([rule.summary,rule.answer,rule.description,...mechanics,...examples,...meta].join(' '));
  return {title,id,aliases,keywords,questions,mechanics,examples,meta,body,titleTokens:tokenize(title)};
}
const SEARCH_DOCS = new Map(RULES.map(rule=>[rule.id,buildSearchDoc(rule)]));

function expandQuery(query=''){
  const normalized=normalize(query);
  const coreTokens=tokenize(query);
  const expanded=[...coreTokens];
  for(const [phrase, replacements] of QUERY_SYNONYMS){
    if(normalized.includes(phrase)) expanded.push(...replacements.flatMap(tokenize));
  }
  return { raw:String(query||''), normalized, coreTokens, tokens:unique(expanded) };
}

function detectIntent(query=''){
  const q=normalize(query);
  if(/(combina|combo|sinerg|habilidad.*(usa|aplica|aproveita)|usa .*condi|usa .*congel|aproveita|ativa|aplica)/.test(q)) return 'relation';
  if(/(como|funciona|funcionar|regra|posso|pode|quando)/.test(q)) return 'mechanic';
  if(/(reduz|aumenta|impede|causa|dano|movimento|deslocamento|bonus|penalidade)/.test(q)) return 'effect';
  return 'direct';
}

function scoreRule(rule, queryInfo, options={}){
  const doc=SEARCH_DOCS.get(rule.id); if(!doc) return null;
  const {normalized:q,tokens}=queryInfo;
  const intent=detectIntent(queryInfo.raw);
  let score=0; const matchedFields=[];
  const add=(points,field)=>{score+=points;if(field&&!matchedFields.includes(field))matchedFields.push(field);};
  if(doc.title===q || doc.id===q) add(140,'Título exato');
  if(doc.aliases.includes(q)) add(125,'Alias exato');
  if(doc.questions.includes(q)) add(120,'Pergunta equivalente');
  if(doc.keywords.includes(q)) add(105,'Palavra-chave exata');
  if(q && doc.title.startsWith(q)) add(80,'Título');
  if(q && doc.aliases.some(a=>a.startsWith(q))) add(68,'Alias');
  if(q && doc.body.includes(q)) add(28,'Mecânica');
  for(const term of tokens){
    if(doc.title===term) add(42,'Título');
    else if(doc.title.includes(term)) add(30,'Título');
    if(doc.aliases.some(a=>a===term)) add(36,'Alias');
    else if(doc.aliases.some(a=>a.includes(term))) add(24,'Alias');
    if(doc.questions.some(a=>a.includes(term))) add(24,'Perguntas comuns');
    if(doc.keywords.some(k=>k===term)) add(30,'Palavra-chave');
    else if(doc.keywords.some(k=>k.includes(term))) add(18,'Palavra-chave');
    if(doc.mechanics.some(m=>m.includes(term))) add(11,'Mecânica');
    else if(doc.body.includes(term)) add(5,'Descrição');
  }
  if(intent==='effect' && queryInfo.coreTokens.length>1 && queryInfo.coreTokens.every(t=>doc.body.includes(t))) { add(48,'Efeito descrito na regra'); if(rule.category==='condicoes') add(30,'Condição correspondente'); }
  if(tokens.length>1){
    const coverage=tokens.filter(t=>doc.body.includes(t)||doc.title.includes(t)||doc.aliases.some(a=>a.includes(t))||doc.keywords.some(k=>k.includes(t))).length/tokens.length;
    if(coverage===1) add(22,'Todos os termos'); else if(coverage>=0.66) add(10,'Termos relacionados');
  }
  const contextTerms=(options.contextTerms||[]).map(normalize).filter(Boolean);
  if(contextTerms.some(t=>t && (doc.body.includes(t)||doc.keywords.some(k=>k.includes(t))))) add(4,'Relacionado ao personagem');
  return {rule,score,matchedFields,matchReason:matchedFields[0]||''};
}

function fuzzyCandidates(queryInfo, rules, limit=8){
  const needle=queryInfo.coreTokens.join(' ')||queryInfo.normalized;
  if(needle.length<4) return [];
  return rules.map(rule=>{
    const doc=SEARCH_DOCS.get(rule.id);
    const candidates=[doc.title,...doc.aliases,...doc.keywords].filter(Boolean);
    const similarity=Math.max(...candidates.map(c=>fuzzySimilarity(needle,c)),0);
    return {rule,score:Math.round(similarity*45),matchedFields:['Correspondência aproximada'],matchReason:'Correspondência aproximada',similarity};
  }).filter(x=>x.similarity>=0.68).sort((a,b)=>b.similarity-a.similarity||a.rule.title.localeCompare(b.rule.title,'pt-BR')).slice(0,limit);
}

export function getRule(id) { return RULE_BY_ID.get(id) || null; }
export function getRelatedRules(ruleOrId) {
  const rule=typeof ruleOrId==='string'?getRule(ruleOrId):ruleOrId;
  if(!rule)return[];
  return (rule.related||[]).map(getRule).filter(Boolean);
}
export function getGroupedRelations(ruleOrId){
  const related=getRelatedRules(ruleOrId);
  const groups={rules:[],conditions:[],abilities:[],classes:[],trails:[],elements:[],other:[]};
  for(const r of related){
    if(r.category==='condicoes') groups.conditions.push(r);
    else if(['habilidades','habilidades-trilha'].includes(r.category)) groups.abilities.push(r);
    else if(r.category==='classes') groups.classes.push(r);
    else if(r.category==='trilhas') groups.trails.push(r);
    else if(r.category==='elementos') groups.elements.push(r);
    else if(['basico','combate','recursos','ressonancia','skill-tree','personagem','equipamentos','combos'].includes(r.category)) groups.rules.push(r);
    else groups.other.push(r);
  }
  return groups;
}
export function getRulesByCategory(category){return RULES.filter(r=>r.category===category);}

export function searchRules(query,options={}){
  const info=expandQuery(query); if(!info.normalized)return[];
  const category=options.category||null;
  const source=RULES.filter(r=>!category||r.category===category);
  let ranked=source.map(r=>scoreRule(r,info,options)).filter(x=>x&&x.score>0).sort((a,b)=>b.score-a.score||a.rule.title.localeCompare(b.rule.title,'pt-BR'));
  if(!ranked.length || ranked[0].score<22){
    const fuzzy=fuzzyCandidates(info,source,options.limit||30);
    const seen=new Set(ranked.map(x=>x.rule.id));
    ranked=[...ranked,...fuzzy.filter(x=>!seen.has(x.rule.id))].sort((a,b)=>b.score-a.score||a.rule.title.localeCompare(b.rule.title,'pt-BR'));
  }
  return ranked.slice(0,options.limit||30);
}

export function analyzeQuery(query,options={}){
  const info=expandQuery(query);
  const results=searchRules(query,{...options,limit:options.limit||30});
  const counts={}; for(const r of results) counts[r.rule.category]=(counts[r.rule.category]||0)+1;
  return {query:String(query||''),normalized:info.normalized,tokens:info.tokens,intent:detectIntent(query),results,categoryCounts:counts,top:results[0]||null};
}

export function buildQuickAnswer(ruleOrId,query=''){
  const rule=typeof ruleOrId==='string'?getRule(ruleOrId):ruleOrId; if(!rule)return null;
  const mechanics=(rule.mechanics||[]).slice(0,5);
  const related=getRelatedRules(rule).slice(0,6);
  return {title:rule.title,category:rule.category,summary:rule.answer||rule.summary||rule.description||'',mechanics,related,status:rule.status||'ok',note:rule.note||'',intent:detectIntent(query)};
}

function getAll(){return RULES;} function getById(id){return getRule(id);} function getRelated(id){return getRelatedRules(id);} function getByCategory(category){return getRulesByCategory(category);} function getReviewIssues(){return REVIEW_ISSUES;}
export const RuleBook={getAll,getById,getRelated,getGroupedRelations,getByCategory,getReviewIssues,search:searchRules,analyze:analyzeQuery,buildQuickAnswer,categories:RULE_CATEGORIES};

if(typeof window!=='undefined'){
  window.RuleBook=RuleBook; window.RPG_RULES=RULES; window.RPG_RULE_SEARCH=searchRules; window.RPG_RULE_BY_ID=RULE_BY_ID;
  window.dispatchEvent(new CustomEvent('rulebook-ready'));
}

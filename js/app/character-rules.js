// Estado Global
let currentMainTab = 'personagem';
let currentTab = 'personagem';
let currentSkillElement = 'frio';
let activeBattle = null;
let battleEnemies = [];
let battleRealtimeChannel = null;
let battleRefreshTimer = null;
let combatPlayersCache = [];
let combatRenderedBattleId = null;
let unlocked = {};
let currentUser = null;
let currentRole = 'player';
let selectedUserId = null;
let profilesCache = [];
let currentProfile = null;
let presenceChannel = null;
let onlineUserIds = new Set();

// --- Central do Mestre ---
let masterHubSection = 'session';
let masterPlayersCache = [];
let masterEnemiesCache = [];
let masterBestiaryCache = [];
let masterNotesCache = '';
let masterBattleLogCache = [];
let plannedSessionsCache = [];
let masterNotesTimer = null;
let masterSetupWarnings = [];


// --- Controle de carregamento / autosave ---
// dataReady só fica true depois que a ficha do jogador selecionado terminou
// de carregar do Supabase. Isso evita o bug onde salvar/autosalvar antes do
// carregamento terminar gravava uma ficha vazia por cima da ficha salva.
let dataReady = false;
let isSaving = false;
let isDirty = false;
let autosaveTimer = null;
let loadedUpdatedAt = null;
let dirtyFields = new Set();
let realtimeChannel = null;
let isApplyingRemoteUpdate = false;
const AUTOSAVE_DELAY_MS = 1200;

function setSaveStatus(status) {
  // status: 'loading' | 'saved' | 'dirty' | 'saving' | 'error'
  const el = document.getElementById('save-status');
  const btn = document.getElementById('save-btn');
  if (!el || !btn) return;

  const labels = {
    loading: '⏳ Carregando ficha...',
    saved: '✓ Tudo salvo',
    dirty: '● Alterações não salvas',
    saving: '⏳ Salvando...',
    error: '⚠ Erro ao salvar'
  };
  el.textContent = labels[status] || '';
  el.className = 'save-status save-status-' + status;

  if (status === 'loading') {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
}

function markDirtyAndScheduleAutosave(field = '*') {
  if (!dataReady || currentTab !== 'personagem' || isApplyingRemoteUpdate) return;
  dirtyFields.add(field);
  isDirty = true;
  setSaveStatus('dirty');

  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    window.saveCharacterData({ silent: true });
  }, AUTOSAVE_DELAY_MS);
}

function getDirtyFieldFromElement(target) {
  if (target.closest('.skill-row')) return 'skills';
  if (target.closest('.attack-editor-card')) return 'attacks';
  const map = {
    'char-name':'name','char-origin':'origin','char-class':'class_name','char-archetype':'archetype','char-player':'player_name','char-level':'level',
    'stat-strength':'strength','stat-dexterity':'dexterity','stat-constitution':'constitution','stat-intelligence':'intelligence','stat-presence':'presence',
    'hp-curr':'hp_current','hp-max':'hp_max','en-curr':'energy_current','en-max':'energy_max','stat-pr':'resonance_points','stat-def':'defense','stat-rd':'damage_reduction','stat-dodge':'dodge','stat-block':'block','stat-mov':'movement_speed','char-avatar':'avatar_url'
  };
  return map[target.id] || '*';
}

function updateHeaderIdentity() {
  const avatar = document.getElementById('header-avatar');
  const title = document.getElementById('page-title');
  if (title) title.textContent = characterData?.name || 'Elemento do Frio';
  const userLabel = document.getElementById('user-label');
  if (userLabel) userLabel.textContent = [characterData?.player_name, currentUser?.email].filter(Boolean).join(' · ');
  if (!avatar) return;
  const initial = (characterData?.name || '?').charAt(0).toUpperCase();
  avatar.replaceChildren();
  const safeAvatar = safeMediaUrl(characterData?.avatar_url);
  if (safeAvatar) {
    const img = document.createElement('img');
    img.src = safeAvatar;
    img.alt = 'Avatar';
    img.referrerPolicy = 'no-referrer';
    avatar.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.textContent = initial;
    avatar.appendChild(span);
  }
}

function setLiveInputValue(id, value) {
  const el = document.getElementById(id);
  if (!el || document.activeElement === el) return;
  const next = value ?? '';
  if (String(el.value) !== String(next)) el.value = next;
}

function patchCharacterSheetFromRemote(remote) {
  if (currentTab !== 'personagem') return;
  const fields = {
    name: 'char-name', origin: 'char-origin', class_name: 'char-class', archetype: 'char-archetype', player_name: 'char-player', level: 'char-level',
    strength: 'stat-strength', dexterity: 'stat-dexterity', constitution: 'stat-constitution', intelligence: 'stat-intelligence', presence: 'stat-presence',
    hp_current: 'hp-curr', hp_max: 'hp-max', energy_current: 'en-curr', energy_max: 'en-max', resonance_points: 'stat-pr', defense: 'stat-def', damage_reduction: 'stat-rd', dodge: 'stat-dodge', block: 'stat-block', movement_speed: 'stat-mov'
  };
  Object.entries(fields).forEach(([key, id]) => {
    if (Object.prototype.hasOwnProperty.call(remote, key)) setLiveInputValue(id, remote[key]);
  });
}

function subscribeToCharacterRealtime(userId) {
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
  realtimeChannel = supabaseClient.channel(`character:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'characters', filter: `user_id=eq.${userId}` }, async (payload) => {
      if (!payload.new) return;
      const remote = payload.new;
      if (loadedUpdatedAt && remote.updated_at && new Date(remote.updated_at) <= new Date(loadedUpdatedAt)) return;
      if (isDirty) {
        console.warn('Chegou uma atualização remota enquanto existem alterações locais pendentes; mantendo os campos em edição.');
        return;
      }
      isApplyingRemoteUpdate = true;
      characterData = { ...characterData, ...remote, skills: remote.skills || characterData.skills || {}, attacks: remote.attacks || characterAttacks };
      if (Array.isArray(remote.attacks)) characterAttacks = [...remote.attacks];
      loadedUpdatedAt = remote.updated_at || loadedUpdatedAt;
      updateHeaderIdentity();
      patchCharacterSheetFromRemote(remote);
      if (currentTab === 'combate') scheduleCombatSync();
      isApplyingRemoteUpdate = false;
    }).subscribe();
}

// Backup local (rede de segurança extra). Isso NÃO substitui o Supabase,
// é só uma cópia de recuperação caso o salvamento na nuvem falhe.
function backupCharacterLocally(userId, payload) {
  try {
    localStorage.setItem('char-backup-' + userId, JSON.stringify({
      savedAt: new Date().toISOString(),
      payload
    }));
  } catch (e) {
    console.warn('Não foi possível salvar backup local:', e);
  }
}

// Avisa o jogador antes de fechar/recarregar a aba se houver alterações
// não salvas (bem comum de acontecer no Steam Deck ao fechar o navegador).
window.addEventListener('beforeunload', (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Ao voltar pelo BFCache, sincroniza somente a area atual em vez de recarregar a pagina inteira.
async function resyncVisibleSection() {
  if (isDirty || !currentUser) return;
  try {
    if (currentRole === 'admin') {
      if (currentTab === 'jogadores') return await loadMasterPlayersOverview();
      if (currentTab === 'combate') return scheduleCombatSync(20);
      if (currentTab === 'bestiario') return await loadMasterHub('bestiary');
      if (currentTab === 'documentos') return await window.loadDocumentsPage?.({ silent:true });
      if (currentTab === 'mestre') return await loadMasterHub('session');
      return;
    }
    if (currentTab === 'personagem' && selectedUserId) return await loadCharacterData();
    if (currentTab === 'combate') return scheduleCombatSync(20);
    if (currentTab === 'documentos') return await window.loadDocumentsPage?.({ silent:true });
  } catch (error) { console.warn('Falha ao ressincronizar a tela:', error); }
}
window.addEventListener('pageshow', (event) => { if (event.persisted) resyncVisibleSection(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') resyncVisibleSection(); });

let characterData = {
  name: 'Novo Personagem',
  origin: '',
  class_name: '',
  archetype: '',
  player_name: '',
  level: 1,

  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  presence: 0,

  hp_current: 0,
  hp_max: 0,
  energy_current: 0,
  energy_max: 0,
  resonance_points: 3,

  defense: 10,
  damage_reduction: 0,
  dodge: 10,
  block: 0,
  movement_speed: 9,

  avatar_url: '',

  skills: {},
  attacks: [
    { nome: "", teste: "3d20+5", dano: "2d6", crit: "x2", alcance: "Curto" }
  ]
};

// Lista de Ataques (Inicia com um vazio)
let characterAttacks = [
  { nome: "", teste: "3d20+5", dano: "2d6", crit: "x2", alcance: "Curto" }
];

// --- SALVA TUDO ---
window.saveCurrentAttacks = function() {
    const cards = document.querySelectorAll('.attack-editor-card');

    characterAttacks = Array.from(cards).map(card => ({
        nome: card.querySelector('.attack-input-name')?.value || "",
        teste: card.querySelector('input[placeholder="3d20+5"]')?.value || "",
        dano: card.querySelector('input[placeholder="2d6"]')?.value || "",
        crit: card.querySelector('input[placeholder="x2"]')?.value || "",
        alcance: card.querySelector('input[placeholder="Curto"]')?.value || ""
    }));

    if (characterAttacks.length === 0) {
        characterAttacks = [
            { nome: "", teste: "3d20+5", dano: "2d6", crit: "x2", alcance: "Curto" }
        ];
    }
};

window.addAttack = function() {
    window.saveCurrentAttacks();
    characterAttacks.push({ nome: "", teste: "", dano: "", crit: "", alcance: "" });
    switchTab('personagem');
};

window.removeAttack = function(index) {
    window.saveCurrentAttacks();

    if (characterAttacks.length > 1) {
        characterAttacks.splice(index, 1);
    } else {
        characterAttacks = [
            { nome: "", teste: "", dano: "", crit: "", alcance: "" }
        ];
    }

    switchTab('personagem');
};

const TAB_META = {
  personagem: '👤 Ficha',
  combate: '⚔️ Combate',
  habilidades: '🌳 Habilidades',
  regras: '📖 Regras'
};
const SKILL_TAB_META = {
  terra:'🌍 Terra', energia:'⚡ Energia', frio:'❄️ Frio', vento:'💨 Vento',
  agua:'💧 Água', fogo:'🔥 Fogo', universais:'✨ Universais', forca:'💪 Força Inata'
};

function getSkillKey(tab, skillName) {
  return `${tab}__${skillName}`;
}

function getTypeBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes('área') || t.includes('area')) return 'type-badge-area';
  if (t.includes('aprimoramento')) return 'type-badge-aprimoramento';
  if (t.includes('mobilidade')) return 'type-badge-mobilidade';
  if (t.includes('ataque')) return 'type-badge-ataque';
  if (t.includes('controle')) return 'type-badge-controle';
  if (t.includes('defesa')) return 'type-badge-defesa';
  if (t.includes('cura')) return 'type-badge-cura';
  if (t.includes('suporte')) return 'type-badge-suporte';
  return 'type-badge-ataque';
}

function renderResDots(res) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="res-dot ${i <= res ? 'filled' : ''}"></span> `;
  }
  return html;
}

function normalizeSkill(skill) {
  return {
    name: skill.name,
    desc: skill.desc || '',
    prereq: skill.prereq || 'Nenhum',
    type: skill.type || 'Ataque',
    range: skill.range || 'Pessoal',
    effect: skill.effect || '',
    res: skill.res || 1
  };
}


function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function safeMediaUrl(value='') {
  const raw=String(value||'').trim(); if(!raw)return '';
  if(/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(raw) || /^blob:/i.test(raw)) return raw;
  try { const url=new URL(raw, location.href); return ['http:','https:'].includes(url.protocol) ? url.href : ''; } catch (_) { return ''; }
}
function getRuleBook() { return window.RuleBook || null; }
function getRule(ruleId) { return getRuleBook()?.getById(ruleId) || null; }
function normalizeRuleId(value='') { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function findRuleForSkill(skillName) {
  const book=getRuleBook(); if(!book) return null;
  const direct=book.getById(normalizeRuleId(skillName));
  if(direct) return direct;
  return (book.search(skillName,{limit:5})||[]).map(x=>x.rule).find(r=>normalizeRuleId(r.title)===normalizeRuleId(skillName)) || null;
}
let ruleLinkIndexCache = null;
let ruleLinkRegexCache = null;
function buildRuleLinkIndex() {
  const book = getRuleBook();
  if (!book) return { map:new Map(), regex:null };
  if (ruleLinkIndexCache && ruleLinkRegexCache) return { map:ruleLinkIndexCache, regex:ruleLinkRegexCache };
  const map = new Map();
  for (const rule of book.getAll()) {
    for (const term of [rule.title, ...(rule.aliases || [])]) {
      const clean = String(term || '').trim();
      if (!clean) continue;
      const key = clean.toLocaleLowerCase('pt-BR');
      if (!map.has(key)) map.set(key, rule.id);
    }
  }
  const terms = [...map.keys()].sort((a,b)=>b.length-a.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  ruleLinkIndexCache = map;
  ruleLinkRegexCache = terms.length ? new RegExp(`(^|[^\\wÀ-ÿ])(${terms.join('|')})(?=$|[^\\wÀ-ÿ])`, 'gi') : null;
  return { map, regex:ruleLinkRegexCache };
}
function escapeAttr(v=''){ return escapeHtml(v).replace(/`/g,'&#096;'); }
function linkifyRules(text='') {
  const { map, regex } = buildRuleLinkIndex();
  const input = String(text);
  if (!regex) return escapeHtml(input);
  regex.lastIndex = 0;
  let out = '', last = 0, m;
  while ((m = regex.exec(input))) {
    const wholeStart = m.index;
    const prefix = m[1] || '';
    const term = m[2] || '';
    const termStart = wholeStart + prefix.length;
    out += escapeHtml(input.slice(last, termStart));
    const id = map.get(term.toLocaleLowerCase('pt-BR'));
    out += id ? `<button class="rule-term" type="button" data-rule-id="${escapeAttr(id)}">${escapeHtml(term)}</button>` : escapeHtml(term);
    last = termStart + term.length;
    if (regex.lastIndex <= wholeStart) regex.lastIndex = wholeStart + 1;
  }
  out += escapeHtml(input.slice(last));
  return out;
}
let ruleHistory=[];
let rulesSearchTimer=null;
function ruleCategoryLabel(category){ return getRuleBook()?.categories?.[category] || category || 'Regra'; }
function getRuleSearchContext(){
  const data = characterData || {};
  return [data.class_name, data.archetype, data.origin, data.element, data.trail]
    .filter(Boolean)
    .map(String);
}
function renderRulesPage(){
 const book=getRuleBook();
 if(!book) return `<section class="rulebook-shell"><p class="rules-empty">Carregando Livro de Regras...</p></section>`;
 const categories=Object.entries(book.categories||{});
 const popular=['pr','rd','ressonancia','esquiva','congelado','imobilizado','contra-ataque','pontos-de-ressonancia'];
 return `<section class="rulebook-shell">
   <header class="rulebook-header"><div><div class="rules-eyebrow">ELEMENTO DO FRIO</div><h1>📚 Livro de Regras</h1><p>Pesquise como você perguntaria durante a sessão: “como funciona esquiva?”, “o que reduz movimento?” ou “o que combina com Congelado?”.</p></div></header>
   <div class="rule-search"><input id="rules-search" type="search" autocomplete="off" placeholder="Pergunte uma regra, condição, habilidade ou efeito..." data-input-call="scheduleRuleSearch(this.value)"></div>
   <div class="rule-category-row"><button class="rule-category-chip active" data-rule-category="all" data-click-call="filterRulesCategory('all')">Todos</button>${categories.map(([id,label])=>`<button class="rule-category-chip" data-rule-category="${id}" data-click-call="filterRulesCategory('${id}')">${escapeHtml(label)}</button>`).join('')}</div>
   <div class="rulebook-popular"><span>Consultas rápidas:</span>${popular.map(id=>{const r=book.getById(id);return r?`<button data-rule-id="${id}">${escapeHtml(r.title)}</button>`:''}).join('')}</div>
   <div id="rules-results" class="rules-results rules-results-smart"><div class="rules-search-start"><strong>Busque por nome ou por dúvida.</strong><span>A busca considera título, aliases, palavras-chave, mecânicas, erros de digitação e relações entre tópicos.</span></div></div>
 </section>`;
}
function scheduleRuleSearch(query){ clearTimeout(rulesSearchTimer); rulesSearchTimer=setTimeout(()=>searchRules(query),150); }
function renderRuleResultCard(result){
 const book=getRuleBook(); const rule=result.rule;
 const related=book.getRelated(rule.id).slice(0,3);
 return `<button class="rule-result-card" data-rule-id="${rule.id}">
   <span class="rule-kicker">${escapeHtml(ruleCategoryLabel(rule.category))}</span>
   <strong>${escapeHtml(rule.title)}</strong>
   <p>${escapeHtml(rule.summary||'')}</p>
   <div class="rule-match-reason">Encontrado em: ${escapeHtml(result.matchReason||'conteúdo relacionado')}</div>
   ${related.length?`<div class="rule-card-related">${related.map(r=>`<span>${escapeHtml(r.title)}</span>`).join('')}</div>`:''}
   ${rule.status==='needs-review'?'<span class="rule-status-review">⚠ Pendente de revisão</span>':''}
 </button>`;
}
function renderRuleQuickAnswer(query,analysis){
 const book=getRuleBook(); const top=analysis?.top; if(!top)return'';
 const answer=book.buildQuickAnswer(top.rule,query); if(!answer)return'';
 return `<article class="rule-quick-answer">
   <div class="rule-quick-answer-head"><div><span class="rule-kicker">RESPOSTA RÁPIDA • ${escapeHtml(ruleCategoryLabel(answer.category))}</span><h2>${escapeHtml(answer.title)}</h2></div><button data-rule-id="${top.rule.id}">Ver regra completa →</button></div>
   <p class="rule-quick-summary">${linkifyRules(answer.summary||'')}</p>
   ${answer.mechanics?.length?`<div class="rule-quick-mechanics"><strong>Principais pontos</strong><ul>${answer.mechanics.map(m=>`<li>${linkifyRules(m)}</li>`).join('')}</ul></div>`:''}
   ${answer.related?.length?`<div class="rule-quick-related"><span>Relacionado:</span>${answer.related.map(r=>`<button data-rule-id="${r.id}">${escapeHtml(r.title)}</button>`).join('')}</div>`:''}
   ${answer.status==='needs-review'?`<div class="rule-status-review">⚠ Esta regra possui um ponto pendente de revisão.${answer.note?` ${escapeHtml(answer.note)}`:''}</div>`:''}
 </article>`;
}
function renderRuleResultFilters(analysis){
 const book=getRuleBook(); const counts=analysis?.categoryCounts||{}; const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
 if(!entries.length)return'';
 return `<div class="rule-result-filters"><span>${analysis.results.length} resultado${analysis.results.length===1?'':'s'}</span><button class="active" data-click-call="searchRules(document.getElementById('rules-search')?.value||'')">Todos</button>${entries.slice(0,7).map(([id,count])=>`<button data-click-call="searchRules(document.getElementById('rules-search')?.value||'',{category:'${id}'})">${escapeHtml(book.categories[id]||id)} <b>${count}</b></button>`).join('')}</div>`;
}
function searchRules(query='',options={}){
 const box=document.getElementById('rules-results'),book=getRuleBook(); if(!box||!book)return;
 const q=String(query).trim();
 if(!q){box.innerHTML='<div class="rules-search-start"><strong>Busque por nome ou por dúvida.</strong><span>Ex.: “como funciona esquiva?”, “reduzir dano”, “habilidades que usam congelado”.</span></div>';return;}
 const analysis=book.analyze(q,{...options,limit:30,contextTerms:getRuleSearchContext()});
 const results=analysis.results||[];
 if(!results.length){box.innerHTML=`<div class="rules-empty-smart"><strong>Nenhuma regra encontrada.</strong><span>Tente um termo mais curto, um sinônimo ou confira a escrita.</span></div>`;return;}
 const rest=results.slice(1);
 box.innerHTML=`${renderRuleQuickAnswer(q,analysis)}${renderRuleResultFilters(analysis)}${rest.length?`<section class="rule-other-results"><h3>Outros resultados relacionados</h3><div class="rule-result-grid">${rest.map(renderRuleResultCard).join('')}</div></section>`:''}`;
}
function filterRulesCategory(category){
 document.querySelectorAll('[data-rule-category]').forEach(b=>b.classList.toggle('active',category==='all'?b.dataset.ruleCategory==='all':b.dataset.ruleCategory===category));
 const box=document.getElementById('rules-results'),book=getRuleBook(); if(!box||!book)return;
 if(category==='all'){box.innerHTML='<div class="rules-search-start"><strong>Todas as categorias disponíveis.</strong><span>Digite uma dúvida acima para receber uma resposta rápida ou escolha outra categoria para navegar.</span></div>';return;}
 const rules=book.getByCategory(category)||[];
 box.innerHTML=`<div class="rule-category-browser"><div class="rule-category-browser-head"><strong>${escapeHtml(ruleCategoryLabel(category))}</strong><span>${rules.length} tópico${rules.length===1?'':'s'}</span></div><div class="rule-result-grid">${rules.map(rule=>renderRuleResultCard({rule,matchReason:'Categoria'})).join('')}</div></div>`;
}
function openRuleById(id,push=true){
 const rule=getRule(id); if(!rule)return;
 if(push) ruleHistory.push(id);
 const main=document.getElementById('main-content'); if(!main)return;
 const book=getRuleBook(), grouped=book.getGroupedRelations?book.getGroupedRelations(id):null, related=book.getRelated(id)||[];
 const section=(title,content)=>content&&content.length?`<section class="rule-section"><h3>${title}</h3>${content}</section>`:'';
 const list=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
 const meta=[['Elemento',rule.element],['Grau',rule.grade],['Tipo',rule.type],['Ação',rule.action],['Alcance',rule.range],['Duração',rule.duration],['Pré-requisito',rule.prerequisite]].filter(x=>x[1]);
 const relationLabels={rules:'Regras relacionadas',conditions:'Condições relacionadas',abilities:'Habilidades relacionadas',classes:'Classes relacionadas',trails:'Trilhas relacionadas',elements:'Elementos relacionados',other:'Outros relacionados'};
 const relationHtml=grouped?Object.entries(grouped).filter(([,items])=>items?.length).map(([key,items])=>`<div class="rule-relation-group"><span>${relationLabels[key]||'Relacionado'}</span><div class="rule-related-list">${items.map(r=>`<button class="rule-related-item" data-rule-id="${r.id}">${escapeHtml(r.title)}</button>`).join('')}</div></div>`).join(''):(related.length?`<div class="rule-related-list">${related.map(r=>`<button class="rule-related-item" data-rule-id="${r.id}">${escapeHtml(r.title)}</button>`).join('')}</div>`:'');
 main.innerHTML=`<section class="rule-detail"><div class="rule-breadcrumb"><button data-click-call="backFromRule()">← Voltar</button><span>Livro de Regras › ${escapeHtml(ruleCategoryLabel(rule.category))} › ${escapeHtml(rule.title)}</span></div><div class="rule-detail-head"><div><span class="rule-kicker">${escapeHtml(ruleCategoryLabel(rule.category))}</span><h1>${escapeHtml(rule.title)}</h1><p>${escapeHtml(rule.summary||'')}</p></div>${rule.status==='needs-review'?'<div class="rule-status-review">⚠ Regra pendente de revisão</div>':''}</div>${meta.length?`<div class="rule-meta">${meta.map(([k,v])=>`<span><b>${k}:</b> ${escapeHtml(v)}</span>`).join('')}</div>`:''}${section('Como funciona',rule.description&&`<p>${linkifyRules(rule.description)}</p>`)}${section('Mecânica',rule.mechanics?.length?list(rule.mechanics.map(linkifyRules)): '')}${section('Exemplos',rule.examples?.length?list(rule.examples.map(linkifyRules)):'')}${section('Tags',rule.tags?.length?`<div class="rule-tags">${rule.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>`:'')}${relationHtml?`<section class="rule-section"><h3>Relacionado</h3>${relationHtml}</section>`:''}${rule.note?`<section class="rule-section rule-review-note"><h3>Observação</h3><p>${escapeHtml(rule.note)}</p></section>`:''}</section>`;
 window.scrollTo({top:0,behavior:'smooth'});
}
function openRuleModal(term){ const book=getRuleBook(); if(!book)return; const found=(book.search(term,{limit:1})||[])[0]?.rule; if(found) openRuleById(found.id); }
function closeRuleModal(){}
function backFromRule(){
 ruleHistory.pop(); const previous=ruleHistory.pop();
 if(previous){openRuleById(previous,true);return;}
 switchTab('regras');
}
function openRuleForSkill(name){
 const rule=findRuleForSkill(name);
 if(!rule){alert('Não foi encontrada uma entrada estruturada para esta habilidade no Livro de Regras.');return;}
 switchTab('regras'); setTimeout(()=>openRuleById(rule.id),0);
}
function renderRulesContext(){}
function searchRulesFromContext(q){ switchTab('regras'); setTimeout(()=>{const i=document.getElementById('rules-search');if(i){i.value=q;searchRules(q);}},0); }
window.openRuleById=openRuleById; window.openRuleForSkill=openRuleForSkill; window.searchRules=searchRules; window.filterRulesCategory=filterRulesCategory; window.scheduleRuleSearch=scheduleRuleSearch; window.backFromRule=backFromRule;

function renderSkillCard(skill, tab, delay = 0) {
  const s = normalizeSkill(skill);
  const key = getSkillKey(tab, s.name);
  const isUnlocked = unlocked[key] || false;
  const canEdit = currentRole === 'admin' || selectedUserId === currentUser?.id;

  return `
    <div class="skill-card ${isUnlocked ? 'unlocked' : ''} fade-in" style="animation-delay:${delay}ms">
      <div class="flex items-start justify-between gap-3 mb-2">
        <h3 class="font-bold text-base" style="font-family:'Cinzel',serif; color:${isUnlocked ? 'var(--primary-color)' : 'var(--text-color)'};">
          ${s.name}
        </h3>
        <input
          type="checkbox"
          class="checkbox-custom"
          ${isUnlocked ? 'checked' : ''}
          ${!canEdit ? 'disabled' : ''}
          data-change-call="toggleSkill('${key}', this)"
          title="Desbloquear"
        >
      </div>

      <p class="text-xs opacity-70 mb-3 leading-relaxed">${linkifyRules(s.desc)}</p>

      <div class="flex flex-wrap gap-2 mb-3">
        <span class="badge ${getTypeBadgeClass(s.type)}">${s.type}</span>
        <span class="badge" style="background:rgba(255,255,255,0.07); color:var(--text-color);">📍 ${s.range}</span>
      </div>

      <div class="text-xs mb-2" style="color:var(--secondary-color);">
        <span class="font-semibold" style="color:var(--text-color);">Pré-requisito:</span> ${s.prereq}
      </div>

      <div class="text-xs mb-3 opacity-80">
        <span class="font-semibold" style="color:var(--text-color);">Efeito:</span> ${s.effect}
      </div>

      <div class="flex items-center gap-1 text-xs">
        <span class="opacity-60 mr-1">Ressonância:</span>
        ${renderResDots(s.res)}
      </div>
      ${findRuleForSkill(s.name) ? `<button class="skill-rule-link" type="button" data-click-call="openRuleForSkill(${escapeAttr(JSON.stringify(s.name))})">📖 Ver regra completa</button>` : ''}
    </div>
  `;
}

function renderTab(tab) {
  const data = SKILLS[tab];
  if (!data || !data.paths) return '<p class="opacity-60">Nenhuma habilidade cadastrada.</p>';

  let html = `<div class="skills-grid grid gap-6 element-${tab}" style="grid-template-columns: repeat(${data.paths.length}, minmax(280px, 1fr));">`;

  data.paths.forEach(path => {
    html += `<div class="flex flex-col">`;
    html += `<h2 class="path-title">${path.name}</h2>`;

    path.skills.forEach((skill, idx) => {
      if (idx > 0) {
        const prevKey = getSkillKey(tab, path.skills[idx - 1].name);
        html += `<div class="path-line ${unlocked[prevKey] ? 'active' : ''}"></div>`;
      }
      html += renderSkillCard(skill, tab, idx * 80);
    });

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}



//salvar no supabase quando desbloquear ou bloquear uma skill, e atualizar a interface



function renderAbilitiesHub() {
  const buttons = Object.entries(SKILL_TAB_META).map(([key,label]) =>
    `<button class="skill-element-btn ${currentSkillElement===key?'active':''}" data-click-call="selectSkillElement('${key}')">${label}</button>`
  ).join('');
  return `<section class="abilities-hub fade-in"><header class="section-hero"><div><span class="section-eyebrow">PROGRESSÃO</span><h2>🌳 Árvore de Habilidades</h2><p>Consulte e administre a progressão do personagem. Na ficha ficam apenas as habilidades já adquiridas.</p></div></header><div class="skill-element-nav">${buttons}</div><div id="skill-tree-content">${renderTab(currentSkillElement)}</div></section>`;
}
window.selectSkillElement = function(key){ currentSkillElement=key; const main=document.getElementById('main-content'); main.innerHTML=renderAbilitiesHub(); if(window.lucide) lucide.createIcons(); };


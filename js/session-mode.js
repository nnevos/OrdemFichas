// =========================================================
// MODO SESSAO - fechamento da versao V4
// Reaproveita Combate/Regras existentes sem novas tabelas.
// =========================================================

const SESSION_FAVORITES_KEY = 'elemento-frio-session-favorites';
let sessionCommandOpen = false;

function getSessionFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_FAVORITES_KEY) || '[]');
    return Array.isArray(raw) ? raw.slice(0, 8) : [];
  } catch (_) { return []; }
}

function saveSessionFavorites(list) {
  try { localStorage.setItem(SESSION_FAVORITES_KEY, JSON.stringify((list || []).slice(0, 8))); } catch (_) {}
}

window.toggleSessionFavorite = function(key, label = '') {
  const list = getSessionFavorites();
  const idx = list.findIndex(x => x.key === key);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift({ key, label });
  saveSessionFavorites(list);
  if (currentTab === 'sessao') renderSessionModeIntoMain();
};

function isSessionFavorite(key) {
  return getSessionFavorites().some(x => x.key === key);
}

function sessionEntity(type, id) {
  if (type === 'player') return combatPlayersCache.find(p => String(p.user_id) === String(id)) || null;
  return battleEnemies.find(e => String(e.id) === String(id)) || null;
}

window.selectSessionEntity = function(type, id) {
  selectedCombatTarget = { type, id:String(id) };
  patchSessionContext();
  document.querySelectorAll('[data-session-entity]').forEach(el => {
    el.classList.toggle('selected', el.dataset.sessionEntity === `${type}:${id}`);
  });
};

function renderSessionInitiativeCompact() {
  const order = Array.isArray(activeBattle?.turn_order) ? activeBattle.turn_order : [];
  const current = activeBattle?.turn_index || 0;
  if (!order.length) {
    return `<div class="session-empty-small">Nenhuma iniciativa definida.${currentRole==='admin'?` <button data-click-call="openInitiativeEditor()">Definir</button>`:''}</div>`;
  }
  return `<div class="session-init-list">${order.map((item,i)=>`
    <button class="session-init-item ${i===current?'active':''}" data-click-call="selectSessionEntity('${escapeAttr(item.type)}','${escapeAttr(item.id)}')">
      <span>${i+1}</span><b>${escapeHtml(item.label||'Participante')}</b><em>${Number(item.initiative)||0}</em>
    </button>`).join('')}</div>`;
}

function renderSessionPlayerMini(p) {
  const hpMax = Math.max(1, Number(p.hp_max)||1);
  const hpPct = Math.max(0, Math.min(100, Math.round((Number(p.hp_current)||0)/hpMax*100)));
  const selected = selectedCombatTarget?.type==='player' && String(selectedCombatTarget.id)===String(p.user_id);
  return `<button class="session-entity-card ally ${selected?'selected':''}" data-session-entity="player:${escapeAttr(p.user_id)}" data-click-call="selectSessionEntity('player','${escapeAttr(p.user_id)}')">
    <div class="session-entity-head"><strong>${escapeHtml(p.name||'Personagem')}</strong><span>NV ${Number(p.level)||1}</span></div>
    <small>${escapeHtml([p.class_name,p.archetype].filter(Boolean).join(' • '))}</small>
    <div class="session-mini-bar"><i style="width:${hpPct}%"></i></div>
    <div class="session-mini-meta"><b>PV ${Number(p.hp_current)||0}/${Number(p.hp_max)||0}</b><span>PD ${Number(p.energy_current)||0}/${Number(p.energy_max)||0}</span></div>
  </button>`;
}

function renderSessionEnemyMini(e) {
  const canHp = enemyVisible(e,'hp');
  const hpMax = Math.max(1, Number(e.hp_max)||1);
  const hpPct = Math.max(0, Math.min(100, Math.round((Number(e.hp_current)||0)/hpMax*100)));
  const selected = selectedCombatTarget?.type==='enemy' && String(selectedCombatTarget.id)===String(e.id);
  return `<button class="session-entity-card enemy ${selected?'selected':''}" data-session-entity="enemy:${escapeAttr(e.id)}" data-click-call="selectSessionEntity('enemy','${escapeAttr(e.id)}')">
    <div class="session-entity-head"><strong>${enemyVisible(e,'name')?escapeHtml(e.name||'Inimigo'):'Inimigo desconhecido'}</strong><span>${escapeHtml((e.rank||'').toUpperCase())}</span></div>
    <small>${escapeHtml(e.subtitle||e.element||'')}</small>
    ${canHp?`<div class="session-mini-bar enemy"><i style="width:${hpPct}%"></i></div><div class="session-mini-meta"><b>PV ${enemyVisible(e,'hp_numbers')?`${Number(e.hp_current)||0}/${Number(e.hp_max)||0}`:'?'}</b><span>DEF ${enemyVisible(e,'defense')?(e.defense??10):'?'}</span></div>`:''}
  </button>`;
}

function sessionMyCharacter() {
  return combatPlayersCache.find(p => String(p.user_id) === String(currentUser?.id)) || null;
}

function sessionSkillList() {
  try { return typeof getMyUnlockedSkills === 'function' ? getMyUnlockedSkills() : []; }
  catch (_) { return []; }
}

function renderSessionActions() {
  const me = sessionMyCharacter();
  if (!me || currentRole === 'admin') return '';
  const attacks = (Array.isArray(me.attacks)?me.attacks:[]).filter(a=>a?.nome);
  const skills = sessionSkillList().slice(0,12);
  const favs = getSessionFavorites();
  const favoriteButtons = favs.map(f => {
    if (f.key.startsWith('attack:')) {
      const name=f.key.slice(7); const idx=attacks.findIndex(a=>a.nome===name); if(idx<0)return '';
      return `<button class="session-fav-action" data-click-call="useQuickAttack(${idx})">⚔ ${escapeHtml(name)}</button>`;
    }
    if (f.key.startsWith('skill:')) {
      const [,element,...parts]=f.key.split(':'); const name=parts.join(':');
      const found=skills.find(s=>s.element===element&&s.name===name); if(!found)return '';
      return `<button class="session-fav-action" data-click-call="useQuickSkill('${escapeAttr(element)}','${escapeAttr(name)}')">✨ ${escapeHtml(name)}</button>`;
    }
    if (f.key.startsWith('rule:')) {
      const id=f.key.slice(5); const r=window.RuleBook?.getById?.(id); if(!r)return '';
      return `<button class="session-fav-action" data-click-call="openSessionRule('${escapeAttr(id)}')">📖 ${escapeHtml(r.title)}</button>`;
    }
    return '';
  }).filter(Boolean).join('');

  return `<section class="session-actions-panel">
    <div class="session-panel-title"><span class="section-eyebrow">ATALHOS</span><h3>Suas ações</h3><small>Role os dados fisicamente e informe o resultado no painel de uso.</small></div>
    ${favoriteButtons?`<div class="session-favorites">${favoriteButtons}</div>`:''}
    <details ${favoriteButtons?'':'open'}><summary>Ataques e habilidades</summary>
      <div class="session-actions-grid">
        ${attacks.map((a,i)=>{const key=`attack:${a.nome}`;return `<div class="session-action-wrap"><button data-click-call="useQuickAttack(${i})"><strong>${escapeHtml(a.nome)}</strong><small>${escapeHtml([a.dano,a.alcance].filter(Boolean).join(' • '))}</small></button><button class="session-star ${isSessionFavorite(key)?'active':''}" data-click-call="event.stopPropagation();toggleSessionFavorite('${escapeAttr(key)}','${escapeAttr(a.nome)}')">★</button></div>`;}).join('')}
        ${skills.map(s=>{const key=`skill:${s.element}:${s.name}`;return `<div class="session-action-wrap"><button data-click-call="useQuickSkill('${escapeAttr(s.element)}','${escapeAttr(s.name)}')"><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml([s.type,s.range].filter(Boolean).join(' • '))}</small></button><button class="session-star ${isSessionFavorite(key)?'active':''}" data-click-call="event.stopPropagation();toggleSessionFavorite('${escapeAttr(key)}','${escapeAttr(s.name)}')">★</button></div>`;}).join('')}
      </div>
    </details>
  </section>`;
}

function renderSessionContext() {
  const target = selectedCombatTarget ? sessionEntity(selectedCombatTarget.type, selectedCombatTarget.id) : null;
  if (!target) {
    return `<div class="session-context-empty"><strong>Contexto</strong><p>Selecione um aliado ou inimigo para ver os detalhes aqui.</p><button data-click-call="openSessionCommand()">⌘ Buscar ação/regra</button></div>`;
  }
  if (selectedCombatTarget.type === 'player') {
    return `<div class="session-context-card"><span class="section-eyebrow">PERSONAGEM</span><h3>${escapeHtml(target.name||'Personagem')}</h3><p>${escapeHtml([target.class_name,target.archetype,target.origin].filter(Boolean).join(' • '))}</p><div class="session-context-stats"><span>PV <b>${target.hp_current||0}/${target.hp_max||0}</b></span><span>PD <b>${target.energy_current||0}/${target.energy_max||0}</b></span><span>DEF <b>${target.defense??10}</b></span><span>ESQ <b>${target.dodge??0}</b></span></div>${renderTimedEffects('player',target.user_id)}${currentRole==='admin'?`<button data-click-call="selectCharacterFromPicker('${escapeAttr(target.user_id)}');setTimeout(()=>switchTab('personagem'),80)">Abrir ficha completa →</button>`:''}</div>`;
  }
  const attacks = typeof normalizeEnemyActionsV3==='function'?normalizeEnemyActionsV3(target.attacks,'Ataque'):[];
  const abilities = typeof normalizeEnemyActionsV3==='function'?normalizeEnemyActionsV3(target.abilities,'Habilidade'):[];
  return `<div class="session-context-card"><span class="section-eyebrow">INIMIGO</span><h3>${enemyVisible(target,'name')?escapeHtml(target.name||'Inimigo'):'Inimigo desconhecido'}</h3><p>${escapeHtml(target.subtitle||'')}</p><div class="session-context-stats">${enemyVisible(target,'hp')?`<span>PV <b>${enemyVisible(target,'hp_numbers')?`${target.hp_current||0}/${target.hp_max||0}`:'Oculto'}</b></span>`:''}${enemyVisible(target,'defense')?`<span>DEF <b>${target.defense??10}</b></span>`:''}${enemyVisible(target,'dodge')?`<span>ESQ <b>${target.dodge??0}</b></span>`:''}${enemyVisible(target,'block')?`<span>ARM <b>${target.block??0}</b></span>`:''}</div>${renderTimedEffects('enemy',target.id)}${currentRole==='admin'&&attacks.length?`<h4>Ataques</h4><div class="session-context-actions">${attacks.map((a,i)=>`<button data-click-call="useEnemyManualAction('${escapeAttr(target.id)}','attack',${i})"><strong>${escapeHtml(a.name)}</strong><small>${escapeHtml(a.damage||a.effect||'')}</small></button>`).join('')}</div>`:''}${currentRole==='admin'&&abilities.length?`<h4>Habilidades</h4><div class="session-context-actions">${abilities.map((a,i)=>`<button data-click-call="useEnemyManualAction('${escapeAttr(target.id)}','ability',${i})"><strong>${escapeHtml(a.name)}</strong><small>${escapeHtml(a.damage||a.effect||'')}</small></button>`).join('')}</div>`:''}${currentRole==='admin'?`<div class="session-context-footer"><button data-click-call="openEnemyDetails('${escapeAttr(target.id)}')">Ficha</button><button data-click-call="openEnemyEditor('${escapeAttr(target.id)}')">Editar</button></div>`:''}</div>`;
}

function renderSessionHistoryCompact() {
  const items=(battleLogPublicCache||[]).slice(0,8);
  return `<div class="session-history"><div class="session-panel-title"><span class="section-eyebrow">HISTÓRICO</span><h3>Últimos eventos</h3></div>${items.map(x=>`<div><time>${new Date(x.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time><span>${escapeHtml(x.message||'')}</span></div>`).join('')||'<small>Nenhum evento registrado.</small>'}</div>`;
}

function renderSessionMode() {
  const title = activeGameSession?.title || activeBattle?.name || 'Modo Sessão';
  const subtitle = activeBattle ? `Rodada ${activeBattle.round||1}${activeBattle.turn_label?' • Turno: '+activeBattle.turn_label:''}` : 'Nenhum combate ativo';
  return `<section class="session-shell">
    <header class="session-topbar"><div><span class="section-eyebrow">MODO SESSÃO</span><h2>🎲 ${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}${activeGameSession?` • <b data-session-clock>${sessionElapsed()}</b>`:''}</p></div><div class="session-top-actions"><button data-click-call="openSessionCommand()">⌘ Comandos</button><button data-click-call="switchTab('combate')">Combate completo</button>${currentRole==='admin'?`<button data-click-call="switchTab('mestre')">Mestre</button>`:''}</div></header>
    ${!activeBattle?`<div class="session-no-battle"><h3>Nenhum combate ativo</h3><p>O Modo Sessão continua disponível para consulta rápida.${currentRole==='admin'?' Inicie um combate quando precisar da iniciativa e dos inimigos.':''}</p>${currentRole==='admin'?'<button class="primary-action" data-click-call="startBattle()">+ Iniciar combate</button>':''}</div>`:''}
    <div class="session-layout">
      <aside class="session-pane initiative-pane"><div class="session-panel-title"><span class="section-eyebrow">ORDEM</span><h3>Iniciativa</h3></div>${renderSessionInitiativeCompact()}</aside>
      <main class="session-pane session-center"><section><div class="session-panel-title"><span class="section-eyebrow">ALIADOS</span><h3>Grupo</h3></div><div class="session-entity-grid allies">${combatPlayersCache.map(renderSessionPlayerMini).join('')||'<small>Nenhum personagem.</small>'}</div></section><section><div class="session-panel-title"><span class="section-eyebrow">INIMIGOS</span><h3>Encontro</h3></div><div class="session-entity-grid enemies">${battleEnemies.map(renderSessionEnemyMini).join('')||'<small>Nenhum inimigo.</small>'}</div></section>${renderSessionActions()}</main>
      <aside class="session-pane session-context" data-session-context>${renderSessionContext()}${renderSessionHistoryCompact()}</aside>
    </div>
  </section>`;
}

function renderSessionModeIntoMain() {
  const main=document.getElementById('main-content'); if(!main)return;
  main.innerHTML=renderSessionMode();
  if(window.lucide)window.lucide.createIcons();
  syncSessionClockTimer?.();
}

function patchSessionContext() {
  const el=document.querySelector('[data-session-context]');
  if(el) el.innerHTML=renderSessionContext()+renderSessionHistoryCompact();
}

async function loadSessionMode() {
  const main=document.getElementById('main-content'); if(!main)return;
  main.innerHTML='<p class="rules-empty">Carregando modo sessão...</p>';
  const state=await fetchCombatState();
  if(state.error){ main.innerHTML=renderCombatSetupNotice(state.error); return; }
  activeBattle=state.battle; battleEnemies=state.enemies; combatPlayersCache=state.players;
  if (!selectedCombatTarget) {
    const firstEnemy=battleEnemies[0]; const me=sessionMyCharacter();
    if(firstEnemy) selectedCombatTarget={type:'enemy',id:String(firstEnemy.id)};
    else if(me) selectedCombatTarget={type:'player',id:String(me.user_id)};
  }
  renderSessionModeIntoMain();
  subscribeBattleRealtime();
}
window.loadSessionMode=loadSessionMode;

async function syncSessionMode() {
  if(currentTab!=='sessao')return;
  const state=await fetchCombatState(); if(state.error)return;
  activeBattle=state.battle; battleEnemies=state.enemies; combatPlayersCache=state.players;
  renderSessionModeIntoMain();
}
window.syncSessionMode=syncSessionMode;

// ---------- Command palette ----------
function sessionCommandEntries(query='') {
  const q=String(query||'').trim(); const entries=[];
  const baseTabs=currentRole==='admin'?[['jogadores','Jogadores'],['sessao','Modo Sessão'],['combate','Combate'],['bestiario','Bestiário'],['regras','Regras'],['mestre','Mestre']]:[['personagem','Minha Ficha'],['sessao','Modo Sessão'],['combate','Combate'],['habilidades','Habilidades'],['regras','Regras']];
  baseTabs.forEach(([id,label])=>entries.push({kind:'Navegação',label,action:`switchTab('${id}')`}));
  combatPlayersCache.forEach(p=>entries.push({kind:'Personagem',label:p.name||'Personagem',action:`selectSessionEntity('player','${escapeAttr(p.user_id)}')`}));
  battleEnemies.forEach(e=>entries.push({kind:'Inimigo',label:e.name||'Inimigo',action:`selectSessionEntity('enemy','${escapeAttr(e.id)}')`}));
  if(q && window.RuleBook?.search){
    window.RuleBook.search(q,{limit:6}).forEach(r=>entries.push({kind:'Regra',label:r.title||r.rule?.title||'Regra',action:`openSessionRule('${escapeAttr(r.id||r.rule?.id||'')}')`}));
  }
  const n=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const nq=n(q);
  return entries.filter(x=>!nq||n(x.label).includes(nq)||n(x.kind).includes(nq)).slice(0,16);
}

window.openSessionRule=function(id){
  if(!id)return; switchTab('regras'); setTimeout(()=>openRuleById(id),0);
};

window.openSessionCommand=function(){
  document.getElementById('session-command')?.remove(); sessionCommandOpen=true;
  document.body.insertAdjacentHTML('beforeend',`<div id="session-command" class="session-command-modal"><button class="picker-backdrop" data-click-call="closeSessionCommand()"></button><div class="session-command-box"><input id="session-command-input" autocomplete="off" placeholder="Buscar regra, personagem, inimigo ou página..." data-input-call="renderSessionCommandResults(this.value)"><div id="session-command-results"></div><small>Atalho: Ctrl/⌘ + K</small></div></div>`);
  setTimeout(()=>{document.getElementById('session-command-input')?.focus();renderSessionCommandResults('');},0);
};
window.closeSessionCommand=function(){document.getElementById('session-command')?.remove();sessionCommandOpen=false;};
window.renderSessionCommandResults=function(q){
  const el=document.getElementById('session-command-results');if(!el)return;
  el.innerHTML=sessionCommandEntries(q).map(x=>`<button data-click-call="closeSessionCommand();${x.action}"><span>${escapeHtml(x.kind)}</span><strong>${escapeHtml(x.label)}</strong></button>`).join('')||'<p>Nenhum resultado.</p>';
};

document.addEventListener('keydown',ev=>{
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();sessionCommandOpen?closeSessionCommand():openSessionCommand();}
  if(ev.key==='Escape'&&sessionCommandOpen)closeSessionCommand();
});

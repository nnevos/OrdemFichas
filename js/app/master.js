
function subscribeSessionPresence(profile) {
  if (presenceChannel) supabaseClient.removeChannel(presenceChannel);
  presenceChannel = supabaseClient.channel('elemento-frio-presence', {
    config: { presence: { key: currentUser?.id || crypto.randomUUID() } }
  });

  presenceChannel.on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    onlineUserIds = new Set(
      Object.values(state || {}).flat().map(item => item.user_id).filter(Boolean)
    );
    if (currentTab === 'mestre' && masterHubSection === 'session') {
      const counter = document.querySelector('[data-master-online]');
      if (counter) counter.textContent = String(masterPlayersCache.filter(p => onlineUserIds.has(p.user_id)).length);
    }
  });

  presenceChannel.subscribe(async status => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        user_id: currentUser.id,
        username: profile?.username || currentUser.email,
        role: profile?.role || 'player',
        online_at: new Date().toISOString()
      });
    }
  });
}

async function loadMasterHub(section = masterHubSection, { background=false, force=false } = {}) {
  if (currentRole !== 'admin') return;
  masterHubSection = section;

  const main = document.getElementById('main-content');
  if (!main) return;

  // O Bestiário é independente de combate/notas. Carregar tudo junto fazia a
  // tela ficar presa em "Carregando central do mestre..." quando qualquer
  // outro módulo do Supabase falhava ou demorava.
  if (section === 'bestiary') {
    if(background && masterBestiaryCache.length && window.UiFlow?.isFresh('bestiario',15000)) return;
    if (!background) main.innerHTML = '<section class="master-center"><p class="rules-empty">Carregando bestiário...</p></section>';
    masterSetupWarnings = [];

    try {
      const [bestiaryRes, encountersRes] = await Promise.allSettled([
        supabaseClient.from('enemy_templates').select('*').order('name'),
        supabaseClient.from('encounter_templates').select('*').order('name')
      ]);

      if (bestiaryRes.status === 'fulfilled') {
        if (bestiaryRes.value.error) {
          masterSetupWarnings.push('Bestiário: ' + bestiaryRes.value.error.message);
          masterBestiaryCache = [];
        } else {
          masterBestiaryCache = bestiaryRes.value.data || [];
        }
      } else {
        masterSetupWarnings.push('Bestiário: ' + (bestiaryRes.reason?.message || 'Falha ao carregar.'));
        masterBestiaryCache = [];
      }

      if (encountersRes.status === 'fulfilled') {
        if (encountersRes.value.error) {
          masterSetupWarnings.push('Encontros: ' + encountersRes.value.error.message);
          encounterTemplatesCache = [];
        } else {
          encounterTemplatesCache = encountersRes.value.data || [];
        }
      } else {
        masterSetupWarnings.push('Encontros: ' + (encountersRes.reason?.message || 'Falha ao carregar.'));
        encounterTemplatesCache = [];
      }
    } catch (error) {
      console.error('Erro ao carregar Bestiário:', error);
      masterSetupWarnings.push('Bestiário: ' + (error?.message || 'Erro inesperado.'));
      masterBestiaryCache = [];
    }

    if (currentTab !== 'bestiario') return;
    main.innerHTML = renderStandaloneBestiary();
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Planejamento e notas nao precisam carregar combate/bestiario.
  if (section === 'planning') {
    if (!background && !plannedSessionsCache.length) main.innerHTML = '<section class="master-center"><p class="rules-empty">Carregando sessões...</p></section>';
    try { if (typeof window.loadPlannedSessions === 'function') await window.loadPlannedSessions(); }
    catch(error){ masterSetupWarnings=['Planejamento: '+(error?.message||'Falha ao carregar.')]; }
    if (currentTab === 'mestre') { main.innerHTML=renderMasterHub(); if(window.lucide)window.lucide.createIcons(); }
    return;
  }

  if (section === 'notes') {
    if (!background && !masterNotesCache) main.innerHTML = '<section class="master-center"><p class="rules-empty">Carregando notas...</p></section>';
    try {
      const notesRes=await supabaseClient.from('gm_notes').select('*').eq('owner_id',currentUser.id).maybeSingle();
      if(notesRes.error) masterSetupWarnings=['Notas: '+notesRes.error.message];
      else masterNotesCache=notesRes.data?.content||'';
    } catch(error){ masterSetupWarnings=['Notas: '+(error?.message||'Falha ao carregar.')]; }
    if (currentTab === 'mestre') { main.innerHTML=renderMasterHub(); if(window.lucide)window.lucide.createIcons(); }
    return;
  }

  if (!background) main.innerHTML = '<section class="master-center"><p class="rules-empty">Carregando central do mestre...</p></section>';
  masterSetupWarnings = [];

  try {
    const results = await Promise.allSettled([
      fetchCombatState(),
      supabaseClient.from('enemy_templates').select('*').order('name'),
      supabaseClient.from('gm_notes').select('*').eq('owner_id', currentUser.id).maybeSingle()
    ]);

    const combatResult = results[0];
    const bestiaryResult = results[1];
    const notesResult = results[2];

    if (combatResult.status === 'fulfilled') {
      const combat = combatResult.value;
      if (!combat.error) {
        activeBattle = combat.battle;
        battleEnemies = combat.enemies || [];
        masterEnemiesCache = combat.enemies || [];
        masterPlayersCache = combat.players || [];
      } else {
        masterSetupWarnings.push('Combate: ' + combat.error.message);
      }
    } else {
      masterSetupWarnings.push('Combate: ' + (combatResult.reason?.message || 'Falha ao carregar.'));
    }

    if (bestiaryResult.status === 'fulfilled') {
      const bestiaryRes = bestiaryResult.value;
      if (bestiaryRes.error) masterSetupWarnings.push('Bestiário: ' + bestiaryRes.error.message);
      masterBestiaryCache = bestiaryRes.data || [];
    } else {
      masterSetupWarnings.push('Bestiário: ' + (bestiaryResult.reason?.message || 'Falha ao carregar.'));
      masterBestiaryCache = [];
    }

    if (notesResult.status === 'fulfilled') {
      const notesRes = notesResult.value;
      if (notesRes.error) masterSetupWarnings.push('Notas: ' + notesRes.error.message);
      masterNotesCache = notesRes.data?.content || '';
    } else {
      masterSetupWarnings.push('Notas: ' + (notesResult.reason?.message || 'Falha ao carregar.'));
      masterNotesCache = '';
    }

    masterBattleLogCache = [];
    if (activeBattle?.id) {
      try {
        const logRes = await supabaseClient
          .from('battle_log')
          .select('*')
          .eq('battle_id', activeBattle.id)
          .order('created_at', { ascending: false })
          .limit(30);

        if (logRes.error) masterSetupWarnings.push('Histórico: ' + logRes.error.message);
        else masterBattleLogCache = logRes.data || [];
      } catch (error) {
        masterSetupWarnings.push('Histórico: ' + (error?.message || 'Falha ao carregar.'));
      }
    }
  } catch (error) {
    console.error('Erro ao carregar Central do Mestre:', error);
    masterSetupWarnings.push(error?.message || 'Erro inesperado ao carregar a Central do Mestre.');
  }

  if (typeof window.loadPlannedSessions === 'function') {
    try { await window.loadPlannedSessions(); } catch (error) { masterSetupWarnings.push('Planejamento: ' + (error?.message || 'Falha ao carregar.')); }
  }

  if (currentTab !== 'mestre') return;
  main.innerHTML = renderMasterHub();
  if (window.lucide) window.lucide.createIcons();
}

function renderMasterHub() {
  const nav = [
    ['session','Mesa atual','Conduza a sessao em andamento'],
    ['planning','Sessoes','Prepare e organize seus roteiros'],
    ['notes','Notas','Anotacoes privadas gerais']
  ];
  const content = masterHubSection === 'notes'
    ? renderMasterNotes()
    : masterHubSection === 'planning'
      ? (window.renderSessionPlanner ? window.renderSessionPlanner() : '<p class="rules-empty">Planejador indisponivel.</p>')
      : renderMasterSession();

  return `<section class="master-center master-center-v2 fade-in">
    <header class="master-topbar-v2">
      <div><span class="section-eyebrow">CENTRAL DO MESTRE</span><h2>Mesa de jogo</h2><p>Planejamento, conducao e notas sem misturar as ferramentas da ficha.</p></div>
      <div class="master-topbar-actions">${activeBattle ? `<button class="primary-action" data-click-call="switchTab('combate')">Abrir combate</button>` : `<button data-click-call="startBattle();setTimeout(()=>loadMasterHub('session'),250)">+ Combate</button>`}</div>
    </header>
    ${masterSetupWarnings.length ? `<div class="master-warning"><strong>Configuracao pendente</strong><span>Algum modulo do Supabase nao respondeu corretamente. As outras paginas continuam independentes.</span></div>` : ''}
    <div class="master-app-shell">
      <aside class="master-side-nav">
        <div class="master-side-nav-label">MESTRE</div>
        ${nav.map(([id,label,desc])=>`<button class="${masterHubSection===id?'active':''}" data-click-call="setMasterSection('${id}')"><strong>${label}</strong><small>${desc}</small></button>`).join('')}
        <div class="master-side-nav-divider"></div>
        <button data-click-call="switchTab('jogadores')"><strong>Jogadores</strong><small>Fichas e recursos do grupo</small></button>
        <button data-click-call="switchTab('bestiario')"><strong>Bestiario</strong><small>Biblioteca de inimigos</small></button>
        <button data-click-call="switchTab('combate')"><strong>Combate</strong><small>Iniciativa e encontro atual</small></button>
      </aside>
      <main class="master-work-area">${content}</main>
    </div>
  </section>`;
}

function renderStandaloneBestiary() {
  return `<section class="standalone-master-page bestiary-page">
    <header class="section-hero">
      <div><span class="section-eyebrow">BIBLIOTECA DO MESTRE</span><h2>📚 Bestiario</h2><p>Cadastre, edite e reutilize inimigos. Esta e a unica pagina de gerenciamento do Bestiario.</p></div>
    </header>
    ${masterSetupWarnings.length ? `<div class="master-warning"><strong>Bestiario com problema de configuracao</strong><span>${escapeHtml(masterSetupWarnings.join(' • '))}</span></div>` : ''}
    ${renderMasterBestiary()}
  </section>`;
}

function renderMasterSessionBase() {
  const online = masterPlayersCache.filter(p => onlineUserIds.has(p.user_id)).length;
  const injured = masterPlayersCache.filter(p => (p.hp_current ?? 0) < (p.hp_max ?? 0)).length;
  const playerConditions = masterPlayersCache.reduce((n,p)=>n+(Array.isArray(p.conditions)?p.conditions.length:0),0);
  const enemyConditions = masterEnemiesCache.reduce((n,e)=>n+(Array.isArray(e.conditions)?e.conditions.length:0),0);
  const turnOrder = Array.isArray(activeBattle?.turn_order) ? activeBattle.turn_order : [];
  const turnIndex = Math.max(0, activeBattle?.turn_index || 0);
  const currentTurn = turnOrder[turnIndex]?.label || activeBattle?.turn_label || '—';
  return `<div class="master-dashboard-grid">
    <section class="master-panel master-session-panel">
      <div class="master-panel-head"><div><span class="section-eyebrow">SESSÃO ATUAL</span><h3>${activeBattle ? escapeHtml(activeBattle.name || 'Batalha') : 'Fora de combate'}</h3></div><span class="master-live-dot ${activeBattle?'on':''}">${activeBattle?'ATIVO':'INATIVO'}</span></div>
      <div class="master-stat-grid">
        <div><strong data-master-online>${online}</strong><span>online</span></div>
        <div><strong>${masterPlayersCache.length}</strong><span>jogadores</span></div>
        <div><strong>${activeBattle?.round || '—'}</strong><span>rodada</span></div>
        <div><strong>${masterEnemiesCache.length}</strong><span>inimigos</span></div>
        <div><strong>${injured}</strong><span>feridos</span></div>
        <div><strong>${playerConditions + enemyConditions}</strong><span>condições</span></div>
      </div>
      ${activeBattle ? `<div class="master-turn-box"><span>Turno atual</span><strong>${escapeHtml(currentTurn)}</strong><div><button data-click-call="openInitiativeEditor()">Iniciativa</button><button data-click-call="advanceBattleTurn()">Próximo turno →</button></div></div>` : ''}
      <div class="master-quick-actions">
        <button data-click-call="switchTab('combate')">⚔️ Abrir combate</button>
        <button data-click-call="switchTab('jogadores')">👥 Jogadores</button>
        <button data-click-call="openBestiaryEditor()">＋ Criar inimigo</button>
        <button data-click-call="switchTab('regras')">📖 Regras</button>
      </div>
    </section>

    <section class="master-panel">
      <div class="master-panel-head"><div><span class="section-eyebrow">ROLAGENS</span><h3>Dados rápidos</h3></div></div>
      <div class="master-dice-row">${[20,12,10,8,6,4].map(d=>`<button data-click-call="rollMasterDie(${d})">d${d}</button>`).join('')}</div>
      <div id="master-dice-result" class="master-dice-result"><span>Resultado</span><strong>—</strong></div>
    </section>

    <section class="master-panel master-preview-panel">
      <div class="master-panel-head"><div><span class="section-eyebrow">PERSONAGENS</span><h3>Estado do grupo</h3></div><button data-click-call="switchTab('jogadores')">Ver todos</button></div>
      <div class="master-mini-list">${masterPlayersCache.slice(0,5).map(p=>`<button data-click-call="openMasterOverviewDetails('${p.user_id}')"><span>${escapeHtml(p.name||'Sem nome')}</span><b>${p.hp_current??0}/${p.hp_max??0} PV</b></button>`).join('') || '<p>Nenhum personagem.</p>'}</div>
    </section>

    <section class="master-panel master-preview-panel">
      <div class="master-panel-head"><div><span class="section-eyebrow">BESTIÁRIO</span><h3>Inimigos salvos</h3></div><button data-click-call="switchTab('bestiario')">Abrir</button></div>
      <div class="master-mini-list">${masterBestiaryCache.slice(0,5).map(e=>`<button data-click-call="openBestiaryEditor('${e.id}')"><span>${escapeHtml(e.name)}</span><b>${e.hp_max} PV</b></button>`).join('') || '<p>Nenhum inimigo salvo.</p>'}</div>
    </section>

    <section class="master-panel master-preview-panel master-notes-preview">
      <div class="master-panel-head"><div><span class="section-eyebrow">NOTAS</span><h3>Últimas anotações</h3></div><button data-click-call="setMasterSection('notes')">Editar</button></div>
      <p>${escapeHtml(masterNotesCache.trim().slice(0,240) || 'Nenhuma nota de sessão ainda.')}</p>
    </section>

    <section class="master-panel master-log-panel">
      <div class="master-panel-head"><div><span class="section-eyebrow">HISTÓRICO</span><h3>Últimos eventos</h3></div></div>
      <div class="master-log-list">${masterBattleLogCache.slice(0,8).map(item=>`<div><time>${new Date(item.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time><span>${escapeHtml(item.message)}</span></div>`).join('') || '<p>Nenhum evento registrado nesta batalha.</p>'}</div>
    </section>
  </div>`;
}

function renderMasterPlayers() {
  const conditions = ['Lento','Caído','Imobilizado','Congelado','Sobrecarregado','Atordoado','Em Chamas','Encharcado'];
  return `<section class="master-section-block"><div class="master-section-title"><div><span class="section-eyebrow">GRUPO</span><h3>Gerenciador de personagens</h3><p>Altere recursos e condições sem abrir ficha por ficha.</p></div><button data-click-call="openCharacterPicker()">Trocar ficha</button></div>
    <div class="master-player-grid">${masterPlayersCache.map(p=>{
      const conds=Array.isArray(p.conditions)?p.conditions:[];
      return `<article class="master-player-card">
        <div class="master-player-head"><div class="battle-avatar">${p.avatar_url?`<img src="${escapeAttr(p.avatar_url)}">`:escapeHtml((p.name||'?')[0])}</div><div><strong>${escapeHtml(p.name||'Sem nome')}</strong><small>${escapeHtml([p.class_name,p.archetype].filter(Boolean).join(' • '))}</small></div><b>NV ${p.level||1}</b></div>
        <div class="master-player-resources"><span>PV <b>${p.hp_current??0}/${p.hp_max??0}</b></span><span>PD <b>${p.energy_current??0}/${p.energy_max??0}</b></span><span>PR <b>${p.resonance_points??3}</b></span><span>DEF <b>${p.defense??10}</b></span></div>
        <div class="master-resource-actions"><button data-click-call="adjustMasterResource('${p.user_id}','hp',-10)">-10 PV</button><button data-click-call="adjustMasterResource('${p.user_id}','hp',10)">+10 PV</button><button data-click-call="adjustMasterResource('${p.user_id}','pd',-1)">-1 PD</button><button data-click-call="adjustMasterResource('${p.user_id}','pd',1)">+1 PD</button></div>
        <div class="master-condition-list">${conds.map(c=>`<button title="Remover condição" data-click-call="removeMasterCondition('${p.user_id}','${escapeAttr(c)}')">${escapeHtml(c)} ×</button>`).join('') || '<span>Sem condições</span>'}</div>
        <div class="master-condition-add"><select id="condition-${p.user_id}">${conditions.map(c=>`<option>${c}</option>`).join('')}</select><button data-click-call="addMasterCondition('${p.user_id}')">Aplicar</button></div>
        <div class="master-card-actions"><button data-click-call="openMasterCharacter('${p.user_id}')">Abrir ficha</button><button data-click-call="openMasterSkills('${p.user_id}')">Ver habilidades</button></div>
      </article>`;
    }).join('') || '<p class="rules-empty">Nenhum personagem encontrado.</p>'}</div>
  </section>`;
}


function renderMasterNotes() {
  return `<section class="master-section-block"><div class="master-section-title"><div><span class="section-eyebrow">PRIVADO</span><h3>Notas da sessão</h3><p>Somente sua conta de mestre consegue ler estas anotações.</p></div><span id="master-notes-status" class="master-note-status">Salvo</span></div><textarea id="master-notes-textarea" class="master-notes-textarea" placeholder="Pistas, segredos, lembretes, eventos futuros..." data-input-call="scheduleMasterNotesSave(this.value)">${escapeHtml(masterNotesCache)}</textarea></section>`;
}

function renderMasterQuickRules() {
  const rules=['esquiva','contra-ataque','reducao-de-dano','ressonancia-elemental','pontos-de-ressonancia','caido','imobilizado','congelado','sobrecarregado','cobertura'];
  const book=getRuleBook();
  return `<section class="master-section-block"><div class="master-section-title"><div><span class="section-eyebrow">CONSULTA</span><h3>Regras rápidas</h3><p>Abra as mecânicas mais usadas durante a sessão.</p></div><button data-click-call="switchTab('regras')">Livro completo →</button></div><div class="master-rule-grid">${rules.map(id=>{const r=book?.getById(id);return r?`<button data-click-call="switchTab('regras');setTimeout(()=>openRuleById('${r.id}'),0)"><span>${escapeHtml(ruleCategoryLabel(r.category))}</span><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.summary||'')}</small></button>`:''}).join('')}</div></section>`;
}

window.setMasterSection = async function(section){
  if (currentRole !== 'admin') return;

  // Compatibilidade com botoes antigos: secoes que agora possuem uma pagina
  // oficial sao redirecionadas, evitando dois estados diferentes para a mesma
  // funcionalidade.
  if (section === 'players') return switchTab('jogadores');
  if (section === 'bestiary') return switchTab('bestiario');
  if (section === 'rules') return switchTab('regras');

  masterHubSection = section === 'notes' ? 'notes' : section === 'planning' ? 'planning' : 'session';
  if (currentTab !== 'mestre') {
    currentTab = 'mestre';
    renderTabs();
    document.body.dataset.section = 'mestre';
  }
  const main=document.getElementById('main-content');
  if(main) main.innerHTML=renderMasterHub();
  if(window.lucide)window.lucide.createIcons();
  await loadMasterHub(masterHubSection,{ background:true });
  window.UiFlow?.commit('mestre');
};


async function refreshBestiaryOnly(){
  if(currentRole!=='admin') return false;
  try {
    const {data,error}=await supabaseClient.from('enemy_templates').select('*').order('name');
    if(error){
      masterSetupWarnings=['Bestiário: '+error.message];
      return false;
    }
    masterBestiaryCache=data||[];
    return true;
  } catch(error){
    masterSetupWarnings=['Bestiário: '+(error?.message||'Falha ao carregar.')];
    return false;
  }
}
window.openBestiary = async function(){
  if (currentRole !== 'admin') return;
  return switchTab('bestiario');
};

window.rollMasterDie = function(sides){ const result=Math.floor(Math.random()*sides)+1; const box=document.getElementById('master-dice-result'); if(box) box.innerHTML=`<span>d${sides}</span><strong>${result}</strong>`; };
window.openMasterCharacter = async function(userId){ selectedUserId=userId; const select=document.getElementById('player-select'); if(select) select.value=userId; dataReady=false; setSaveStatus('loading'); await loadSkills(); await loadCharacterData(); switchTab('personagem'); };
window.openMasterSkills = async function(userId){ selectedUserId=userId; const select=document.getElementById('player-select'); if(select) select.value=userId; dataReady=false; setSaveStatus('loading'); await loadSkills(); await loadCharacterData(); switchTab('habilidades',{force:true}); };

async function logBattle(message, kind='info') {
  if (!activeBattle?.id || currentRole!=='admin') return;
  const {error}=await supabaseClient.from('battle_log').insert({battle_id:activeBattle.id,message,kind,created_by:currentUser.id});
  if(error && !String(error.message).includes('battle_log')) console.warn('Histórico:',error.message);
  window.TabletopRealtime?.announceCombatRefresh?.();
}

window.adjustMasterResource = async function(userId, resource, delta){
  const {data,error}=await supabaseClient.rpc('master_adjust_character',{p_user_id:userId,p_resource:resource,p_delta:delta});
  if(error){alert('Não foi possível alterar o recurso. Execute o SQL atualizado.\n'+error.message);return;}
  const player=masterPlayersCache.find(p=>p.user_id===userId); const name=player?.name||'Personagem';
  await logBattle(`${name}: ${delta>0?'+':''}${delta} ${resource==='hp'?'PV':'PD'}`,'resource');
  await loadMasterHub('players');
};

window.addMasterCondition = async function(userId){ const select=document.getElementById('condition-'+userId); if(!select)return; const player=masterPlayersCache.find(p=>p.user_id===userId); const list=[...(player?.conditions||[])]; if(!list.includes(select.value)) list.push(select.value); await saveMasterConditions(userId,list,`${player?.name||'Personagem'} recebeu ${select.value}`); };
window.removeMasterCondition = async function(userId,condition){ const player=masterPlayersCache.find(p=>p.user_id===userId); const list=(player?.conditions||[]).filter(c=>c!==condition); await saveMasterConditions(userId,list,`${player?.name||'Personagem'} removeu ${condition}`); };
async function saveMasterConditions(userId,list,log){ const {error}=await supabaseClient.rpc('master_set_character_conditions',{p_user_id:userId,p_conditions:list}); if(error){alert('Não foi possível alterar condições. Execute o SQL atualizado.\n'+error.message);return;} await logBattle(log,'condition'); await loadMasterHub('players'); }

window.scheduleMasterNotesSave=function(value){ masterNotesCache=value; const status=document.getElementById('master-notes-status'); if(status)status.textContent='Salvando...'; clearTimeout(masterNotesTimer); masterNotesTimer=setTimeout(()=>saveMasterNotes(value),650); };
async function saveMasterNotes(value){ const {error}=await supabaseClient.from('gm_notes').upsert({owner_id:currentUser.id,content:value,updated_at:new Date().toISOString()},{onConflict:'owner_id'}); const status=document.getElementById('master-notes-status'); if(error){if(status)status.textContent='Erro ao salvar';console.error(error);return;} if(status)status.textContent='Salvo'; }


window.deleteBestiary=async function(id){const enemy=masterBestiaryCache.find(x=>String(x.id)===String(id));const name=enemy?.name||'este inimigo';if(!confirm(`Excluir “${name}” do Bestiário?\n\nIsso não remove cópias que já estejam em um combate e não apaga referências antigas das sessões.`))return;const {error}=await supabaseClient.from('enemy_templates').delete().eq('id',id);if(error)return alert('Não foi possível excluir do Bestiário.\n'+error.message);document.getElementById('bestiary-editor')?.remove();masterBestiaryCache=masterBestiaryCache.filter(x=>String(x.id)!==String(id));const main=document.getElementById('main-content');if(currentTab==='bestiario'&&main){main.innerHTML=renderStandaloneBestiary();window.lucide?.createIcons();window.UiFlow?.commit('bestiario');}};
window.duplicateBestiary=async function(id){const e=masterBestiaryCache.find(x=>x.id===id);if(!e)return;const {id:_id,created_at,_created,updated_at,_updated,...copy}=e;copy.name=(e.name||'Inimigo')+' (Cópia)';copy.owner_id=currentUser.id;const {data,error}=await supabaseClient.from('enemy_templates').insert(copy).select().single();if(error)return alert(error.message);if(data)masterBestiaryCache.push(data);masterBestiaryCache.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));const main=document.getElementById('main-content');if(currentTab==='bestiario'&&main){main.innerHTML=renderStandaloneBestiary();window.lucide?.createIcons();window.UiFlow?.commit('bestiario');}};
window.addTemplateToBattle=async function(id){let battle=activeBattle;if(!battle){const state=await fetchCombatState();battle=state.battle;activeBattle=battle;}if(!battle){alert('Inicie um combate antes de adicionar inimigos.');return;}const e=masterBestiaryCache.find(x=>x.id===id);if(!e)return;const payload={battle_id:battle.id,name:e.name,subtitle:e.subtitle,image_url:e.image_url,hp_current:e.hp_max,hp_max:e.hp_max,defense:e.defense,dodge:e.dodge,block:e.block,movement_speed:e.movement_speed,level:e.level||1,rank:e.rank||'comum',element:e.element||'',damage_reduction:e.damage_reduction||0,conditions:e.conditions||[],attacks:e.attacks||[],abilities:e.abilities||[],notes:e.notes||'',visibility:e.visibility||{}};const {error}=await supabaseClient.from('battle_enemies').insert(payload);if(error){alert(error.message);return;}await logBattle(`${e.name} foi adicionado ao combate`,'enemy');};


async function ensureBestiaryLoaded(){
  if(masterBestiaryCache.length) return true;
  const {data,error}=await supabaseClient.from('enemy_templates').select('*').order('name');
  if(error){
    alert('Não foi possível carregar o bestiário.\n'+error.message);
    return false;
  }
  masterBestiaryCache=data||[];
  return true;
}

window.openBattleBestiaryPicker=async function(){
  if(currentRole!=='admin') return;
  let battle=activeBattle;
  if(!battle){
    const state=await fetchCombatState();
    battle=state.battle;
    activeBattle=battle;
  }
  if(!battle){
    alert('Inicie um combate antes de adicionar inimigos do bestiário.');
    return;
  }
  if(!(await ensureBestiaryLoaded())) return;

  document.getElementById('battle-bestiary-picker')?.remove();
  const rows=masterBestiaryCache.map(e=>`
    <article class="battle-bestiary-row" data-bestiary-search="${escapeAttr([e.name,e.subtitle].filter(Boolean).join(' ')).toLowerCase()}">
      <div class="battle-avatar enemy">${e.image_url?`<img src="${escapeAttr(e.image_url)}" alt="">`:'👹'}</div>
      <div class="battle-bestiary-info">
        <strong>${escapeHtml(e.name||'Inimigo')}</strong>
        <small>${escapeHtml(e.subtitle||'')}</small>
        <div class="battle-bestiary-stats"><span>PV ${e.hp_max??0}</span><span>DEF ${e.defense??10}</span><span>ESQ ${e.dodge??0}</span><span>DESL ${e.movement_speed??9}m</span></div>
      </div>
      <button class="primary-action" type="button" data-click-call="addTemplateToActiveBattle('${e.id}', this)">+ Adicionar</button>
    </article>`).join('');

  document.body.insertAdjacentHTML('beforeend',`
    <div id="battle-bestiary-picker" class="picker-modal">
      <button class="picker-backdrop" data-click-call="closeBattleBestiaryPicker()"></button>
      <div class="picker-panel battle-bestiary-picker-panel">
        <div class="picker-head">
          <div><span class="section-eyebrow">BESTIÁRIO</span><h3>Adicionar ao combate</h3><small>Escolha um inimigo salvo para criar uma cópia nesta batalha.</small></div>
          <button type="button" data-click-call="closeBattleBestiaryPicker()">✕</button>
        </div>
        <div class="picker-search"><input id="battle-bestiary-search" placeholder="Pesquisar inimigo..." data-input-call="filterBattleBestiary(this.value)"></div>
        <div class="battle-bestiary-list">${rows||'<div class="combat-empty"><span>👹</span><h3>Bestiário vazio</h3><p>Crie inimigos na Central do Mestre primeiro.</p></div>'}</div>
      </div>
    </div>`);
};

window.closeBattleBestiaryPicker=function(){document.getElementById('battle-bestiary-picker')?.remove();};
window.filterBattleBestiary=function(query=''){
  const q=String(query).trim().toLocaleLowerCase('pt-BR');
  document.querySelectorAll('#battle-bestiary-picker .battle-bestiary-row').forEach(row=>{
    row.hidden=q&&!String(row.dataset.bestiarySearch||'').includes(q);
  });
};

window.addTemplateToActiveBattle=async function(id,button){
  if(button){button.disabled=true;button.textContent='Adicionando...';}
  try{
    let battle=activeBattle;
    if(!battle){
      const state=await fetchCombatState();
      battle=state.battle;
      activeBattle=battle;
    }
    if(!battle){alert('Não existe combate ativo.');return;}
    if(!(await ensureBestiaryLoaded())) return;
    const e=masterBestiaryCache.find(x=>String(x.id)===String(id));
    if(!e){alert('Inimigo não encontrado no bestiário.');return;}
    const visibility={name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false,...(e.visibility||{})};
    const payload={battle_id:battle.id,name:e.name||'Inimigo',subtitle:e.subtitle||'',image_url:e.image_url||'',hp_current:e.hp_max??10,hp_max:e.hp_max??10,defense:e.defense??10,dodge:e.dodge??0,block:e.block??0,movement_speed:e.movement_speed??9,level:e.level||1,rank:e.rank||'comum',element:e.element||'',damage_reduction:e.damage_reduction||0,conditions:Array.isArray(e.conditions)?e.conditions:[],attacks:Array.isArray(e.attacks)?e.attacks:[],abilities:Array.isArray(e.abilities)?e.abilities:[],notes:e.notes||'',visibility};
    const {error}=await supabaseClient.from('battle_enemies').insert(payload);
    if(error){alert('Erro ao adicionar ao combate.\n'+error.message);return;}
    await logBattle(`${e.name||'Inimigo'} foi adicionado ao combate`,'enemy');
    scheduleCombatSync(50);
    if(button){button.textContent='✓ Adicionado';setTimeout(()=>{if(button){button.disabled=false;button.textContent='+ Adicionar';}},900);}
  }finally{
    if(button&&button.textContent==='Adicionando...'){button.disabled=false;button.textContent='+ Adicionar';}
  }
};

window.openInitiativeEditor=function(){
  if(!activeBattle){alert('Nenhum combate ativo.');return;}
  const current=Array.isArray(activeBattle.turn_order)?activeBattle.turn_order:[];
  const currentMap=new Map(current.map(x=>[`${x.type}:${x.id}`,x.initiative]));
  // Na tela de Combate usamos os dados que já estão carregados ali. Na Central
  // do Mestre mantemos o fallback para os caches administrativos.
  const playerSource=((currentTab==='combate'||currentTab==='mesa')&&combatPlayersCache.length)?combatPlayersCache:masterPlayersCache;
  const enemySource=((currentTab==='combate'||currentTab==='mesa')&&battleEnemies.length)?battleEnemies:masterEnemiesCache;
  const entities=[
    ...playerSource.map(p=>({type:'player',id:p.user_id,label:p.name||'Personagem'})),
    ...enemySource.map(e=>({type:'enemy',id:e.id,label:e.name||'Inimigo'}))
  ];
  document.getElementById('initiative-editor')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="initiative-editor" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('initiative-editor').remove()"></button><form class="picker-panel initiative-editor" data-submit-call="saveInitiative(event)"><div class="picker-head"><div><span class="section-eyebrow">COMBATE</span><h3>Ordem de iniciativa</h3><small>Defina os valores. A ordem é organizada automaticamente do maior para o menor.</small></div><button type="button" data-click-call="document.getElementById('initiative-editor').remove()">✕</button></div><div class="initiative-list">${entities.map(x=>`<label><span>${escapeHtml(x.label)} <small>${x.type==='player'?'Jogador':'Inimigo'}</small></span><input type="number" inputmode="numeric" name="init" data-type="${x.type}" data-id="${x.id}" data-label="${escapeAttr(x.label)}" value="${currentMap.get(`${x.type}:${x.id}`)??0}"></label>`).join('')}</div><button class="primary-action" type="submit">Salvar e ordenar</button></form></div>`);
};
window.saveInitiative=async function(ev){ev.preventDefault();const order=[...ev.target.querySelectorAll('input[name="init"]')].map(i=>({type:i.dataset.type,id:i.dataset.id,label:i.dataset.label,initiative:+i.value||0})).sort((a,b)=>b.initiative-a.initiative||String(a.label).localeCompare(String(b.label),'pt-BR'));const first=order[0]?.label||null;const {error}=await supabaseClient.from('battles').update({turn_order:order,turn_index:0,turn_label:first}).eq('id',activeBattle.id);if(error){alert(error.message);return;}document.getElementById('initiative-editor')?.remove();await logBattle('Ordem de iniciativa atualizada','initiative');if(currentTab==='combate')scheduleCombatSync(40);else if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else await loadMasterHub('session');};
window.advanceBattleTurn=async function(){if(!activeBattle)return;const order=Array.isArray(activeBattle.turn_order)?activeBattle.turn_order:[];if(!order.length){openInitiativeEditor();return;}const {data,error}=await supabaseClient.rpc('finish_turn_v1542',{p_battle_id:activeBattle.id});if(error){alert(error.message);return;}const label=data?.turn_label||'Turno';await logBattle(`Turno: ${label}${data?.wrapped?` • Rodada ${data.round}`:''}`,'turn');if(currentTab==='combate')scheduleCombatSync(40);else if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else await loadMasterHub('session');};

// --- Escudo do Mestre ---
// Mostra, numa única tela, um resumo de todos os jogadores para o mestre
// acompanhar durante a sessão (PV, PD, Nível, PR, Defesa, Esquiva, Bloqueio,
// Deslocamento). Depende da função get_master_shield_data no Supabase
// (mesmo padrão de get_players_for_admin, só que trazendo também os dados
// da tabela characters). Veja o SQL sugerido na documentação do projeto.
async function loadMasterShieldData() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<p class="opacity-60 text-center p-8">Carregando fichas dos jogadores...</p>';

  const { data, error } = await supabaseClient.rpc('get_master_shield_data');

  if (error) {
    console.error('Erro ao carregar Escudo do Mestre:', error);
    mainContent.innerHTML = `
      <div class="opacity-80 text-center p-8">
        <p>Não foi possível carregar o Escudo do Mestre.</p>
        <p class="text-xs opacity-60 mt-2">${error.message}</p>
        <p class="text-xs opacity-50 mt-2">Verifique se a função get_master_shield_data existe no Supabase.</p>
      </div>`;
    return;
  }

  mainContent.innerHTML = renderMasterShield(data || []);
  if (window.lucide) window.lucide.createIcons();
}

function renderMasterShield(players) {
  if (!players || players.length === 0) {
    return '<p class="opacity-60 text-center p-8">Nenhum jogador encontrado.</p>';
  }

  const cards = players.map(pl => {
    const hpMax = pl.hp_max || 0;
    const enMax = pl.energy_max || 0;
    const hpPct = hpMax ? Math.max(0, Math.min(100, Math.round((pl.hp_current / hpMax) * 100))) : 0;
    const enPct = enMax ? Math.max(0, Math.min(100, Math.round((pl.energy_current / enMax) * 100))) : 0;
    const displayName = pl.name || 'Sem nome';
    const initial = (displayName || pl.username || '?').charAt(0).toUpperCase();

    return `
      <div class="shield-card">
        <div class="shield-card-head">
          <div class="shield-avatar">
            ${pl.avatar_url
              ? `<img src="${pl.avatar_url}" alt="${displayName}">`
              : `<span>${initial}</span>`}
          </div>
          <div class="shield-head-info">
            <div class="shield-char-name">${displayName}</div>
            <div class="shield-player-name">${pl.username || ''}${pl.class_name ? ' • ' + pl.class_name : ''}</div>
            <div class="shield-player-name opacity-60">${[pl.origin, pl.archetype].filter(Boolean).join(' • ')}</div>
          </div>
          <div class="shield-level">NV<br>${pl.level ?? 1}</div>
        </div>

        <div class="shield-bar-row">
          <span class="shield-bar-label pv">PV</span>
          <div class="shield-bar-track"><div class="shield-bar-fill pv" style="width:${hpPct}%"></div></div>
          <span class="shield-bar-value">${pl.hp_current ?? 0}/${hpMax}</span>
        </div>
        <div class="shield-bar-row">
          <span class="shield-bar-label pd">PD</span>
          <div class="shield-bar-track"><div class="shield-bar-fill pd" style="width:${enPct}%"></div></div>
          <span class="shield-bar-value">${pl.energy_current ?? 0}/${enMax}</span>
        </div>

        <div class="shield-stat-grid">
          <div class="shield-stat"><span class="mini-label">PR</span><span>${pl.damage_reduction ?? 0}</span></div>
          <div class="shield-stat"><span class="mini-label">DEFESA</span><span>${pl.defense ?? 10}</span></div>
          <div class="shield-stat"><span class="mini-label">ESQUIVA</span><span>${pl.dodge ?? 10}</span></div>
          <div class="shield-stat"><span class="mini-label">ARMUEIO</span><span>${pl.block ?? 0}</span></div>
          <div class="shield-stat"><span class="mini-label">DESLOC.</span><span>${pl.movement_speed ?? 9}m</span></div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="shield-grid">${cards}</div>`;
}

function openCharacterPicker(){
 if(currentRole!=='admin') return;
 const existing=document.getElementById('character-picker-modal'); if(existing) existing.remove();
 const rows=profilesCache.filter(p=>p.role!=='admin').map(p=>`<button class="character-picker-row" data-click-call="selectCharacterFromPicker('${p.id}')"><span class="picker-avatar">${escapeHtml((p.username||'?')[0].toUpperCase())}</span><span><strong>${escapeHtml(p.username||'Jogador')}</strong><small>Abrir ficha deste personagem</small></span></button>`).join('');
 document.body.insertAdjacentHTML('beforeend',`<div id="character-picker-modal" class="picker-modal"><button class="picker-backdrop" data-click-call="closeCharacterPicker()"></button><div class="picker-panel"><div class="picker-head"><div><span class="section-eyebrow">PERSONAGENS</span><h3>Trocar ficha</h3></div><button data-click-call="closeCharacterPicker()">✕</button></div><div class="picker-search"><input placeholder="Pesquisar personagem..." data-input-call="filterCharacterPicker(this.value)"></div><div class="picker-list">${rows}</div></div></div>`);
}
function closeCharacterPicker(){document.getElementById('character-picker-modal')?.remove()}
function filterCharacterPicker(q){q=String(q).toLowerCase();document.querySelectorAll('.character-picker-row').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(q))}
async function selectCharacterFromPicker(id){closeCharacterPicker(); const select=document.getElementById('player-select'); if(select) select.value=id; selectedUserId=id; dataReady=false; setSaveStatus('loading'); await loadSkills(); await loadCharacterData();}
window.openCharacterPicker=openCharacterPicker; window.closeCharacterPicker=closeCharacterPicker; window.filterCharacterPicker=filterCharacterPicker; window.selectCharacterFromPicker=selectCharacterFromPicker;



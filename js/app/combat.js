function scheduleCombatSync(delay=120){
  if (battleRefreshTimer) clearTimeout(battleRefreshTimer);
  battleRefreshTimer = setTimeout(() => {
    battleRefreshTimer = null;
    if (currentTab === 'combate') syncCombatIncrementally();
  }, delay);
}

async function fetchCombatState(){
  const {data:battles,error}=await supabaseClient.from('battles').select('*').eq('active',true).order('created_at',{ascending:false}).limit(1);
  if(error) return {error};
  const battle=battles?.[0]||null;
  let enemies=[];
  if(battle){
    const res=await supabaseClient.rpc('get_battle_enemies',{p_battle_id:battle.id});
    if(res.error) return {error:res.error};
    enemies=res.data||[];
  }
  let players=[];
  const shield=await supabaseClient.rpc('get_master_shield_data');
  if(!shield.error) players=shield.data||[];
  activeBattle=battle;
  await loadCombatExtras();
  return {battle,enemies,players,error:null};
}

async function loadCombatView({ background=false } = {}){
  const main=document.getElementById('main-content');
  if(!background) main.innerHTML='<p class="rules-empty">Carregando combate...</p>';
  else if(combatPlayersCache.length || activeBattle) { main.innerHTML=renderCombat(combatPlayersCache); if(window.lucide)lucide.createIcons(); }
  const state=await fetchCombatState();
  if(state.error){ main.innerHTML=renderCombatSetupNotice(state.error); return; }
  activeBattle=state.battle;
  battleEnemies=state.enemies;
  combatPlayersCache=state.players;
  combatRenderedBattleId=activeBattle?.id||null;
  main.innerHTML=renderCombat(combatPlayersCache);
  if(window.lucide)lucide.createIcons();
  subscribeBattleRealtime();
}

function patchCombatHeader(){
  const shell=document.querySelector('.combat-shell');
  if(!shell || !activeBattle) return;
  const title=shell.querySelector('[data-combat-title]');
  const meta=shell.querySelector('[data-combat-meta]');
  if(title) title.textContent='⚔️ '+(activeBattle.name||'Combate');
  if(meta) meta.textContent=`Rodada ${activeBattle.round||1}${activeBattle.turn_label?' • Turno: '+activeBattle.turn_label:''}`;
}

function patchCardCollection(containerSelector, items, idKey, renderFn, attrName, emptyHtml=''){
  const container=document.querySelector(containerSelector);
  if(!container) return;
  const wanted=new Set(items.map(item=>String(item[idKey])));
  container.querySelectorAll(`[${attrName}]`).forEach(node=>{
    if(!wanted.has(String(node.getAttribute(attrName)))) node.remove();
  });
  items.forEach(item=>{
    const id=String(item[idKey]);
    const existing=container.querySelector(`[${attrName}="${CSS.escape(id)}"]`);
    const html=renderFn(item);
    if(existing){
      if(existing.outerHTML!==html) existing.outerHTML=html;
    }else{
      container.insertAdjacentHTML('beforeend',html);
    }
  });
  const placeholder=container.querySelector('.combat-placeholder');
  if(items.length && placeholder) placeholder.remove();
  if(!items.length && emptyHtml && !container.querySelector('.combat-placeholder')) container.innerHTML=emptyHtml;
}

function renderCombatInitiative(){
  const order=Array.isArray(activeBattle?.turn_order)?activeBattle.turn_order:[];
  const currentIndex=Math.max(0,Math.min(order.length-1,activeBattle?.turn_index||0));
  if(!order.length){
    return `<section class="combat-initiative" data-initiative-section><div class="combat-initiative-head"><div><span class="section-eyebrow">ORDEM DE TURNO</span><h3>Iniciativa</h3><p>Nenhuma iniciativa definida.</p></div>${currentRole==='admin'?`<button class="primary-action" data-click-call="openInitiativeEditor()">+ Definir iniciativa</button>`:''}</div>${currentRole!=='admin'?'<p class="combat-initiative-empty">Aguardando o mestre definir a ordem da batalha.</p>':''}</section>`;
  }
  return `<section class="combat-initiative" data-initiative-section>
    <div class="combat-initiative-head">
      <div><span class="section-eyebrow">ORDEM DE TURNO</span><h3>Iniciativa</h3><p>${order.length} participantes • Rodada ${activeBattle?.round||1}</p></div>
      ${currentRole==='admin'?`<div class="combat-initiative-actions"><button data-click-call="openInitiativeEditor()">Editar</button><button class="primary-action" data-click-call="advanceBattleTurn()">Próximo turno →</button></div>`:''}
    </div>
    <div class="combat-initiative-order">
      ${order.map((item,index)=>`<div class="initiative-order-item ${index===currentIndex?'current':''}" data-initiative-id="${escapeAttr(item.type+':'+item.id)}">
        <span class="initiative-position">${index+1}</span>
        <span class="initiative-entity-icon">${item.type==='player'?'👤':'👹'}</span>
        <div class="initiative-entity"><strong>${escapeHtml(item.label||'Participante')}</strong><small>${item.type==='player'?'Jogador':'Inimigo'}</small></div>
        <b class="initiative-value">${Number(item.initiative)||0}</b>
        ${index===currentIndex?'<span class="initiative-turn-badge">AGINDO</span>':''}
      </div>`).join('')}
    </div>
  </section>`;
}

function patchCombatInitiative(){
  const current=document.querySelector('[data-initiative-section]');
  if(!current)return;
  const holder=document.createElement('div');
  holder.innerHTML=renderCombatInitiative().trim();
  const next=holder.firstElementChild;
  if(next && current.outerHTML!==next.outerHTML) current.replaceWith(next);
}

async function syncCombatIncrementally(){
  const state=await fetchCombatState();
  if(state.error || currentTab !== 'combate') return;
  const nextBattleId=state.battle?.id||null;
  if(nextBattleId!==combatRenderedBattleId){
    activeBattle=state.battle; battleEnemies=state.enemies; combatPlayersCache=state.players;
    combatRenderedBattleId=nextBattleId;
    const main=document.getElementById('main-content');
    main.innerHTML=renderCombat(combatPlayersCache).replace(' fade-in','');
    if(window.lucide)lucide.createIcons();
    return;
  }
  activeBattle=state.battle;
  battleEnemies=state.enemies;
  combatPlayersCache=state.players;
  if(!activeBattle) return;
  patchCombatHeader();
  patchCombatInitiative();
  const allyCount=document.querySelector('[data-ally-count]');
  if(allyCount) allyCount.textContent=`${combatPlayersCache.length} personagens`;
  patchCardCollection('.battle-allies', combatPlayersCache, 'user_id', renderBattlePlayerCard, 'data-player-id');
  patchCardCollection('.battle-enemies', battleEnemies, 'id', renderEnemyCard, 'data-enemy-id', '<p class="combat-placeholder">Nenhum inimigo adicionado.</p>');
  const main=document.getElementById('main-content');
  if(main){
    const oldQ=main.querySelector('.combat-quick-panel');
    const oldH=main.querySelector('.combat-history');
    if(oldQ){const h=document.createElement('div');h.innerHTML=renderCombatQuickActions();if(h.firstElementChild)oldQ.replaceWith(h.firstElementChild);}
    if(oldH){const h=document.createElement('div');h.innerHTML=renderCombatHistory();if(h.firstElementChild)oldH.replaceWith(h.firstElementChild);}
  }
}

function renderCombatSetupNotice(error){return `<section class="combat-shell"><div class="combat-empty"><span>⚔️</span><h2>Combate ainda não configurado</h2><p>${escapeHtml(error?.message||'Execute a migração SQL atualizada para ativar batalhas.')}</p><small>O restante do site continua funcionando normalmente.</small></div></section>`}
function enemyVisible(e,key){return currentRole==='admin'||(e.visibility||{})[key]!==false}
async function startBattle(){if(currentRole!=='admin')return;const name=prompt('Nome do combate:','Batalha');if(name===null)return;await supabaseClient.from('battles').update({active:false}).eq('active',true);const {error}=await supabaseClient.from('battles').insert({name:name||'Batalha',active:true,round:1,created_by:currentUser.id});if(error)alert(error.message);else scheduleCombatSync(50)}
async function endBattle(){if(!confirm('Encerrar o combate atual?'))return;await supabaseClient.from('battles').update({active:false}).eq('id',activeBattle.id);scheduleCombatSync(50)}
async function advanceRound(){if(!activeBattle?.id)return;await tickBattleEffects();const next=(activeBattle.round||1)+1;await supabaseClient.from('battles').update({round:next}).eq('id',activeBattle.id);await logBattle(`Rodada ${next} iniciada`,'round');scheduleCombatSync(40);}
async function saveEnemy(ev,id){ev.preventDefault();const f=new FormData(ev.target),visibility={};['name','hp','hp_numbers','conditions','defense','dodge','block','movement','attacks','abilities'].forEach(k=>visibility[k]=f.get('vis_'+k)==='on');const lines=name=>String(f.get(name)||'').split('\n').map(x=>x.trim()).filter(Boolean);const payload={battle_id:activeBattle.id,name:f.get('name')||'Inimigo',subtitle:f.get('subtitle')||'',image_url:f.get('image_url')||'',hp_current:+f.get('hp_current')||0,hp_max:+f.get('hp_max')||0,defense:+f.get('defense')||0,dodge:+f.get('dodge')||0,block:+f.get('block')||0,movement_speed:+f.get('movement_speed')||0,conditions:String(f.get('conditions')||'').split(',').map(x=>x.trim()).filter(Boolean),attacks:lines('attacks'),abilities:lines('abilities'),notes:f.get('notes')||'',visibility};const q=id?supabaseClient.from('battle_enemies').update(payload).eq('id',id):supabaseClient.from('battle_enemies').insert(payload);const {error}=await q;if(error)alert(error.message);else{document.getElementById('enemy-editor')?.remove();await logBattle(`${payload.name} ${id?'foi atualizado':'entrou no combate'}`,'enemy');scheduleCombatSync(50)}}
async function deleteEnemy(id){if(!confirm('Remover este inimigo?'))return;await supabaseClient.from('battle_enemies').delete().eq('id',id);document.getElementById('enemy-editor')?.remove();scheduleCombatSync(50)}
async function changeEnemyHp(id,d){const e=battleEnemies.find(x=>x.id===id);if(!e)return;await supabaseClient.from('battle_enemies').update({hp_current:Math.max(0,(e.hp_current||0)+d)}).eq('id',id)}
window.startBattle=startBattle;window.endBattle=endBattle;// V15.13 — public renderer bridge used by Mesa. This keeps one combat UI/source of truth.
window.CombatSurface=Object.freeze({
  syncState(state={}){
    activeBattle=state.battle||null;
    battleEnemies=Array.isArray(state.enemies)?state.enemies:[];
    combatPlayersCache=Array.isArray(state.players)?state.players:[];
    // Mesa player must have the same local sheet payload used by the Combate tab.
    // The shield RPC may intentionally omit private attack details for non-admin clients.
    const myIndex=combatPlayersCache.findIndex(p=>String(p.user_id)===String(currentUser?.id));
    if(myIndex>=0 && typeof characterData!=='undefined' && characterData){
      const localAttacks=Array.isArray(characterData.attacks)?characterData.attacks:Array.isArray(characterData.ataques)?characterData.ataques:[];
      combatPlayersCache[myIndex]={...combatPlayersCache[myIndex],...characterData,user_id:combatPlayersCache[myIndex].user_id||currentUser.id,attacks:localAttacks.length?localAttacks:(combatPlayersCache[myIndex].attacks||[])};
    } else if(myIndex<0 && currentRole!=='admin' && currentUser?.id && typeof characterData!=='undefined' && characterData){
      // Fora de combate a RPC pode não devolver o próprio personagem. Mantemos a ficha local
      // como fallback para que Ações Rápidas nunca desapareçam na Mesa.
      const localAttacks=Array.isArray(characterData.attacks)?characterData.attacks:Array.isArray(characterData.ataques)?characterData.ataques:[];
      combatPlayersCache.push({...characterData,user_id:currentUser.id,attacks:localAttacks});
    }
    battleEffectsCache=Array.isArray(state.effects)?state.effects:[];
    battleLogPublicCache=Array.isArray(state.logs)?state.logs:[];
    battleActionRequestsCache=Array.isArray(state.requests)?state.requests:[];
  },
  renderQuickActions:(options={})=>renderCombatQuickActions(options),
  renderInitiative:()=>renderCombatInitiative(),
  renderHistory:()=>renderCombatHistory(),
  isMyTurn:()=>isMyCombatTurn(),
  targetLabel:()=>targetLabel(),
  currentActor:()=>currentCombatActor(),
  setTarget(type,id){window.selectCombatTarget(type,id);},
  refreshTargetLabel(){const label=document.querySelector('[data-target-label]');if(label)label.textContent=targetLabel();}
});

window.advanceRound=advanceRound;window.saveEnemy=saveEnemy;window.deleteEnemy=deleteEnemy;window.changeEnemyHp=changeEnemyHp;


// =========================================================
// COMBAT SUITE 2.0 — alvo, acoes rapidas, efeitos e encontros
// =========================================================
let battleEffectsCache = [];
let battleLogPublicCache = [];
let battleActionRequestsCache = [];
let selectedCombatTarget = null;
let activeGameSession = null;

function patchCombatCharacterFromRealtime(payload) {
  if (currentTab !== 'combate' || !payload?.new?.user_id) return;
  const idx = combatPlayersCache.findIndex(p => String(p.user_id) === String(payload.new.user_id));
  if (idx < 0) return scheduleCombatSync(80);
  combatPlayersCache[idx] = { ...combatPlayersCache[idx], ...payload.new };
  const card = document.querySelector(`[data-player-id="${CSS.escape(String(payload.new.user_id))}"]`);
  if (card) {
    const box=document.createElement('div'); box.innerHTML=renderBattlePlayerCard(combatPlayersCache[idx]);
    card.replaceWith(box.firstElementChild);
  }
}
function patchCombatEnemyFromRealtime(payload) {
  if (currentTab !== 'combate' || currentRole !== 'admin' || !payload?.new?.id) return scheduleCombatSync(80);
  const idx = battleEnemies.findIndex(e => String(e.id) === String(payload.new.id));
  if (payload.eventType === 'DELETE') return scheduleCombatSync(50);
  if (idx < 0) return scheduleCombatSync(50);
  battleEnemies[idx] = { ...battleEnemies[idx], ...payload.new };
  const card = document.querySelector(`[data-enemy-id="${CSS.escape(String(payload.new.id))}"]`);
  if (card) {
    const box=document.createElement('div'); box.innerHTML=renderEnemyCard(battleEnemies[idx]);
    card.replaceWith(box.firstElementChild);
  }
}
function subscribeBattleRealtime(){
  if (battleRealtimeChannel) supabaseClient.removeChannel(battleRealtimeChannel);
  if(window.__combatFallbackSyncTimer) clearInterval(window.__combatFallbackSyncTimer);
  battleRealtimeChannel = supabaseClient.channel('battle-live')
    .on('postgres_changes',{event:'*',schema:'public',table:'battles'},()=>{if(currentTab==='combate')scheduleCombatSync(60);})
    .on('postgres_changes',{event:'*',schema:'public',table:'battle_enemies'},patchCombatEnemyFromRealtime)
    .on('postgres_changes',{event:'*',schema:'public',table:'battle_effects'},()=>{if(currentTab==='combate')scheduleCombatSync(80);})
    .on('postgres_changes',{event:'*',schema:'public',table:'battle_action_requests'},()=>{if(currentTab==='combate')scheduleCombatSync(80);})
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'characters'},patchCombatCharacterFromRealtime)
    .subscribe();
  // Rede de segurança: se algum evento do Realtime não chegar, o estado converge
  // sozinho em poucos segundos sem exigir refresh manual da página.
  window.__combatFallbackSyncTimer=setInterval(()=>{if(currentTab==='combate')scheduleCombatSync(10);},2200);
}
function combatEntityKey(type,id){ return `${type}:${id}`; }
function conditionName(c){ return CombatDomain.conditionName(c); }
function conditionDuration(c){ return CombatDomain.conditionDuration(c); }
function currentCombatActor(){
  const order=Array.isArray(activeBattle?.turn_order)?activeBattle.turn_order:[];
  return order[activeBattle?.turn_index||0]||null;
}
function isMyCombatTurn(){
  const actor=currentCombatActor();
  return !actor || (actor.type==='player' && String(actor.id)===String(currentUser?.id));
}
function targetLabel(){
  if(!selectedCombatTarget)return 'Nenhum alvo selecionado';
  if(selectedCombatTarget.type==='enemy') return battleEnemies.find(e=>String(e.id)===String(selectedCombatTarget.id))?.name||'Inimigo';
  return combatPlayersCache.find(e=>String(e.user_id)===String(selectedCombatTarget.id))?.name||'Personagem';
}
window.selectCombatTarget=function(type,id){
  selectedCombatTarget={type,id:String(id)};
  document.querySelectorAll('.battle-card.targeted').forEach(x=>x.classList.remove('targeted'));
  const attr=type==='enemy'?'data-enemy-id':'data-player-id';
  document.querySelector(`[${attr}="${CSS.escape(String(id))}"]`)?.classList.add('targeted');
  const label=document.querySelector('[data-target-label]'); if(label)label.textContent=targetLabel();
};

async function loadCombatExtras(){
  if(!activeBattle?.id){battleEffectsCache=[];battleLogPublicCache=[];return;}
  const [effects,logs,sessions,requests]=await Promise.all([
    supabaseClient.rpc('get_battle_effects_v1542',{p_battle_id:activeBattle.id}),
    supabaseClient.rpc('get_battle_log_v1542',{p_battle_id:activeBattle.id}),
    currentRole==='admin'?supabaseClient.from('game_sessions').select('*').eq('active',true).order('started_at',{ascending:false}).limit(1):Promise.resolve({data:[]}),
    supabaseClient.from('battle_action_requests').select('*').eq('battle_id',activeBattle.id).eq('status','pending').order('created_at',{ascending:false})
  ]);
  if(!effects.error)battleEffectsCache=effects.data||[];
  if(!logs.error)battleLogPublicCache=logs.data||[];
  if(!sessions.error){activeGameSession=sessions.data?.[0]||null;syncSessionClockTimer();}
  if(!requests.error)battleActionRequestsCache=requests.data||[];
}
function effectsFor(type,id){return battleEffectsCache.filter(x=>x.entity_type===type&&String(x.entity_id)===String(id));}
function renderTimedEffects(type,id){
  const list=effectsFor(type,id); if(!list.length)return '';
  return `<div class="condition-chips timed-effects">${list.map(e=>`<button data-click-call="searchRulesFromContext('${escapeAttr(e.name)}')" title="Abrir regra">${escapeHtml(e.name)}${e.rounds_remaining>0?` <b>• ${e.rounds_remaining}r</b>`:''}</button>${currentRole==='admin'?`<button class="effect-remove" data-click-call="event.stopPropagation();removeBattleEffect('${e.id}')">×</button>`:''}`).join('')}</div>`;
}
window.addBattleEffect=async function(type,id){
  if(currentRole!=='admin')return;
  const name=prompt('Condição/efeito:','Congelado'); if(!name)return;
  const rounds=Math.max(0,parseInt(prompt('Duração em rodadas (0 = sem duração):','2'))||0);
  const {data,error}=await supabaseClient.rpc('admin_apply_battle_effect_v1535',{p_battle_id:activeBattle.id,p_entity_type:type,p_entity_id:String(id),p_name:name.trim(),p_rounds:rounds});
  if(error){alert('Aplique somente a migration V15.42 desta versão.\n'+error.message);return;} const finalName=data?.name||name;await logBattle(`${finalName} aplicado em ${type==='enemy'?(battleEnemies.find(e=>String(e.id)===String(id))?.name||'inimigo'):(combatPlayersCache.find(p=>String(p.user_id)===String(id))?.name||'personagem')}${data?.fusion?' · evolução de status':''}`,'condition'); scheduleCombatSync(40);
};
window.removeBattleEffect=async function(id){await supabaseClient.from('battle_effects').delete().eq('id',id);scheduleCombatSync(40);};
async function tickBattleEffects(){
  if(currentRole!=='admin'||!activeBattle?.id)return;
  const expiring=battleEffectsCache.filter(e=>e.rounds_remaining===1);
  const ticking=battleEffectsCache.filter(e=>e.rounds_remaining>1);
  await Promise.all([
    ...expiring.map(e=>supabaseClient.from('battle_effects').delete().eq('id',e.id)),
    ...ticking.map(e=>supabaseClient.from('battle_effects').update({rounds_remaining:e.rounds_remaining-1}).eq('id',e.id))
  ]);
  for(const e of expiring) await logBattle(`${e.name} expirou`,'condition');
}

window.quickAdjustPlayer=async function(userId,resource,delta){
  if(currentRole!=='admin')return;
  const {error}=await supabaseClient.rpc('master_adjust_character',{p_user_id:userId,p_resource:resource,p_delta:delta});
  if(error){alert(error.message);return;} const p=combatPlayersCache.find(x=>String(x.user_id)===String(userId)); await logBattle(`${p?.name||'Personagem'} ${delta>0?'recuperou':'perdeu'} ${Math.abs(delta)} ${resource==='hp'?'PV':'PD'}`,'resource'); scheduleCombatSync(30);
};
window.quickAdjustEnemy=async function(id,delta){
  if(currentRole!=='admin')return; const e=battleEnemies.find(x=>String(x.id)===String(id)); if(!e)return;
  const next=CombatDomain.adjustResource(e.hp_current||0,delta,e.hp_max||999999,0); const {error}=await supabaseClient.from('battle_enemies').update({hp_current:next}).eq('id',id); if(error)return alert(error.message);
  await logBattle(`${e.name} ${delta>0?'recuperou':'perdeu'} ${Math.abs(delta)} PV`,'resource'); scheduleCombatSync(30);
};
function quickButtons(handler){return `<div class="quick-resource-pop"><button data-click-call="${handler}(-10)">−10</button><button data-click-call="${handler}(-5)">−5</button><button data-click-call="${handler}(-1)">−1</button><button data-click-call="${handler}(1)">+1</button><button data-click-call="${handler}(5)">+5</button><button data-click-call="${handler}(10)">+10</button></div>`;}

function getMyUnlockedSkills(){
  const out=[]; if(typeof SKILLS==='undefined')return out;
  Object.entries(unlocked||{}).forEach(([key,on])=>{if(!on)return;const [element,name]=key.split('__');for(const path of SKILLS[element]?.paths||[]){const s=path.skills.find(x=>x.name===name);if(s){out.push({...s,element});break;}}}); return out;
}
function combatSkillsForPlayer(player){
  const base=getMyUnlockedSkills();
  const trail=window.EDFCombatRules?.activeTrailAbilities?.(player)||[];
  return [...base,...trail.map(x=>({...x,element:'__trail__'}))];
}
function renderCombatActionEconomy(player){
  if(!activeBattle||!window.EDFCombatRules||!player)return '';
  const budget=EDFCombatRules.actionBudget(activeBattle,battleEffectsCache,'player',player.user_id);
  const item=(slot,label)=>{const lim=budget.limits[slot]??0,used=budget.used[slot]??0,left=budget.available[slot]??0,manual=['movement','light','free'].includes(slot)&&left>0&&isMyCombatTurn();return `<span class="combat-action-slot ${left>0?'available':'spent'}"><b>${escapeHtml(label)}</b><small>${used}/${lim} usado${lim===1?'':'s'}</small>${manual?`<button type="button" data-click-call="consumeSimpleCombatAction('${slot}','${escapeAttr(label)}')">Marcar uso</button>`:''}</span>`;};
  return `<div class="combat-action-economy" aria-label="Economia de ações">${item('standard','Padrão')}${item('movement','Movimento')}${item('light','Leve')}${item('free','Livre')}${item('reaction','Reação')}</div><details class="combat-action-help"><summary>O que conta como cada ação?</summary><small><b>Padrão:</b> ataque comum e habilidades marcadas como Ação Padrão. <b>Movimento:</b> deslocamento normal do turno. <b>Leve:</b> ação curta explicitamente concedida pela regra; não é a mesma coisa que Ataque Leve. <b>Livre:</b> somente habilidades marcadas como Ação Livre ou interação trivial autorizada; não substitui ataque, movimento completo ou teste relevante. <b>Reação:</b> 1 por rodada, fora do próprio turno quando houver gatilho.</small></details>`;
}
function renderCombatQuickActions(options={}){
  const attackHandler=options.attackHandler||'useQuickAttack',skillHandler=options.skillHandler||'useQuickSkill',selectedKey=String(options.selectedKey||'');
  const me=combatPlayersCache.find(p=>String(p.user_id)===String(currentUser?.id)); if(!me)return '';
  const attacks=Array.isArray(me.attacks)?me.attacks:[]; const skills=combatSkillsForPlayer(me);
  const selected=(key)=>selectedKey===key?' is-selected':'';
  const canSlot=slot=>!activeBattle||!window.EDFCombatRules?{ok:true}:EDFCombatRules.canUseAction(activeBattle,battleEffectsCache,'player',me.user_id,slot);
  const attacksHtml=attacks.filter(a=>a?.nome||a?.name).map((a,i)=>{const key=`attack:${i}`,use=canSlot('standard'),locked=activeBattle&&!use.ok;return `<button class="combat-action-card${selected(key)}${locked?' is-action-spent':''}" aria-pressed="${selectedKey===key}" data-action-key="${escapeAttr(key)}" data-click-call="${attackHandler}(${i})"><strong>${escapeHtml(a.nome||a.name)}</strong><small>${escapeHtml(['Ação Padrão',a.teste||a.test,a.dano||a.damage,a.alcance||a.range].filter(Boolean).join(' • '))}</small>${locked?`<em>${escapeHtml(use.reason)}</em>`:selectedKey===key?'<em>✓ Selecionada · escolha o alvo</em>':''}</button>`;}).join('')||'<small>Nenhum ataque cadastrado.</small>';
  const skillsHtml=skills.slice(0,18).map(s=>{const key=`skill:${s.element}:${s.name}`,cost=window.EDFCombatRules?.pdCost?.(s)??0,info=window.EDFCombatRules?.actionInfo?.(s)||{slot:'standard',label:'Ação Padrão'},poor=Number(me.energy_current||0)<cost,use=canSlot(info.slot),passive=info.slot==='passive',locked=passive||(activeBattle&&!use.ok);const source=s.trailAbility?'TRILHA':`RES ${s.res??''}`;return `<button class="combat-action-card${selected(key)}${poor?' is-unaffordable':''}${locked?' is-action-spent':''}" aria-pressed="${selectedKey===key}" data-action-key="${escapeAttr(key)}" data-click-call="${skillHandler}('${escapeAttr(s.element)}','${escapeAttr(s.name)}')"><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml([info.label,s.type||'',s.range||'',source,cost>0?`${cost} PD`:s.trailAbility?'0 PD':''].filter(Boolean).join(' • '))}</small>${passive?'<em>Passivo · aplicado automaticamente quando objetivo</em>':poor?'<em>PD insuficiente</em>':locked?`<em>${escapeHtml(use.reason)}</em>`:selectedKey===key?'<em>✓ Selecionada · escolha o alvo</em>':''}</button>`;}).join('')||'<small>Nenhuma habilidade adquirida.</small>';
  return `<section class="combat-quick-panel"><div class="combat-section-head"><div><span class="section-eyebrow">AÇÕES RÁPIDAS</span><h3>Ataques e habilidades</h3></div><span class="turn-state ${isMyCombatTurn()?'ready':'waiting'}">${activeBattle?(isMyCombatTurn()?'Pronto para agir':'Aguardando turno'):'Consulta'}</span></div>${renderCombatActionEconomy(me)}<div class="target-strip">🎯 Alvo: <strong data-target-label>${escapeHtml(targetLabel())}</strong></div><div class="quick-action-columns"><div><h4>⚔️ Ataques</h4>${attacksHtml}</div><div><h4>✨ Habilidades</h4>${skillsHtml}</div></div></section>`;
}
window.consumeSimpleCombatAction=async function(slot,label){
  if(!activeBattle?.id||!currentUser?.id)return;
  if(!isMyCombatTurn())return alert('Aguarde seu turno.');
  const use=window.EDFCombatRules?.canUseAction?.(activeBattle,battleEffectsCache,'player',currentUser.id,slot);if(use&&!use.ok)return alert(use.reason);
  const {data,error}=await supabaseClient.rpc('consume_combat_action_v1535',{p_battle_id:activeBattle.id,p_actor_type:'player',p_actor_id:currentUser.id,p_action_slot:slot,p_pd_cost:0,p_is_counter:false,p_context:{manual:true,label}});
  if(error)return alert('Não foi possível marcar a ação. Aplique a migration V15 / V15.39.\n'+error.message);
  if(data?.reaction_state)activeBattle={...activeBattle,reaction_state:data.reaction_state};
  if(typeof logBattle==='function')await logBattle(`${combatPlayersCache.find(p=>String(p.user_id)===String(currentUser.id))?.name||'Personagem'} usou ${label}`,'action');
  window.TabletopRealtime?.announceCombatRefresh?.();if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);
};

async function submitCombatAction(message,payload={}){
  if(!activeBattle?.id)return;
  if(currentRole==='admin'){await logBattle(message,'action');return;}
  const {error}=await supabaseClient.from('battle_action_requests').insert({battle_id:activeBattle.id,user_id:currentUser.id,message,payload,status:'pending'});
  if(error)alert('Não foi possível enviar a ação. Execute o SQL atualizado.\n'+error.message);
}
window.resolveCombatAction=async function(id,approved){
  if(currentRole!=='admin')return;const req=battleActionRequestsCache.find(x=>String(x.id)===String(id));if(!req)return;
  await supabaseClient.from('battle_action_requests').update({status:approved?'approved':'rejected',resolved_by:currentUser.id,resolved_at:new Date().toISOString()}).eq('id',id);
  if(approved)await logBattle(req.message,'action');if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);
};

window.duplicateBattleEnemy=async function(id,count=1){
  if(currentRole!=='admin')return;const e=battleEnemies.find(x=>String(x.id)===String(id));if(!e)return; const copies=[];
  for(let i=0;i<count;i++)copies.push({battle_id:activeBattle.id,name:e.name,subtitle:e.subtitle,image_url:e.image_url,hp_current:e.hp_max,hp_max:e.hp_max,defense:e.defense,dodge:e.dodge,block:e.block,movement_speed:e.movement_speed,level:e.level||1,rank:e.rank||'comum',element:e.element||'',damage_reduction:e.damage_reduction||0,conditions:e.conditions||[],attacks:e.attacks||[],abilities:e.abilities||[],notes:e.notes||'',visibility:e.visibility||{}});
  const {error}=await supabaseClient.from('battle_enemies').insert(copies);if(error)return alert(error.message);await logBattle(`${e.name} duplicado ×${count}`,'enemy');scheduleCombatSync(40);
};

function renderCombatHistory(){
  const pending=currentRole==='admin'&&battleActionRequestsCache.length?`<div class="pending-actions"><span class="section-eyebrow">AÇÕES PARA CONFIRMAR</span>${battleActionRequestsCache.map(r=>`<div><span>${escapeHtml(r.message)}</span><button data-click-call="resolveCombatAction('${r.id}',true)">Confirmar</button><button data-click-call="resolveCombatAction('${r.id}',false)">Ignorar</button></div>`).join('')}</div>`:'';
  return `<section class="combat-history">${pending}<div class="combat-section-head"><div><span class="section-eyebrow">HISTÓRICO</span><h3>Últimos acontecimentos</h3></div></div><div class="combat-log-list">${battleLogPublicCache.slice(0,12).map(l=>`<div><time>${new Date(l.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</time><span>${escapeHtml(l.message)}</span></div>`).join('')||'<small>Nenhum evento registrado.</small>'}</div></section>`;
}


// Substitui somente a composição visual do combate; os dados/realtime continuam os mesmos.
function renderBattlePlayerCard(pl){
  const hpMax=pl.hp_max||1,hp=Math.max(0,Math.min(100,Math.round((pl.hp_current||0)/hpMax*100))),pdMax=pl.energy_max||1,pd=Math.max(0,Math.min(100,Math.round((pl.energy_current||0)/pdMax*100))),down=(pl.hp_current||0)<=0;
  const mods=window.EDFCombatRules?.derivedModifiers?.(pl)||{},defense=5+(Number(pl.constitution)||0)+(Number(pl.block)||0)+(Number(mods.defense)||0),rd=Number(pl.damage_reduction||0)+(Number(mods.rd)||0);
  return `<article class="battle-card ally-card ${down?'combat-down':''} ${selectedCombatTarget?.type==='player'&&String(selectedCombatTarget.id)===String(pl.user_id)?'targeted':''}" data-player-id="${escapeHtml(pl.user_id||'')}" data-click-call="selectCombatTarget('player','${escapeAttr(pl.user_id)}')"><div class="battle-card-head"><div class="battle-avatar">${pl.avatar_url?`<img src="${escapeAttr(pl.avatar_url)}">`:escapeHtml((pl.name||'?')[0])}</div><div><strong>${escapeHtml(pl.name||'Sem nome')}</strong><small>${escapeHtml([pl.class_name,pl.archetype,pl.element].filter(Boolean).join(' • '))}</small></div><b>${down?'💀 0 PV':'NV '+(pl.level||1)}</b></div><div class="battle-resource"><span>PV</span><div><i style="width:${hp}%"></i></div><b>${pl.hp_current||0}/${pl.hp_max||0}</b></div><div class="battle-resource pd"><span>PD</span><div><i style="width:${pd}%"></i></div><b>${pl.energy_current||0}/${pl.energy_max||0}</b></div><div class="battle-stats"><span>DEF <b>${defense}</b></span><span>RD <b>${rd}</b></span><span>ESQ <b>${pl.dodge??0}</b></span><span>ARM <b>${pl.block??0}</b></span><span>DESL <b>${pl.movement_speed??9}m</b></span></div>${mods.reminders?.length?`<details class="combat-auto-reminders"><summary>Automações da ficha</summary>${mods.reminders.map(x=>`<small>${escapeHtml(x)}</small>`).join('')}</details>`:''}${renderTimedEffects('player',pl.user_id)}${currentRole==='admin'?`<div class="combat-card-tools" data-click-call="event.stopPropagation()">${quickButtons(`quickAdjustPlayer.bind(null,'${escapeAttr(pl.user_id)}','hp')`)}<button data-click-call="addBattleEffect('player','${escapeAttr(pl.user_id)}')">+ Condição</button><button data-click-call="selectCharacterFromPicker('${escapeAttr(pl.user_id)}');setTimeout(()=>switchTab('personagem'),100)">Ficha →</button></div>`:''}</article>`;
};
function renderCombat(players){
  if(!activeBattle)return `<section class="combat-shell"><div class="combat-empty"><span>⚔️</span><h2>Nenhum combate ativo</h2><p>Quando o mestre iniciar uma batalha, jogadores e inimigos aparecerão aqui em tempo real.</p>${currentRole==='admin'?'<button class="primary-action" data-click-call="startBattle()">+ Iniciar combate</button>':''}</div></section>`;
  const allies=players.map(renderBattlePlayerCard).join('')||'<p class="combat-placeholder">Nenhum personagem.</p>', enemies=battleEnemies.map(renderEnemyCard).join('')||'<p class="combat-placeholder">Nenhum inimigo.</p>';
  return `<section class="combat-shell"><header class="combat-head"><div><span class="section-eyebrow">BATALHA AO VIVO</span><h2 data-combat-title>⚔️ ${escapeHtml(activeBattle.name||'Combate')}</h2><p data-combat-meta>Rodada ${activeBattle.round||1}${activeBattle.turn_label?' • Turno: '+escapeHtml(activeBattle.turn_label):''}</p></div>${currentRole==='admin'?`<div class="combat-admin-actions"><button data-click-call="advanceRound()">+ Rodada</button><button class="danger-action" data-click-call="endBattle()">Encerrar</button></div>`:''}</header>${renderCombatInitiative()}${renderCombatQuickActions()}<div class="combat-section-head"><h3>Aliados</h3><span data-ally-count>${players.length} personagens</span></div><div class="battle-allies">${allies}</div><div class="combat-section-head"><h3>Inimigos</h3>${currentRole==='admin'?`<div class="combat-enemy-actions"><button data-click-call="openBattleBestiaryPicker()">📚 Do bestiário</button><button data-click-call="openEnemyEditor()">+ Criar manualmente</button></div>`:''}</div><div class="battle-enemies">${enemies}</div>${renderCombatHistory()}</section>`;
};

// V15.13 — public renderer bridge used by Mesa. This keeps one combat UI/source of truth.
window.CombatSurface=Object.freeze({
  syncState(state={}){
    activeBattle=state.battle||null;
    battleEnemies=Array.isArray(state.enemies)?state.enemies:[];
    combatPlayersCache=Array.isArray(state.players)?state.players:[];
    // Mesa player must have the same local sheet payload used by the Combate tab.
    // The shield RPC may intentionally omit private attack details for non-admin clients.
    const myIndex=combatPlayersCache.findIndex(p=>String(p.user_id)===String(currentUser?.id));
    if(myIndex>=0 && typeof characterData!=='undefined' && characterData){
      const localAttacks=Array.isArray(characterData.attacks)?characterData.attacks:Array.isArray(characterData.ataques)?characterData.ataques:[];
      combatPlayersCache[myIndex]={...combatPlayersCache[myIndex],...characterData,user_id:combatPlayersCache[myIndex].user_id||currentUser.id,attacks:localAttacks.length?localAttacks:(combatPlayersCache[myIndex].attacks||[])};
    } else if(myIndex<0 && currentRole!=='admin' && currentUser?.id && typeof characterData!=='undefined' && characterData){
      // Fora de combate a RPC pode não devolver o próprio personagem. Mantemos a ficha local
      // como fallback para que Ações Rápidas nunca desapareçam na Mesa.
      const localAttacks=Array.isArray(characterData.attacks)?characterData.attacks:Array.isArray(characterData.ataques)?characterData.ataques:[];
      combatPlayersCache.push({...characterData,user_id:currentUser.id,attacks:localAttacks});
    }
    battleEffectsCache=Array.isArray(state.effects)?state.effects:[];
    battleLogPublicCache=Array.isArray(state.logs)?state.logs:[];
    battleActionRequestsCache=Array.isArray(state.requests)?state.requests:[];
  },
  renderQuickActions:(options={})=>renderCombatQuickActions(options),
  renderInitiative:()=>renderCombatInitiative(),
  renderHistory:()=>renderCombatHistory(),
  isMyTurn:()=>isMyCombatTurn(),
  targetLabel:()=>targetLabel(),
  currentActor:()=>currentCombatActor(),
  setTarget(type,id){window.selectCombatTarget(type,id);},
  refreshTargetLabel(){const label=document.querySelector('[data-target-label]');if(label)label.textContent=targetLabel();}
});

window.advanceRound=advanceRound;

// Bestiário: filtros, categoria/elemento/nível e encontros.
let bestiaryFilter={q:'',rank:'all',element:'all'};
function filterBestiaryList(){document.querySelectorAll('.bestiary-card[data-search]').forEach(card=>{const q=bestiaryFilter.q.toLowerCase();card.hidden=!!((q&&!card.dataset.search.includes(q))||(bestiaryFilter.rank!=='all'&&card.dataset.rank!==bestiaryFilter.rank)||(bestiaryFilter.element!=='all'&&card.dataset.element!==bestiaryFilter.element));});}
window.setBestiaryFilter=function(kind,value){bestiaryFilter[kind]=value;document.querySelectorAll(`[data-filter-kind="${kind}"]`).forEach(b=>b.classList.toggle('active',b.dataset.filterValue===value));filterBestiaryList();};
window.searchBestiary=function(v){bestiaryFilter.q=v||'';filterBestiaryList();};
function renderMasterBestiary(){
  const cards=masterBestiaryCache.map(e=>`<article class="bestiary-card" data-search="${escapeAttr([e.name,e.subtitle,e.rank,e.element].filter(Boolean).join(' ').toLowerCase())}" data-rank="${escapeAttr(e.rank||'comum')}" data-element="${escapeAttr(e.element||'nenhum')}"><div class="bestiary-head"><div class="battle-avatar enemy">${e.image_url?`<img src="${escapeAttr(e.image_url)}">`:'👹'}</div><div><strong>${escapeHtml(e.name)}</strong><small>${escapeHtml((e.rank||'Comum').toUpperCase())} • ${escapeHtml((e.element||'Sem elemento').toUpperCase())} • Nv. ${e.level||1}</small></div></div><div class="bestiary-stats"><span>PV <b>${e.hp_max}</b></span><span>DEF <b>${e.defense??10}</b></span><span>ESQ <b>${e.dodge??0}</b></span><span>DESL <b>${e.movement_speed??9}m</b></span></div><div class="bestiary-actions"><button data-click-call="addTemplateToBattle('${e.id}')">+ Combate</button><button data-click-call="openBestiaryEditor('${e.id}')">Editar</button><button data-click-call="duplicateBestiary('${e.id}')">Duplicar</button><button class="danger-text" data-click-call="deleteBestiary('${e.id}')">🗑 Excluir</button></div></article>`).join('');
  return `<section class="master-section"><div class="master-panel-head"><div><span class="section-eyebrow">BESTIÁRIO</span><h3>Biblioteca de inimigos</h3></div><div class="bestiary-create-actions"><button data-click-call="openBestiaryTextImporter()">✦ Criar do texto</button><button class="primary-action" data-click-call="openBestiaryEditor()">+ Novo inimigo</button></div></div><div class="bestiary-toolbar"><input placeholder="🔎 Pesquisar..." data-input-call="searchBestiary(this.value)"><div class="filter-row">${['all','comum','elite','chefe'].map(x=>`<button data-filter-kind="rank" data-filter-value="${x}" data-click-call="setBestiaryFilter('rank','${x}')">${x==='all'?'Todos':x}</button>`).join('')}</div><div class="filter-row">${['all','frio','fogo','agua','terra','vento','energia','vazio'].map(x=>`<button data-filter-kind="element" data-filter-value="${x}" data-click-call="setBestiaryFilter('element','${x}')">${x==='all'?'Elementos':x}</button>`).join('')}</div></div><div class="bestiary-grid">${cards||'<div class="combat-empty"><h3>Bestiário vazio</h3></div>'}</div>${renderEncounterTemplates()}</section>`;
};

let encounterTemplatesCache=[];
async function loadEncounterTemplates(){if(currentRole!=='admin')return;const {data}=await supabaseClient.from('encounter_templates').select('*').order('name');encounterTemplatesCache=data||[];}
function renderEncounterTemplates(){return `<div class="encounter-section" data-encounters>${encounterTemplatesHtml()}</div>`;}
function encounterTemplatesHtml(){return `<div class="master-panel-head"><div><span class="section-eyebrow">ENCONTROS SALVOS</span><h3>Modelos de encontro</h3></div><button data-click-call="createEncounterTemplate()">+ Salvar encontro atual</button></div><div class="encounter-grid">${encounterTemplatesCache.map(e=>`<article><strong>${escapeHtml(e.name)}</strong><small>${(e.members||[]).reduce((n,x)=>n+(x.quantity||1),0)} inimigos</small><button data-click-call="startEncounterTemplate('${e.id}')">Iniciar encontro</button><button data-click-call="deleteEncounterTemplate('${e.id}')">Excluir</button></article>`).join('')||'<small>Nenhum encontro salvo.</small>'}</div>`;}
window.createEncounterTemplate=async function(){const name=prompt('Nome do encontro:');if(!name)return;const members=masterBestiaryCache.filter(e=>confirm(`Incluir ${e.name}?`)).map(e=>({template_id:e.id,quantity:Math.max(1,parseInt(prompt(`Quantidade de ${e.name}:`,'1'))||1)}));if(!members.length)return;const {error}=await supabaseClient.from('encounter_templates').insert({owner_id:currentUser.id,name,members});if(error)alert(error.message);else{await loadEncounterTemplates();loadMasterHub('bestiary');}};
window.startEncounterTemplate=async function(id){const enc=encounterTemplatesCache.find(x=>x.id===id);if(!enc)return;if(!activeBattle){alert('Inicie um combate primeiro.');return;}for(const m of enc.members||[]){for(let i=0;i<(m.quantity||1);i++)await addTemplateToBattle(m.template_id);}await logBattle(`Encontro “${enc.name}” adicionado`,'encounter');scheduleCombatSync(50);};
window.deleteEncounterTemplate=async function(id){if(!confirm('Excluir encontro salvo?'))return;await supabaseClient.from('encounter_templates').delete().eq('id',id);await loadEncounterTemplates();loadMasterHub('bestiary');};

// Modo de sessão — cronômetro e resumo persistente.
window.startGameSession=async function(){if(currentRole!=='admin')return;const title=prompt('Nome da sessão rápida:','Nova sessão');if(!title)return;await supabaseClient.from('game_sessions').update({active:false,status:'finished',ended_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('active',true);const {data,error}=await supabaseClient.from('game_sessions').insert({owner_id:currentUser.id,title,active:true,status:'active',source_text:'',plan:{},started_at:new Date().toISOString(),updated_at:new Date().toISOString()}).select().single();if(error)return alert('Não foi possível iniciar. Execute a migration v6 do planejador.\n'+error.message);activeGameSession=data;if(typeof window.loadPlannedSessions==='function')await window.loadPlannedSessions();if(typeof window.syncSessionDocumentLauncher==='function')window.syncSessionDocumentLauncher();syncSessionClockTimer();loadMasterHub('session');};
window.endGameSession=async function(){if(!activeGameSession)return;const notes=prompt('Resumo/notas finais da sessão:',activeGameSession.notes||'')??activeGameSession.notes;await supabaseClient.from('game_sessions').update({active:false,status:'finished',ended_at:new Date().toISOString(),notes,updated_at:new Date().toISOString()}).eq('id',activeGameSession.id);activeGameSession=null;if(typeof window.syncSessionDocumentLauncher==='function')window.syncSessionDocumentLauncher();syncSessionClockTimer();if(typeof window.loadPlannedSessions==='function')await window.loadPlannedSessions();loadMasterHub('session');};
function sessionElapsed(){if(!activeGameSession)return '';const ms=Date.now()-new Date(activeGameSession.started_at).getTime();const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':');}
function renderMasterSession(){if(activeGameSession){return `<section class="session-mode-card session-mode-card-v5"><div><span class="section-eyebrow">SESSAO EM ANDAMENTO</span><h2>${escapeHtml(activeGameSession.title)}</h2><p>Duração: <b data-session-clock>${sessionElapsed()}</b> • O documento fica disponível pelo botão 📖 no canto inferior direito.</p></div><div class="session-mode-actions"><button data-click-call="openActiveSessionDocument()">📖 Documento</button><button data-click-call="switchTab('jogadores')">Jogadores</button><button data-click-call="switchTab('bestiario')">Bestiario</button><button class="primary-action" data-click-call="switchTab('combate')">Combate</button><button class="danger-action" data-click-call="endGameSession()">Finalizar</button></div></section>`;}return `<section class="session-mode-card session-mode-card-v5"><div><span class="section-eyebrow">MESA ATUAL</span><h2>Nenhuma sessao iniciada</h2><p>Escolha um documento de sessao preparado ou inicie uma sessao rapida.</p></div><div class="session-mode-actions"><button class="primary-action" data-click-call="setMasterSection('planning')">Abrir sessoes</button><button data-click-call="startGameSession()">Sessao rapida</button></div></section>`;};
let sessionClockTimer = null;
function syncSessionClockTimer() {
  if (sessionClockTimer) { clearInterval(sessionClockTimer); sessionClockTimer = null; }
  if (!activeGameSession) return;
  sessionClockTimer = setInterval(() => {
    if (document.visibilityState !== 'visible' || !activeGameSession) return;
    const el = document.querySelector('[data-session-clock]');
    if (el) el.textContent = sessionElapsed();
  }, 1000);
}



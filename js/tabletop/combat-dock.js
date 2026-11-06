(function(){
'use strict';

let pendingAction=null;
let counterTargetId=null;
let enemyCounterActorId=null;
let enemyCounterTargetId=null;
let reactionFeedback=null;
const state=()=>TabletopStore?.state?.combat||{};
const selected=()=>TabletopStore?.selected?.()||null;
const esc=v=>escapeHtml(String(v??''));
const attr=v=>escapeAttr(String(v??''));

function sync(){
  window.CombatSurface?.syncState?.(state());
  const rs=state().battle?.reaction_state||{};
  if(currentRole!=='admin'&&currentUser?.id){
    const row=rs?.actors?.[`player:${currentUser.id}`]||{};
    const persisted=row?.counter_available?.target_id;
    if(persisted)counterTargetId=String(persisted);
    else if(counterTargetId&&row?.counter_available==null)counterTargetId=null;
  }else if(currentRole==='admin'){
    const entries=Object.entries(rs?.actors||{}).filter(([key,row])=>key.startsWith('enemy:')&&row?.counter_available?.target_id);
    const found=entries[0]||null;
    enemyCounterActorId=found?String(found[0].slice(6)):null;
    enemyCounterTargetId=found?String(found[1].counter_available.target_id):null;
  }
}
function order(){return Array.isArray(state().battle?.turn_order)?state().battle.turn_order:[];}
function actor(){const o=order(),i=Math.max(0,Math.min(o.length-1,Number(state().battle?.turn_index)||0));return o[i]||null;}
function myTurn(){const a=actor();return !!a&&a.type==='player'&&String(a.id)===String(currentUser?.id);}
function playerById(id){return (state().players||[]).find(p=>String(p.user_id)===String(id));}
function entityForActor(a){return !a?null:TabletopStore.state.entities.find(e=>String(e.id)===String(a.entity_id)||(a.type==='player'&&String(e.source_id||e.owner_user_id)===String(a.id))||(a.type==='enemy'&&String(e.battle_entity_id)===String(a.id)));}
function selectedBattleEnemy(e){return e?.battle_entity_id?(state().enemies||[]).find(x=>String(x.id)===String(e.battle_entity_id)):null;}
function participant(e){return !!e&&order().some(x=>String(x.entity_id)===String(e.id)||(x.type==='player'&&e.entity_type==='player'&&String(x.id)===String(e.source_id||e.owner_user_id))||(x.type==='enemy'&&e.entity_type==='enemy'&&String(x.id)===String(e.battle_entity_id)));}
function announce(){window.TabletopRealtime?.announceCombatRefresh?.();}

function initiativeSidebar(){
  const b=state().battle;if(!b)return '';
  const o=order(),idx=Math.max(0,Math.min(o.length-1,Number(b.turn_index)||0));
  return `<aside class="tabletop-inspector tt-initiative-sidebar"><div class="tt-side-title"><div><span class="section-eyebrow">COMBATE</span><h3>Iniciativa</h3><small>Rodada ${Number(b.round)||1}</small></div>${currentRole==='admin'?'<button data-click-call="openInitiativeEditor()">Editar</button>':''}</div><div class="tt-side-initiative-list">${o.map((x,i)=>`<div class="tt-side-init ${i===idx?'current':''}"><span>${i+1}</span><i>${x.type==='player'?'👤':x.type==='enemy'?'👹':'🗣️'}</i><div><b>${esc(x.label)}</b><small>${x.type==='player'?'Player':x.type==='enemy'?'Inimigo':'NPC'}</small></div><strong>${Number(x.initiative)||0}</strong>${i===idx?'<em>AGINDO</em>':''}</div>`).join('')}</div><div class="tt-side-battle-admin">${currentRole==='admin'?'<button data-click-call="openInitiativeEditor()">↕ Alterar iniciativa</button>':''}<button class="primary-action" data-click-call="tabletopFinishTurn()">✓ Acabou o turno</button>${currentRole==='admin'?'<button class="danger-text" data-click-call="tabletopEndCombat()">Encerrar combate</button>':''}</div></aside>`;
}

function mobileInitiativePeek(){
  const b=state().battle,o=order();if(!b||!o.length)return '';
  const idx=Math.max(0,Math.min(o.length-1,Number(b.turn_index)||0)),now=o[idx],next=o[(idx+1)%o.length];
  return `<button class="tt-mobile-initiative-peek" data-click-call="setTabletopMobilePanel('turns')"><span><b>Rodada ${Number(b.round)||1}</b><strong>${esc(now?.label||'Turno')}</strong></span><small>Agora${next?` · próximo: ${esc(next.label)}`:''}</small><em>Ver iniciativa →</em></button>`;
}

function enemyById(id){return (state().enemies||[]).find(e=>String(e.id)===String(id));}
function reactionRequest(){
  const requests=state().requests||[];
  if(currentRole==='admin')return requests.find(r=>r.payload?.kind==='player_attack_reaction'&&String(r.user_id)===String(currentUser?.id))||null;
  return requests.find(r=>r.payload?.kind==='enemy_attack_reaction'&&String(r.user_id)===String(currentUser?.id))||null;
}
function outgoingReactionRequest(){if(currentRole==='admin')return null;return (state().requests||[]).find(r=>r.payload?.kind==='player_attack_reaction'&&String(r.payload?.actor_id)===String(currentUser?.id))||null;}
function reactionWaitingPanel(req){const p=req?.payload||{},target=enemyById(p.target_id);return `<section class="tt-reaction-waiting"><div><span class="section-eyebrow">ATAQUE ENVIADO</span><strong>⏳ Aguardando reação do Mestre</strong><small>${esc(p.action||'Ataque')} → ${esc(target?.name||p.target_name||'Inimigo')}</small></div><span>O dano só será aplicado depois que o Mestre escolher Esquivar, Bloquear/reduzir ou Receber.</span></section>`;}
function conditionLabelsFor(type,id,row){
  const own=Array.isArray(row?.conditions)?row.conditions:[];
  const timed=(state().effects||[]).filter(x=>x.entity_type===type&&String(x.entity_id)===String(id)).map(x=>x.name);
  return [...own,...timed].map(x=>typeof x==='string'?x:(x?.name||'')).filter(Boolean);
}
function hasCondition(labels,name){const n=name.toLowerCase();return labels.some(x=>String(x).toLowerCase().includes(n));}
function playerDodgeDiceText(me){const agi=Math.max(0,Number(me?.dexterity)||0);return agi===0?'AGI 0: role 2d20 e use o pior resultado.':`AGI ${agi}: role ${agi}d20 e use o melhor resultado.`;}
function skillBonus(row,name){const v=row?.skills?.[name];return Math.max(0,Number(typeof v==='object'?v?.bonus:v)||0)+(Number(typeof v==='object'?v?.others:0)||0);}
function fortitudeGuide(row){const vig=Math.max(0,Number(row?.constitution)||0),bonus=skillBonus(row,'Fortitude'),armor=Math.max(0,Number(row?.block)||0);const dice=vig===0?'2d20 e use o pior':`${vig}d20 e use o melhor`;return{vig,bonus,armor,text:`Role ${dice}; some Fortitude ${bonus}${armor?` + Armadura ${armor}`:''}.`};}
function reactionContext(req){
  const p=req?.payload||{},enemyTarget=p.kind==='player_attack_reaction';
  if(enemyTarget){
    const target=enemyById(p.target_id),attacker=playerById(p.actor_id);
    return{controller:'master',targetType:'enemy',targetId:String(p.target_id||''),target,targetName:target?.name||p.target_name||'Inimigo',targetImage:target?.image_url||'',attackerName:attacker?.name||p.actor_name||'Personagem',attack:Number(p.attack_result)||0,damage:Number(p.damage)||0,rd:Number(target?.damage_reduction)||0,armor:Number(target?.block)||0,fortitude:Number(target?.fortitude||0),dodge:Number(target?.dodge)||0,labels:conditionLabelsFor('enemy',p.target_id,target),action:p.action||'Ataque'};
  }
  const target=playerById(req?.user_id||currentUser?.id),mods=window.EDFCombatRules?.derivedModifiers?.(target)||{};
  return{controller:'player',targetType:'player',targetId:String(req?.user_id||currentUser?.id||''),target,targetName:target?.name||'Personagem',targetImage:target?.avatar_url||'',attackerName:p.actor_name||enemyById(p.actor_id)?.name||'Inimigo',attack:Number(p.attack_result)||0,damage:Number(p.damage)||0,rd:(Number(target?.damage_reduction)||0)+(Number(mods.rd)||0),armor:Number(target?.block)||0,fortitude:skillBonus(target,'Fortitude'),dodge:Number(target?.dexterity)||0,labels:conditionLabelsFor('player',req?.user_id||currentUser?.id,target),action:p.action||'Ataque inimigo'};
}
function dodgeInstruction(ctx){
  if(ctx.targetType==='player')return `${playerDodgeDiceText(ctx.target)} Compare o total final com ${ctx.attack}.`;
  return `Esquiva cadastrada: ${ctx.dodge}. Role Reflexos/AGI conforme a ficha do inimigo e compare o total com ${ctx.attack}.`;
}
function reactionPanel(req,modal=false){
  const c=reactionContext(req),p=req?.payload||{},immobilized=hasCondition(c.labels,'imobilizado')||hasCondition(c.labels,'congelado'),fallen=hasCondition(c.labels,'caído')||hasCondition(c.labels,'caido'),slowed=hasCondition(c.labels,'lento')||hasCondition(c.labels,'congelando');
  const budget=window.EDFCombatRules?.actionBudget?.(state().battle,state().effects||[],c.targetType,c.targetId),reactionAvailable=(budget?.available?.reaction??1)>0;
  const area=p.allow_generic_dodge===false||p.is_area===true,canDodge=reactionAvailable&&!immobilized&&!area,canMitigate=reactionAvailable;
  const warnings=[!reactionAvailable?'A Reação desta rodada já foi usada. Você ainda pode receber o ataque.':'',area?'Efeito de área: a Esquiva genérica não se aplica. Use o teste de resistência indicado pela habilidade.':'',immobilized?'Imobilizado: não pode Esquivar.':'',fallen?'Caído: Esquiva somente com desvantagem.':'',slowed?'Lento/Congelando: −2 no teste de Esquiva.':''].filter(Boolean);
  const eyebrow=c.controller==='master'?'INIMIGO SOB ATAQUE · DECISÃO DO MESTRE':'VOCÊ ESTÁ SENDO ATACADO · SUA REAÇÃO';
  return `<section class="tt-reaction-panel is-priority ${modal?'is-popout':''}"><div class="tt-reaction-head"><div class="tt-reaction-identity">${c.targetImage?`<span class="tt-reaction-avatar"><img src="${attr(c.targetImage)}" alt=""></span>`:'<span class="tt-reaction-avatar">⚔</span>'}<div><span class="section-eyebrow">${eyebrow}</span><h3>${esc(c.targetName)}</h3><small>${esc(c.attackerName)} → ${esc(c.action)}</small></div></div><span class="tt-danger-chip">Ataque ${c.attack}</span></div><div class="tt-reaction-summary"><span>Dano anunciado <b>${c.damage}</b></span><span>${c.targetType==='enemy'?'ESQ':'AGI'} <b>${c.dodge}</b></span><span>ARM <b>${c.armor||0}</b></span><span>RD <b>${c.rd}</b></span><span>Reação <b>${reactionAvailable?'Disponível':'Usada'}</b></span></div>${warnings.length?`<div class="tt-reaction-warning">⚠ ${warnings.map(esc).join(' ')}</div>`:''}<div class="tt-reaction-choice-grid"><button class="tt-reaction-choice primary-action" ${canDodge?'':'disabled aria-disabled="true"'} data-click-call="tabletopResolveDodge('${attr(req.id)}')"><b>🌀 Esquivar</b><small>${area?'Indisponível para área. Resolva a resistência da habilidade.':esc(dodgeInstruction(c))}</small></button><button class="tt-reaction-choice" ${canMitigate?'':'disabled aria-disabled="true"'} data-click-call="tabletopResolveBlock('${attr(req.id)}')"><b>🛡 Bloquear</b><small>Consome sua Reação. Faça Fortitude + Armadura contra o ataque; se superar o resultado, recebe metade do dano.</small></button><button class="tt-reaction-choice danger-text" data-click-call="tabletopAcceptEnemyHit('${attr(req.id)}')"><b>💥 Receber ataque</b><small>Receber o ataque não gasta sua Reação.</small></button></div><details class="tt-reaction-rules"><summary>Regras usadas pelo sistema</summary><small>Cada personagem tem 1 Reação por rodada. Esquiva usa Reflexos (AGI) contra o resultado do ataque e não é oferecida genericamente contra efeitos de área. Sucesso = 0 dano; 20 natural permite mover 1,5m; 1 natural acrescenta +1d6 de dano. Uma Esquiva bem-sucedida pode abrir Contra-Ataque sem gastar uma segunda Reação. Bloqueio usa Fortitude + Armadura e precisa superar o resultado do ataque.</small></details><small class="tt-reaction-note">${c.controller==='master'?'O Mestre controla a reação deste inimigo.':'Esta decisão pertence ao jogador alvo.'}</small></section>`;
}
function ensureReactionPopout(req){
  const existing=document.getElementById('tt-reaction-modal');
  if(!req){if(existing?.dataset?.reactionDecision==='true')existing.remove();return;}
  if(existing&&String(existing.dataset?.requestId||'')===String(req.id))return;
  if(existing)existing.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="tt-reaction-modal" class="picker-modal tt-reaction-attention" data-request-id="${attr(req.id)}" data-reaction-decision="true"><div class="picker-backdrop" aria-hidden="true"></div><div class="picker-panel tt-reaction-popout-panel"><div class="tt-reaction-popout-callout"><b>⚠ Reação pendente</b><span>O combate está aguardando esta decisão.</span></div>${reactionPanel(req,true)}</div></div>`);
}

function reactionFeedbackPanel(){
  if(!reactionFeedback)return '';
  const good=reactionFeedback.kind==='dodge-success'||reactionFeedback.damage===0;
  return `<section class="tt-reaction-feedback ${good?'success':'resolved'}"><div><span class="section-eyebrow">REAÇÃO RESOLVIDA</span><strong>${esc(reactionFeedback.title)}</strong><small>${esc(reactionFeedback.detail||'')}</small></div><button data-click-call="tabletopDismissReactionFeedback()">Fechar</button></section>`;
}

function skillByName(element,name,player=null){
  if(element==='__trail__')return (window.EDFCombatRules?.activeTrailAbilities?.(player)||[]).find(x=>x.name===name)||null;
  if(typeof SKILLS==='undefined')return null;for(const path of SKILLS?.[element]?.paths||[]){const skill=(path.skills||[]).find(s=>s.name===name);if(skill)return {...skill,element};}return null;
}
function unlockedSkillsForPlayer(player){
  const raw=player?.unlocked_skills&&typeof player.unlocked_skills==='object'?player.unlocked_skills:{};
  const list=[];
  Object.entries(raw).forEach(([key,on])=>{if(!on)return;const pos=key.indexOf('__');if(pos<0)return;const element=key.slice(0,pos),name=key.slice(pos+2),skill=skillByName(element,name,player);if(skill)list.push({...skill,element});});
  const trail=window.EDFCombatRules?.activeTrailAbilities?.(player)||[];
  return [...list,...trail.map(x=>({...x,element:'__trail__'}))];
}
function skillPdCost(skill){return window.EDFCombatRules?.pdCost?.(skill)??0;}
function canPaySkill(player,skill){return Number(player?.energy_current||0)>=skillPdCost(skill);}
function actionCheck(type,id,slot,isCounter=false){if(isCounter||!window.EDFCombatRules)return{ok:true};return EDFCombatRules.canUseAction(state().battle,state().effects||[],type,id,slot);}
function skillPendingPayload(player,skill){
  const cost=skillPdCost(skill),info=window.EDFCombatRules?.actionInfo?.(skill)||{slot:'standard',label:'Ação Padrão'},resonance=window.EDFCombatRules?.resonanceInfo?.(skill,player)||{required:false},effects=window.EDFCombatRules?.effectsForSkill?.(skill)||[];
  return{actorType:'player',actorId:String(player.user_id),actorName:player.name||'Personagem',name:skill.name,actionKind:'ability',testFormula:skill.test||skill.teste||'',damageFormula:skill.damage||skill.dano||'',effect:skill.effect||skill.description||'',resource:'pd',cost,grade:Number(skill.res||skill.grade)||0,element:skill.element||resonance.rule?.element||'',actionSlot:info.slot,actionLabel:info.label,resonance,effects,isArea:!!window.EDFCombatRules?.isAreaSkill?.(skill),source:skill.trailAbility?'trail':'skill-tree',skill};
}

function chooseActionPanel(){
  const a=actor();if(!a)return '';
  if(a.type==='player'&&String(a.id)===String(currentUser?.id)){
    const quick=window.CombatSurface?.renderQuickActions?.({attackHandler:'tabletopChoosePlayerAttack',skillHandler:'tabletopChoosePlayerSkill',selectedKey:pendingAction?.selectionKey})||'';
    return `<section class="tt-turn-panel"><div class="tt-turn-head"><div><span class="section-eyebrow">SEU TURNO</span><h3>Escolha uma ação</h3></div><span>1. Ação → 2. Alvo → 3. Rolagem física</span></div>${quick}</section>`;
  }
  if(a.type==='enemy'&&currentRole==='admin')return masterEnemyQuickActions((state().enemies||[]).find(x=>String(x.id)===String(a.id)),true);
  if(a.type==='npc'&&currentRole==='admin')return `<section class="tt-turn-panel"><span class="section-eyebrow">TURNO DO NPC</span><h3>${esc(a.label)}</h3><p>Resolva a ação presencialmente e clique em “Acabou o turno”.</p></section>`;
  return '';
}

function masterPlayerQuickActions(player){
  if(!player)return '';
  const attacks=Array.isArray(player.attacks)?player.attacks:[],skills=unlockedSkillsForPlayer(player),a=actor(),canUse=!!state().battle&&a?.type==='player'&&String(a.id)===String(player.user_id);
  const attackCards=attacks.filter(x=>x?.nome||x?.name).map((x,i)=>{const key=`mattack:${player.user_id}:${i}`,sel=pendingAction?.selectionKey===key;return `<button class="combat-action-card${sel?' is-selected':''}" aria-pressed="${sel}" data-click-call="tabletopChooseMasterPlayerAttack('${attr(player.user_id)}',${i})"><strong>⚔ ${esc(x.nome||x.name)}</strong><small>${esc([x.teste||x.test,x.dano||x.damage,x.alcance||x.range].filter(Boolean).join(' • '))}</small>${sel?'<em>✓ Selecionada · escolha o inimigo</em>':''}</button>`;}).join('')||'<small>Nenhum ataque cadastrado.</small>';
  const skillCards=skills.slice(0,14).map(s=>{const key=`mskill:${player.user_id}:${s.element}:${s.name}`,sel=pendingAction?.selectionKey===key,cost=skillPdCost(s),poor=Number(player.energy_current||0)<cost,info=window.EDFCombatRules?.actionInfo?.(s)||{label:'Ação Padrão',slot:'standard'},passive=info.slot==='passive';return `<button class="combat-action-card${sel?' is-selected':''}${poor?' is-unaffordable':''}${passive?' is-action-spent':''}" aria-pressed="${sel}" data-click-call="tabletopChooseMasterPlayerSkill('${attr(player.user_id)}','${attr(s.element)}','${attr(s.name)}')"><strong>✦ ${esc(s.name)}</strong><small>${esc([info.label,s.type,s.range,s.trailAbility?'TRILHA':`RES ${s.res??''}`,cost?`${cost} PD`:''].filter(Boolean).join(' • '))}</small>${passive?'<em>Passivo</em>':poor?'<em>PD insuficiente</em>':sel?'<em>✓ Selecionada · escolha o inimigo</em>':''}</button>`;}).join('')||'<small>Nenhuma habilidade adquirida.</small>';
  return `<section class="tt-persistent-quick tt-master-selected ${canUse?'is-turn':'standby'}"><div class="tt-turn-head"><div><span class="section-eyebrow">AÇÕES DO PERSONAGEM</span><h3>${esc(player.name||'Personagem')}</h3></div><span>${!state().battle?'Consulta fora de combate':canUse?'Turno atual · pode agir':'Consulta · não é o turno'}</span></div><div class="quick-action-columns"><div><h4>⚔ Ataques</h4>${attackCards}</div><div><h4>✨ Habilidades</h4>${skillCards}</div></div></section>`;
}

function masterEnemyQuickActions(enemy,turnOnly=false){
  if(!enemy)return '';
  const attacks=Array.isArray(enemy.attacks)?enemy.attacks:[],abilities=Array.isArray(enemy.abilities)?enemy.abilities:[],a=actor(),canUse=!!state().battle&&a?.type==='enemy'&&String(a.id)===String(enemy.id);
  const btn=(x,i,k)=>{const key=`enemy:${enemy.id}:${k}:${i}`,sel=pendingAction?.selectionKey===key,info=window.EDFCombatRules?.actionInfo?.(x)||{label:'Ação Padrão'};return `<button class="combat-action-card${sel?' is-selected':''}" aria-pressed="${sel}" data-click-call="tabletopChooseEnemyAction('${attr(enemy.id)}','${k}',${i})"><strong>${k==='attack'?'⚔':'✦'} ${esc(x.name||x.nome||'Ação')}</strong><small>${esc([info.label,x.test||x.teste||x.attack||x.ataque,x.damage||x.dano,x.effect||x.efeito].filter(Boolean).join(' • '))}</small>${sel?'<em>✓ Selecionada · escolha o player</em>':''}</button>`;};
  return `<section class="tt-persistent-quick tt-master-selected ${canUse?'is-turn':'standby'}"><div class="tt-turn-head"><div><span class="section-eyebrow">${turnOnly?'TURNO DO INIMIGO':'AÇÕES DO INIMIGO'}</span><h3>${esc(enemy.name)}</h3></div><span>${canUse?'Turno atual · pode agir':'Consulta · não é o turno'}</span></div><div class="quick-action-columns"><div><h4>Ataques</h4>${attacks.map((x,i)=>btn(x,i,'attack')).join('')||'<small>Nenhum ataque.</small>'}</div><div><h4>Habilidades</h4>${abilities.map((x,i)=>btn(x,i,'ability')).join('')||'<small>Nenhuma habilidade.</small>'}</div></div></section>`;
}

function masterSelectedQuickActions(){
  if(currentRole!=='admin')return '';
  const e=selected();if(!e)return '';
  if(e.entity_type==='player')return masterPlayerQuickActions(playerById(String(e.source_id||e.owner_user_id)));
  if(e.entity_type==='enemy')return masterEnemyQuickActions(selectedBattleEnemy(e));
  return '';
}

function pendingPanel(){if(!pendingAction)return '';const target=pendingAction.actorType==='player'?'um inimigo':'um player';return `<section class="tt-target-pick is-active" role="status"><div><span class="section-eyebrow">AÇÃO SELECIONADA</span><strong>🎯 ${esc(pendingAction.name)}</strong></div><span><b>Agora toque em ${target} destacado no mapa.</b> Durante a seleção de alvo o token não pode ser movido, redimensionado ou removido por engano.</span><button data-click-call="tabletopCancelPendingAction()">Cancelar seleção</button></section>`;}
function persistentPlayerQuickActions(){if(currentRole==='admin')return '';const quick=window.CombatSurface?.renderQuickActions?.({attackHandler:'tabletopChoosePlayerAttack',skillHandler:'tabletopChoosePlayerSkill',selectedKey:pendingAction?.selectionKey})||'';if(!quick)return '';const active=!!state().battle,turn=myTurn();return `<section class="tt-persistent-quick ${turn?'is-turn':'standby'}"><div class="tt-turn-head"><div><span class="section-eyebrow">AÇÕES RÁPIDAS</span><h3>Seus ataques e habilidades</h3></div><span>${!active?'Disponíveis para consulta':turn?'Seu turno · escolha uma ação':'Aguardando seu turno'}</span></div>${quick}</section>`;}
function counterPanel(){
  if(!counterTargetId||currentRole==='admin')return '';
  const target=(state().enemies||[]).find(e=>String(e.id)===String(counterTargetId));
  const quick=window.CombatSurface?.renderQuickActions?.({attackHandler:'tabletopChooseCounterAttack',skillHandler:'tabletopChooseCounterSkill'})||'';
  return `<section class="tt-counter-panel"><div class="tt-turn-head"><div><span class="section-eyebrow">CONTRA-ATAQUE DISPONÍVEL</span><h3>Escolha como contra-atacar ${esc(target?.name||'o inimigo')}</h3></div><button data-click-call="tabletopSkipCounterAttack()">Pular</button></div><p><b>Regra da mesa:</b> depois da Esquiva bem-sucedida, o contra-ataque causa <b>metade do dano rolado</b>. Se usar uma habilidade, ela gasta o <b>mesmo PD do uso normal</b> (RES 1→1 PD, RES 2→2 PD, RES 3→3 PD, RES 4→4 PD).</p>${quick}</section>`;
}

function enemyCounterPanel(){
  if(currentRole!=='admin'||!enemyCounterActorId||!enemyCounterTargetId)return '';
  const enemy=enemyById(enemyCounterActorId),target=playerById(enemyCounterTargetId);if(!enemy)return '';
  const attacks=Array.isArray(enemy.attacks)?enemy.attacks:[],abilities=Array.isArray(enemy.abilities)?enemy.abilities:[];
  const button=(x,i,kind)=>`<button class="combat-action-card" data-click-call="tabletopChooseEnemyCounterAction('${attr(enemy.id)}','${kind}',${i})"><strong>${kind==='attack'?'⚔':'✦'} ${esc(x.name||x.nome||'Ação')}</strong><small>${esc([x.test||x.teste||x.attack||x.ataque,x.damage||x.dano,x.effect||x.efeito].filter(Boolean).join(' • '))}</small></button>`;
  return `<section class="tt-counter-panel"><div class="tt-turn-head"><div><span class="section-eyebrow">CONTRA-ATAQUE DO INIMIGO</span><h3>${esc(enemy.name)} pode contra-atacar ${esc(target?.name||'o jogador')}</h3></div><button data-click-call="tabletopSkipEnemyCounterAttack()">Pular</button></div><p>O contra-ataque usa a mesma janela persistida de Reação e causa metade do dano rolado.</p><div class="quick-action-columns"><div><h4>Ataques</h4>${attacks.map((x,i)=>button(x,i,'attack')).join('')||'<small>Nenhum ataque.</small>'}</div><div><h4>Habilidades</h4>${abilities.map((x,i)=>button(x,i,'ability')).join('')||'<small>Nenhuma habilidade.</small>'}</div></div></section>`;
}

function html(){
  sync();
  const req=reactionRequest(),outgoing=outgoingReactionRequest(),initiative=mobileInitiativePeek(),feedback=reactionFeedbackPanel();
  if(req)return `${initiative}${reactionPanel(req)}${currentRole==='admin'?'':persistentPlayerQuickActions()}`;
  if(currentRole!=='admin'&&outgoing)return `${initiative}${feedback}${reactionWaitingPanel(outgoing)}`;
  if(currentRole!=='admin')return `${initiative}${feedback}${counterPanel()}${persistentPlayerQuickActions()}${pendingAction?pendingPanel():''}`;
  const enemyCounter=enemyCounterPanel();
  if(enemyCounter)return `${initiative}${feedback}${enemyCounter}`;
  const selectedQuick=masterSelectedQuickActions();
  if(selectedQuick)return `${initiative}${selectedQuick}${pendingAction?pendingPanel():''}`;
  if(!state().battle)return '';
  return `${initiative}${chooseActionPanel()}${pendingAction?pendingPanel():''}`;
}

function refreshTargetMode(){const active=!!pendingAction,page=document.querySelector('.tabletop-page');page?.classList.toggle('is-picking-target',active);document.querySelectorAll('[data-tabletop-token-id]').forEach(el=>{const e=TabletopStore.state.entities.find(x=>String(x.id)===String(el.dataset.tabletopTokenId));const valid=!!(active&&targetValidity(e).valid);el.classList.toggle('valid-action-target',valid);el.classList.toggle('invalid-action-target',active&&!valid);});}
function refresh(){const host=document.querySelector('[data-tabletop-combat-dock]');if(host)host.innerHTML=html();const side=document.querySelector('[data-tabletop-inspector]');if(side&&state().battle)side.innerHTML=initiativeSidebar();refreshTargetMode();ensureReactionPopout(reactionRequest());window.lucide?.createIcons?.();}
async function refreshCombat(){const overlay=await TabletopPersistence.combatOverlay();TabletopStore.setCombat(overlay);sync();TabletopRenderer?.patchFromState?.();}
function targetValidity(e){
  if(!pendingAction||!state().battle||!e)return{valid:false,reason:'Nenhuma ação aguardando alvo.'};
  if(!participant(e))return{valid:false,reason:'Esse token não participa do combate atual.'};
  if(pendingAction.actorType==='player'){
    if(e.entity_type!=='enemy')return{valid:false,reason:'Este ataque precisa de um inimigo como alvo.'};
    if(!e.battle_entity_id)return{valid:false,reason:'Esse inimigo ainda não está vinculado ao combate.'};
    return{valid:true,targetType:'enemy',targetId:String(e.battle_entity_id)};
  }
  if(pendingAction.actorType==='enemy'){
    if(e.entity_type!=='player')return{valid:false,reason:'A ação do inimigo precisa de um player como alvo.'};
    const id=String(e.source_id||e.owner_user_id||'');
    if(!id)return{valid:false,reason:'Esse token de player não possui personagem vinculado.'};
    return{valid:true,targetType:'player',targetId:id};
  }
  return{valid:false,reason:'Tipo de ação sem alvo configurado.'};
}
function tryTargetEntity(e){
  sync();if(!pendingAction||!state().battle)return false;
  const check=targetValidity(e);
  if(!check.valid){
    const panel=document.querySelector('.tt-target-pick');
    if(panel){panel.classList.remove('invalid-flash');void panel.offsetWidth;panel.classList.add('invalid-flash');const span=panel.querySelector('span:not(.section-eyebrow)');if(span)span.innerHTML=`<b>Alvo inválido.</b> ${esc(check.reason)}`;}
    return true;
  }
  const a=pendingAction;pendingAction=null;
  window.CombatSurface?.setTarget?.(check.targetType,check.targetId);
  openManualCombatAction({...a,targetType:check.targetType,targetId:check.targetId});
  refresh();
  return true;
}
function mapTarget(e){
  sync();if(!e)return;
  if(pendingAction&&state().battle){tryTargetEntity(e);return;}
  if(e.entity_type==='player')window.CombatSurface?.setTarget?.('player',String(e.source_id||e.owner_user_id));
  else if(e.entity_type==='enemy'&&e.battle_entity_id)window.CombatSurface?.setTarget?.('enemy',String(e.battle_entity_id));
}

window.TabletopCombatDock=Object.freeze({html,refresh,syncGlobals:sync,mapTarget,tryTargetEntity,isTargeting:()=>!!pendingAction,refreshCombat,initiativeSidebar});

window.tabletopOpenBattleSetup=()=>{if(currentRole!=='admin')return;const candidates=TabletopStore.state.entities.filter(e=>['player','enemy','npc'].includes(e.entity_type));document.getElementById('tt-battle-setup')?.remove();document.body.insertAdjacentHTML('beforeend',`<div id="tt-battle-setup" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('tt-battle-setup').remove()"></button><form class="picker-panel tt-battle-setup" data-submit-call="tabletopConfirmBattleSetup(event)"><div class="picker-head"><div><span class="section-eyebrow">NOVA BATALHA</span><h3>Quem participa?</h3><small>Selecione somente quem realmente entra no combate e registre a iniciativa rolada fisicamente.</small></div><button type="button" data-click-call="document.getElementById('tt-battle-setup').remove()">✕</button></div><label>Nome da batalha<input name="battle_name" value="Batalha"></label><div class="tt-participant-list">${candidates.map(e=>`<label class="tt-participant"><input type="checkbox" name="participant" value="${attr(e.id)}" ${e.entity_type==='player'||e.entity_type==='enemy'?'checked':''}><span>${e.entity_type==='player'?'👤':e.entity_type==='enemy'?'👹':'🗣️'}</span><div><b>${esc(e.label)}</b><small>${e.entity_type==='player'?'Player':e.entity_type==='enemy'?'Inimigo':'NPC'}</small></div><input class="tt-init-input" type="number" name="initiative_${attr(e.id)}" value="0" aria-label="Iniciativa de ${attr(e.label)}"></label>`).join('')||'<p>Nenhum Player, NPC ou Inimigo está na Mesa.</p>'}</div><button class="primary-action" type="submit">⚔ Iniciar combate</button></form></div>`);};
window.tabletopConfirmBattleSetup=async ev=>{ev.preventDefault();const form=ev.currentTarget,fd=new FormData(form),ids=new Set(fd.getAll('participant').map(String)),entities=TabletopStore.state.entities.filter(e=>ids.has(String(e.id)));if(!entities.length)return alert('Selecione pelo menos um participante.');const participants=entities.map(e=>({entity_id:e.id,type:e.entity_type,label:e.label,initiative:Number(fd.get(`initiative_${e.id}`))||0}));const btn=form.querySelector('[type=submit]');btn.disabled=true;btn.textContent='Iniciando…';try{await TabletopPersistence.createBattleFromScene(String(fd.get('battle_name')||'Batalha'),participants);document.getElementById('tt-battle-setup')?.remove();announce();await refreshCombat();}catch(err){btn.disabled=false;btn.textContent='⚔ Iniciar combate';alert(err.message);}};
window.tabletopStartCombat=window.tabletopOpenBattleSetup;

window.tabletopChoosePlayerAttack=index=>{sync();if(!state().battle)return alert('Ações rápidas ficam disponíveis para consulta. Inicie um combate para usar uma ação.');if(!myTurn())return alert('Aguarde seu turno.');const me=playerById(currentUser.id),a=me?.attacks?.[index];if(!a)return;const use=actionCheck('player',String(currentUser.id),'standard');if(!use.ok)return alert(use.reason);pendingAction={actorType:'player',actorId:String(currentUser.id),actorName:me?.name||'Personagem',name:a.nome||a.name||'Ataque',actionKind:'attack',testFormula:a.teste||a.test||'',damageFormula:a.dano||a.damage||'',resource:'none',cost:0,actionSlot:'standard',actionLabel:'Ação Padrão',resonance:{required:false},effects:[],isArea:false,selectionKey:`attack:${index}`};refresh();};
window.tabletopChoosePlayerSkill=(element,name)=>{sync();if(!state().battle)return alert('Ações rápidas ficam disponíveis para consulta. Inicie um combate para usar uma ação.');if(!myTurn())return alert('Aguarde seu turno.');const me=playerById(currentUser.id),skill=skillByName(element,name,me);if(!skill)return;const info=window.EDFCombatRules?.actionInfo?.(skill)||{slot:'standard'};if(info.slot==='passive')return alert('Esta é uma habilidade Passiva. Ela não é ativada como ação; o sistema aplica os bônus objetivos automaticamente.');const use=actionCheck('player',String(currentUser.id),info.slot);if(!use.ok)return alert(use.reason);const cost=skillPdCost(skill);if(Number(me?.energy_current||0)<cost)return alert(`PD insuficiente. ${skill.name} custa ${cost} PD e você possui ${Number(me?.energy_current||0)}.`);pendingAction={...skillPendingPayload(me||{user_id:currentUser.id,name:'Personagem'},skill),selectionKey:`skill:${element}:${name}`};refresh();};
window.tabletopChooseMasterPlayerAttack=(userId,index)=>{sync();if(currentRole!=='admin')return;const a=actor();if(!state().battle)return alert('As ações estão visíveis para consulta. Inicie um combate para executá-las.');if(!a||a.type!=='player'||String(a.id)!==String(userId))return alert('Este personagem não está no turno atual. As ações continuam disponíveis para consulta.');const p=playerById(userId),x=p?.attacks?.[index];if(!x)return;const use=actionCheck('player',String(userId),'standard');if(!use.ok)return alert(use.reason);pendingAction={actorType:'player',actorId:String(userId),actorName:p.name||'Personagem',name:x.nome||x.name||'Ataque',actionKind:'attack',testFormula:x.teste||x.test||'',damageFormula:x.dano||x.damage||'',resource:'none',cost:0,actionSlot:'standard',actionLabel:'Ação Padrão',resonance:{required:false},effects:[],isArea:false,selectionKey:`mattack:${userId}:${index}`};refresh();};
window.tabletopChooseMasterPlayerSkill=(userId,element,name)=>{sync();if(currentRole!=='admin')return;const a=actor();if(!state().battle)return alert('As ações estão visíveis para consulta. Inicie um combate para executá-las.');if(!a||a.type!=='player'||String(a.id)!==String(userId))return alert('Este personagem não está no turno atual. As ações continuam disponíveis para consulta.');const p=playerById(userId),skill=skillByName(element,name,p);if(!p||!skill)return;const info=window.EDFCombatRules?.actionInfo?.(skill)||{slot:'standard'};if(info.slot==='passive')return alert('Esta habilidade é Passiva e não consome ação.');const use=actionCheck('player',String(userId),info.slot);if(!use.ok)return alert(use.reason);const cost=skillPdCost(skill);if(Number(p.energy_current||0)<cost)return alert(`PD insuficiente. ${skill.name} custa ${cost} PD e ${p.name||'o personagem'} possui ${Number(p.energy_current||0)}.`);pendingAction={...skillPendingPayload(p,skill),selectionKey:`mskill:${userId}:${element}:${name}`};refresh();};
window.tabletopChooseEnemyAction=(id,kind,index)=>{sync();if(currentRole!=='admin')return;if(!state().battle)return alert('Ações do inimigo disponíveis para consulta. Inicie um combate para usar.');const a=actor();if(!a||a.type!=='enemy'||String(a.id)!==String(id))return alert('Este inimigo não está no turno atual. As ações continuam disponíveis para consulta.');const e=(state().enemies||[]).find(x=>String(x.id)===String(id)),list=kind==='ability'?(e?.abilities||[]):(e?.attacks||[]),x=list[index];if(!x)return;const info=window.EDFCombatRules?.actionInfo?.(x)||{slot:'standard',label:'Ação Padrão'};if(info.slot==='passive')return alert('Esta habilidade do inimigo é Passiva.');const use=actionCheck('enemy',String(id),info.slot);if(!use.ok)return alert(use.reason);pendingAction={actorType:'enemy',actorId:String(id),actorName:e.name,name:x.name||x.nome||'Ação',actionKind:kind,skill:x,testFormula:x.test||x.teste||x.attack||x.ataque||'',damageFormula:x.damage||x.dano||'',effect:x.effect||x.efeito||'',element:x.element||x.elemento||'',grade:Number(x.res??x.grade??0)||0,resource:'none',cost:0,actionSlot:info.slot,actionLabel:info.label,resonance:window.EDFCombatRules?.resonanceInfo?.(x,e)||{required:false},resolution:window.EDFCombatRules?.resolutionInfo?.(x),effects:window.EDFCombatRules?.effectsForSkill?.(x)||[],isArea:!!window.EDFCombatRules?.isAreaSkill?.(x),selectionKey:`enemy:${id}:${kind}:${index}`};refresh();};
window.tabletopCancelPendingAction=()=>{pendingAction=null;refresh();};

window.tabletopChooseCounterAttack=index=>{sync();if(!counterTargetId)return;const me=playerById(currentUser.id),a=me?.attacks?.[index];if(!a)return;const target=counterTargetId;counterTargetId=null;openManualCombatAction({actorType:'player',actorId:currentUser.id,actorName:me?.name||'Personagem',name:a.nome||a.name||'Contra-Ataque',actionKind:'counter',testFormula:a.teste||a.test||'',damageFormula:a.dano||a.damage||'',resource:'none',cost:0,damageMultiplier:.5,targetType:'enemy',targetId:target});refresh();};
window.tabletopChooseCounterSkill=(element,name)=>{sync();if(!counterTargetId)return;const me=playerById(currentUser.id),skill=skillByName(element,name,me);if(!skill||!me)return;const cost=skillPdCost(skill);if(Number(me.energy_current||0)<cost)return alert(`PD insuficiente para contra-atacar com ${skill.name}. Custo: ${cost} PD; disponível: ${Number(me.energy_current||0)}.`);const target=counterTargetId;counterTargetId=null;openManualCombatAction({...skillPendingPayload(me,skill),actionKind:'counter',damageMultiplier:.5,targetType:'enemy',targetId:target});refresh();};
window.tabletopSkipCounterAttack=async()=>{const id=counterTargetId;counterTargetId=null;try{if(id&&state().battle?.id)await supabaseClient.rpc('clear_counter_window_v1540',{p_battle_id:state().battle.id,p_actor_type:'player',p_actor_id:currentUser.id});}catch(err){console.warn('Falha ao encerrar janela de contra-ataque',err);}announce();refresh();};
window.tabletopChooseEnemyCounterAction=(enemyId,kind,index)=>{sync();if(currentRole!=='admin'||String(enemyCounterActorId)!==String(enemyId)||!enemyCounterTargetId)return;const enemy=enemyById(enemyId),list=kind==='ability'?(enemy?.abilities||[]):(enemy?.attacks||[]),x=list[index];if(!x)return;const info=window.EDFCombatRules?.actionInfo?.(x)||{slot:'standard',label:'Ação Padrão'};const target=enemyCounterTargetId;enemyCounterActorId=null;enemyCounterTargetId=null;openManualCombatAction({actorType:'enemy',actorId:String(enemyId),actorName:enemy?.name||'Inimigo',name:x.name||x.nome||'Contra-Ataque',actionKind:'counter',skill:x,testFormula:x.test||x.teste||x.attack||x.ataque||'',damageFormula:x.damage||x.dano||'',effect:x.effect||x.efeito||'',element:x.element||x.elemento||'',grade:Number(x.res??x.grade??0)||0,resource:'none',cost:0,actionSlot:info.slot,actionLabel:info.label,resonance:window.EDFCombatRules?.resonanceInfo?.(x,enemy)||{required:false},resolution:window.EDFCombatRules?.resolutionInfo?.(x),effects:window.EDFCombatRules?.effectsForSkill?.(x)||[],isArea:!!window.EDFCombatRules?.isAreaSkill?.(x),targetType:'player',targetId:String(target)});refresh();};
window.tabletopSkipEnemyCounterAttack=async()=>{const actorId=enemyCounterActorId;enemyCounterActorId=null;enemyCounterTargetId=null;try{if(actorId&&state().battle?.id)await supabaseClient.rpc('clear_counter_window_v1540',{p_battle_id:state().battle.id,p_actor_type:'enemy',p_actor_id:String(actorId)});}catch(err){console.warn('Falha ao encerrar contra-ataque do inimigo',err);}announce();refresh();};
window.tabletopDismissReactionFeedback=()=>{reactionFeedback=null;refresh();};

window.tabletopFinishTurn=async()=>{sync();const a=actor();if(!a)return;if(reactionRequest()||outgoingReactionRequest())return alert('Existe uma reação pendente. Resolva a reação antes de encerrar o turno.');if(a.type==='player'&&String(a.id)!==String(currentUser?.id)&&currentRole!=='admin')return alert('Não é seu turno.');if(a.type==='enemy'&&currentRole!=='admin')return;pendingAction=null;await tabletopNextTurn();};
window.tabletopNextTurn=async()=>{sync();const b=state().battle,o=order();if(!b||!o.length)return;const a=actor();if(currentRole!=='admin'&&!(a?.type==='player'&&String(a.id)===String(currentUser?.id)))return;const {data,error}=await supabaseClient.rpc('finish_turn_v1542',{p_battle_id:b.id});if(error)return alert(error.message);const label=data?.turn_label||'Turno';if(typeof logBattle==='function')await logBattle(`Turno: ${label}${data?.wrapped?` · Rodada ${data.round}`:''}`,'turn');announce();await refreshCombat();};
window.tabletopEndCombat=async()=>{const b=state().battle;if(currentRole!=='admin'||!b||!confirm('Encerrar o combate e voltar à exploração?'))return;await supabaseClient.from('battles').update({active:false,reaction_state:{}}).eq('id',b.id);pendingAction=null;counterTargetId=null;enemyCounterActorId=null;enemyCounterTargetId=null;reactionFeedback=null;announce();await refreshCombat();};

function openReactionModal(id,kind){
  const req=(state().requests||[]).find(r=>String(r.id)===String(id));if(!req)return;
  const c=reactionContext(req),p=req.payload||{},attack=c.attack,damage=c.damage;
  document.getElementById('tt-reaction-modal')?.remove();
  let body='';
  if(kind==='dodge'){
    const guide=c.targetType==='player'?playerDodgeDiceText(c.target):`Esquiva cadastrada do inimigo: ${c.dodge}.`;
    body=`<div class="tt-reaction-modal-rule"><b>${esc(guide)}</b><small>Reflexos (AGI) contra ${attack}. Aplique bônus e penalidades da ficha/mesa antes de informar o total.</small></div><label class="damage-input-big">Total final da Esquiva<input name="roll" type="number" inputmode="numeric" value="0" required autofocus></label><label>D20 natural usado no resultado<input name="natural_roll" type="number" min="1" max="20" inputmode="numeric" placeholder="Ex.: 17"><small>Informe 20 ou 1 para aplicar os efeitos críticos do livro.</small></label><label>Dano extra do 1 natural (1d6)<input name="extra_damage" type="number" min="0" inputmode="numeric" value="0"><small>Preencha somente se o d20 natural usado foi 1; role o 1d6 fisicamente.</small></label>`;
  }else if(kind==='mitigate'){
    const guide=c.targetType==='player'?fortitudeGuide(c.target):{text:`Use o teste de Fortitude do inimigo + Armadura ${c.armor||0}.`,armor:c.armor||0,bonus:c.fortitude||0};
    body=`<div class="tt-reaction-modal-rule"><b>Ataque ${attack} · Dano ${damage}</b><small>${esc(guide.text)} O resultado precisa superar ${attack}; empate favorece o atacante. Em sucesso, o dano é reduzido à metade.</small></div><div class="resonance-rule-grid"><span>Armadura <b>${c.armor||0}</b></span><span>RD fixa <b>${c.rd}</b></span><span>Fortitude <b>${c.fortitude||0}</b></span><span>Meta <b>&gt; ${attack}</b></span></div><label class="damage-input-big">Total final do Bloqueio<input name="block_roll" type="number" inputmode="numeric" value="0" required autofocus></label><label class="check-row"><input name="apply_rd_after_block" type="checkbox" checked> Aplicar RD fixa (${c.rd}) depois do Bloqueio</label><label>Dano final manual (opcional)<input name="remaining_damage_override" type="number" min="0" inputmode="numeric" placeholder="Use se outra habilidade reduziu dano"><small>Se vazio, o sistema calcula Bloqueio + RD automaticamente.</small></label>`;
  }else{
    body=`<div class="tt-reaction-modal-rule"><b>Confirmar ${damage} de dano anunciado?</b><small>O sistema aplica a configuração do ataque e a RD automática somente se ela foi marcada na ação original.</small></div><input type="hidden" name="remaining_damage" value="${damage}">`;
  }
  const title=kind==='dodge'?'Esquivar':kind==='mitigate'?'Bloquear / reduzir':'Receber ataque';
  const owner=c.controller==='master'?'REAÇÃO DO MESTRE':'REAÇÃO DO PLAYER';
  document.body.insertAdjacentHTML('beforeend',`<div id="tt-reaction-modal" class="picker-modal tt-reaction-attention" data-request-id="${attr(id)}"><div class="picker-backdrop" aria-hidden="true"></div><form class="picker-panel tt-reaction-modal-panel" data-submit-call="tabletopConfirmReaction(event,'${attr(id)}','${kind}')"><div class="picker-head"><div><span class="section-eyebrow">${owner} · ${esc(c.targetName)}</span><h3>${title}</h3><small>${esc(c.attackerName)} → ${esc(p.action||'Ataque')} · Ataque ${attack}</small></div></div>${body}<div class="manual-action-buttons manual-action-sticky"><button type="button" data-click-call="tabletopBackToReactionChoice('${attr(id)}')">Voltar às opções</button><button class="primary-action" type="submit">Confirmar reação</button></div></form></div>`);
}

async function resolveReaction(id,kind,fields={}){
  const args={p_request_id:id,p_reaction:kind,p_roll:fields.roll??null,p_natural_roll:fields.naturalRoll??null,p_remaining_damage:fields.remainingDamage??null,p_extra_damage:fields.extraDamage??0};
  const {data,error}=await supabaseClient.rpc('resolve_battle_reaction',args);
  if(error)throw error;
  if(data?.already_resolved){reactionFeedback={title:'Esta reação já havia sido resolvida.',detail:'O estado foi atualizado sem aplicar dano novamente.',damage:0};return data;}
  window.applyManualCombatResultToTabletop?.(data,{p_target_type:data?.target_type||'player',p_target_id:data?.target_id||currentUser?.id});
  const who=data?.target_name||reactionContext((state().requests||[]).find(r=>String(r.id)===String(id))||{}).targetName||'Alvo';
  if(kind==='dodge'&&data?.dodge_success){
    counterTargetId=data?.target_type==='player'&&data?.actor_id?String(data.actor_id):null;
    if(counterTargetId&&state().battle?.id&&data?.target_type==='player'){
      try{await supabaseClient.rpc('set_counter_window_v1540',{p_battle_id:state().battle.id,p_actor_type:'player',p_actor_id:String(data.target_id||currentUser.id),p_target_id:String(data.actor_id)});}catch(err){console.warn('Falha ao persistir janela de contra-ataque',err);}
    }
    reactionFeedback={kind:'dodge-success',title:`${who} esquivou`,detail:data?.target_type==='enemy'?'0 dano. O Mestre pode resolver um Contra-Ataque se a ficha/regra permitir.':'0 dano. Contra-Ataque disponível.',damage:0};
  }
  else if(kind==='dodge')reactionFeedback={title:`Esquiva de ${who} falhou`,detail:`${Number(data?.damage_applied)||0} de dano aplicado.`,damage:Number(data?.damage_applied)||0};
  else if(kind==='mitigate')reactionFeedback={title:`Defesa de ${who} resolvida`,detail:`${Number(data?.damage_applied)||0} de dano restante aplicado.`,damage:Number(data?.damage_applied)||0};
  else reactionFeedback={title:`${who} recebeu o ataque`,detail:`${Number(data?.damage_applied)||0} de dano aplicado.`,damage:Number(data?.damage_applied)||0};
  return data;
}

window.tabletopResolveDodge=id=>openReactionModal(id,'dodge');
window.tabletopResolveBlock=id=>openReactionModal(id,'mitigate');
window.tabletopAcceptEnemyHit=id=>openReactionModal(id,'take');
window.tabletopBackToReactionChoice=id=>{document.getElementById('tt-reaction-modal')?.remove();const req=(state().requests||[]).find(r=>String(r.id)===String(id));if(req)ensureReactionPopout(req);};
window.tabletopConfirmReaction=async(ev,id,kind)=>{
  ev.preventDefault();const form=ev.currentTarget,fd=new FormData(form),submit=form.querySelector('[type=submit]');
  if(submit){submit.disabled=true;submit.textContent='Resolvendo…';}
  try{
    let remainingDamage=fd.has('remaining_damage')?Math.max(0,Number(fd.get('remaining_damage'))||0):null;
    if(kind==='mitigate'){
      const req=(state().requests||[]).find(r=>String(r.id)===String(id)),ctx=reactionContext(req||{}),blockRoll=Number(fd.get('block_roll'))||0,blockSuccess=blockRoll>Number(ctx.attack||0);
      let computed=blockSuccess?Math.floor(Number(ctx.damage||0)/2):Number(ctx.damage||0);
      if(fd.get('apply_rd_after_block')==='on')computed=Math.max(0,computed-Number(ctx.rd||0));
      const override=String(fd.get('remaining_damage_override')||'').trim();remainingDamage=override===''?computed:Math.max(0,Number(override)||0);
    }
    await resolveReaction(id,kind,{roll:fd.has('roll')?Number(fd.get('roll')):null,naturalRoll:fd.has('natural_roll')&&fd.get('natural_roll')!==''?Number(fd.get('natural_roll')):null,remainingDamage,extraDamage:Math.max(0,Number(fd.get('extra_damage'))||0)});
    document.getElementById('tt-reaction-modal')?.remove();announce();await refreshCombat();
  }catch(error){if(submit){submit.disabled=false;submit.textContent='Confirmar reação';}alert('Não foi possível resolver a reação. Aplique somente a migration V15.42 desta versão no Supabase.\n'+error.message);}
};
// Alias mantido para compatibilidade com telas/cache anteriores.
window.tabletopConfirmBlock=window.tabletopConfirmReaction;

})();

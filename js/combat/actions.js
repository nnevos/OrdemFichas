// =========================================================
// FLUXO DE COMBATE MANUAL + VISAO AGREGADA DO MESTRE
// =========================================================

function manualActionTargets(actorType) {
  if (actorType === 'enemy') {
    const ids=new Set((activeBattle?.turn_order||[]).filter(x=>x.type==='player').map(x=>String(x.id))); return combatPlayersCache.filter(p=>ids.has(String(p.user_id))).map(p => ({ type:'player', id:String(p.user_id), label:p.name || 'Personagem' }));
  }
  const ids=new Set((activeBattle?.turn_order||[]).filter(x=>x.type==='enemy').map(x=>String(x.id))); return battleEnemies.filter(e=>ids.has(String(e.id))).map(e => ({ type:'enemy', id:String(e.id), label:e.name || 'Inimigo' }));
}

function findManualTargetDefault(actorType) {
  const allowed = manualActionTargets(actorType);
  if (selectedCombatTarget && allowed.some(x => x.type===selectedCombatTarget.type && x.id===String(selectedCombatTarget.id))) {
    return `${selectedCombatTarget.type}:${selectedCombatTarget.id}`;
  }
  return allowed[0] ? `${allowed[0].type}:${allowed[0].id}` : '';
}
window.applyManualCombatResultToTabletop = function(result,payload){
  if(!result||!payload||!window.TabletopStore)return;
  const combat=TabletopStore.state.combat||{};
  const hp=Number(result.hp_after);
  if(!Number.isFinite(hp))return;
  if(payload.p_target_type==='enemy'){
    const enemies=(combat.enemies||[]).map(e=>String(e.id)===String(payload.p_target_id)?{...e,hp_current:hp}:e);
    TabletopStore.setCombat({...combat,enemies});
    const entity=TabletopStore.state.entities.find(e=>String(e.battle_entity_id)===String(payload.p_target_id));
    if(entity)TabletopStore.upsertEntity({...entity,hp_current:hp});
  }else if(payload.p_target_type==='player'){
    const players=(combat.players||[]).map(pl=>String(pl.user_id)===String(payload.p_target_id)?{...pl,hp_current:hp}:pl);
    TabletopStore.setCombat({...combat,players});
    const entity=TabletopStore.state.entities.find(e=>e.entity_type==='player'&&String(e.source_id||e.owner_user_id)===String(payload.p_target_id));
    if(entity)TabletopStore.upsertEntity({...entity,hp_current:hp});
  }
  window.TabletopRenderer?.patchFromState?.();
};

window.confirmManualCombatAction = async function(ev) {
  ev.preventDefault();
  const form=ev.currentTarget,f=new FormData(form),[targetType,targetId]=String(f.get('target')||'').split(':');
  const rawDamage=Math.max(0,Number(f.get('damage'))||0),actionKind=String(f.get('action_kind')||'action'),counter=actionKind==='counter',resolutionMode=String(f.get('resolution_mode')||'weapon');
  const rawAttackResult=Math.max(0,Number(f.get('attack_result'))||0),autoAttackBonus=Math.max(0,Number(f.get('auto_attack_bonus'))||0),actorType=String(f.get('actor_type')||''),actorId=String(f.get('actor_id')||''),actorName=String(f.get('actor_name')||'Atacante'),actionName=String(f.get('action_name')||'Ação');
  const actionSlot=String(f.get('action_slot')||'standard'),pdCost=actorType==='player'?Math.max(0,Number(f.get('resource_cost'))||0):0,isArea=String(f.get('is_area'))==='1';
  const resonanceRequired=String(f.get('resonance_required'))==='1',resDt=Math.max(0,Number(f.get('resonance_dt'))||0),resTotal=resonanceRequired?Number(f.get('resonance_total')):null,resNatural=resonanceRequired?Number(f.get('resonance_natural')):null;
  if(resonanceRequired&&(!Number.isFinite(resTotal)||!Number.isFinite(resNatural)||resNatural<1||resNatural>20))return alert('Informe o total final e o d20 natural do Teste de Ressonância.');
  let resonanceStatus='not_required';
  if(resonanceRequired){const ok=resNatural===20||resTotal>=resDt;resonanceStatus=ok?'success':resTotal<=resDt-5?'unstable':'failure';}
  const resonanceMultiplier=resonanceRequired&&resNatural===20?1.5:1;
  const resolvedDamage=Math.floor(rawDamage*resonanceMultiplier),damage=counter?Math.floor(resolvedDamage*0.5):resolvedDamage;
  const attackResult=resolutionMode==='resonance-hit'&&resonanceRequired?Math.max(0,Number(resTotal)||0):(resolutionMode==='precision'||resolutionMode==='weapon'?rawAttackResult+autoAttackBonus:0);
  const effects=[];const effectCount=Math.max(0,Number(f.get('effect_count'))||0);
  const targetEffectNames=(battleEffectsCache||[]).filter(e=>String(e.entity_type)===String(targetType)&&String(e.entity_id)===String(targetId)).map(e=>window.EDFCombatRules?.normalize?.(e.name)||String(e.name||'').toLowerCase());
  for(let i=0;i<effectCount;i++){
    if(f.get(`effect_apply_${i}`)!=='on')continue;
    const name=String(f.get(`effect_name_${i}`)||'').trim(),requires=String(f.get(`effect_requires_${i}`)||'').trim();
    if(requires){const reqKey=window.EDFCombatRules?.normalize?.(requires)||requires.toLowerCase();if(!targetEffectNames.includes(reqKey))continue;}
    if(name)effects.push({name,rounds:Math.max(0,Number(f.get(`effect_rounds_${i}`))||0)});
  }
  const targetRow=targetType==='enemy'?battleEnemies.find(e=>String(e.id)===String(targetId)):combatPlayersCache.find(p=>String(p.user_id)===String(targetId));
  const targetMods=targetType==='player'?(window.EDFCombatRules?.derivedModifiers?.(targetRow)||{}):{};
  const targetDefense=targetType==='enemy'?Math.max(0,Number(targetRow?.defense)||0):Math.max(0,5+(Number(targetRow?.constitution)||0)+(Number(targetRow?.block)||0)+(Number(targetMods.defense)||0));
  const applyPayload={
    p_battle_id:activeBattle.id,p_actor_type:actorType,p_actor_id:actorId,p_target_type:targetType,p_target_id:targetId,p_action_name:actionName,p_damage:damage,
    p_resource:'none',p_resource_cost:0,cost_paid:true,declared_pd_cost:pdCost,p_condition:String(f.get('condition')||'').trim()||null,p_condition_rounds:Math.max(0,Number(f.get('condition_rounds'))||0),p_apply_rd:f.get('apply_rd')==='on',p_effects:effects
  };
  const context={attack_critical:f.get('attack_critical')==='on',resolution_mode:resolutionMode,target_defense:targetDefense,resonance_damage_multiplier:resonanceMultiplier,resonance_required:resonanceRequired,resonance_status:resonanceStatus,resonance_total:resTotal,resonance_natural:resNatural,resonance_dt:resDt,resonance_attribute:String(f.get('resonance_attribute')||''),element:String(f.get('skill_element')||''),is_area:isArea};
  const requestPayload={attack_result:attackResult,damage,action:actionName,action_kind:actionKind,raw_damage:rawDamage,damage_multiplier:(counter?0.5:1)*resonanceMultiplier,actor_id:actorId,target_id:targetId,actor_name:actorName,apply_payload:applyPayload,p_effects:effects,is_area:isArea,allow_generic_dodge:!isArea,resonance:context};
  const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Confirmando...';}
  try{
    if((actorType==='player'&&targetType==='enemy')||(actorType==='enemy'&&targetType==='player')){
      const {data,error}=await supabaseClient.rpc('begin_combat_action_v1535',{
        p_battle_id:activeBattle.id,p_actor_type:actorType,p_actor_id:actorId,p_target_type:targetType,p_target_id:targetId,p_action_name:actionName,p_action_kind:actionKind,p_attack_result:attackResult,p_damage:damage,p_action_slot:actionSlot,p_pd_cost:pdCost,p_is_counter:counter,p_context:context,p_apply_payload:requestPayload
      });
      if(error)throw error;
      const pdAfter=Number(data?.pd_after??data?.action?.pd_after);
      if(actorType==='player'&&Number.isFinite(pdAfter)){
        combatPlayersCache=combatPlayersCache.map(pl=>String(pl.user_id)===actorId?{...pl,energy_current:pdAfter}:pl);
        if(window.TabletopStore){const combat=TabletopStore.state.combat||{};TabletopStore.setCombat({...combat,players:(combat.players||[]).map(pl=>String(pl.user_id)===actorId?{...pl,energy_current:pdAfter}:pl),battle:data?.action?.reaction_state?{...(combat.battle||{}),reaction_state:data.action.reaction_state}:combat.battle});}
      }
      if(resonanceRequired&&data?.executed===false){
        const text=resonanceStatus==='unstable'?`${actorName} falhou por 5+ na Ressonância. A ação e ${pdCost} PD foram gastos; aplique o efeito de Ressonância Instável indicado.`:`${actorName} falhou no Teste de Ressonância. A ação e ${pdCost} PD foram gastos; a habilidade não acontece.`;
        await logBattle(text,'resonance');
        document.getElementById('manual-action-modal')?.remove();window.TabletopRealtime?.announceCombatRefresh?.();if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);return;
      }
      const targetName=targetType==='enemy'?(manualActionTargets('player').find(x=>x.id===targetId)?.label||'inimigo'):(manualActionTargets('enemy').find(x=>x.id===targetId)?.label||'jogador');
      if(data?.missed===true||data?.hit_confirmed===false){
        await logBattle(`${actorName} usou ${actionName}${pdCost>0?` (-${pdCost} PD)`:''} em ${targetName}: ERROU (${attackResult} contra DEF ${Number(data?.target_defense??targetDefense)||0}). 0 dano e nenhum efeito de acerto aplicado.`,'attack');
        document.getElementById('manual-action-modal')?.remove();window.TabletopRealtime?.announceCombatRefresh?.();if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);return;
      }
      const resonanceText=resonanceRequired?` · Ressonância ${resTotal}/${resDt}${resNatural===20?' (20 natural · +50% efeitos)':''}`:'';
      const resolutionText=resolutionMode==='precision'?' · Pontaria '+attackResult:resolutionMode==='resonance-hit'?' · acerto pela Ressonância':'';
      await logBattle(`${actorName} usou ${actionName}${pdCost>0?` (-${pdCost} PD)`:''}${counter?' · Contra-Ataque 50% dano':''}${resonanceText}${resolutionText} em ${targetName}: aguardando reação`,'reaction');
      document.getElementById('manual-action-modal')?.remove();window.TabletopRealtime?.announceCombatRefresh?.();if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);return;
    }
    // Fallback para ações manuais sem janela de reação. A economia/PD ainda é consumida primeiro.
    const {data:spent,error:spendError}=await supabaseClient.rpc('consume_combat_action_v1535',{p_battle_id:activeBattle.id,p_actor_type:actorType,p_actor_id:actorId,p_action_slot:actionSlot,p_pd_cost:pdCost,p_is_counter:counter,p_context:context});
    if(spendError)throw spendError;
    if(resonanceRequired&&resonanceStatus!=='success'){
      document.getElementById('manual-action-modal')?.remove();window.TabletopRealtime?.announceCombatRefresh?.();return;
    }
    const {data,error}=await supabaseClient.rpc('apply_manual_combat_action',applyPayload);if(error)throw error;
    window.applyManualCombatResultToTabletop?.(data,applyPayload);
    document.getElementById('manual-action-modal')?.remove();window.TabletopRealtime?.announceCombatRefresh?.();if(currentTab==='mesa'&&window.TabletopCombatDock)await TabletopCombatDock.refreshCombat();else scheduleCombatSync(30);
  }catch(error){
    if(submit){submit.disabled=false;submit.textContent='Confirmar ação';}
    alert('Não foi possível confirmar a ação. Aplique somente a migration V15.42 desta versão no Supabase.\n'+error.message);
  }
};

// Ataques e habilidades do jogador: abre painel de rolagem física em vez de prompt/automação.
window.useQuickAttack = function(index) {
  const me=combatPlayersCache.find(p=>String(p.user_id)===String(currentUser?.id)),a=me?.attacks?.[index];if(!a)return;
  if(activeBattle&&window.EDFCombatRules){const use=EDFCombatRules.canUseAction(activeBattle,battleEffectsCache,'player',currentUser.id,'standard');if(!use.ok)return alert(use.reason);}
  openManualCombatAction({actorType:'player',actorId:currentUser.id,actorName:me.name,name:a.nome||a.name||'Ataque',actionKind:'attack',testFormula:a.teste||a.test||'',damageFormula:a.dano||a.damage||'',resource:'none',cost:0,actionSlot:'standard',actionLabel:'Ação Padrão',resonance:{required:false},effects:[],isArea:false});
};
window.useQuickSkill = function(element,name) {
  const me=combatPlayersCache.find(p=>String(p.user_id)===String(currentUser?.id));
  let skill=null;
  if(element==='__trail__')skill=(window.EDFCombatRules?.activeTrailAbilities?.(me)||[]).find(x=>x.name===name)||null;
  else for(const path of SKILLS[element]?.paths||[]){skill=path.skills.find(s=>s.name===name);if(skill){skill={...skill,element};break;}}
  if(!skill)return;
  const info=window.EDFCombatRules?.actionInfo?.(skill)||{slot:'standard',label:'Ação Padrão'};
  if(info.slot==='passive')return alert('Esta habilidade é Passiva. Os bônus objetivos são aplicados automaticamente; ela não é usada como ação.');
  if(activeBattle&&window.EDFCombatRules){const use=EDFCombatRules.canUseAction(activeBattle,battleEffectsCache,'player',currentUser.id,info.slot);if(!use.ok)return alert(use.reason);}
  const cost=window.EDFCombatRules?.pdCost?.(skill)??0;if(Number(me?.energy_current||0)<cost)return alert(`PD insuficiente. ${skill.name} custa ${cost} PD e você possui ${Number(me?.energy_current||0)}.`);
  openManualCombatAction({actorType:'player',actorId:currentUser.id,actorName:me?.name,name:skill.name,actionKind:'ability',testFormula:skill.test||skill.teste||'',damageFormula:skill.damage||skill.dano||'',effect:skill.effect||skill.description||'',resource:'pd',cost,element:skill.element||'',actionSlot:info.slot,actionLabel:info.label,resonance:window.EDFCombatRules?.resonanceInfo?.(skill,me)||{required:false},effects:window.EDFCombatRules?.effectsForSkill?.(skill)||[],isArea:!!window.EDFCombatRules?.isAreaSkill?.(skill),resolution:window.EDFCombatRules?.resolutionInfo?.(skill),skill});
};

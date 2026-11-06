(function(){
  'use strict';
  let channel=null,lastBroadcast=0,overlayTimer=null,lockTimer=null,combatPollTimer=null,pollBusy=false,lastCombatSignature='';

  function combatSignature(overlay={}){
    const b=overlay.battle||null;
    return JSON.stringify({
      battle:b?{id:b.id,active:b.active,round:b.round,turn_index:b.turn_index,turn_label:b.turn_label,turn_order:b.turn_order}:null,
      enemies:(overlay.enemies||[]).map(e=>[e.id,e.hp_current,e.hp_max,e.conditions,e.visibility]),
      players:(overlay.players||[]).map(p=>[p.user_id,p.hp_current,p.hp_max,p.energy_current,p.energy_max,p.resonance_points,p.conditions,p.updated_at]),
      effects:(overlay.effects||[]).map(x=>[x.id,x.remaining_rounds,x.name,x.target_type,x.target_id]),
      requests:(overlay.requests||[]).map(x=>[x.id,x.status,x.user_id,x.payload]),
      log:(overlay.logs||[]).slice(0,3).map(x=>[x.id,x.created_at,x.message])
    });
  }

  function applyOverlay(overlay){
    lastCombatSignature=combatSignature(overlay);
    TabletopStore.setCombat(overlay);
    window.TabletopRenderer?.patchFromState?.();
  }

  function stop(){
    if(channel){try{channel.untrack();}catch(_){ }supabaseClient.removeChannel(channel);channel=null;}
    clearTimeout(overlayTimer);clearInterval(lockTimer);clearInterval(combatPollTimer);
    overlayTimer=null;lockTimer=null;combatPollTimer=null;pollBusy=false;lastCombatSignature='';
    TabletopStore.setPresence([]);
  }

  function refreshOverlaySoon(delay=90){
    clearTimeout(overlayTimer);
    overlayTimer=setTimeout(async()=>{
      try{applyOverlay(await TabletopPersistence.combatOverlay());}
      catch(err){console.warn('Tabletop combat overlay',err);}
    },delay);
  }

  async function pollCombatOverlay(){
    if(pollBusy||currentTab!=='mesa'||!TabletopStore.state.board)return;
    pollBusy=true;
    try{
      const overlay=await TabletopPersistence.combatOverlay(),signature=combatSignature(overlay);
      if(signature!==lastCombatSignature)applyOverlay(overlay);
    }catch(err){console.warn('Tabletop combat fallback sync',err);}
    finally{pollBusy=false;}
  }

  function announceCombatRefresh(){
    refreshOverlaySoon(15);
    if(channel)channel.send({type:'broadcast',event:'combat_refresh',payload:{user_id:currentUser?.id,at:Date.now()}}).catch?.(()=>{});
  }

  function syncPresence(){if(!channel)return;const raw=channel.presenceState(),items=[];Object.values(raw||{}).flat().forEach(p=>items.push(p));TabletopStore.setPresence(items);window.TabletopRenderer?.patchPresence?.();}
  function pruneLocks(){const now=Date.now();let touched=false;for(const [id,lock] of Object.entries(TabletopStore.state.locks)){if(!lock?.expires_at||lock.expires_at<now){delete TabletopStore.state.locks[id];touched=true;}}if(touched)window.TabletopRenderer?.patchFromState();}

  function start(boardId){
    stop();if(!boardId)return;
    lastCombatSignature=combatSignature(TabletopStore.state.combat||{});
    channel=supabaseClient.channel(`tabletop:${boardId}`,{config:{presence:{key:String(currentUser?.id||Math.random())}}})
      .on('presence',{event:'sync'},syncPresence).on('presence',{event:'join'},syncPresence).on('presence',{event:'leave'},syncPresence)
      .on('broadcast',{event:'token_move'},({payload})=>{if(!payload?.id||String(payload.user_id)===String(currentUser?.id))return;const entity=TabletopStore.state.entities.find(x=>String(x.id)===String(payload.id));if(!entity)return;if(window.TabletopController?.remoteMove?.(payload.id,payload.x,payload.y)===false)return;})
      .on('broadcast',{event:'token_lock'},({payload})=>{if(!payload?.id||String(payload.user_id)===String(currentUser?.id))return;TabletopStore.setLock(payload.id,payload.locked?{user_id:payload.user_id,label:payload.label||'Outro jogador',expires_at:Date.now()+8000}:null);window.TabletopRenderer?.patchFromState();})
      .on('broadcast',{event:'combat_refresh'},()=>refreshOverlaySoon(20))
      .on('postgres_changes',{event:'*',schema:'public',table:'tabletop_entities',filter:`board_id=eq.${boardId}`},payload=>{if(payload.eventType==='DELETE'){TabletopStore.removeEntity(payload.old.id);window.TabletopRenderer?.patchFromState();return;}if(window.TabletopController?.isDragging?.(payload.new.id))return;TabletopStore.upsertEntity(payload.new);window.TabletopRenderer?.patchFromState();})
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'tabletop_boards',filter:`id=eq.${boardId}`},async payload=>{TabletopStore.setBoard(payload.new);try{TabletopStore.set({backgroundUrl:await TabletopPersistence.signedBackground(payload.new)});}catch(_){ }window.TabletopRenderer?.renderCurrent();})
      .on('postgres_changes',{event:'*',schema:'public',table:'battles'},()=>refreshOverlaySoon())
      .on('postgres_changes',{event:'*',schema:'public',table:'battle_enemies'},()=>refreshOverlaySoon())
      .on('postgres_changes',{event:'*',schema:'public',table:'battle_effects'},()=>refreshOverlaySoon())
      .on('postgres_changes',{event:'*',schema:'public',table:'battle_log'},()=>refreshOverlaySoon(40))
      .on('postgres_changes',{event:'*',schema:'public',table:'battle_action_requests'},()=>refreshOverlaySoon(40))
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'characters'},payload=>{const row=payload.new;if(!row?.user_id)return;let touched=false;TabletopStore.state.entities.filter(e=>e.entity_type==='player'&&String(e.source_id)===String(row.user_id)).forEach(e=>{TabletopStore.upsertEntity({...e,label:row.name||e.label,image_url:row.avatar_url||e.image_url,hp_current:row.hp_current,hp_max:row.hp_max});touched=true;});if(touched)window.TabletopRenderer?.patchFromState();refreshOverlaySoon(40);})
      .subscribe(async status=>{if(status==='SUBSCRIBED'){await channel.track({user_id:currentUser?.id,label:currentUser?.email?.split('@')[0]||'Jogador',role:currentRole,online_at:new Date().toISOString()});syncPresence();refreshOverlaySoon(20);}});
    lockTimer=setInterval(pruneLocks,2500);
    // Realtime continua sendo o caminho principal. Este polling leve é a rede de segurança
    // para sessões em que uma publicação do Supabase caiu ou algum evento foi perdido.
    combatPollTimer=setInterval(pollCombatOverlay,2200);
  }

  function move(id,x,y,force=false){if(!channel)return;const now=Date.now();if(!force&&now-lastBroadcast<45)return;lastBroadcast=now;channel.send({type:'broadcast',event:'token_move',payload:{id,x,y,user_id:currentUser?.id}});}
  function lock(id,label){if(!channel||!id)return;TabletopStore.setLock(id,{user_id:currentUser?.id,label:label||'Você',expires_at:Date.now()+8000});channel.send({type:'broadcast',event:'token_lock',payload:{id,locked:true,user_id:currentUser?.id,label:label||currentUser?.email?.split('@')[0]||'Jogador'}});}
  function unlock(id){if(!id)return;TabletopStore.setLock(id,null);if(channel)channel.send({type:'broadcast',event:'token_lock',payload:{id,locked:false,user_id:currentUser?.id}});}
  function isLockedByOther(id){const lock=TabletopStore.state.locks[String(id)];return !!(lock&&lock.expires_at>Date.now()&&String(lock.user_id)!==String(currentUser?.id));}

  window.TabletopRealtime=Object.freeze({start,stop,move,lock,unlock,isLockedByOther,refreshOverlaySoon,announceCombatRefresh});
})();

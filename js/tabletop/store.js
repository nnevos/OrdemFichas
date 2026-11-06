(function(){
  'use strict';
  const state={board:null,entities:[],selectedId:null,camera:{x:0,y:0,scale:1},backgroundUrl:'',loading:false,lastLoadedAt:0,presence:[],locks:{},combat:{battle:null,enemies:[],players:[],effects:[],logs:[],requests:[]}};
  const listeners=new Set();
  function emit(){listeners.forEach(fn=>{try{fn(state);}catch(err){console.warn('Tabletop store listener',err);}});}
  function set(patch){Object.assign(state,patch);emit();}
  function setBoard(board){state.board=board||null;if(!board){state.entities=[];state.selectedId=null;state.backgroundUrl='';state.presence=[];state.locks={};}emit();}
  function setEntities(items){state.entities=(items||[]).map(TabletopDomain.normalizeEntity);if(window.TabletopSelection)TabletopSelection.prune(state.entities.map(x=>x.id));if(state.selectedId&&!state.entities.some(x=>String(x.id)===String(state.selectedId)))state.selectedId=null;emit();}
  function upsertEntity(entity){const item=TabletopDomain.normalizeEntity(entity);const i=state.entities.findIndex(x=>String(x.id)===String(item.id));if(i>=0)state.entities[i]={...state.entities[i],...item};else state.entities.push(item);emit();return item;}
  function removeEntity(id){state.entities=state.entities.filter(x=>String(x.id)!==String(id));window.TabletopSelection?.remove?.(id);if(String(state.selectedId)===String(id))state.selectedId=null;delete state.locks[String(id)];emit();}
  function select(id){state.selectedId=id==null?null:String(id);if(window.TabletopSelection){if(id==null)TabletopSelection.clear();else if(TabletopSelection.primary()!==String(id)||TabletopSelection.size()!==1)TabletopSelection.set(id);}emit();}
  function selected(){const id=window.TabletopSelection?.primary?.()||state.selectedId;return state.entities.find(x=>String(x.id)===String(id))||null;}
  function camera(patch){state.camera={...state.camera,...patch};emit();}
  function setPresence(items){state.presence=Array.isArray(items)?items:[];emit();}
  function setLock(id,lock){if(!id)return;if(lock)state.locks[String(id)]=lock;else delete state.locks[String(id)];emit();}
  function setCombat(payload){state.combat={battle:payload?.battle||null,enemies:payload?.enemies||[],players:payload?.players||[],effects:payload?.effects||[],logs:payload?.logs||[],requests:payload?.requests||[]};emit();}
  function combatEntity(entity){
    if(!entity)return null;const c=state.combat,b=c.battle;if(!b)return null;
    if(entity.battle_entity_type==='enemy'&&entity.battle_entity_id){const row=c.enemies.find(x=>String(x.id)===String(entity.battle_entity_id));if(row)return {type:'enemy',row,battle:b,linked:String(entity.battle_id||'')===String(b.id)};}
    if(entity.entity_type==='player'){const row=c.players.find(x=>String(x.user_id)===String(entity.source_id||entity.owner_user_id));if(row)return {type:'player',row,battle:b,linked:Array.isArray(b.turn_order)&&b.turn_order.some(x=>x.type==='player'&&String(x.id)===String(row.user_id))};}
    return null;
  }
  function isCurrentTurn(entity){const snap=combatEntity(entity),b=state.combat.battle;if(!snap||!b)return false;const order=Array.isArray(b.turn_order)?b.turn_order:[],actor=order[Math.max(0,Math.min(order.length-1,Number(b.turn_index)||0))];if(!actor)return false;return actor.type===snap.type&&String(actor.id)===String(snap.type==='enemy'?snap.row.id:snap.row.user_id);}
  function effectsFor(entity){const snap=combatEntity(entity);if(!snap)return[];const id=snap.type==='enemy'?snap.row.id:snap.row.user_id;return (state.combat.effects||[]).filter(x=>x.entity_type===snap.type&&String(x.entity_id)===String(id));}
  function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
  window.TabletopStore=Object.freeze({state,set,setBoard,setEntities,upsertEntity,removeEntity,select,selected,camera,setPresence,setLock,setCombat,combatEntity,isCurrentTurn,effectsFor,subscribe});
})();

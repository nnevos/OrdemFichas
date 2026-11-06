(function(){
  'use strict';const BUCKET='tabletop-assets';
  async function activeBoard(){const {data,error}=await supabaseClient.from('tabletop_boards').select('*').eq('active',true).order('updated_at',{ascending:false}).limit(1);if(error)throw error;return data?.[0]||null;}
  async function entities(boardId){if(!boardId)return[];const {data,error}=await supabaseClient.from('tabletop_entities').select('*').eq('board_id',boardId).order('created_at');if(error)throw error;return data||[];}
  async function createBoard(name='Mesa principal'){const {data,error}=await supabaseClient.from('tabletop_boards').insert({name:name||'Mesa principal',created_by:currentUser.id,active:true,logical_width:7200,logical_height:4800,grid_enabled:false,grid_size:70,grid_snap:false}).select().single();if(error)throw error;return data;}
  async function updateBoard(id,patch){const {data,error}=await supabaseClient.from('tabletop_boards').update(patch).eq('id',id).select().single();if(error)throw error;return data;}
  async function signedBackground(board){if(!board?.background_path)return'';const {data,error}=await supabaseClient.storage.from(BUCKET).createSignedUrl(board.background_path,3600);if(error)throw error;return data?.signedUrl||'';}
  function imageSize(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{resolve({width:img.naturalWidth||1600,height:img.naturalHeight||900});URL.revokeObjectURL(url);};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Imagem inválida.'));};img.src=url;});}
  async function uploadBackground(board,file){if(!board?.id)throw new Error('Crie uma Mesa antes de enviar um mapa.');if(!file?.type?.startsWith('image/'))throw new Error('Selecione uma imagem PNG, JPG, WEBP ou GIF.');if(file.size>15*1024*1024)throw new Error('O mapa deve ter no máximo 15 MB.');const dim=await imageSize(file),safeExt=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg',path=`${board.id}/background.${safeExt}`;const upload=await supabaseClient.storage.from(BUCKET).upload(path,file,{upsert:true,contentType:file.type,cacheControl:'3600'});if(upload.error)throw upload.error;return updateBoard(board.id,{background_path:path,background_mime:file.type,logical_width:Math.max(7200,Number(board.logical_width)||0,Math.min(12000,dim.width)),logical_height:Math.max(4800,Number(board.logical_height)||0,Math.min(12000,dim.height))});}
  async function clearBackground(board){if(!board?.id)return board;if(board.background_path)await supabaseClient.storage.from(BUCKET).remove([board.background_path]).catch(()=>{});return updateBoard(board.id,{background_path:null,background_mime:null});}
  function prepareEntity(payload){const type=payload.entity_type||'marker';return{object_type:'token',layer_name:'tokens',disposition:type==='player'?'friendly':type==='enemy'?'hostile':'neutral',control_mode:type==='player'?'owner':'gm',visibility_mode:'visible',locked:false,...payload,created_by:currentUser.id};}
  async function addEntity(payload){const {data,error}=await supabaseClient.from('tabletop_entities').insert(prepareEntity(payload)).select().single();if(error)throw error;return data;}
  async function addEntities(payloads){if(!payloads?.length)return[];const {data,error}=await supabaseClient.from('tabletop_entities').insert(payloads.map(prepareEntity)).select();if(error)throw error;return data||[];}
  async function updateEntity(id,patch){const {data,error}=await supabaseClient.from('tabletop_entities').update(patch).eq('id',id).select().single();if(error)throw error;return data;}
  async function updateEntities(items){const out=[];for(const item of items||[])out.push(await updateEntity(item.id,item.patch));return out;}
  async function removeEntity(id){const {error}=await supabaseClient.from('tabletop_entities').delete().eq('id',id);if(error)throw error;}
  async function combatOverlay(){
    const {data:battles,error}=await supabaseClient.from('battles').select('*').eq('active',true).order('created_at',{ascending:false}).limit(1);if(error)throw error;
    const battle=battles?.[0]||null;let enemies=[],effects=[],logs=[],requests=[];
    if(battle){
      const [er,fx,lr,rq]=await Promise.all([
        supabaseClient.rpc('get_battle_enemies',{p_battle_id:battle.id}),
        supabaseClient.rpc('get_battle_effects_v1542',{p_battle_id:battle.id}),
        supabaseClient.rpc('get_battle_log_v1542',{p_battle_id:battle.id}),
        supabaseClient.from('battle_action_requests').select('*').eq('battle_id',battle.id).eq('status','pending').order('created_at',{ascending:false})
      ]);
      if(!er.error)enemies=er.data||[];if(!fx.error)effects=fx.data||[];if(!lr.error)logs=lr.data||[];if(!rq.error)requests=rq.data||[];
    }
    let players=[];const pr=await supabaseClient.rpc('get_master_shield_data');if(!pr.error)players=pr.data||[];
    // Mestre precisa das habilidades adquiridas para abrir Ações Rápidas ao selecionar
    // um Player na Mesa. Para o jogador, a RLS naturalmente limita a leitura à própria árvore.
    if(players.length){
      try{
        const ids=players.map(p=>p.user_id).filter(Boolean);
        const sr=await supabaseClient.from('skill_trees').select('user_id, unlocked_skills').in('user_id',ids);
        if(!sr.error&&Array.isArray(sr.data)){
          const byUser=new Map(sr.data.map(row=>[String(row.user_id),row.unlocked_skills||{}]));
          players=players.map(p=>({...p,unlocked_skills:byUser.get(String(p.user_id))||p.unlocked_skills||{}}));
        }
      }catch(err){console.warn('Tabletop skill overlay',err);}
    }
    return{battle,enemies,players,effects,logs,requests};
  }

  async function createBattleFromScene(name,participants){
    if(currentRole!=='admin')throw new Error('Apenas o Mestre inicia o combate.');
    await supabaseClient.from('battles').update({active:false}).eq('active',true);
    const setup={participants:(participants||[]).map(p=>({entity_id:p.entity_id,type:p.type,label:p.label,initiative:Number(p.initiative)||0}))};
    const {data:battle,error}=await supabaseClient.from('battles').insert({name:name||'Batalha',active:true,round:1,turn_index:0,tabletop_setup:setup,created_by:currentUser.id}).select().single();if(error)throw error;
    const entitiesById=new Map(TabletopStore.state.entities.map(e=>[String(e.id),e])),order=[];
    for(const p of participants||[]){const entity=entitiesById.get(String(p.entity_id));if(!entity)continue;
      if(p.type==='enemy'){
        let battleEnemy=null;
        if(entity.source_type==='enemy_template'){
          const {data:t}=await supabaseClient.from('enemy_templates').select('*').eq('id',entity.source_id).maybeSingle();
          if(t){const visibility={name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false,...(t.visibility||{})};const payload={battle_id:battle.id,name:t.name||entity.label||'Inimigo',subtitle:t.subtitle||'',image_url:t.image_url||entity.image_url||'',hp_current:t.hp_max??entity.hp_max??10,hp_max:t.hp_max??entity.hp_max??10,defense:t.defense??10,dodge:t.dodge??0,block:t.block??0,movement_speed:t.movement_speed??9,level:t.level||1,rank:t.rank||'comum',element:t.element||'',damage_reduction:t.damage_reduction||0,conditions:Array.isArray(t.conditions)?t.conditions:[],attacks:Array.isArray(t.attacks)?t.attacks:[],abilities:Array.isArray(t.abilities)?t.abilities:[],notes:t.notes||'',visibility};const ins=await supabaseClient.from('battle_enemies').insert(payload).select().single();if(ins.error)throw ins.error;battleEnemy=ins.data;await updateEntity(entity.id,{battle_id:battle.id,battle_entity_type:'enemy',battle_entity_id:String(ins.data.id),hp_current:ins.data.hp_current,hp_max:ins.data.hp_max});}}
        if(battleEnemy)order.push({type:'enemy',id:String(battleEnemy.id),entity_id:String(entity.id),label:p.label,initiative:Number(p.initiative)||0});
      }else if(p.type==='player')order.push({type:'player',id:String(entity.source_id||entity.owner_user_id),entity_id:String(entity.id),label:p.label,initiative:Number(p.initiative)||0});
      else if(p.type==='npc')order.push({type:'npc',id:String(entity.id),entity_id:String(entity.id),label:p.label,initiative:Number(p.initiative)||0});
    }
    order.sort((a,b)=>b.initiative-a.initiative||String(a.label).localeCompare(String(b.label),'pt-BR'));
    const {data:updated,error:uerr}=await supabaseClient.from('battles').update({turn_order:order,turn_index:0,turn_label:order[0]?.label||null}).eq('id',battle.id).select().single();if(uerr)throw uerr;return updated;
  }
  async function linkEnemyToActiveBattle(entity,template){const overlay=await combatOverlay(),battle=overlay.battle;if(!battle)throw new Error('Não existe combate ativo. A Mesa continua funcionando normalmente sem combate.');if(entity.battle_id&&String(entity.battle_id)===String(battle.id)&&entity.battle_entity_id)return{entity,battleEnemy:overlay.enemies.find(x=>String(x.id)===String(entity.battle_entity_id))||null,battle};if(!template)throw new Error('Ficha do Bestiário não encontrada.');const visibility={name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false,...(template.visibility||{})};const payload={battle_id:battle.id,name:template.name||entity.label||'Inimigo',subtitle:template.subtitle||'',image_url:template.image_url||entity.image_url||'',hp_current:template.hp_max??entity.hp_max??10,hp_max:template.hp_max??entity.hp_max??10,defense:template.defense??10,dodge:template.dodge??0,block:template.block??0,movement_speed:template.movement_speed??9,level:template.level||1,rank:template.rank||'comum',element:template.element||'',damage_reduction:template.damage_reduction||0,conditions:Array.isArray(template.conditions)?template.conditions:[],attacks:Array.isArray(template.attacks)?template.attacks:[],abilities:Array.isArray(template.abilities)?template.abilities:[],notes:template.notes||'',visibility};const ins=await supabaseClient.from('battle_enemies').insert(payload).select().single();if(ins.error)throw ins.error;const linked=await updateEntity(entity.id,{battle_id:battle.id,battle_entity_type:'enemy',battle_entity_id:String(ins.data.id),hp_current:ins.data.hp_current,hp_max:ins.data.hp_max});return{entity:linked,battleEnemy:ins.data,battle};}
  async function unlinkCombat(entity){if(!entity?.id)return entity;return updateEntity(entity.id,{battle_id:null,battle_entity_type:null,battle_entity_id:null});}
  window.TabletopPersistence=Object.freeze({BUCKET,activeBoard,entities,createBoard,updateBoard,signedBackground,uploadBackground,clearBackground,addEntity,addEntities,updateEntity,updateEntities,removeEntity,combatOverlay,createBattleFromScene,linkEnemyToActiveBattle,unlinkCombat});
})();

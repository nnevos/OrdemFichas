(function(){
  'use strict';
  const OBJECT_TYPES=new Set(['token','map','image','note','text','shape','marker','area']);
  const LAYERS=['map','objects','tokens','markings','gm'];
  const DISPOSITIONS=new Set(['friendly','neutral','hostile']);
  const CONTROLS=new Set(['gm','owner','party','none']);
  const VISIBILITY=new Set(['visible','hidden','gm_only']);
  const clean=(value,set,fallback)=>set.has(String(value||''))?String(value):fallback;
  function normalize(raw={}){
    const type=clean(raw.object_type||raw.type,OBJECT_TYPES,'token');
    const entityType=raw.entity_type||'marker';
    const naturalDisposition=entityType==='player'?'friendly':entityType==='enemy'?'hostile':'neutral';
    const naturalControl=entityType==='player'&&raw.owner_user_id?'owner':'gm';
    const size=Math.max(24,Math.min(720,Number(raw.size)||82));
    return {...raw,
      object_type:type,
      disposition:clean(raw.disposition,DISPOSITIONS,naturalDisposition),
      control_mode:clean(raw.control_mode,CONTROLS,naturalControl),
      visibility_mode:clean(raw.visibility_mode,VISIBILITY,raw.visible_to_players===false?'gm_only':'visible'),
      layer_name:LAYERS.includes(raw.layer_name)?raw.layer_name:(type==='token'?'tokens':'objects'),
      locked:!!raw.locked,
      width:Math.max(8,Number(raw.width)||size),height:Math.max(8,Number(raw.height)||size),
      size,rotation:Number(raw.rotation)||0,revision:Number(raw.revision)||1,
      metadata:raw.metadata&&typeof raw.metadata==='object'?raw.metadata:{},
    };
  }
  function canControl(e,userId,isAdmin){
    if(!e||e.locked)return false;if(isAdmin)return true;
    if(e.control_mode==='party'&&e.entity_type==='player')return true;
    return e.control_mode==='owner'&&String(e.owner_user_id||'')===String(userId||'');
  }
  function isVisible(e,isAdmin){if(!e)return false;if(isAdmin)return true;return e.visibility_mode==='visible'&&e.visible_to_players!==false;}
  function patchForVisibility(mode){return{visibility_mode:mode,visible_to_players:mode==='visible'};}
  window.TabletopSceneModel=Object.freeze({OBJECT_TYPES,LAYERS,DISPOSITIONS,CONTROLS,VISIBILITY,normalize,canControl,isVisible,patchForVisibility});
})();

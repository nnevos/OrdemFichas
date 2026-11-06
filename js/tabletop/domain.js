(function(){
  'use strict';
  function number(value,fallback=0){const n=Number(value);return Number.isFinite(n)?n:fallback;}
  function clamp(value,min,max){return Math.max(min,Math.min(max,number(value,min)));}
  const MIN_BOARD_WIDTH=7200,MIN_BOARD_HEIGHT=4800;
  function boardSize(board){return{width:Math.max(MIN_BOARD_WIDTH,number(board?.logical_width,MIN_BOARD_WIDTH)),height:Math.max(MIN_BOARD_HEIGHT,number(board?.logical_height,MIN_BOARD_HEIGHT))};}
  function clampPosition(entity,board){const bounds=boardSize(board),w=Math.max(24,number(entity?.width,entity?.size||82)),h=Math.max(24,number(entity?.height,entity?.size||82));return{x:clamp(entity?.x,w/2,bounds.width-w/2),y:clamp(entity?.y,h/2,bounds.height-h/2)};}
  function canMove(entity,userId,isAdmin){return window.TabletopSceneModel?TabletopSceneModel.canControl(entity,userId,isAdmin):!!entity&&(isAdmin||(entity.entity_type==='player'&&String(entity.owner_user_id||'')===String(userId||'')));}
  function hpPercent(entity){const max=number(entity?.hp_max,0);if(max<=0)return null;return clamp(number(entity?.hp_current,0)/max*100,0,100);}
  function entityIcon(type,entity){if(entity?.metadata?.kind==='item'||entity?.state?.kind==='item')return entity?.metadata?.icon||entity?.state?.icon||'📦';return({player:'🧙',enemy:'👹',npc:'🧑',marker:'📍'})[type]||'◉';}
  function entityLabel(entity){if(entity?.metadata?.kind==='item'||entity?.state?.kind==='item')return 'item';return entity?.entity_type||'token';}
  function normalizeEntity(raw){const base={...raw,x:number(raw?.x,MIN_BOARD_WIDTH/2),y:number(raw?.y,MIN_BOARD_HEIGHT/2),size:clamp(raw?.size||82,24,720),rotation:number(raw?.rotation,0)};return window.TabletopSceneModel?TabletopSceneModel.normalize(base):base;}
  window.TabletopDomain=Object.freeze({MIN_BOARD_WIDTH,MIN_BOARD_HEIGHT,number,clamp,boardSize,clampPosition,canMove,hpPercent,entityIcon,entityLabel,normalizeEntity});
})();

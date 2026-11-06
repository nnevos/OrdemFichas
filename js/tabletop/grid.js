(function(){
  'use strict';
  function config(){const b=TabletopStore.state.board||{};return{enabled:!!b.grid_enabled,snap:!!b.grid_snap,size:Math.max(10,Math.min(500,Number(b.grid_size)||70))};}
  function point(x,y,{ignore=false}={}){const g=config();if(ignore||!g.enabled||!g.snap)return{x,y};return{x:Math.round(x/g.size)*g.size,y:Math.round(y/g.size)*g.size};}
  function entityPosition(entity,x,y,opts){const p=point(x,y,opts);return TabletopDomain.clampPosition({...entity,...p},TabletopStore.state.board);}
  window.TabletopGrid=Object.freeze({config,point,entityPosition});
})();

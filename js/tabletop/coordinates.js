(function(){
  'use strict';
  function viewportPoint(event, viewport){
    const rect=viewport.getBoundingClientRect();
    return {x:event.clientX-rect.left,y:event.clientY-rect.top};
  }
  function screenToWorld(event, viewport, camera){
    const p=viewportPoint(event,viewport),c=camera||{x:0,y:0,scale:1},scale=Number(c.scale)||1;
    return {x:(p.x-(Number(c.x)||0))/scale,y:(p.y-(Number(c.y)||0))/scale};
  }
  function worldToScreen(point,camera){
    const c=camera||{x:0,y:0,scale:1},scale=Number(c.scale)||1;
    return {x:(Number(point.x)||0)*scale+(Number(c.x)||0),y:(Number(point.y)||0)*scale+(Number(c.y)||0)};
  }
  function distance(a,b){return Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0));}
  window.TabletopCoordinates=Object.freeze({viewportPoint,screenToWorld,worldToScreen,distance});
})();

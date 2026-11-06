// V15.8 - two-finger pan + pinch, using the same camera scale as desktop.
(function(){
  'use strict';const active=new Map();let gesture=null;
  const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y),mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  function viewport(){return TabletopBoardView?.viewport?.();}
  function begin(){if(active.size!==2)return;const [a,b]=[...active.values()],c=TabletopBoardView.getCamera();gesture={distance:Math.max(1,dist(a,b)),midpoint:mid(a,b),camera:c};document.documentElement.classList.add('tabletop-pinching');TabletopController?.cancelGesture?.();}
  function move(){if(!gesture||active.size!==2)return;const [a,b]=[...active.values()],m=mid(a,b),vp=viewport();if(!vp)return;const rect=vp.getBoundingClientRect(),old=gesture.camera,ratio=dist(a,b)/gesture.distance,nextScale=Math.max(TabletopBoardView.minScale(),Math.min(3.5,old.scale*ratio)),anchorX=gesture.midpoint.x-rect.left,anchorY=gesture.midpoint.y-rect.top,wx=(anchorX-old.x)/old.scale,wy=(anchorY-old.y)/old.scale,dx=m.x-gesture.midpoint.x,dy=m.y-gesture.midpoint.y;TabletopBoardView.setCamera({scale:nextScale,x:anchorX-wx*nextScale+dx,y:anchorY-wy*nextScale+dy});}
  function down(e){const v=viewport();if(!v||!v.contains(e.target)||e.pointerType==='mouse')return;active.set(e.pointerId,{x:e.clientX,y:e.clientY});if(active.size===2){e.preventDefault();begin();}}
  function pointerMove(e){if(!active.has(e.pointerId))return;active.set(e.pointerId,{x:e.clientX,y:e.clientY});if(active.size===2){e.preventDefault();move();}}
  function up(e){active.delete(e.pointerId);if(active.size<2){gesture=null;document.documentElement.classList.remove('tabletop-pinching');}}
  addEventListener('pointerdown',down,{passive:false,capture:true});addEventListener('pointermove',pointerMove,{passive:false,capture:true});addEventListener('pointerup',up,{capture:true});addEventListener('pointercancel',up,{capture:true});
  window.TabletopTouchGestures={reset(){active.clear();gesture=null;}};
})();

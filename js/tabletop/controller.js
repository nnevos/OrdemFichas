(function(){
  'use strict';
  const DRAG_THRESHOLD=5;
  let cleanup=[],gesture=null,deferredRemote=new Map();
  function on(el,type,fn,opts){if(!el)return;el.addEventListener(type,fn,opts);cleanup.push(()=>el.removeEventListener(type,fn,opts));}
  function entity(id){return TabletopStore.state.entities.find(x=>String(x.id)===String(id));}
  function movable(e){return !!e&&TabletopDomain.canMove(e,currentUser?.id,currentRole==='admin')&&!TabletopRealtime.isLockedByOther(e.id);}
  function selectionIds(){const ids=window.TabletopSelection?.all?.()||[];return ids.length?ids:(TabletopStore.state.selectedId?[String(TabletopStore.state.selectedId)]:[]);}
  function selectToken(id,shift){if(window.TabletopSelection){shift?TabletopSelection.toggle(id):TabletopSelection.set(id);}else TabletopStore.select(id);window.TabletopRenderer?.patchSelection?.();}
  function cancelGesture(){if(gesture?.locks)gesture.locks.forEach(id=>TabletopRealtime.unlock(id));document.querySelector('[data-tabletop-marquee]')?.remove();document.querySelector('[data-tabletop-viewport]')?.classList.remove('panning','token-dragging','marquee-selecting','transforming-token');gesture=null;}
  function stop(){cleanup.forEach(fn=>{try{fn();}catch(_){}});cleanup=[];cancelGesture();deferredRemote.clear();}
  function isTransforming(id){if(!gesture)return false;if(gesture.kind==='move'&&gesture.dragging)return gesture.ids?.includes(String(id));return ['resize','rotate'].includes(gesture.kind)&&gesture.dragging&&String(gesture.id)===String(id);}
  function isDragging(id){return isTransforming(id);}
  function remoteMove(id,x,y){if(isTransforming(id)){deferredRemote.set(String(id),{x,y});return false;}const e=entity(id);if(!e)return false;e.x=Number(x);e.y=Number(y);TabletopTokenView.patchPosition(id,e.x,e.y);return true;}
  function flushDeferred(ids){for(const id of ids||[]){const p=deferredRemote.get(String(id));deferredRemote.delete(String(id));if(p)remoteMove(id,p.x,p.y);}}
  function worldPoint(event,vp){return TabletopCoordinates.screenToWorld(event,vp,TabletopStore.state.camera);}
  async function applySnapshots(snapshots){for(const item of snapshots){const e=entity(item.id);if(!e)continue;Object.assign(e,item.patch);TabletopTokenView.patchTransform(e.id,item.patch);if('x' in item.patch||'y' in item.patch)TabletopRealtime.move(e.id,e.x,e.y,true);try{await TabletopPersistence.updateEntity(e.id,item.patch);}catch(err){console.warn('Falha ao aplicar histórico',err);}}TabletopRenderer?.patchSelection?.();}
  function pushHistory(before,after,label){if(!before?.length||!after?.length)return;TabletopHistory?.push({label,undo:()=>applySnapshots(before),redo:()=>applySnapshots(after)});}
  function marqueeNode(vp,start){const el=document.createElement('div');el.className='tabletop-marquee';el.dataset.tabletopMarquee='1';el.style.left=`${start.x}px`;el.style.top=`${start.y}px`;vp.appendChild(el);return el;}
  function viewportLocal(event,vp){const r=vp.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};}
  function updateMarquee(el,a,b){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y),w=Math.abs(a.x-b.x),h=Math.abs(a.y-b.y);Object.assign(el.style,{left:`${x}px`,top:`${y}px`,width:`${w}px`,height:`${h}px`});}
  function marqueeSelect(vp,a,b){const minX=Math.min(a.x,b.x),maxX=Math.max(a.x,b.x),minY=Math.min(a.y,b.y),maxY=Math.max(a.y,b.y),cam=TabletopStore.state.camera,tl=TabletopCoordinates.screenToWorld({clientX:vp.getBoundingClientRect().left+minX,clientY:vp.getBoundingClientRect().top+minY},vp,cam),br=TabletopCoordinates.screenToWorld({clientX:vp.getBoundingClientRect().left+maxX,clientY:vp.getBoundingClientRect().top+maxY},vp,cam);const ids=TabletopStore.state.entities.filter(e=>e.x>=tl.x&&e.x<=br.x&&e.y>=tl.y&&e.y<=br.y).map(e=>String(e.id));TabletopSelection?.setMany(ids);}
  function bind(){
    stop();const vp=TabletopBoardView.viewport();if(!vp)return;TabletopBoardView.applyCamera();
    on(vp,'pointerdown',event=>{
      if(event.button!==undefined&&event.button!==0)return;
      const token=event.target.closest('[data-tabletop-token-id]');
      if(token){
        const id=String(token.dataset.tabletopTokenId),e=entity(id);if(!e)return;event.preventDefault();event.stopPropagation();
        // Combat target-picking owns the click. Do not start selection, movement or token transforms.
        if(window.TabletopCombatDock?.isTargeting?.()){
          window.TabletopCombatDock.tryTargetEntity?.(e);
          return;
        }
        const resize=!!event.target.closest('[data-tabletop-resize]'),rotate=!!event.target.closest('[data-tabletop-rotate]');
        try{vp.setPointerCapture?.(event.pointerId);}catch(_){}
        if((resize||rotate)&&currentRole==='admin'&&!e.locked){
          if(!TabletopSelection?.has(id))selectToken(id,false);const localCenter=TabletopCoordinates.worldToScreen({x:e.x,y:e.y},TabletopStore.state.camera),vr=vp.getBoundingClientRect(),center={x:vr.left+localCenter.x,y:vr.top+localCenter.y};
          gesture={kind:resize?'resize':'rotate',id,pointer:event.pointerId,startClient:{x:event.clientX,y:event.clientY},center,start:{size:Number(e.size)||82,rotation:Number(e.rotation)||0},before:{id,patch:{size:Number(e.size)||82,rotation:Number(e.rotation)||0}},dragging:false,node:token,locks:[id]};TabletopRealtime.lock(id,e.label);vp.classList.add('transforming-token');return;
        }
        selectToken(id,event.shiftKey);if(event.shiftKey&&!TabletopSelection?.has(id))return;
        const ids=(TabletopSelection?.has(id)?selectionIds():[id]).filter(x=>movable(entity(x)));if(!ids.length)return;
        const starts=new Map(ids.map(x=>{const item=entity(x);return[x,{x:Number(item.x)||0,y:Number(item.y)||0}];}));
        gesture={kind:'move',id,pointer:event.pointerId,startClient:{x:event.clientX,y:event.clientY},ids,starts,dragging:false,nodes:ids.map(TabletopTokenView.node).filter(Boolean),locks:[]};return;
      }
      event.preventDefault();try{vp.setPointerCapture?.(event.pointerId);}catch(_){}
      if(event.shiftKey){const p=viewportLocal(event,vp);gesture={kind:'marquee',pointer:event.pointerId,startClient:p,current:p,dragging:false,node:marqueeNode(vp,p)};vp.classList.add('marquee-selecting');}
      else{if(window.TabletopSelection?.size?.())TabletopSelection.clear();gesture={kind:'pan',pointer:event.pointerId,startClient:{x:event.clientX,y:event.clientY},camera:{...TabletopStore.state.camera},dragging:false,clearSelection:!event.shiftKey};}
    });
    on(window,'pointermove',event=>{
      if(!gesture||gesture.pointer!==event.pointerId)return;
      if(gesture.kind==='marquee'){const p=viewportLocal(event,vp);gesture.current=p;if(!gesture.dragging&&Math.hypot(p.x-gesture.startClient.x,p.y-gesture.startClient.y)<DRAG_THRESHOLD)return;gesture.dragging=true;event.preventDefault();updateMarquee(gesture.node,gesture.startClient,p);return;}
      const delta={x:event.clientX-gesture.startClient.x,y:event.clientY-gesture.startClient.y};
      if(gesture.kind==='move'){
        if(!gesture.dragging&&Math.hypot(delta.x,delta.y)<DRAG_THRESHOLD)return;
        if(!gesture.dragging){gesture.dragging=true;vp.classList.add('token-dragging');gesture.nodes.forEach(n=>n.classList.add('dragging'));gesture.ids.forEach(id=>{const e=entity(id);TabletopRealtime.lock(id,e?.label);gesture.locks.push(id);});}
        event.preventDefault();const scale=Number(TabletopStore.state.camera.scale)||1;gesture.preview=new Map();
        for(const id of gesture.ids){const e=entity(id),start=gesture.starts.get(id);if(!e||!start)continue;const pos=window.TabletopGrid?TabletopGrid.entityPosition(e,start.x+delta.x/scale,start.y+delta.y/scale,{ignore:event.altKey}):TabletopDomain.clampPosition({...e,x:start.x+delta.x/scale,y:start.y+delta.y/scale},TabletopStore.state.board);gesture.preview.set(id,{x:pos.x,y:pos.y});TabletopTokenView.patchPosition(id,pos.x,pos.y);TabletopRealtime.move(id,pos.x,pos.y);}
        return;
      }
      if(gesture.kind==='resize'){
        if(!gesture.dragging&&Math.hypot(delta.x,delta.y)<DRAG_THRESHOLD)return;gesture.dragging=true;event.preventDefault();const scale=Number(TabletopStore.state.camera.scale)||1;const size=Math.max(24,Math.min(360,gesture.start.size+(delta.x+delta.y)/(2*scale)*2));gesture.preview={size};TabletopTokenView.patchTransform(gesture.id,{size});return;
      }
      if(gesture.kind==='rotate'){
        gesture.dragging=true;event.preventDefault();const cx=gesture.center.x,cy=gesture.center.y;const startAngle=Math.atan2(gesture.startClient.y-cy,gesture.startClient.x-cx),angle=Math.atan2(event.clientY-cy,event.clientX-cx);let rotation=gesture.start.rotation+(angle-startAngle)*180/Math.PI;if(event.shiftKey)rotation=Math.round(rotation/15)*15;gesture.preview={rotation};TabletopTokenView.patchTransform(gesture.id,{rotation});return;
      }
      if(gesture.kind==='pan'){
        if(!gesture.dragging&&Math.hypot(delta.x,delta.y)<DRAG_THRESHOLD)return;gesture.dragging=true;event.preventDefault();vp.classList.add('panning');TabletopBoardView.setCamera({x:gesture.camera.x+delta.x,y:gesture.camera.y+delta.y});
      }
    },{passive:false});
    async function release(event){
      if(!gesture||gesture.pointer!==event.pointerId)return;const done=gesture;gesture=null;try{vp.releasePointerCapture?.(event.pointerId);}catch(_){}vp.classList.remove('panning','token-dragging','marquee-selecting','transforming-token');
      // Only the temporary marquee overlay is disposable. `done.node` is the real token for resize/rotate.
      if(done.kind==='marquee'){done.node?.remove?.();if(done.dragging)marqueeSelect(vp,done.startClient,done.current);return;}
      if(done.kind==='pan'){if(!done.dragging&&done.clearSelection){TabletopSelection?.clear?.();TabletopRenderer?.patchSelection?.();}return;}
      (done.nodes||[]).forEach(n=>n.classList.remove('dragging'));(done.locks||[]).forEach(id=>TabletopRealtime.unlock(id));
      if(done.kind==='move'&&done.dragging&&done.preview){const before=[],after=[];for(const id of done.ids){const e=entity(id),start=done.starts.get(id),pos=done.preview.get(id);if(!e||!start||!pos)continue;before.push({id,patch:{x:start.x,y:start.y}});after.push({id,patch:{x:pos.x,y:pos.y}});e.x=pos.x;e.y=pos.y;TabletopTokenView.patch(id);TabletopRealtime.move(id,pos.x,pos.y,true);try{await TabletopPersistence.updateEntity(id,{x:pos.x,y:pos.y});}catch(err){console.warn('Falha ao salvar posição',err);}}pushHistory(before,after,done.ids.length>1?'Mover grupo':'Mover token');flushDeferred(done.ids);TabletopRenderer?.patchSelection?.();return;}
      if((done.kind==='resize'||done.kind==='rotate')&&done.dragging&&done.preview){const e=entity(done.id);if(!e)return;const before=[done.before],patch=done.preview,after=[{id:done.id,patch:{...done.before.patch,...patch}}];Object.assign(e,patch);TabletopTokenView.patch(done.id);try{await TabletopPersistence.updateEntity(done.id,patch);pushHistory(before,after,done.kind==='resize'?'Redimensionar token':'Rotacionar token');}catch(err){console.warn('Falha ao salvar transformação',err);}flushDeferred([done.id]);return;}
      if(done.kind==='move')done.ids?.forEach(id=>TabletopTokenView.patch(id));else if(done.id)TabletopTokenView.patch(done.id);
    }
    on(window,'pointerup',release);on(window,'pointercancel',release);on(window,'blur',cancelGesture);
    on(vp,'wheel',event=>{event.preventDefault();const factor=Math.max(.78,Math.min(1.28,Math.exp(-event.deltaY*.0016)));TabletopBoardView.zoomAt(event.clientX,event.clientY,factor);},{passive:false});on(vp,'dragstart',event=>event.preventDefault());
  }
  window.TabletopController=Object.freeze({bind,stop,isDragging,isTransforming,remoteMove,cancelGesture});
})();

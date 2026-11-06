(function(){
  'use strict';
  let cleanup=[];
  let drag=null;
  let pan=null;

  function on(el,type,fn,opts){
    if(!el)return;
    el.addEventListener(type,fn,opts);
    cleanup.push(()=>el.removeEventListener(type,fn,opts));
  }

  function stop(){
    cleanup.forEach(fn=>{try{fn();}catch(_){}});
    cleanup=[];
    drag=null;
    pan=null;
  }

  function safeSelector(value){
    const raw=String(value??'');
    if(window.CSS&&typeof window.CSS.escape==='function')return window.CSS.escape(raw);
    return raw.replace(/["\\]/g,'\\$&');
  }

  function bind(){
    stop();
    const viewport=document.querySelector('[data-tabletop-viewport]');
    const world=document.querySelector('[data-tabletop-world]');
    if(!viewport||!world)return;

    const camera=()=>TabletopStore.state.camera;
    const applyCamera=()=>{
      const c=camera();
      world.style.transform=`translate(${c.x}px,${c.y}px) scale(${c.scale})`;
      const label=document.querySelector('[data-tabletop-zoom]');
      if(label)label.textContent=`${Math.round(c.scale*100)}%`;
    };
    const worldPoint=event=>{
      const rect=viewport.getBoundingClientRect();
      const c=camera();
      return {
        x:(event.clientX-rect.left-c.x)/c.scale,
        y:(event.clientY-rect.top-c.y)/c.scale
      };
    };

    function selectToken(id){
      TabletopStore.select(id);
      window.TabletopRenderer?.patchSelection?.();
    }

    function beginTokenDrag(event,token){
      if(event.button!==undefined&&event.button!==0)return;
      const id=token.dataset.tabletopToken;
      const entity=TabletopStore.state.entities.find(x=>String(x.id)===String(id));
      if(!entity)return;

      selectToken(id);
      event.preventDefault();
      event.stopPropagation();

      const canMove=TabletopDomain.canMove(entity,currentUser?.id,currentRole==='admin');
      if(!canMove||TabletopRealtime.isLockedByOther(id))return;

      const p=worldPoint(event);
      drag={
        id:String(id),
        pointer:event.pointerId,
        dx:p.x-Number(entity.x),
        dy:p.y-Number(entity.y),
        token,
        moved:false,
        startX:event.clientX,
        startY:event.clientY
      };
      TabletopRealtime.lock(id,entity.label);
      try{token.setPointerCapture?.(event.pointerId);}catch(_){ }
      token.classList.add('dragging');
      viewport.classList.add('token-dragging');
    }

    document.querySelectorAll('[data-tabletop-token]').forEach(token=>{
      on(token,'pointerdown',event=>beginTokenDrag(event,token));
      on(token,'click',event=>{
        event.preventDefault();
        event.stopPropagation();
        selectToken(token.dataset.tabletopToken);
      });
      on(token,'dragstart',event=>event.preventDefault());
    });

    on(viewport,'pointerdown',event=>{
      if(event.button!==undefined&&event.button!==0)return;
      if(event.target.closest('[data-tabletop-token]'))return;
      event.preventDefault();
      pan={x:event.clientX,y:event.clientY,cx:camera().x,cy:camera().y,pointer:event.pointerId};
      try{viewport.setPointerCapture?.(event.pointerId);}catch(_){ }
      viewport.classList.add('panning');
    });

    on(viewport,'wheel',event=>{
      event.preventDefault();
      const rect=viewport.getBoundingClientRect();
      const c=camera();
      const next=TabletopDomain.clamp(c.scale*(event.deltaY<0?1.1:.9),.25,3.5);
      const mx=event.clientX-rect.left,my=event.clientY-rect.top;
      const wx=(mx-c.x)/c.scale,wy=(my-c.y)/c.scale;
      TabletopStore.camera({scale:next,x:mx-wx*next,y:my-wy*next});
      applyCamera();
    },{passive:false});

    on(window,'pointermove',event=>{
      if(drag&&drag.pointer===event.pointerId){
        event.preventDefault();
        const p=worldPoint(event);
        const entity=TabletopStore.state.entities.find(x=>String(x.id)===String(drag.id));
        if(!entity)return;
        const pos=TabletopDomain.clampPosition({...entity,x:p.x-drag.dx,y:p.y-drag.dy},TabletopStore.state.board);
        entity.x=pos.x; entity.y=pos.y;
        if(Math.abs(event.clientX-drag.startX)>2||Math.abs(event.clientY-drag.startY)>2)drag.moved=true;
        window.TabletopRenderer?.patchToken?.(drag.id);
        TabletopRealtime.move(drag.id,pos.x,pos.y);
        return;
      }
      if(pan&&pan.pointer===event.pointerId){
        event.preventDefault();
        TabletopStore.camera({x:pan.cx+(event.clientX-pan.x),y:pan.cy+(event.clientY-pan.y)});
        applyCamera();
      }
    },{passive:false});

    async function release(event){
      if(drag&&drag.pointer===event.pointerId){
        const current=drag;
        drag=null;
        current.token?.classList.remove('dragging');
        viewport.classList.remove('token-dragging');
        try{current.token?.releasePointerCapture?.(event.pointerId);}catch(_){ }
        TabletopRealtime.unlock(current.id);
        const entity=TabletopStore.state.entities.find(x=>String(x.id)===String(current.id));
        if(entity){
          TabletopRealtime.move(current.id,entity.x,entity.y,true);
          try{await TabletopPersistence.updateEntity(current.id,{x:entity.x,y:entity.y});}
          catch(err){console.warn('Falha ao salvar posição',err);}
        }
      }
      if(pan&&pan.pointer===event.pointerId){
        pan=null;
        viewport.classList.remove('panning');
        try{viewport.releasePointerCapture?.(event.pointerId);}catch(_){ }
      }
    }

    on(window,'pointerup',release);
    on(window,'pointercancel',release);
    on(window,'blur',()=>{
      if(drag){TabletopRealtime.unlock(drag.id);drag.token?.classList.remove('dragging');drag=null;}
      pan=null;
      viewport.classList.remove('panning','token-dragging');
    });

    applyCamera();
  }

  window.TabletopInteractions=Object.freeze({bind,stop});
})();

(function(){
  'use strict';
  const MAX_SCALE=3.5;
  function viewport(){return document.querySelector('[data-tabletop-viewport]');}
  function world(){return document.querySelector('[data-tabletop-world]');}
  function camera(){return {...TabletopStore.state.camera};}
  function fitScale(){const vp=viewport(),b=TabletopStore.state.board;if(!vp||!b)return .15;const r=vp.getBoundingClientRect(),s=TabletopDomain.boardSize(b);return Math.min(Math.max(120,r.width-56)/s.width,Math.max(120,r.height-56)/s.height,1);}
  function minScale(){return Math.max(.08,Math.min(.35,fitScale()*.72));}
  function clampAxis(value,content,viewportSize){
    const margin=Math.max(28,Math.min(110,viewportSize*.12));
    if(content<=viewportSize-margin*2)return (viewportSize-content)/2;
    const min=viewportSize-margin-content,max=margin;
    return Math.max(min,Math.min(max,Number(value)||0));
  }
  function constrain(c){
    const vp=viewport(),b=TabletopStore.state.board;if(!vp||!b)return c;
    const r=vp.getBoundingClientRect(),s=TabletopDomain.boardSize(b),w=s.width*c.scale,h=s.height*c.scale;
    return {...c,x:clampAxis(c.x,w,r.width),y:clampAxis(c.y,h,r.height)};
  }
  function normalize(patch){const current=TabletopStore.state.camera||{x:0,y:0,scale:1};const merged={...current,...patch,scale:TabletopDomain.clamp(patch?.scale??current.scale,minScale(),MAX_SCALE)};return constrain(merged);}
  function applyCamera(){
    const node=world(),vp=viewport();if(!node)return;
    const c=normalize(TabletopStore.state.camera);if(c.scale!==TabletopStore.state.camera.scale||c.x!==TabletopStore.state.camera.x||c.y!==TabletopStore.state.camera.y)TabletopStore.camera(c);
    node.style.transform=`translate3d(${Number(c.x)||0}px,${Number(c.y)||0}px,0) scale(${c.scale})`;
    if(vp){const uiScale=Math.max(.82,Math.min(2.15,1/c.scale));vp.style.setProperty('--tabletop-scale',String(c.scale));vp.style.setProperty('--tabletop-ui-scale',String(uiScale));vp.classList.toggle('zoom-far',c.scale<.34);vp.classList.toggle('zoom-very-far',c.scale<.19);}
    const label=document.querySelector('[data-tabletop-zoom]');if(label)label.textContent=`${Math.round(c.scale*100)}%`;
  }
  function setCamera(patch){TabletopStore.camera(normalize(patch));applyCamera();}
  function reset(){const vp=viewport(),b=TabletopStore.state.board;if(!vp||!b)return;const rect=vp.getBoundingClientRect(),size=TabletopDomain.boardSize(b),scale=Math.max(minScale(),Math.min((rect.width-56)/size.width,(rect.height-56)/size.height,1));setCamera({scale,x:(rect.width-size.width*scale)/2,y:(rect.height-size.height*scale)/2});}
  function zoomAt(clientX,clientY,factor){const vp=viewport();if(!vp)return;const rect=vp.getBoundingClientRect(),c=camera(),oldScale=Number(c.scale)||1,next=TabletopDomain.clamp(oldScale*factor,minScale(),MAX_SCALE);const mx=clientX-rect.left,my=clientY-rect.top,wx=(mx-(Number(c.x)||0))/oldScale,wy=(my-(Number(c.y)||0))/oldScale;setCamera({scale:next,x:mx-wx*next,y:my-wy*next});}
  function zoomStep(factor){const vp=viewport();if(!vp)return;const r=vp.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,factor);}
  function viewportCenterWorld(offset={x:0,y:0}){const vp=viewport(),c=camera(),b=TabletopStore.state.board;if(!vp||!b){const s=TabletopDomain.boardSize(b);return{x:s.width/2,y:s.height/2};}const r=vp.getBoundingClientRect(),p={clientX:r.left+r.width/2,clientY:r.top+r.height/2},w=TabletopCoordinates.screenToWorld(p,vp,c),bounds=TabletopDomain.boardSize(b);return{x:TabletopDomain.clamp(w.x+(offset.x||0),60,bounds.width-60),y:TabletopDomain.clamp(w.y+(offset.y||0),60,bounds.height-60)};}
  function focusWorldPoint(point,scale){const vp=viewport();if(!vp)return;const r=vp.getBoundingClientRect(),next=TabletopDomain.clamp(scale??TabletopStore.state.camera.scale,minScale(),MAX_SCALE);setCamera({scale:next,x:r.width/2-(Number(point.x)||0)*next,y:r.height/2-(Number(point.y)||0)*next});}
  function focusEntity(id,{scale}={}){const e=TabletopStore.state.entities.find(x=>String(x.id)===String(id));if(!e)return;const current=Number(TabletopStore.state.camera.scale)||1;focusWorldPoint(e,scale??Math.max(.72,Math.min(1.35,current)));}
  function frameEntities(ids,{maxScale=1.05,padding=180}={}){const wanted=new Set((ids||[]).map(String)),items=TabletopStore.state.entities.filter(e=>wanted.has(String(e.id)));if(!items.length)return;const vp=viewport();if(!vp)return;const r=vp.getBoundingClientRect(),xs=items.map(e=>Number(e.x)||0),ys=items.map(e=>Number(e.y)||0),sizes=items.map(e=>Number(e.size)||82),maxSize=Math.max(82,...sizes),pad=Math.max(padding,maxSize*1.4),minX=Math.min(...xs)-pad,maxX=Math.max(...xs)+pad,minY=Math.min(...ys)-pad,maxY=Math.max(...ys)+pad,w=Math.max(320,maxX-minX),h=Math.max(260,maxY-minY),scale=TabletopDomain.clamp(Math.min((r.width-70)/w,(r.height-70)/h,maxScale),minScale(),maxScale),cx=(minX+maxX)/2,cy=(minY+maxY)/2;setCamera({scale,x:r.width/2-cx*scale,y:r.height/2-cy*scale});}
  function frameContent(){const items=TabletopStore.state.entities||[];if(!items.length){reset();return;}frameEntities(items.map(e=>e.id),{maxScale:.95,padding:220});}
  window.TabletopBoardView=Object.freeze({viewport,world,camera,getCamera:camera,applyCamera,setCamera,reset,zoomAt,zoomStep,fitScale,minScale,viewportCenterWorld,focusWorldPoint,focusEntity,frameEntities,frameContent});
})();

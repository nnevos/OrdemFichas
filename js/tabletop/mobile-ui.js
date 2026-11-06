(function(){
  'use strict';
  const MQ='(max-width: 850px)';
  function page(){ return document.querySelector('.tabletop-page'); }
  function setPanel(name){
    const p=page(); if(!p)return;
    p.dataset.mobilePanel=name||'map';
    document.querySelectorAll('[data-tt-mobile-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ttMobileTab===(name||'map')));
    if(name==='actions') document.querySelector('[data-tabletop-combat-dock]')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function closeAux(){setPanel('map');}
  function init(){
    const p=page(); if(!p)return;
    if(!p.dataset.mobilePanel)p.dataset.mobilePanel='map';
  }
  window.TabletopMobileUI=Object.freeze({init,setPanel,closeAux});
  window.setTabletopMobilePanel=setPanel;
  addEventListener('resize',()=>{ if(!matchMedia(MQ).matches){ const p=page(); if(p)p.dataset.mobilePanel='map'; } },{passive:true});
})();
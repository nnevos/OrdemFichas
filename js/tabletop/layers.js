(function(){
  'use strict';
  const ORDER=['map','objects','tokens','markings','gm'];
  function ensure(world){
    if(!world)return{};const result={};
    for(const name of ORDER){let el=world.querySelector(`[data-tabletop-layer="${name}"]`);if(!el){el=document.createElement('div');el.className=`tabletop-scene-layer layer-${name}`;el.dataset.tabletopLayer=name;world.appendChild(el);}result[name]=el;}
    return result;
  }
  function layer(name){return document.querySelector(`[data-tabletop-layer="${ORDER.includes(name)?name:'objects'}"]`);}
  window.TabletopLayers=Object.freeze({ORDER,ensure,layer});
})();

// V15.6 — selection model shared by controller, renderer and shortcuts.
(function(){
  'use strict';
  let ids=new Set(), listeners=new Set();
  const norm=id=>id==null?null:String(id);
  function emit(){const value=[...ids];listeners.forEach(fn=>{try{fn(value);}catch(err){console.warn('Tabletop selection listener',err);}});}
  function syncPrimary(){const first=[...ids][0]||null;if(window.TabletopStore&&TabletopStore.state.selectedId!==first){TabletopStore.state.selectedId=first;}}
  function changed(){syncPrimary();emit();window.TabletopRenderer?.patchSelection?.();}
  window.TabletopSelection=Object.freeze({
    all:()=>[...ids],
    has:id=>ids.has(norm(id)),
    primary:()=>[...ids][0]||null,
    size:()=>ids.size,
    clear(){if(!ids.size)return;ids.clear();changed();},
    set(id){const n=norm(id);ids=new Set(n?[n]:[]);changed();},
    setMany(values){ids=new Set((values||[]).map(norm).filter(Boolean));changed();},
    toggle(id){const n=norm(id);if(!n)return;ids.has(n)?ids.delete(n):ids.add(n);changed();},
    add(id){const n=norm(id);if(!n||ids.has(n))return;ids.add(n);changed();},
    remove(id){const n=norm(id);if(!n||!ids.delete(n))return;changed();},
    prune(valid){const allowed=new Set((valid||[]).map(norm));let dirty=false;for(const id of [...ids])if(!allowed.has(id)){ids.delete(id);dirty=true;}if(dirty)changed();},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
  });
})();

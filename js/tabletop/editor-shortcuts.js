// V15.6 — editor shortcuts. They never intercept typing fields.
(function(){
  'use strict';
  function typing(e){const t=e.target;return t&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable);}
  function active(){const v=document.querySelector('[data-tabletop-viewport],#tabletop-viewport,.tabletop-viewport');return !!(v&&v.offsetParent!==null);}
  addEventListener('keydown',async e=>{if(!active()||typing(e))return;const mod=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
    if(mod&&key==='z'){e.preventDefault();e.shiftKey?await TabletopHistory?.redo():await TabletopHistory?.undo();return;}
    if(mod&&key==='y'){e.preventDefault();await TabletopHistory?.redo();return;}
    if(e.key==='Escape'){TabletopSelection?.clear();TabletopController?.cancelGesture?.();return;}
    if(key==='f'){const id=TabletopSelection?.primary?.();if(id){e.preventDefault();TabletopBoardView?.focusEntity?.(id);}}
    if(key==='0'){e.preventDefault();TabletopBoardView?.frameContent?.();}
  });
})();

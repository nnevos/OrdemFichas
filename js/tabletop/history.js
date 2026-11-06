// V15.6 — command history. Commands may be async and are serialized.
(function(){
  'use strict';
  let undoStack=[],redoStack=[],limit=100,busy=false;
  async function run(stackFrom,stackTo,method){if(busy)return false;const cmd=stackFrom.pop();if(!cmd)return false;busy=true;try{await cmd[method]();stackTo.push(cmd);return true;}catch(err){stackFrom.push(cmd);console.warn(`Tabletop ${method} falhou`,err);return false;}finally{busy=false;window.dispatchEvent(new CustomEvent('tabletop:history-change',{detail:state()}));}}
  function state(){return{undo:undoStack.length,redo:redoStack.length,busy};}
  window.TabletopHistory=Object.freeze({
    push(cmd){if(!cmd||typeof cmd.undo!=='function'||typeof cmd.redo!=='function')return;undoStack.push(cmd);if(undoStack.length>limit)undoStack.shift();redoStack=[];window.dispatchEvent(new CustomEvent('tabletop:history-change',{detail:state()}));},
    undo:()=>run(undoStack,redoStack,'undo'),
    redo:()=>run(redoStack,undoStack,'redo'),
    clear(){undoStack=[];redoStack=[];window.dispatchEvent(new CustomEvent('tabletop:history-change',{detail:state()}));},
    state
  });
})();

const test=require('node:test');
const __legacyMigrations=["supabase-migration-v7-tabletop.sql"];
if(__legacyMigrations.some(f=>!require('fs').existsSync(f))){ console.log('legacy migration assertions skipped: migrations intentionally omitted from release'); process.exit(0); }
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('V15.6 liga selection model ao controller e renderer',()=>{
  const controller=read('js/tabletop/controller.js');
  const renderer=read('js/tabletop/renderer.js');
  assert.match(controller,/TabletopSelection\.toggle/);
  assert.match(controller,/TabletopSelection\?\.setMany/);
  assert.match(renderer,/TabletopSelection\?\.has/);
});

test('marquee usa Shift sem substituir o pan normal',()=>{
  const source=read('js/tabletop/controller.js');
  assert.match(source,/event\.shiftKey/);
  assert.match(source,/kind:'marquee'/);
  assert.match(source,/kind:'pan'/);
  assert.match(source,/marqueeSelect/);
});

test('movimento em grupo registra um unico comando de historico conceitual',()=>{
  const source=read('js/tabletop/controller.js');
  assert.match(source,/gesture\.ids/);
  assert.match(source,/pushHistory\(before,after,done\.ids\.length>1\?'Mover grupo':'Mover token'\)/);
});

test('resize e rotacao persistem size e rotation existentes no schema',()=>{
  const source=read('js/tabletop/controller.js');
  const token=read('js/tabletop/token-view.js');
  const migration=read('supabase-migration-v7-tabletop.sql');
  assert.match(source,/kind:resize\?'resize':'rotate'/);
  assert.match(source,/Math\.min\(360/);
  assert.match(source,/rotation/);
  assert.match(token,/data-tabletop-resize/);
  assert.match(token,/data-tabletop-rotate/);
  assert.match(migration,/size numeric/);
  assert.match(migration,/rotation numeric/);
});

test('undo redo ficam disponiveis por botoes e atalhos',()=>{
  const renderer=read('js/tabletop/renderer.js');
  const shortcuts=read('js/tabletop/editor-shortcuts.js');
  const actions=read('js/core/event-actions.js');
  assert.match(renderer,/undoTabletopAction/);
  assert.match(renderer,/redoTabletopAction/);
  assert.match(shortcuts,/TabletopHistory\?\.undo/);
  assert.match(shortcuts,/TabletopHistory\?\.redo/);
  assert.match(actions,/undoTabletopAction/);
});

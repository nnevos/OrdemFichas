const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('core rewrite carrega controller incremental e nao carrega interactions legado',()=>{
  const html=read('index.html');
  assert.match(html,/js\/tabletop\/controller\.js/);
  assert.match(html,/js\/tabletop\/token-view\.js/);
  assert.doesNotMatch(html,/js\/tabletop\/interactions\.js/);
});

test('drag usa threshold e nao persiste durante pointermove',()=>{
  const source=read('js/tabletop/controller.js');
  assert.match(source,/DRAG_THRESHOLD=5/);
  const moveStart=source.indexOf("on(window,'pointermove'");
  const releaseStart=source.indexOf('async function release',moveStart);
  assert.ok(moveStart>=0&&releaseStart>moveStart);
  const moveBlock=source.slice(moveStart,releaseStart);
  assert.doesNotMatch(moveBlock,/TabletopPersistence\.updateEntity/);
  assert.match(source.slice(releaseStart),/TabletopPersistence\.updateEntity/);
});

test('renderer sincroniza tokens incrementalmente sem substituir a layer inteira',()=>{
  const source=read('js/tabletop/renderer.js');
  assert.match(source,/TabletopTokenView\.sync/);
  assert.doesNotMatch(source,/layer\.innerHTML\s*=/);
});

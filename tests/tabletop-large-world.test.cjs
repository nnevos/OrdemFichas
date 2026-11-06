const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('large world uses 7200x4800 minimum',()=>{
  const domain=read('js/tabletop/domain.js');
  assert.match(domain,/MIN_BOARD_WIDTH=7200/);
  assert.match(domain,/MIN_BOARD_HEIGHT=4800/);
  assert.match(domain,/function boardSize/);
});

test('renderer exposes visible world boundary',()=>{
  const renderer=read('js/tabletop/renderer.js');
  const css=read('css/tabletop.css');
  assert.match(renderer,/tabletop-world-boundary/);
  assert.match(renderer,/LIMITE DA MESA/);
  assert.match(css,/tabletop-world-boundary/);
});

test('camera derives a safe minimum zoom from viewport and board size',()=>{
  const view=read('js/tabletop/board-view.js');
  assert.match(view,/function fitScale/);
  assert.match(view,/function minScale/);
  assert.match(view,/fitScale\(\)\*\.72/);
});

test('background upload does not shrink board below large-world minimum',()=>{
  const persistence=read('js/tabletop/persistence.js');
  assert.match(persistence,/Math\.max\(7200/);
  assert.match(persistence,/Math\.max\(4800/);
});

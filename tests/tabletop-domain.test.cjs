const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');
const code=fs.readFileSync('js/tabletop/domain.js','utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(code,context);
const D=context.window.TabletopDomain;

test('clampPosition keeps tokens inside board bounds',()=>{
  const pos=D.clampPosition({x:-10,y:5000,size:100},{logical_width:1000,logical_height:600});
  assert.equal(pos.x,50); assert.equal(pos.y,4750);
});

test('players move only their own token while admin can move any token',()=>{
  const token={entity_type:'player',owner_user_id:'u1'};
  assert.equal(D.canMove(token,'u1',false),true);
  assert.equal(D.canMove(token,'u2',false),false);
  assert.equal(D.canMove({entity_type:'enemy'},'u1',false),false);
  assert.equal(D.canMove({entity_type:'enemy'},'u1',true),true);
});

test('hpPercent clamps visible hp safely',()=>{
  assert.equal(D.hpPercent({hp_current:50,hp_max:100}),50);
  assert.equal(D.hpPercent({hp_current:200,hp_max:100}),100);
  assert.equal(D.hpPercent({hp_current:-10,hp_max:100}),0);
  assert.equal(D.hpPercent({hp_current:2,hp_max:0}),null);
});

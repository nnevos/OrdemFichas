const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const controller=fs.readFileSync(path.join(root,'js/tabletop/controller.js'),'utf8');
const dock=fs.readFileSync(path.join(root,'js/tabletop/combat-dock.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/tabletop.css'),'utf8');

test('resize/rotate release never removes the real token node',()=>{
  assert.doesNotMatch(controller,/transforming-token'\);done\.node\?\.remove/);
  assert.match(controller,/done\.kind==='marquee'\)\{done\.node\?\.remove/);
});

test('combat target picking intercepts token pointerdown before transforms',()=>{
  const targeting=controller.indexOf('TabletopCombatDock?.isTargeting?.()');
  const resize=controller.indexOf("event.target.closest('[data-tabletop-resize]')");
  assert.ok(targeting>0 && resize>targeting);
  assert.match(controller,/tryTargetEntity\?\.\(e\)/);
});

test('target resolution gives explicit invalid feedback and exposes targeting API',()=>{
  assert.match(dock,/function targetValidity\(e\)/);
  assert.match(dock,/Alvo inválido\./);
  assert.match(dock,/isTargeting:\(\)=>!!pendingAction/);
  assert.match(css,/is-picking-target \.tabletop-transform-handle\{opacity:0!important;pointer-events:none!important\}/);
});

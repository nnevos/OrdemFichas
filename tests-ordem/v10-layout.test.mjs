import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../ordem/main.mjs',import.meta.url),'utf8');
const css=readFileSync(new URL('../ordem/style.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('armas compactas exibem nome, dano e crítico e detalhes sob demanda',()=>{
 assert.match(js,/op-weapon-compact/);
 assert.match(js,/op-weapon-key-stats/);
 assert.match(js,/toggle-weapon-details/);
 assert.match(js,/expandedWeaponDetails/);
});
test('ações de ritual e habilidade pertencem às suas seções',()=>{
 assert.match(js,/section\('rituais','Rituais','rituais',rituals\+`<button/);
 assert.match(js,/abilities}<button class="op-btn/);
 assert.doesNotMatch(js,/section\('rituais','Rituais','rituais',rituals\)}<button/);
});
test('topo mobile tem menu utilitário e estrutura compacta',()=>{
 assert.match(html,/id="op-mobile-tools"/);
 assert.match(js,/action==='toggle-tools'/);
 assert.match(css,/\.op-topactions\.is-open\{display:flex\}/);
 assert.match(css,/\.op-campaign-bar\{display:grid;grid-template-columns/);
 assert.match(css,/\.op-agent-list\{grid-column:1;grid-row:1/);
});

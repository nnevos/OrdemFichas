const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'js/app/auth-character.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/character.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(v,msg){ if(!v) throw new Error(msg); }
ok(js.includes('edf-origin-summary'),'origem precisa renderizar descricao visivel');
ok(js.includes('edf-origin-details'),'origem precisa renderizar mecanicas visiveis');
ok(js.includes('edf-trail-abilities'),'trilha precisa usar layout robusto de habilidades');
ok(js.includes('level-number-trigger'),'nivel precisa ser um acionador clicavel');
ok(js.includes("closest('#char-level-picker')"),'nivel precisa ter delegacao de clique');
ok(js.includes("'arcanista':'arcanista-elemental'"),'progressao deve resolver classe sem depender do RuleBook');
ok(css.includes('grid-auto-rows:max-content'),'lista do picker nao pode achatar cards');
ok(css.includes('.edf-origin-summary,.edf-trail-summary{display:block!important'),'descricao da origem nao pode ser ocultada');
ok(html.includes('auth-character.js?v=15.42'),'cache bust do JS deve ser 15.42');
console.log('character-v15-34-picker-level-regression: ok');

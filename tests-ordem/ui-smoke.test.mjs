import test from 'node:test';
import assert from 'node:assert/strict';

const elements=new Map();
const elementListeners=new Map();
const el=id=>{
 if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,addEventListener(name,fn){elementListeners.set(`${id}:${name}`,fn)},setAttribute(){},classList:{add(){},remove(){},toggle(){}}});
 return elements.get(id);
};
const listeners=new Map();
globalThis.document={getElementById:el,addEventListener:(name,fn)=>listeners.set(name,fn),querySelector:()=>({value:'1'}),activeElement:{matches:()=>false}};
globalThis.window={addEventListener:(name,fn)=>listeners.set(`window:${name}`,fn)};
const cache=new Map();
globalThis.localStorage={getItem:key=>cache.get(key)||null,setItem:(key,value)=>cache.set(key,value)};
globalThis.confirm=()=>true;
globalThis.URL={createObjectURL:()=>'',revokeObjectURL:()=>{}};
globalThis.Blob=class{constructor(){}};
const click=(action,data={})=>listeners.get('click')({target:{closest:()=>({dataset:{action,...data}})}});

test('entrada exibe campanhas e permite criar sem login',async()=>{
 await import('../ordem/main.mjs?test-ui-v2');
 await new Promise(resolve=>setTimeout(resolve,0));
 assert.match(el('op-landing').innerHTML,/Suas campanhas/);
 assert.match(el('op-landing').innerHTML,/Criar campanha/);
 el('campaign-name').value='Investigação de Teste';
 await elementListeners.get('op-landing:submit')({target:{id:'op-create-form'},preventDefault(){}});
 assert.match(el('op-campaign-title').textContent,/Investigação de Teste/);
 assert.match(el('op-hero').innerHTML,/Nenhuma ficha ainda/);
});
test('criar ficha e modificar recursos no painel do mestre',()=>{
 click('new');
 assert.match(el('op-content').innerHTML,/Identidade do agente/);
 assert.match(el('op-hero').innerHTML,/PONTOS DE VIDA/);
 click('master');
 assert.match(el('op-content').innerHTML,/Agente 1/);
 assert.match(el('op-content').innerHTML,/Defesa/);
 const first=JSON.parse(cache.get('ordem-paranormal-campaigns-v2')).characters[0];
 click('quick-resource',{id:first.id,resource:'pv',mode:'spend'});
 assert.match(el('op-content').innerHTML,/19 \/ 21|20 \/ 21/);
});
test('edicao de ficha atualiza a visao mestre e isola campanhas',async()=>{
 click('sheets');
 listeners.get('change')({target:{dataset:{path:'name'},value:'Agente Aurora',type:'text'}});
 click('master');
 assert.match(el('op-content').innerHTML,/Agente Aurora/);
 click('home');
 assert.match(el('op-landing').innerHTML,/Investigação de Teste/);
 assert.match(el('op-landing').innerHTML,/1 ficha\(s\)/);
 el('campaign-name').value='Outra missão';
 await elementListeners.get('op-landing:submit')({target:{id:'op-create-form'},preventDefault(){}});
 assert.match(el('op-hero').innerHTML,/Nenhuma ficha ainda/);
 click('new');
 assert.doesNotMatch(el('character-list').innerHTML,/Agente Aurora/);
 click('home');
 assert.match(el('op-landing').innerHTML,/Outra missão/);
});

import test from 'node:test';
import assert from 'node:assert/strict';

const elements=new Map();
const elementListeners=new Map();
const el=id=>{
 if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',hidden:false,addEventListener(name,fn){elementListeners.set(`${id}:${name}`,fn)},setAttribute(){},classList:{add(){},remove(){},toggle(){}}});
 return elements.get(id);
};
const listeners=new Map();
globalThis.document={getElementById:el,addEventListener:(name,fn)=>listeners.set(name,fn),querySelector:()=>({value:'1'}),activeElement:{matches:()=>false},body:{classList:{toggle(){}},appendChild(){}},createElement:()=>({innerHTML:''})};
globalThis.window={addEventListener:(name,fn)=>listeners.set(`window:${name}`,fn),scrollTo(){}};
const cache=new Map();
globalThis.localStorage={getItem:key=>cache.get(key)||null,setItem:(key,value)=>cache.set(key,value)};
globalThis.confirm=()=>true;
globalThis.URL={createObjectURL:()=>'',revokeObjectURL:()=>{}};
globalThis.Blob=class{constructor(){}};
const click=(action,data={})=>listeners.get('click')({target:{closest:()=>({dataset:{action,...data}})}});
const change=(dataset,value,type='text',checked)=>listeners.get('change')({target:{dataset,value,type,checked}});
const saved=()=>JSON.parse(cache.get('ordem-paranormal-campaigns-v2'));

async function createCampaign(name){el('campaign-name').value=name;await elementListeners.get('op-landing:submit')({target:{id:'op-create-form'},preventDefault(){}})}
function createViaWizard(name){
 click('new');
 assert.match(el('op-content').innerHTML,/Criar personagem/);
 assert.equal(saved().characters.length,0,'não salva um personagem vazio');
 change({wizard:'name'},name);click('wizard-next');
 change({wizard:'classId'},'especialista');change({wizard:'origin'},'Investigador');click('wizard-next');
 assert.match(el('op-content').innerHTML,/Distribua seus atributos/);click('wizard-next');
 assert.match(el('op-content').innerHTML,/Treinamento de perícias/);click('wizard-next');
 assert.match(el('op-content').innerHTML,/Habilidades e rituais/);click('wizard-next');
 assert.match(el('op-content').innerHTML,/Conferir antes/);click('wizard-finish');
 assert.equal(saved().characters.length,1);
}

test('campanhas e cadastro guiado sem autenticação nem ficha vazia',async()=>{
 await import('../ordem/main.mjs?test-ui-v4');await new Promise(resolve=>setTimeout(resolve,0));
 assert.match(el('op-landing').innerHTML,/Suas campanhas/);
 await createCampaign('Investigação de Teste');
 assert.match(el('op-hero').innerHTML,/Nenhuma ficha ainda/);
 createViaWizard('Leon Aurora');
 assert.match(el('op-content').innerHTML,/Leon Aurora/);
 assert.match(el('op-content').innerHTML,/overview-rituais/);
});
test('ficha tem todas as informações em uma página e pode editar após criação',()=>{
 const html=el('op-content').innerHTML;
 for(const section of ['Atributos','Perícias','Combate · armas e ataques','Rituais','Habilidades e poderes','Inventário','Descrição e notas'])assert.match(html,new RegExp(section));
 assert.doesNotMatch(html,/data-action="roll"/);
 assert.match(html,/op-physical-dice/);
 assert.match(html,/data-skill="Investigação"/);
 assert.match(html,/data-action="open-ritual-catalog"/);
 click('tab',{tab:'combate'});assert.match(el('op-editor-modal-root').innerHTML,/Armas e ataques/);click('add-attack');
 change({collection:'attacks',i:'0',key:'name'},'Revólver');
 change({collection:'attacks',i:'0',key:'damage'},'2d6');
 click('tab',{tab:'ficha'});
 assert.match(el('op-content').innerHTML,/Revólver/);
 click('tab',{tab:'habilidades'});assert.match(el('op-editor-modal-root').innerHTML,/Editar habilidades/);click('add-ability');
 change({collection:'abilities',i:'0',key:'name'},'Faro para Pistas');
 click('tab',{tab:'ficha'});
 assert.match(el('op-content').innerHTML,/Faro para Pistas/);
});
test('painel do mestre compartilha os recursos de ficha',()=>{
 click('master');
 assert.match(el('op-content').innerHTML,/Leon Aurora/);
 const c=saved().characters[0];
 click('quick-resource',{id:c.id,resource:'pv',mode:'spend'});
 assert.match(el('op-content').innerHTML,/16 \/ 17/);
 click('select',{id:c.id});
 assert.match(el('op-content').innerHTML,/VIDA/);
});
test('campanhas isolam fichas e o assistente pode ser cancelado',async()=>{
 click('home');assert.match(el('op-landing').innerHTML,/1 ficha\(s\)/);
 await createCampaign('Outra campanha');
 click('new');click('wizard-cancel');
 assert.equal(saved().characters.length,1);
 assert.doesNotMatch(el('character-list').innerHTML,/Leon Aurora/);
 click('home');assert.match(el('op-landing').innerHTML,/Outra campanha/);
});

test('modal de rituais filtra por círculo e apresenta resumo expansível',()=>{
 click('home');click('open-campaign',{id:saved().campaigns[0].id});
 click('open-ritual-catalog');
 assert.match(el('op-ritual-modal-root').innerHTML,/Adicionar rituais/);
 assert.match(el('op-ritual-modal-root').innerHTML,/Tecer Ilusão/);
 click('ritual-filter-circle',{circle:'4'});
 assert.match(el('op-ritual-modal-root').innerHTML,/Alterar Destino/);
 click('ritual-expand',{id:'ritual-1'});
 click('ritual-filter-circle',{circle:'1'});
 click('ritual-expand',{id:'ritual-1'});
 assert.match(el('op-ritual-modal-root').innerHTML,/Referência:/);
 click('ritual-pick',{id:'ritual-1'});
 assert.ok(saved().characters.some(c=>c.rituals?.some(r=>r.catalogId==='ritual-1')));
 click('close-ritual-catalog');
 assert.equal(el('op-ritual-modal-root').innerHTML,'');
});

test('catálogo de equipamentos abre em popup, permite expandir e adicionar',()=>{
 click('open-weapon-catalog');
 const modal=el('op-equipment-modal-root');
 assert.match(modal.innerHTML,/Adicionar armas/);
 assert.match(modal.innerHTML,/Faca/);
 click('equipment-expand',{id:'arma-2'});
 assert.match(modal.innerHTML,/Dano/);
 click('equipment-pick',{id:'arma-2'});
 assert.ok(saved().characters.some(c=>c.items?.some(x=>x.catalogId==='arma-2')));
 click('close-equipment-catalog');
 assert.equal(modal.innerHTML,'');
 assert.match(el('op-content').innerHTML,/overview-combate/);
 assert.match(el('op-content').innerHTML,/Faca/);
 click('open-equipment-catalog');
 assert.match(modal.innerHTML,/Adicionar itens e equipamentos/);
 assert.doesNotMatch(modal.innerHTML,/data-id="arma-2"/);
 click('close-equipment-catalog');
});
test('visualização não usa rolagem eletrônica e mantém dados físicos',()=>{
 click('tab',{tab:'ficha'});
 const html=el('op-content').innerHTML;
 assert.match(html,/d20 \(maior\)/);
 assert.doesNotMatch(html,/data-action="roll"/);
 assert.match(html,/open-equipment-catalog/);
});

test('catalogo de habilidades abre, filtra, expande e adiciona sem fechar',()=>{
 click('open-ability-catalog');
 const modal=el('op-ability-modal-root');
 assert.match(modal.innerHTML,/Adicionar habilidades/);
 assert.match(modal.innerHTML,/Combatente|Especialista/);
 click('ability-group',{group:'Combatente'});
 assert.match(modal.innerHTML,/Armamento Pesado/);
 click('ability-expand',{id:'habilidade-2'});
 // Busca por nome precisa continuar visivel e a janela aberta apos a selecao.
 assert.match(modal.innerHTML,/Concede proficiência com armas pesadas/);
 click('ability-pick',{id:'habilidade-2'});
 assert.match(modal.innerHTML,/✓/);
 assert.ok(saved().characters[0].abilities.some(x=>x.catalogId==='habilidade-2'));
 click('close-ability-catalog');
 assert.equal(modal.innerHTML,'');
});

test('atributos e defesa podem ser modificados diretamente na ficha',()=>{
 click('tab',{tab:'ficha'});
 let html=el('op-content').innerHTML;
 assert.match(html,/data-path="attrs.agi"/);
 assert.match(html,/data-final-stat="defenseOverride"/);
 change({path:'attrs.agi'},'4','number');
 change({finalStat:'defenseOverride'},'19','number');
 change({finalStat:'dodgeOverride'},'23','number');
 change({finalStat:'blockOverride'},'5','number');
 html=el('op-content').innerHTML;
 assert.match(html,/value="4" aria-label="Editar Agilidade/);
 assert.match(html,/data-final-stat="defenseOverride" value="19"/);
 assert.match(html,/data-final-stat="dodgeOverride" value="23"/);
 assert.match(html,/data-final-stat="blockOverride" value="5"/);
 click('reset-final-stat',{stat:'defenseOverride'});
 assert.equal(saved().characters[0].defenseOverride,null);
});

test('armas ficam no combate e itens comuns no inventario com notas',()=>{
 click('tab',{tab:'ficha'});
 const source=saved().characters[0];
 assert.ok(source.items?.some(x=>x.catalogId==='arma-2'));
 const html=el('op-content').innerHTML;
 const combat=html.split('id="overview-combate"')[1].split('id="overview-rituais"')[0];
 const inventory=html.split('id="overview-inventario"')[1].split('id="overview-historia"')[0];
 assert.match(combat,/Faca/);
 assert.match(combat,/Dano/);
 assert.doesNotMatch(inventory,/strong>Faca/);
 assert.match(inventory,/data-path="inventoryNotes"/);
 change({path:'inventoryNotes'},'Lanterna, pistas e munições');
 assert.equal(saved().characters[0].inventoryNotes,'Lanterna, pistas e munições');
});

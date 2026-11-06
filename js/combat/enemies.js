// =========================================================
// COMBATE SIMPLES V3 — inimigos, PV e acoes Nome/Dano/Efeito
// =========================================================
function normalizeEnemyActionV3(action, fallback='Ação') {
  if (!action) return { name:fallback, damage:'', effect:'', action:'Ação Padrão' };
  if (typeof action === 'string') {
    const parts=action.split('|').map(x=>x.trim());
    return {name:parts[0]||fallback,damage:parts[1]||'',effect:parts.slice(2).join(' | ')||'',action:'Ação Padrão'};
  }
  return {
    ...action,
    name: action.name || action.nome || fallback,
    damage: action.damage || action.dano || '',
    effect: action.effect || action.efeito || action.desc || '',
    action: action.action || action.acao || 'Ação Padrão',
    source: action.source || '',
    element: action.element || action.elemento || '',
    path: action.path || action.caminho || '',
    res: Number(action.res ?? action.grade ?? 0) || 0,
    type: action.type || action.tipo || '',
    range: action.range || action.alcance || '',
    prereq: action.prereq || action.requisito || '',
    desc: action.desc || action.description || '',
    test: action.test || action.teste || action.attack || action.ataque || '',
    appliesConditions: Array.isArray(action.appliesConditions)?action.appliesConditions:[],
    conditionRounds: Math.max(0,Number(action.conditionRounds)||0)
  };
}
function normalizeEnemyActionsV3(list, fallback='Ação') {
  return (Array.isArray(list)?list:[]).map(x=>normalizeEnemyActionV3(x,fallback)).filter(x=>x.name);
}
function renderEnemyActionEditorV3(kind, actions=[]) {
  const title=kind==='attack'?'Ataques':'Habilidades';
  const singular=kind==='attack'?'Ataque':'Habilidade';
  const rows=normalizeEnemyActionsV3(actions,singular);
  const controls=kind==='ability'
    ? `<div class="enemy-action-editor-tools"><button type="button" class="enemy-tree-pick-button" data-click-call="openEnemySkillTreePicker()">✦ Adicionar da Árvore</button><button type="button" data-click-call="addEnemyActionRowV3(this,'${kind}')">+ Manual</button></div>`
    : `<button type="button" data-click-call="addEnemyActionRowV3(this,'${kind}')">+ ${singular}</button>`;
  return `<section class="enemy-action-editor-block"><div class="enemy-action-editor-head"><div><strong>${title}</strong><small>${kind==='ability'?'Use habilidades oficiais da Skill Tree ou cadastre uma habilidade própria.':'Cadastre nome, tipo de ação, dano e efeito.'}</small></div>${controls}</div><div class="enemy-action-editor-list" data-action-list="${kind}">${rows.map(a=>renderEnemyActionRowV3(kind,a)).join('')}</div></section>`;
}
function renderEnemyActionRowV3(kind,a={}) {
  const x=normalizeEnemyActionV3(a,kind==='attack'?'Ataque':'Habilidade');
  const actionOptions=['Ação Padrão','Ação de Movimento','Ação Livre','Ação Leve','Reação','Passivo'].map(v=>`<option ${String(x.action||'Ação Padrão')===v?'selected':''}>${v}</option>`).join('');
  const metadata={source:x.source||'',element:x.element||'',path:x.path||'',res:x.res,type:x.type||'',range:x.range,prereq:x.prereq||'',desc:x.desc||'',test:x.test||'',appliesConditions:Array.isArray(x.appliesConditions)?x.appliesConditions:[],conditionRounds:Math.max(0,Number(x.conditionRounds)||0)};
  const encoded=escapeAttr(JSON.stringify(metadata));
  const badge=x.source==='skill-tree'?`<div class="enemy-tree-source"><span>SKILL TREE</span><b>${escapeHtml(x.element||'Universal')} · RES ${Number(x.res)||0}</b>${x.path?`<small>${escapeHtml(x.path)}</small>`:''}</div>`:'';
  return `<div class="enemy-action-editor-row ${x.source==='skill-tree'?'from-skill-tree':''}" data-kind="${kind}" data-skill-meta="${encoded}">${badge}<label>Nome<input name="${kind}_name" value="${escapeAttr(x.name||'')}" placeholder="Ex.: Machado Glacial"></label><label>Ação<select name="${kind}_action">${actionOptions}</select></label><label>Dano<input name="${kind}_damage" value="${escapeAttr(x.damage||'')}" placeholder="Ex.: 2d8+4"></label><label class="enemy-action-effect-field">Efeito<input name="${kind}_effect" value="${escapeAttr(x.effect||'')}" placeholder="Ex.: deixa Lento por 1 rodada"></label><button type="button" class="danger-text enemy-action-remove" data-click-call="this.closest('.enemy-action-editor-row').remove()" title="Remover">✕</button></div>`;
}
window.addEnemyActionRowV3=function(button,kind){
  const block=button.closest('.enemy-action-editor-block');
  const list=block?.querySelector(`[data-action-list="${kind}"]`); if(!list)return;
  list.insertAdjacentHTML('beforeend',renderEnemyActionRowV3(kind,{name:'',damage:'',effect:''}));
};
function collectEnemyActionsV3(form,kind){
  const rows=[...form.querySelectorAll(`.enemy-action-editor-row[data-kind="${kind}"]`)];
  return rows.map(row=>{
    let meta={};try{meta=JSON.parse(row.dataset.skillMeta||'{}')||{};}catch(_){meta={};}
    return {
      ...meta,
      name:row.querySelector(`[name="${kind}_name"]`)?.value.trim()||'',
      action:row.querySelector(`[name="${kind}_action"]`)?.value||'Ação Padrão',
      damage:row.querySelector(`[name="${kind}_damage"]`)?.value.trim()||'',
      effect:row.querySelector(`[name="${kind}_effect"]`)?.value.trim()||''
    };
  }).filter(x=>x.name);
}


let enemySkillTreePickerFilter={q:'',element:'all',grade:'all'};
let enemySkillTreeParentEditorId='';
function suspendEnemyEditorForTreePicker(editor){
  if(!editor)return;
  enemySkillTreeParentEditorId=editor.id||'';
  editor.classList.add('picker-suspended');
  editor.setAttribute('aria-hidden','true');
  try{editor.inert=true;}catch(_){/* navegador antigo */}
}
function restoreEnemyEditorAfterTreePicker(){
  const editor=enemySkillTreeParentEditorId?document.getElementById(enemySkillTreeParentEditorId):null;
  if(editor){
    editor.classList.remove('picker-suspended');
    editor.removeAttribute('aria-hidden');
    try{editor.inert=false;}catch(_){/* navegador antigo */}
    const trigger=editor.querySelector('.enemy-tree-pick-button');
    requestAnimationFrame(()=>trigger?.focus?.());
  }
  enemySkillTreeParentEditorId='';
}
function enemySkillTreeCatalogV4(){
  const out=[];
  if(typeof SKILLS!=='object'||!SKILLS)return out;
  Object.entries(SKILLS).forEach(([element,tree])=>{
    (tree?.paths||[]).forEach((path,pathIndex)=>{
      (path?.skills||[]).forEach((skill,skillIndex)=>{
        const enriched={...skill,element,path:path?.name||'',source:'skill-tree'};
        const action=window.EDFCombatRules?.actionInfo?.(enriched)?.label||skill.action||'Ação Padrão';
        const damage=window.EDFCombatRules?.damageFormulaForSkill?.(enriched)||'';
        out.push({key:`${element}:${pathIndex}:${skillIndex}`,element,path:path?.name||'',skill:{...enriched,action,damage,effect:skill.effect||skill.desc||''}});
      });
    });
  });
  return out;
}
function enemySkillTreeCardV4(entry){
  const s=entry.skill,resolution=window.EDFCombatRules?.resolutionInfo?.(s)||{};
  return `<article class="enemy-tree-skill-card" data-tree-skill-card data-tree-search="${escapeAttr([s.name,s.desc,s.effect,entry.path,entry.element].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR'))}" data-tree-element="${escapeAttr(entry.element)}" data-tree-grade="${Number(s.res)||0}"><header><div><span>${escapeHtml(entry.element.toUpperCase())} · ${escapeHtml(entry.path)}</span><h4>${escapeHtml(s.name)}</h4></div><b>RES ${Number(s.res)||0}</b></header><p>${escapeHtml(s.desc||'')}</p><div class="enemy-tree-skill-meta"><span>${escapeHtml(s.type||'Habilidade')}</span><span>${escapeHtml(s.range||'—')}</span><span>${escapeHtml(s.action||'Ação Padrão')}</span>${s.damage?`<strong>🎲 ${escapeHtml(s.damage)}</strong>`:''}</div><small>${escapeHtml(s.effect||'')}</small><footer><em>${escapeHtml(resolution.label||'')}</em><button type="button" class="primary-action" data-click-call="addEnemySkillTreeAbility('${escapeAttr(entry.key)}')">Adicionar</button></footer></article>`;
}
window.openEnemySkillTreePicker=function(){
  const editor=document.getElementById('bestiary-editor')||document.getElementById('enemy-editor');
  if(!editor)return alert('Abra a ficha do inimigo antes de selecionar habilidades.');
  enemySkillTreePickerFilter={q:'',element:'all',grade:'all'};
  const catalog=enemySkillTreeCatalogV4();
  document.getElementById('enemy-skill-tree-picker')?.remove();
  suspendEnemyEditorForTreePicker(editor);
  const elements=['all',...new Set(catalog.map(x=>x.element))];
  document.body.insertAdjacentHTML('beforeend',`<div id="enemy-skill-tree-picker" class="picker-modal enemy-skill-tree-picker"><button class="picker-backdrop" data-click-call="closeEnemySkillTreePicker()" aria-label="Voltar à ficha do inimigo"></button><div class="picker-panel enemy-skill-tree-panel" role="dialog" aria-modal="true" aria-label="Adicionar habilidade da Skill Tree"><div class="picker-head"><div><span class="section-eyebrow">SKILL TREE EDF</span><h3>Adicionar habilidade ao inimigo</h3><small>A ficha fica pausada enquanto você escolhe. Ao voltar, todas as habilidades adicionadas continuam nela.</small></div><button type="button" class="enemy-tree-back-button" data-click-call="closeEnemySkillTreePicker()">← Voltar à ficha</button></div><div class="enemy-tree-toolbar"><label class="enemy-tree-search">🔎<input autofocus placeholder="Buscar habilidade, caminho ou efeito..." data-input-call="filterEnemySkillTreePicker('q',this.value)"></label><div class="enemy-tree-filters">${elements.map(x=>`<button type="button" data-tree-filter="element:${escapeAttr(x)}" class="${x==='all'?'active':''}" data-click-call="filterEnemySkillTreePicker('element','${escapeAttr(x)}')">${x==='all'?'Todos':escapeHtml(x)}</button>`).join('')}</div><div class="enemy-tree-filters grades">${['all','1','2','3','4'].map(x=>`<button type="button" data-tree-filter="grade:${x}" class="${x==='all'?'active':''}" data-click-call="filterEnemySkillTreePicker('grade','${x}')">${x==='all'?'Todos os graus':'RES '+x}</button>`).join('')}</div></div><div class="enemy-tree-skill-grid">${catalog.map(enemySkillTreeCardV4).join('')}</div></div></div>`);
  requestAnimationFrame(()=>document.querySelector('#enemy-skill-tree-picker .enemy-tree-search input')?.focus?.());
};
window.closeEnemySkillTreePicker=function(){
  document.getElementById('enemy-skill-tree-picker')?.remove();
  restoreEnemyEditorAfterTreePicker();
};
window.filterEnemySkillTreePicker=function(kind,value){
  if(kind==='q')enemySkillTreePickerFilter.q=String(value||'').trim().toLocaleLowerCase('pt-BR');
  else enemySkillTreePickerFilter[kind]=String(value||'all');
  document.querySelectorAll('#enemy-skill-tree-picker [data-tree-filter]').forEach(btn=>{const [k,v]=String(btn.dataset.treeFilter||'').split(':');btn.classList.toggle('active',k===kind&&v===String(value));});
  const {q,element,grade}=enemySkillTreePickerFilter;
  document.querySelectorAll('#enemy-skill-tree-picker [data-tree-skill-card]').forEach(card=>{card.hidden=!!((q&&!String(card.dataset.treeSearch||'').includes(q))||(element!=='all'&&card.dataset.treeElement!==element)||(grade!=='all'&&card.dataset.treeGrade!==grade));});
};
window.addEnemySkillTreeAbility=function(key){
  const entry=enemySkillTreeCatalogV4().find(x=>x.key===key);if(!entry)return;
  const editor=document.getElementById('bestiary-editor')||document.getElementById('enemy-editor');
  const list=editor?.querySelector('[data-action-list="ability"]');if(!list)return;
  const normalizedName=String(entry.skill.name||'').trim().toLocaleLowerCase('pt-BR');
  const duplicate=[...list.querySelectorAll('.enemy-action-editor-row')].some(row=>String(row.querySelector('[name="ability_name"]')?.value||'').trim().toLocaleLowerCase('pt-BR')===normalizedName);
  if(duplicate)return alert('Esta habilidade já está na ficha do inimigo.');
  list.insertAdjacentHTML('beforeend',renderEnemyActionRowV3('ability',entry.skill));
  const button=document.querySelector(`#enemy-skill-tree-picker [data-click-call="addEnemySkillTreeAbility('${CSS.escape(key)}')"]`);
  if(button){button.disabled=true;button.textContent='✓ Adicionada';}
};

function enemyImageEditorV3(imageUrl=''){
  return `<section class="enemy-image-editor"><div class="enemy-image-preview">${imageUrl?`<img src="${escapeAttr(imageUrl)}" alt="Imagem atual do inimigo">`:'👹'}</div><div><label>Imagem do inimigo<input name="image_file" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><label>ou URL da imagem<input name="image_url" type="url" value="${escapeAttr(imageUrl||'')}" placeholder="https://..."></label><small>PNG, JPG, WEBP ou GIF · até 5 MB. A imagem aparece no Bestiário, combate e token da Mesa.</small></div></section>`;
}
function bindEnemyImagePreviewV3(modalId){
  const root=document.getElementById(modalId);if(!root)return;
  const preview=root.querySelector('.enemy-image-preview'),file=root.querySelector('[name="image_file"]'),url=root.querySelector('[name="image_url"]');
  const show=src=>{if(!preview)return;preview.innerHTML=src?`<img src="${escapeAttr(src)}" alt="Prévia da imagem do inimigo">`:'👹';};
  file?.addEventListener('change',()=>{const f=file.files?.[0];if(!f)return;const objectUrl=URL.createObjectURL(f);show(objectUrl);setTimeout(()=>URL.revokeObjectURL(objectUrl),60000);});
  url?.addEventListener('change',()=>show(url.value.trim()));
}

async function resolveEnemyImageV3(form,currentUrl=''){
  const file=form.querySelector('[name="image_file"]')?.files?.[0];
  const typed=String(new FormData(form).get('image_url')||'').trim();
  if(!file)return typed||currentUrl||'';
  if(!file.type?.startsWith('image/'))throw new Error('Selecione um arquivo de imagem válido.');
  if(file.size>5*1024*1024)throw new Error('A imagem do inimigo deve ter no máximo 5 MB.');
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
  const path=`${currentUser.id}/enemy-${Date.now()}.${ext}`;
  const up=await supabaseClient.storage.from('avatars').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
  if(up.error)throw up.error;
  return supabaseClient.storage.from('avatars').getPublicUrl(path).data?.publicUrl||typed||currentUrl||'';
}

function renderEnemyActionButtonV3(enemy,kind,action,index){
  const a=normalizeEnemyActionV3(action,kind==='attack'?'Ataque':'Habilidade');
  const visible=currentRole==='admin'||enemyVisible(enemy,kind==='attack'?'attacks':'abilities');
  if(!visible)return '';
  if(currentRole==='admin') return `<button class="enemy-action-use-card" data-click-call="event.stopPropagation();useEnemyManualAction('${enemy.id}','${kind}',${index})"><strong>${escapeHtml(a.name)}</strong>${a.damage?`<span>🎲 ${escapeHtml(a.damage)}</span>`:''}${a.effect?`<small>${escapeHtml(a.effect)}</small>`:''}<b>Usar →</b></button>`;
  return `<div class="enemy-action-public-card"><strong>${escapeHtml(a.name)}</strong>${a.damage?`<span>${escapeHtml(a.damage)}</span>`:''}${a.effect?`<small>${escapeHtml(a.effect)}</small>`:''}</div>`;
}

window.openEnemyEditor=function(id=''){
  const e=battleEnemies.find(x=>String(x.id)===String(id))||{visibility:{name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false},conditions:[],attacks:[],abilities:[]};
  document.getElementById('enemy-editor')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="enemy-editor" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('enemy-editor').remove()"></button><form class="picker-panel enemy-editor enemy-editor-v3" data-submit-call="saveEnemyV3(event,'${escapeAttr(id)}')"><div class="picker-head"><div><span class="section-eyebrow">INIMIGO NO COMBATE</span><h3>${id?'Editar':'Criar'} inimigo</h3><small>Edite PV e ações sem sair do combate.</small></div><button type="button" data-click-call="document.getElementById('enemy-editor').remove()">✕</button></div><label>Nome<input name="name" required value="${escapeAttr(e.name||'')}"></label><label>Subtítulo<input name="subtitle" value="${escapeAttr(e.subtitle||'')}"></label>${enemyImageEditorV3(e.image_url||'')}<div class="enemy-form-grid"><label>PV atual<input name="hp_current" type="number" value="${e.hp_current??10}"></label><label>PV máximo<input name="hp_max" type="number" value="${e.hp_max??10}"></label><label>Defesa<input name="defense" type="number" value="${e.defense??10}"></label><label>Esquiva<input name="dodge" type="number" value="${e.dodge??0}"></label><label>Armadura<input name="block" type="number" value="${e.block??0}"></label><label>RD<input name="damage_reduction" type="number" value="${e.damage_reduction??0}"></label><label>Deslocamento<input name="movement_speed" type="number" step="0.5" value="${e.movement_speed??9}"></label></div><label>Condições (vírgula)<input name="conditions" value="${escapeAttr((e.conditions||[]).join(', '))}"></label>${renderEnemyActionEditorV3('attack',e.attacks)}${renderEnemyActionEditorV3('ability',e.abilities)}<fieldset><legend>Visível para jogadores</legend>${[['name','Nome'],['hp','Barra de PV'],['hp_numbers','PV numérico'],['conditions','Condições'],['defense','Defesa'],['dodge','Esquiva'],['block','Armadura'],['movement','Deslocamento'],['attacks','Ataques'],['abilities','Habilidades']].map(([k,l])=>`<label class="check-row"><input type="checkbox" name="vis_${k}" ${e.visibility?.[k]!==false?'checked':''}> ${l}</label>`).join('')}</fieldset><div class="enemy-editor-actions"><button class="primary-action" type="submit">Salvar alterações</button>${id?`<button class="danger-action" type="button" data-click-call="deleteEnemy('${id}')">Remover do combate</button>`:''}</div></form></div>`);
  bindEnemyImagePreviewV3('enemy-editor');
};
window.saveEnemyV3=async function(ev,id){
  ev.preventDefault(); const form=ev.currentTarget,f=new FormData(form),visibility={};
  ['name','hp','hp_numbers','conditions','defense','dodge','block','movement','attacks','abilities'].forEach(k=>visibility[k]=f.get('vis_'+k)==='on');
  let imageUrl='';try{imageUrl=await resolveEnemyImageV3(form,battleEnemies.find(x=>String(x.id)===String(id))?.image_url||'');}catch(err){return alert('Erro na imagem do inimigo:\n'+err.message);}
  const payload={battle_id:activeBattle?.id,name:f.get('name')||'Inimigo',subtitle:f.get('subtitle')||'',image_url:imageUrl,hp_current:+f.get('hp_current')||0,hp_max:Math.max(1,+f.get('hp_max')||1),defense:+f.get('defense')||0,dodge:+f.get('dodge')||0,block:+f.get('block')||0,damage_reduction:+f.get('damage_reduction')||0,movement_speed:+f.get('movement_speed')||0,conditions:String(f.get('conditions')||'').split(',').map(x=>x.trim()).filter(Boolean),attacks:collectEnemyActionsV3(form,'attack'),abilities:collectEnemyActionsV3(form,'ability'),visibility};
  const q=id?supabaseClient.from('battle_enemies').update(payload).eq('id',id):supabaseClient.from('battle_enemies').insert(payload);
  const {error}=await q;if(error)return alert('Erro ao salvar inimigo:\n'+error.message);
  if(id&&payload.image_url){
    try{await supabaseClient.from('tabletop_entities').update({image_url:payload.image_url}).eq('battle_entity_id',String(id));TabletopStore?.state?.entities?.filter?.(e=>String(e.battle_entity_id)===String(id)).forEach(e=>TabletopStore.upsertEntity({...e,image_url:payload.image_url}));}catch(_){ }
  }
  document.getElementById('enemy-editor')?.remove(); await logBattle(`${payload.name} foi ${id?'editado':'adicionado'} no combate`,'enemy'); scheduleCombatSync(30);
};

window.openBestiaryEditor=function(id=''){
  const e=masterBestiaryCache.find(x=>String(x.id)===String(id))||{visibility:{name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false},conditions:[],attacks:[],abilities:[]};
  document.getElementById('bestiary-editor')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="bestiary-editor" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('bestiary-editor').remove()"></button><form class="picker-panel bestiary-editor enemy-editor-v3" data-submit-call="saveBestiaryV3(event,'${escapeAttr(id)}')"><div class="picker-head"><div><span class="section-eyebrow">BESTIÁRIO</span><h3>${id?'Editar':'Novo'} inimigo</h3><small>Ataques e habilidades simples: Nome • Dano • Efeito.</small></div><button type="button" data-click-call="document.getElementById('bestiary-editor').remove()">✕</button></div><label>Nome<input name="name" required value="${escapeAttr(e.name||'')}"></label><label>Subtítulo<input name="subtitle" value="${escapeAttr(e.subtitle||'')}"></label>${enemyImageEditorV3(e.image_url||'')}<div class="enemy-form-grid"><label>PV máximo<input name="hp_max" type="number" value="${e.hp_max??10}"></label><label>Defesa<input name="defense" type="number" value="${e.defense??10}"></label><label>Esquiva<input name="dodge" type="number" value="${e.dodge??0}"></label><label>Armadura<input name="block" type="number" value="${e.block??0}"></label><label>RD<input name="damage_reduction" type="number" value="${e.damage_reduction??0}"></label><label>Deslocamento<input name="movement_speed" type="number" step="0.5" value="${e.movement_speed??9}"></label><label>Nível<input name="level" type="number" value="${e.level??1}"></label></div><div class="enemy-form-grid"><label>Categoria<select name="rank">${['comum','elite','chefe'].map(x=>`<option value="${x}" ${(e.rank||'comum')===x?'selected':''}>${x[0].toUpperCase()+x.slice(1)}</option>`).join('')}</select></label><label>Elemento<input name="element" value="${escapeAttr(e.element||'')}"></label></div><label>Condições padrão (vírgula)<input name="conditions" value="${escapeAttr((e.conditions||[]).join(', '))}"></label>${renderEnemyActionEditorV3('attack',e.attacks)}${renderEnemyActionEditorV3('ability',e.abilities)}<label>Notas privadas<textarea name="notes">${escapeHtml(e.notes||'')}</textarea></label><fieldset><legend>Visível para jogadores</legend>${[['name','Nome'],['hp','Barra de PV'],['hp_numbers','PV numérico'],['conditions','Condições'],['defense','Defesa'],['dodge','Esquiva'],['block','Armadura'],['movement','Deslocamento'],['attacks','Ataques'],['abilities','Habilidades']].map(([k,l])=>`<label class="check-row"><input type="checkbox" name="vis_${k}" ${e.visibility?.[k]!==false?'checked':''}> ${l}</label>`).join('')}</fieldset><div class="enemy-editor-actions"><button class="primary-action" type="submit">Salvar no bestiário</button>${id?`<button class="danger-action" type="button" data-click-call="deleteBestiary('${escapeAttr(id)}')">Excluir do bestiário</button>`:''}</div></form></div>`);
  bindEnemyImagePreviewV3('bestiary-editor');
};
window.saveBestiaryV3=async function(ev,id){
  ev.preventDefault();const form=ev.currentTarget,f=new FormData(form),visibility={};
  ['name','hp','hp_numbers','conditions','defense','dodge','block','movement','attacks','abilities'].forEach(k=>visibility[k]=f.get('vis_'+k)==='on');
  let imageUrl='';try{imageUrl=await resolveEnemyImageV3(form,masterBestiaryCache.find(x=>String(x.id)===String(id))?.image_url||'');}catch(err){return alert('Erro na imagem do inimigo:\n'+err.message);}
  const payload={owner_id:currentUser.id,name:f.get('name')||'Inimigo',subtitle:f.get('subtitle')||'',image_url:imageUrl,hp_max:Math.max(1,+f.get('hp_max')||1),defense:+f.get('defense')||0,dodge:+f.get('dodge')||0,block:+f.get('block')||0,damage_reduction:+f.get('damage_reduction')||0,movement_speed:+f.get('movement_speed')||0,level:Math.max(1,+f.get('level')||1),rank:f.get('rank')||'comum',element:f.get('element')||'',conditions:String(f.get('conditions')||'').split(',').map(x=>x.trim()).filter(Boolean),attacks:collectEnemyActionsV3(form,'attack'),abilities:collectEnemyActionsV3(form,'ability'),notes:f.get('notes')||'',visibility};
  const q=id?supabaseClient.from('enemy_templates').update(payload).eq('id',id).select().single():supabaseClient.from('enemy_templates').insert(payload).select().single();
  const {data,error}=await q;if(error)return alert('Erro ao salvar bestiário\n'+error.message);
  if(data){const idx=masterBestiaryCache.findIndex(x=>String(x.id)===String(data.id));if(idx>=0)masterBestiaryCache[idx]=data;else masterBestiaryCache.push(data);masterBestiaryCache.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR'));try{await supabaseClient.from('tabletop_entities').update({image_url:data.image_url||null,label:data.name||'Inimigo'}).eq('source_type','enemy_template').eq('source_id',String(data.id));TabletopStore?.state?.entities?.filter?.(e=>e.source_type==='enemy_template'&&String(e.source_id)===String(data.id)).forEach(e=>TabletopStore.upsertEntity({...e,image_url:data.image_url||null,label:data.name||e.label}));}catch(_){ }}
  document.getElementById('bestiary-editor')?.remove();
  const main=document.getElementById('main-content');
  if(currentTab==='bestiario'&&main){main.innerHTML=renderStandaloneBestiary();window.lucide?.createIcons();window.UiFlow?.commit('bestiario');}
};

window.useEnemyManualAction=function(enemyId,kind,index){
  if(currentRole!=='admin')return;
  const e=battleEnemies.find(x=>String(x.id)===String(enemyId));if(!e)return;
  const list=kind==='ability'?normalizeEnemyActionsV3(e.abilities,'Habilidade'):normalizeEnemyActionsV3(e.attacks,'Ataque');
  const a=list[index];if(!a)return;
  openManualCombatAction({actorType:'enemy',actorId:e.id,actorName:e.name,name:a.name,skill:a,actionKind:kind,action:a.action||'Ação Padrão',testFormula:a.test||a.teste||a.attack||a.ataque||'',damageFormula:a.damage,effect:a.effect,resource:'none',cost:0,effects:window.EDFCombatRules?.effectsForSkill?.(a)||[],isArea:!!window.EDFCombatRules?.isAreaSkill?.(a),resolution:window.EDFCombatRules?.resolutionInfo?.(a)});
};

window.openManualCombatAction=function(options={}){
  if(!activeBattle?.id)return alert('Nenhum combate ativo.');
  const actorType=options.actorType||'player',actorId=String(options.actorId||(actorType==='player'?currentUser?.id:''));
  const actorName=options.actorName||(actorType==='enemy'?(battleEnemies.find(e=>String(e.id)===actorId)?.name||'Inimigo'):(combatPlayersCache.find(p=>String(p.user_id)===actorId)?.name||'Personagem'));
  if(actorType==='enemy'&&currentRole!=='admin')return;
  const targets=manualActionTargets(actorType);if(!targets.length)return alert('Não há alvos disponíveis.');
  const defaultTarget=options.targetType&&options.targetId?`${options.targetType}:${options.targetId}`:findManualTargetDefault(actorType),condition=options.condition||'',resource=options.resource||'pd';
  const selectedTarget=targets.find(t=>`${t.type}:${t.id}`===defaultTarget)||targets[0],actionKind=options.actionKind||'action',counter=actionKind==='counter',playerRow=actorType==='player'?combatPlayersCache.find(p=>String(p.user_id)===actorId):null,enemyRow=actorType==='enemy'?battleEnemies.find(e=>String(e.id)===actorId):null,actorRow=playerRow||enemyRow;
  const skillLike=options.skill||options,info=window.EDFCombatRules?.actionInfo?.(skillLike)||{slot:options.actionSlot||'standard',label:options.actionLabel||'Ação Padrão'},actionSlot=options.actionSlot||info.slot||'standard',actionLabel=options.actionLabel||info.label||'Ação Padrão';
  const cost=Number.isFinite(Number(options.cost))?Math.max(0,Number(options.cost)):Number(window.EDFCombatRules?.pdCost?.(skillLike)||0);
  const derived=actorType==='player'?(window.EDFCombatRules?.derivedModifiers?.(playerRow)||{}):{},autoAttackBonus=actionKind==='attack'?Number(derived.combatAttackBonus||0):0;
  const resonance=options.resonance||window.EDFCombatRules?.resonanceInfo?.(skillLike,actorRow)||{required:false};
  const resolution=options.resolution||window.EDFCombatRules?.resolutionInfo?.(skillLike)||{mode:actionKind==='attack'?'weapon':'automatic',label:'Resolução',damageFormula:''};
  if(actionKind==='attack'&&!resonance.required)resolution.mode='weapon';
  const pontaria=actorType==='player'?(window.EDFCombatRules?.pontariaInfo?.(playerRow)||{total:0,trained:false}):{total:0,trained:false};
  const effects=Array.isArray(options.effects)?options.effects:(window.EDFCombatRules?.effectsForSkill?.(skillLike)||[]),isArea=options.isArea===true||resolution.isArea===true||!!window.EDFCombatRules?.isAreaSkill?.(skillLike);
  const damageFormula=options.damageFormula||resolution.damageFormula||window.EDFCombatRules?.damageFormulaForSkill?.(skillLike)||'';
  const effectRows=effects.map((e,i)=>`<label class="manual-auto-effect ${e.conditional?'conditional':''}"><input type="checkbox" name="effect_apply_${i}" ${e.conditional?'':'checked'}><span><b>${escapeHtml(e.name)}</b><small>${e.requires?`Requer ${escapeHtml(e.requires)} no alvo. `:''}${e.note?escapeHtml(e.note):e.conditional?'Condicional: marque somente se o teste/gatilho da habilidade ocorreu.':'Aplicação objetiva catalogada para esta habilidade.'}${Number(e.rounds)>0?` · ${Number(e.rounds)} rodada(s)`:''}</small></span><input type="hidden" name="effect_name_${i}" value="${escapeAttr(e.name)}"><input type="hidden" name="effect_rounds_${i}" value="${Math.max(0,Number(e.rounds)||0)}"><input type="hidden" name="effect_requires_${i}" value="${escapeAttr(e.requires||'')}"></label>`).join('');
  const resonanceStage=resonance.required?`<section class="manual-roll-stage resonance-stage is-primary-stage"><header><span class="manual-step-number">1</span><div><b>Teste de Ressonância</b><small>Este teste confirma que a habilidade foi executada. PD e ${escapeHtml(actionLabel)} são gastos na tentativa.</small></div></header><div class="resonance-rule-grid"><span>Grau <b>${Number(resonance.grade)||0}</b></span><span>DT <b>${Number(resonance.dt)||0}</b></span><span>Afinidade <b>${resonance.affinity?'Sim · +2 / DT −1':'Não'}</b></span><span>Acerto <b>${resolution.mode==='resonance-hit'?'Ressonância':resolution.mode==='precision'?'Pontaria depois':resolution.mode==='resistance'?'Alvo resiste':'Direto'}</b></span></div><label class="manual-select-field">Atributo usado<select name="resonance_attribute"><option value="INT">Intelecto (INT)</option><option value="PRE">Presença (PRE)</option></select></label><div class="manual-action-grid"><label class="damage-input-big">Total final<input name="resonance_total" type="number" inputmode="numeric" required placeholder="Resultado total"></label><label class="damage-input-big">d20 natural<input name="resonance_natural" type="number" min="1" max="20" inputmode="numeric" required placeholder="1–20"></label></div><small class="resonance-help">Sucesso executa a habilidade. Falha consome ação e PD sem efeito. 20 natural usa a regra de crítico de Ressonância (+50% nos efeitos numéricos).</small></section>`:'';
  let hitStage='';
  if(resolution.mode==='precision')hitStage=`<section class="manual-roll-stage precision-stage"><header><span class="manual-step-number">2</span><div><b>Teste de Pontaria</b><small>A habilidade já foi manifestada. Agora verifique se o disparo atinge o alvo.</small></div></header><div class="manual-resolution-callout"><span>🎯</span><div><b>Pontaria (AGI)${pontaria.total?` +${pontaria.total}`:''}</b><small>${pontaria.trained?'Perícia treinada na ficha.':'Use o valor atual de Pontaria da ficha.'} O resultado é comparado com a Defesa do alvo.</small></div></div><label class="damage-input-big">Resultado de Pontaria<input name="attack_result" type="number" min="0" inputmode="numeric" value="0" required></label><label class="check-row manual-critical-toggle"><input name="attack_critical" type="checkbox"> Ataque considerado crítico <small>Dobre apenas os dados de dano conforme a regra de crítico.</small></label></section>`;
  else if(resolution.mode==='weapon')hitStage=`<section class="manual-roll-stage precision-stage"><header><span class="manual-step-number">1</span><div><b>Teste de ataque</b><small>Use o teste cadastrado para a arma/ataque físico.</small></div></header><div class="manual-dice-reference"><span>Teste da ficha</span><strong>${escapeHtml(options.testFormula||'Conforme a ficha')}</strong></div><label class="damage-input-big">Resultado rolado${autoAttackBonus?' (antes do bônus automático)':''}<input name="attack_result" type="number" min="0" inputmode="numeric" value="0" required><small>${autoAttackBonus?`O sistema soma +${autoAttackBonus}. `:''}Compare com a Defesa do alvo.</small></label><label class="check-row manual-critical-toggle"><input name="attack_critical" type="checkbox"> Ataque considerado crítico <small>Dobre apenas os dados de dano.</small></label></section>`;
  else if(resolution.mode==='resonance-hit')hitStage=`<section class="manual-resolution-callout success-rule"><span>✓</span><div><b>Sem segundo teste de ataque</b><small>Em uma habilidade elemental corpo a corpo, passar na Ressonância já confirma a execução e o acerto. O valor da Ressonância será usado como resultado do ataque quando a reação precisar de uma referência.</small></div></section>`;
  else if(resolution.mode==='resistance')hitStage=`<section class="manual-resolution-callout resistance-rule"><span>🛡</span><div><b>O alvo faz o teste de resistência indicado</b><small>Não role Pontaria. A Ressonância cria a habilidade; depois resolva a resistência descrita no efeito (Força, Vigor, Agilidade, Presença etc.).</small></div></section>`;
  else hitStage=`<section class="manual-resolution-callout success-rule"><span>✓</span><div><b>Aplicação direta após a Ressonância</b><small>Esta habilidade não pede teste de acerto adicional. Resolva dano, cura, defesa ou efeito conforme o texto.</small></div></section>`;
  const damageStep=resolution.mode==='precision'?3:resonance.required?2:resolution.mode==='weapon'?2:1;
  const damageStage=damageFormula||options.effect?`<section class="manual-roll-stage damage-stage"><header><span class="manual-step-number">${damageStep}</span><div><b>${damageFormula?'Role o dano':'Resolva o efeito'}</b><small>${damageFormula?'A fórmula vem da habilidade; informe somente o total obtido nos dados físicos.':'A habilidade não possui dano base detectado.'}</small></div></header>${damageFormula?`<div class="manual-dice-reference damage-reference"><span>Dano base</span><strong>${escapeHtml(damageFormula)}</strong></div><label class="damage-input-big">${counter?'Dano normal rolado (50% será aplicado)':'Total dos dados'}<input name="damage" type="number" min="0" inputmode="numeric" value="0" required><small>${resonance.required?'Em 20 natural de Ressonância, o sistema aplica +50% ao dano informado. ':''}${counter?'Depois, o Contra-Ataque aplica 50% do resultado final.':''}</small></label>`:`<input type="hidden" name="damage" value="0">`}</section>`:`<input type="hidden" name="damage" value="0">`;
  const automaticEffects=effectRows?`<section class="manual-auto-effects"><header><b>Estados / efeitos</b><small>Apenas aplicações reais catalogadas. Menções de combo não criam status sozinhas.</small></header>${effectRows}</section>`:'';
  document.getElementById('manual-action-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="manual-action-modal" class="picker-modal manual-action-modal"><button class="picker-backdrop" data-click-call="document.getElementById('manual-action-modal').remove()"></button><form class="picker-panel manual-action-panel manual-action-flow" data-submit-call="confirmManualCombatAction(event)"><div class="picker-head"><div><span class="section-eyebrow">RESOLVER AÇÃO</span><h3>${escapeHtml(options.name||'Ação')}</h3><small>${escapeHtml(actorName)} → ${escapeHtml(selectedTarget?.label||'Alvo')}</small></div><button type="button" data-click-call="document.getElementById('manual-action-modal').remove()">✕</button></div><div class="manual-resolution-badges"><span>${escapeHtml(actionLabel)}</span>${cost>0?`<span>${cost} PD</span>`:''}${resonance.required?`<span>RES ${Number(resonance.grade)||0}</span>`:''}${resolution.range?`<span>${escapeHtml(resolution.range)}</span>`:''}<strong>${escapeHtml(resolution.label||'Resolução')}</strong></div><div class="manual-selected-summary"><div><span>Ação</span><strong>${escapeHtml(options.name||'Ação')}</strong><small>${escapeHtml(actionLabel)}${isArea?' · Área':''}</small></div><label><span>Alvo</span><select name="target" required>${targets.map(t=>`<option value="${t.type}:${escapeAttr(t.id)}" ${`${t.type}:${t.id}`===defaultTarget?'selected':''}>${escapeHtml(t.label)}</option>`).join('')}</select></label></div>${actorType==='player'&&cost>0?`<div class="manual-cost-banner"><b>⚡ ${cost} PD</b><span>PD é gasto ao tentar executar a habilidade. PR não é usado em combate.</span></div>`:''}${counter?`<div class="manual-counter-banner"><b>↩ Contra-Ataque</b><span>O dano final é reduzido a 50%. O custo de PD permanece integral.</span></div>`:''}${resonanceStage}${hitStage}${damageStage}${options.effect?`<details class="manual-effect-note" open><summary>Texto da habilidade</summary><p>${escapeHtml(options.effect)}</p></details>`:''}${automaticEffects}<input type="hidden" name="effect_count" value="${effects.length}"><input type="hidden" name="actor_type" value="${escapeAttr(actorType)}"><input type="hidden" name="actor_id" value="${escapeAttr(actorId)}"><input type="hidden" name="actor_name" value="${escapeAttr(actorName)}"><input type="hidden" name="action_name" value="${escapeAttr(options.name||'Ação')}"><input type="hidden" name="action_kind" value="${escapeAttr(actionKind)}"><input type="hidden" name="auto_attack_bonus" value="${autoAttackBonus}"><input type="hidden" name="action_slot" value="${escapeAttr(actionSlot)}"><input type="hidden" name="action_label" value="${escapeAttr(actionLabel)}"><input type="hidden" name="resolution_mode" value="${escapeAttr(resolution.mode||'automatic')}"><input type="hidden" name="skill_element" value="${escapeAttr(options.element||resonance.rule?.element||'')}"><input type="hidden" name="is_area" value="${isArea?'1':'0'}"><input type="hidden" name="resonance_required" value="${resonance.required?'1':'0'}"><input type="hidden" name="resonance_dt" value="${Number(resonance.dt)||0}"><input type="hidden" name="resonance_bonus" value="${Number(resonance.bonus)||0}">${actorType==='player'?`<input type="hidden" name="resource_cost" value="${cost}"><input type="hidden" name="resource" value="${escapeAttr(resource)}">`:`<input type="hidden" name="resource" value="none"><input type="hidden" name="resource_cost" value="0">`}<details class="manual-action-more"><summary>Ajustes manuais / regra de mesa</summary><label class="check-row"><input name="apply_rd" type="checkbox"> Aplicar RD automaticamente ao dano</label><div class="manual-action-grid"><label>Condição extra<input name="condition" value="${escapeAttr(condition)}" placeholder="Opcional"></label><label>Rodadas<input name="condition_rounds" type="number" min="0" value="${condition?2:0}"></label></div></details><div class="manual-action-buttons manual-action-sticky"><button type="button" data-click-call="document.getElementById('manual-action-modal').remove()">Cancelar</button><button class="primary-action" type="submit">${actorType==='enemy'?'Enviar para reação':'Confirmar resolução'}</button></div></form></div>`);
};

function renderEnemyCard(e){
  const max=e.hp_max||1,pct=Math.max(0,Math.min(100,Math.round((e.hp_current||0)/max*100))),can=k=>enemyVisible(e,k),down=(e.hp_current||0)<=0;
  const attacks=normalizeEnemyActionsV3(e.attacks,'Ataque'),abilities=normalizeEnemyActionsV3(e.abilities,'Habilidade');
  const actionSection=[...attacks.map((a,i)=>renderEnemyActionButtonV3(e,'attack',a,i)),...abilities.map((a,i)=>renderEnemyActionButtonV3(e,'ability',a,i))].join('');
  return `<article class="battle-card enemy-card enemy-card-v3 ${down?'combat-down':''} ${selectedCombatTarget?.type==='enemy'&&String(selectedCombatTarget.id)===String(e.id)?'targeted':''}" data-enemy-id="${escapeHtml(e.id||'')}" data-click-call="selectCombatTarget('enemy','${escapeAttr(e.id)}')"><div class="battle-card-head"><div class="battle-avatar enemy">${e.image_url?`<img src="${escapeAttr(e.image_url)}">`:'👹'}</div><div><strong>${can('name')?escapeHtml(e.name||'Inimigo'):'Inimigo desconhecido'}</strong><small>${escapeHtml(e.subtitle||'')}</small></div>${down?'<b class="enemy-down-label">0 PV</b>':''}</div>${can('hp')?`<div class="battle-resource enemy-hp"><span>PV</span><div><i style="width:${pct}%"></i></div><b>${can('hp_numbers')?`${e.hp_current||0}/${e.hp_max||0}`:'?'}</b></div>`:''}<div class="battle-stats">${can('defense')?`<span>DEF <b>${e.defense??10}</b></span>`:''}${can('dodge')?`<span>ESQ <b>${e.dodge??0}</b></span>`:''}${can('block')?`<span>ARM <b>${e.block??0}</b></span>`:''}${can('movement')?`<span>DESL <b>${e.movement_speed??9}m</b></span>`:''}</div>${renderTimedEffects('enemy',e.id)}${actionSection?`<div class="enemy-actions-v3" data-click-call="event.stopPropagation()">${actionSection}</div>`:''}${currentRole==='admin'?`<div class="enemy-admin-v3" data-click-call="event.stopPropagation()"><div class="enemy-hp-buttons"><button data-click-call="quickAdjustEnemy('${e.id}',-10)">−10</button><button data-click-call="quickAdjustEnemy('${e.id}',-5)">−5</button><button data-click-call="quickAdjustEnemy('${e.id}',-1)">−1</button><button data-click-call="quickAdjustEnemy('${e.id}',1)">+1</button><button data-click-call="quickAdjustEnemy('${e.id}',5)">+5</button><button data-click-call="quickAdjustEnemy('${e.id}',10)">+10</button></div><div class="enemy-main-actions"><button data-click-call="openEnemyEditor('${e.id}')">✎ Editar</button><button data-click-call="openEnemyDetails('${e.id}')">Ficha</button><button data-click-call="addBattleEffect('enemy','${e.id}')">+ Condição</button></div></div>`:''}</article>`;
};

window.openEnemyDetails=function(id){
  const e=battleEnemies.find(x=>String(x.id)===String(id));if(!e)return;const can=k=>enemyVisible(e,k),attacks=normalizeEnemyActionsV3(e.attacks,'Ataque'),abilities=normalizeEnemyActionsV3(e.abilities,'Habilidade');
  document.getElementById('enemy-detail-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="enemy-detail-modal" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('enemy-detail-modal').remove()"></button><div class="picker-panel enemy-detail-sheet enemy-detail-v3"><div class="picker-head"><div><span class="section-eyebrow">INIMIGO</span><h3>${can('name')?escapeHtml(e.name):'Inimigo desconhecido'}</h3><small>${escapeHtml(e.subtitle||'')}</small></div><button data-click-call="document.getElementById('enemy-detail-modal').remove()">✕</button></div><div class="enemy-detail-stats">${can('hp')?`<span>PV <b>${can('hp_numbers')?`${e.hp_current}/${e.hp_max}`:'Oculto'}</b></span>`:''}${can('defense')?`<span>DEF <b>${e.defense}</b></span>`:''}${can('dodge')?`<span>ESQ <b>${e.dodge}</b></span>`:''}${can('block')?`<span>ARM <b>${e.block}</b></span>`:''}${can('movement')?`<span>DESL <b>${e.movement_speed}m</b></span>`:''}</div>${currentRole==='admin'?`<div class="enemy-detail-hp-tools"><span>Ajustar PV</span><button data-click-call="quickAdjustEnemy('${e.id}',-10)">−10</button><button data-click-call="quickAdjustEnemy('${e.id}',-5)">−5</button><button data-click-call="quickAdjustEnemy('${e.id}',-1)">−1</button><button data-click-call="quickAdjustEnemy('${e.id}',1)">+1</button><button data-click-call="quickAdjustEnemy('${e.id}',5)">+5</button><button data-click-call="quickAdjustEnemy('${e.id}',10)">+10</button></div>`:''}${attacks.length&&can('attacks')?`<h4>Ataques</h4><div class="enemy-detail-actions-v3">${attacks.map((a,i)=>renderEnemyActionButtonV3(e,'attack',a,i)).join('')}</div>`:''}${abilities.length&&can('abilities')?`<h4>Habilidades</h4><div class="enemy-detail-actions-v3">${abilities.map((a,i)=>renderEnemyActionButtonV3(e,'ability',a,i)).join('')}</div>`:''}${currentRole==='admin'?`<div class="enemy-detail-footer"><button data-click-call="document.getElementById('enemy-detail-modal').remove();openEnemyEditor('${e.id}')">Editar inimigo</button></div>`:''}</div></div>`);
};

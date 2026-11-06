async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = error.message;
    return;
  }

  currentUser = data.user;
  await initUser();
}

async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

async function initUser() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error || !profile) {
    alert('Perfil não encontrado na tabela profiles.');
    return;
  }

  currentRole = profile.role;
  currentProfile = profile;
  subscribeSessionPresence(profile);
  window.ensureAppLiveSync?.();

  document.getElementById('user-label').textContent =
    currentRole === 'admin'
      ? `Logado como ${profile.username} (admin)`
      : `Logado como ${profile.username}`;

  renderTabs();
  dataReady = false;
  setSaveStatus('loading');

  if (currentRole === 'admin') {
    document.getElementById('admin-panel').classList.remove('hidden');
    await loadPlayers();
  } else {
    selectedUserId = currentUser.id;
    await loadSkills();
    await loadCharacterData();
  }
  window.scheduleAppWarmup?.();
}

async function loadPlayers() {
  const { data, error } = await supabaseClient.rpc('get_players_for_admin');

  if (error || !data) {
    console.error('Erro ao carregar jogadores:', error);
    alert('Erro ao carregar jogadores.');
    return;
  }

  profilesCache = data;

  const select = document.getElementById('player-select');
  select.innerHTML = data.map(player =>
    `<option value="${player.id}">${player.username}</option>`
  ).join('');

  const firstNonAdmin = data.find(p => p.role !== 'admin');
  selectedUserId = firstNonAdmin?.id || data[0]?.id || null;

    if (selectedUserId) {
    select.value = selectedUserId;
    await loadSkills();
    await loadCharacterData();
  }
}

async function loadSelectedPlayer() {
  dataReady = false;
  setSaveStatus('loading');
  selectedUserId = document.getElementById('player-select').value;
  await loadSkills();
  await loadCharacterData();
}

async function loadSkills() {
  unlocked = {};

  const { data, error } = await supabaseClient
    .from('skill_trees')
    .select('*')
    .eq('user_id', selectedUserId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao carregar skill tree:', error);
  }

  if (data?.unlocked_skills) {
    unlocked = data.unlocked_skills;
  } else {
    unlocked = {};
  }

  if(currentTab === 'habilidades') switchTab(currentTab,{force:true});
}

async function toggleSkill(key, checkbox) {
  if (checkbox.checked) {
    unlocked[key] = true;
  } else {
    delete unlocked[key];
  }

  await saveSkills();
  if(currentTab==='habilidades') document.getElementById('main-content').innerHTML = renderAbilitiesHub();
}

async function saveSkills() {
  const cleanedUnlocked = Object.fromEntries(
    Object.entries(unlocked).filter(([_, value]) => value === true)
  );

  unlocked = cleanedUnlocked;

  const { error } = await supabaseClient
    .from('skill_trees')
    .upsert({
      user_id: selectedUserId,
      unlocked_skills: cleanedUnlocked
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Erro ao salvar skills:', error);
    alert('Erro ao salvar skills: ' + error.message);
  }
}

async function checkSession() {
  const { data } = await supabaseClient.auth.getUser();
  if (data.user) {
    currentUser = data.user;
    await initUser();
  } else {
    renderTabs();
  }
}

async function uploadCharacterAvatar(userId) {
    const input = document.getElementById('char-avatar');
    const file = input?.files?.[0];

    if (!file) {
        return characterData.avatar_url || '';
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    // 👇 AQUI está a mudança importante
    const filePath = `${userId}/perfil-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return data.publicUrl;
}



// --- V15.33: seletores EDF visíveis + nível por select direto ---
const CHARACTER_CLASS_PROGRESSION = {
  combatente: { title: 'Combatente', hpBase: 20, hpPerLevel: 4, pdBase: 12, pdPerLevel: 3, prBase: 3, prPerLevel: 2 },
  especialista: { title: 'Especialista', hpBase: 16, hpPerLevel: 3, pdBase: 14, pdPerLevel: 3, prBase: 3, prPerLevel: 2 },
  'arcanista-elemental': { title: 'Arcanista Elemental', hpBase: 14, hpPerLevel: 2, pdBase: 16, pdPerLevel: 4, prBase: 3, prPerLevel: 2 }
};
const CHARACTER_LEVEL_MILESTONES = {
  1: 'Habilidade de Trilha + acesso à Skill Tree',
  2: 'Poder da classe',
  3: 'Aumento de Atributo',
  4: 'Grau de Treinamento',
  5: 'Habilidade de Trilha',
  6: 'Poder da classe',
  7: 'Aumento de Atributo',
  8: 'Versatilidade',
  9: 'Poder da classe',
  10: 'Habilidade de Trilha'
};

function normalizeIdentityKey(value='') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function getRuleBookSafe(){ return window.RuleBook || null; }
function getIdentityRule(kind, value){
  const book=getRuleBookSafe(); if(!book||!value)return null;
  const category=kind==='origin'?'origens':kind==='class'?'classes':kind==='element'?'elementos':'trilhas';
  return (book.getByCategory(category)||[]).find(r=>normalizeIdentityKey(r.title)===normalizeIdentityKey(value))||null;
}
function getClassRuleAndProgression(){
  const liveClass=document.getElementById('char-class')?.value||characterData?.class_name||'';
  const rule=getIdentityRule('class', liveClass);
  const rawKey=rule?.id || normalizeIdentityKey(liveClass);
  const aliases={
    'combatente':'combatente',
    'especialista':'especialista',
    'arcanista':'arcanista-elemental',
    'arcanista-elemental':'arcanista-elemental'
  };
  const key=aliases[rawKey]||rawKey;
  const progression=CHARACTER_CLASS_PROGRESSION[key]||null;
  // A automacao de nivel nao deve depender do RuleBook estar carregado.
  // O nome salvo na ficha e suficiente para resolver a progressao oficial.
  const safeRule=rule || (progression ? {id:key,title:liveClass||progression.title} : null);
  return { rule:safeRule, progression, key };
}
function renderIdentityChoiceField(kind,label,value){
  const id=kind==='origin'?'char-origin':kind==='class'?'char-class':kind==='element'?'char-element':'char-archetype';
  const rule=getIdentityRule(kind,value);
  const display=rule?.title||value||`Selecionar ${label.toLowerCase()}`;
  const meta=rule?identitySelectedMeta(kind,rule):(kind==='trail'?'Escolha uma classe para filtrar as trilhas':kind==='element'?'Define afinidade e bônus de Ressonância':'Clique para escolher pelo Livro de Regras');
  return `<div class="identity-choice-field"><label class="sheet-info-label">${label}</label><input id="${id}" type="hidden" value="${escapeAttr(value||'')}"><button type="button" class="identity-choice-display ${rule?'has-selection':'is-empty'}" data-identity-picker="${kind}" aria-label="Selecionar ${label}"><span><strong>${escapeHtml(display)}</strong><small>${escapeHtml(meta)}</small></span><b aria-hidden="true">⌄</b></button></div>`;
}
function identitySelectedMeta(kind,rule){
  if(kind==='origin'){
    const skill=(rule.mechanics||[]).find(x=>/^Perícias:/i.test(x));
    const power=(rule.mechanics||[]).find(x=>/^Habilidade:/i.test(x));
    return [skill,power].filter(Boolean).join(' • ');
  }
  if(kind==='element') return (rule.mechanics||[]).slice(0,2).join(' • ');
  if(kind==='class'){
    const pd=(rule.mechanics||[]).find(x=>/^PD inicial:/i.test(x));
    const pv=(rule.mechanics||[]).find(x=>/^PV inicial:/i.test(x));
    return [pv,pd].filter(Boolean).join(' • ');
  }
  return `${(rule.abilities||[]).length} habilidades de trilha • ${rule.summary||''}`;
}
function getIdentityOptions(kind){
  const book=getRuleBookSafe(); if(!book)return[];
  if(kind==='origin') return book.getByCategory('origens')||[];
  if(kind==='class') return book.getByCategory('classes')||[];
  if(kind==='element') return book.getByCategory('elementos')||[];
  const classRule=getIdentityRule('class',document.getElementById('char-class')?.value||characterData?.class_name);
  const classId=classRule?.id||'';
  if(!classId)return [];
  return (book.getByCategory('trilhas')||[]).filter(r=>r.classId===classId);
}
function identityOptionMeta(kind,rule){
  if(kind==='origin') return (rule.mechanics||[]).slice(0,3).join(' • ');
  if(kind==='class') return (rule.mechanics||[]).slice(0,6).join(' • ');
  if(kind==='element') return [rule.summary,...(rule.mechanics||[])].filter(Boolean).join(' • ');
  return [rule.summary, ...(rule.abilities||[]).slice(0,4).map(a=>a.name)].filter(Boolean).join(' • ');
}
function getTrailAbilityRules(rule){
  const book=getRuleBookSafe();
  const all=book?.getAll?.()||[];
  return (rule.abilities||[]).map(a=>{
    const exact=all.find(r=>r.category==='habilidades-trilha'&&r.trailId===rule.id&&normalizeIdentityKey(r.title)===normalizeIdentityKey(a.name||a.title||''));
    return exact||a;
  });
}
function identityRuleDetails(kind,rule){
  if(kind==='origin'){
    const mechanics=Array.isArray(rule.mechanics)?rule.mechanics:[];
    return `<div class="edf-origin-details">${mechanics.map((x,i)=>`<div class="edf-origin-detail ${i===0?'is-skills':i===1?'is-power':''}"><span>${i===0?'Pericias':i===1?'Habilidade':'Efeito'}</span><p>${escapeHtml(String(x).replace(/^(Perícias|Habilidade):\s*/i,''))}</p></div>`).join('')}</div>`;
  }
  if(kind==='element') return `<div class="identity-picker-mechanics">${(rule.mechanics||[]).map(x=>`<p>${escapeHtml(x)}</p>`).join('')}</div>`;
  if(kind==='class') return `<div class="identity-picker-mechanics">${(rule.mechanics||[]).map(x=>`<p>${escapeHtml(x)}</p>`).join('')}</div>`;
  const abilities=getTrailAbilityRules(rule);
  return `<div class="edf-trail-abilities">${abilities.map(a=>`<article><div class="edf-trail-ability-head"><strong>${escapeHtml(a.title||a.name||'Habilidade')}</strong>${a.type?`<span>${escapeHtml(a.type)}</span>`:''}</div><p>${escapeHtml(a.description||a.summary||'O livro não traz uma descrição narrativa adicional para esta habilidade.')}</p>${Array.isArray(a.mechanics)&&a.mechanics.length?`<small>${escapeHtml(a.mechanics.slice(0,5).join(' • '))}</small>`:''}</article>`).join('')}</div>`;
}
function identityCardHtml(kind,rule){
  if(kind==='element') return `<article class="identity-class-card identity-selectable-card element-choice-card" data-choice-card="${escapeAttr(rule.id)}"><div class="identity-card-top"><div><span class="rule-kicker">ELEMENTO</span><h3>${escapeHtml(rule.title)}</h3></div><button type="button" class="primary-action identity-choose-btn" data-choice-id="${escapeAttr(rule.id)}">Escolher</button></div><p class="identity-card-description">${escapeHtml(rule.description||rule.summary||'')}</p>${identityRuleDetails(kind,rule)}</article>`;
  if(kind==='class') return `<article class="identity-class-card identity-selectable-card" data-choice-card="${escapeAttr(rule.id)}"><div class="identity-card-top"><div><span class="rule-kicker">CLASSE</span><h3>${escapeHtml(rule.title)}</h3></div><button type="button" class="primary-action identity-choose-btn" data-choice-id="${escapeAttr(rule.id)}">Escolher</button></div><p class="identity-card-description">${escapeHtml(rule.description||rule.summary||'')}</p>${identityRuleDetails(kind,rule)}</article>`;
  if(kind==='trail') return `<article class="edf-trail-option identity-selectable-card" data-choice-card="${escapeAttr(rule.id)}" role="group"><header><div><span class="rule-kicker">TRILHA · ${escapeHtml(getIdentityRule('class',document.getElementById('char-class')?.value||characterData?.class_name)?.title||document.getElementById('char-class')?.value||characterData?.class_name||'Classe')}</span><h3>${escapeHtml(rule.title)}</h3></div><button type="button" class="primary-action identity-choose-btn" data-choice-id="${escapeAttr(rule.id)}">Escolher</button></header><p class="edf-trail-summary">${escapeHtml(rule.description||rule.summary||'')}</p>${identityRuleDetails(kind,rule)}</article>`;
  return `<article class="edf-origin-option identity-selectable-card" data-choice-card="${escapeAttr(rule.id)}"><header><div><span class="rule-kicker">ORIGEM</span><h3>${escapeHtml(rule.title)}</h3></div><button type="button" class="primary-action identity-choose-btn" data-choice-id="${escapeAttr(rule.id)}">Escolher</button></header><p class="edf-origin-summary">${escapeHtml(rule.description||rule.summary||'Descrição não informada no livro.')}</p>${identityRuleDetails(kind,rule)}</article>`;
}
window.openCharacterIdentityPicker=function(kind){
  document.getElementById('character-choice-overlay')?.remove();
  const label=kind==='origin'?'Origem':kind==='class'?'Classe':kind==='element'?'Elemento':'Trilha';
  const classRule=getIdentityRule('class',document.getElementById('char-class')?.value||characterData?.class_name);
  if(kind==='trail'&&!classRule){ showCharacterAutomationToast('Escolha a classe primeiro','A lista de trilhas depende da classe do personagem.'); return; }
  const overlay=document.createElement('div'); overlay.id='character-choice-overlay'; overlay.className=`character-choice-overlay identity-picker identity-picker-${kind}`;
  overlay.innerHTML=`<div class="character-choice-modal identity-picker-modal" role="dialog" aria-modal="true" aria-label="Selecionar ${label}"><div class="character-choice-head"><div><span class="section-eyebrow">FICHA EDF</span><h2>Selecionar ${label}</h2><p>${kind==='origin'?'Escolha a origem; as perícias concedidas serão treinadas automaticamente.':kind==='class'?'Escolha a classe e veja recursos, perícias e proficiências antes de aplicar.':kind==='element'?'Escolha a afinidade elemental; ela altera bônus e o Teste de Ressonância.':`Trilhas disponíveis para ${escapeHtml(classRule?.title||'a classe selecionada')}.`}</p></div><button type="button" class="character-choice-close" aria-label="Fechar">×</button></div><label class="identity-picker-search-wrap"><span>⌕</span><input class="character-choice-search" type="search" placeholder="Buscar ${label.toLowerCase()}..." autocomplete="off"></label><div class="character-choice-list identity-choice-list"></div></div>`;
  document.body.appendChild(overlay);
  const list=overlay.querySelector('.character-choice-list'), search=overlay.querySelector('.character-choice-search');
  const render=(q='')=>{
    const needle=normalizeIdentityKey(q).replace(/-/g,' ');
    const opts=getIdentityOptions(kind).filter(r=>!needle||normalizeIdentityKey([r.title,r.summary,...(r.keywords||[]),...(r.mechanics||[])].join(' ')).replace(/-/g,' ').includes(needle));
    list.innerHTML=opts.length?opts.map(r=>identityCardHtml(kind,r)).join(''):`<div class="character-choice-empty">Nenhuma opção encontrada.</div>`;
  };
  render(); search.addEventListener('input',()=>render(search.value));
  overlay.querySelector('.character-choice-close').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',async e=>{
    if(e.target===overlay){ overlay.remove(); return; }
    const choose=e.target.closest('[data-choice-id]');
    if(!choose)return;
    const rule=getRuleBookSafe()?.getById(choose.dataset.choiceId);
    if(!rule)return;
    choose.disabled=true;
    await applyCharacterIdentityChoice(kind,rule);
    overlay.remove();
  });
};

function setSkillTrainedByAutomation(skillName){
  const checkbox=document.getElementById(`skill-trained-${skillName}`), bonus=document.getElementById(`skill-bonus-${skillName}`);
  if(!checkbox||!bonus||checkbox.checked)return false;
  checkbox.checked=true; const current=parseInt(bonus.value)||0; const next=current+5; bonus.value=next; bonus.dataset.trained='true'; characterData.skills=characterData.skills||{}; characterData.skills[skillName]={...(characterData.skills[skillName]||{}),bonus:next,trained:true,others:parseInt(document.querySelector(`.skill-others[data-skill=\"${skillName}\"]`)?.value||0)||0,attr:bonus.closest('.skill-row')?.querySelector('.skill-attr')?.textContent||''}; return true;
}
function applyOriginGuaranteedSkills(rule){
  const first=(rule.mechanics||[]).find(x=>/^Perícias:/i.test(x)); if(!first)return {applied:[],missing:[]};
  const names=first.replace(/^Perícias:\s*/i,'').replace(/\.$/,'').split(',').map(x=>x.trim()).filter(Boolean);
  const applied=[],missing=[]; names.forEach(name=>setSkillTrainedByAutomation(name)?applied.push(name):(document.getElementById(`skill-trained-${name}`)?null:missing.push(name)));
  if(applied.length) markDirtyAndScheduleAutosave('skills');
  return {applied,missing};
}
function applyClassGuaranteedSkills(rule){
  const applied=[],notes=[];
  if(rule.id==='especialista'){ ['Investigação','Percepção'].forEach(n=>{if(setSkillTrainedByAutomation(n))applied.push(n);}); notes.push('Escolha ainda 3 + Intelecto perícias adicionais.'); }
  else if(rule.id==='arcanista-elemental'){ ['Ocultismo Elemental','Intuição'].forEach(n=>{if(setSkillTrainedByAutomation(n))applied.push(n);}); notes.push('Escolha ainda 2 + Intelecto perícias adicionais.'); }
  else if(rule.id==='combatente'){ notes.push('Escolha Luta ou Pontaria; Fortitude ou Reflexos; e 1 + Intelecto perícias adicionais.'); }
  if(applied.length)markDirtyAndScheduleAutosave('skills'); return {applied,notes};
}
function initializeClassResourcesIfBlank(rule){
  const cfg=CHARACTER_CLASS_PROGRESSION[rule.id]; if(!cfg)return false;
  const level=Math.max(1,parseInt(document.getElementById('char-level')?.value||characterData.level||1)||1);
  const hpMax=parseInt(document.getElementById('hp-max')?.value||0)||0, pdMax=parseInt(document.getElementById('en-max')?.value||0)||0;
  if(level!==1||hpMax>0||pdMax>0)return false;
  const vig=parseInt(document.getElementById('stat-constitution')?.value||characterData.constitution||0)||0;
  const hp=cfg.hpBase+vig;
  setLiveInputValue('hp-max',hp); setLiveInputValue('hp-curr',hp); setLiveInputValue('en-max',cfg.pdBase); setLiveInputValue('en-curr',cfg.pdBase); setLiveInputValue('stat-pr',cfg.prBase);
  Object.assign(characterData,{hp_max:hp,hp_current:hp,energy_max:cfg.pdBase,energy_current:cfg.pdBase,resonance_points:cfg.prBase});
  ['hp_max','hp_current','energy_max','energy_current','resonance_points'].forEach(f=>dirtyFields.add(f)); isDirty=true; setSaveStatus('dirty'); return true;
}
async function applyCharacterIdentityChoice(kind,rule){
  if(!rule)return;
  let toastTitle='', toastText='';
  if(kind==='origin'){
    const el=document.getElementById('char-origin'); if(el)el.value=rule.title;
    characterData.origin=rule.title; dirtyFields.add('origin');
    const info=applyOriginGuaranteedSkills(rule);
    const power=(rule.mechanics||[]).find(x=>/^Habilidade:/i.test(x))?.replace(/^Habilidade:\s*/i,'').replace(/\.$/,'');
    const effect=(rule.mechanics||[]).find(x=>!/^Perícias:|^Habilidade:/i.test(x));
    toastTitle=`Origem: ${rule.title}`;
    toastText=[info.applied.length?`Perícias treinadas: ${info.applied.join(', ')}.`:'Perícias da origem já estavam treinadas.',power?`Habilidade: ${power}.`:'',effect||'',info.missing.length?`Sem campo equivalente: ${info.missing.join(', ')}.`:''].filter(Boolean).join(' ');
  }
  if(kind==='element'){
    const el=document.getElementById('char-element'); if(el)el.value=rule.title;
    characterData.element=rule.title; dirtyFields.add('element');
    toastTitle=`Elemento: ${rule.title}`;
    toastText=[...(rule.mechanics||[]),'Afinidade concede +2 no Teste de Ressonância e reduz a DT em 1 para habilidades deste elemento.'].join(' ');
  }
  if(kind==='class'){
    const el=document.getElementById('char-class'); if(el)el.value=rule.title;
    const previousClass=characterData.class_name||''; characterData.class_name=rule.title; dirtyFields.add('class_name');
    if(normalizeIdentityKey(previousClass)!==normalizeIdentityKey(rule.title)){ characterData.progression_choices={...(characterData.progression_choices||{}),trail_abilities:[],class_powers:[],versatility:null}; dirtyFields.add('progression_choices'); }
    const currentTrail=getIdentityRule('trail',document.getElementById('char-archetype')?.value||characterData.archetype);
    if(currentTrail&&currentTrail.classId!==rule.id){ const trailEl=document.getElementById('char-archetype'); if(trailEl)trailEl.value=''; characterData.archetype=''; dirtyFields.add('archetype'); }
    const info=applyClassGuaranteedSkills(rule); const initialized=initializeClassResourcesIfBlank(rule);
    toastTitle=`Classe: ${rule.title}`;
    toastText=[initialized?'PV, PD e PR iniciais configurados pela classe.':'Recursos existentes foram preservados.',info.applied.length?`Perícias fixas treinadas: ${info.applied.join(', ')}.`:'',...info.notes,'Agora escolha uma trilha compatível.'].filter(Boolean).join(' ');
  }
  if(kind==='trail'){
    const classRule=getIdentityRule('class',document.getElementById('char-class')?.value||characterData.class_name);
    if(!classRule||rule.classId!==classRule.id){showCharacterAutomationToast('Trilha incompatível','Escolha primeiro a classe correta.');return;}
    const el=document.getElementById('char-archetype'); if(el)el.value=rule.title;
    characterData.archetype=rule.title; dirtyFields.add('archetype');
    characterData.progression_choices={...(characterData.progression_choices||{}),trail_abilities:[]}; dirtyFields.add('progression_choices');
    toastTitle=`Trilha: ${rule.title}`;
    toastText=`${(rule.abilities||[]).length} habilidades de trilha vinculadas à ficha. A progressão continua respeitando os marcos de nível do livro.`;
  }
  isDirty=true; setSaveStatus('dirty');
  const field=kind==='origin'?'origin':kind==='class'?'class_name':kind==='element'?'element':'archetype';
  dirtyFields.add(field);
  try{ await window.saveCharacterData({silent:true}); }
  catch(err){ console.error('Falha ao salvar escolha guiada:',err); }
  showCharacterAutomationToast(toastTitle,toastText);
  switchTab('personagem',{force:true});
}
function showCharacterAutomationToast(title,text){
  let box=document.getElementById('character-automation-toast'); if(!box){box=document.createElement('div');box.id='character-automation-toast';box.className='character-automation-toast';document.body.appendChild(box);}
  box.innerHTML=`<strong>${escapeHtml(title)}</strong><span>${escapeHtml(text||'')}</span>`; box.classList.add('show'); clearTimeout(box._timer); box._timer=setTimeout(()=>box.classList.remove('show'),5200);
}

function progressionChoices(){
  const value=characterData.progression_choices;
  return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
}
function setProgressionChoices(next){
  characterData.progression_choices=next||{}; dirtyFields.add('progression_choices'); isDirty=true; setSaveStatus('dirty');
}
function requiredTrailAbilityLevels(level){ return [1,5,10].filter(x=>level>=x); }
function chosenTrailEntries(){ return Array.isArray(progressionChoices().trail_abilities)?progressionChoices().trail_abilities:[]; }
function trainingGradeEntries(){const tg=progressionChoices().training_grade;return Array.isArray(tg?.skills)?tg.skills:[];}
function trainedSkillsForProgression(){
  const chosen=new Set(trainingGradeEntries().map(x=>String(typeof x==='string'?x:x?.name||'')));
  return Object.entries(characterData.skills||{}).filter(([name,v])=>!!(typeof v==='object'?v?.trained:false)&&!chosen.has(name)).map(([name,v])=>({name,bonus:Number(v?.bonus)||0})).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
function versatilityOptionsForProgression(){
  const book=getRuleBookSafe(),classRule=getIdentityRule('class',document.getElementById('char-class')?.value||characterData.class_name),currentTrail=getIdentityRule('trail',document.getElementById('char-archetype')?.value||characterData.archetype);
  if(!book||!classRule)return[];
  return (book.getByCategory('trilhas')||[]).filter(t=>t.classId===classRule.id&&t.id!==currentTrail?.id).map(t=>{const first=getTrailAbilityRules(t)[0];return first?{trailId:t.id,trailTitle:t.title,name:first.title||first.name,description:first.description||first.summary||'',mechanics:first.mechanics||[]}:null;}).filter(Boolean);
}

function progressionPendingItems(level=Number(characterData.level)||1){
  const c=progressionChoices(), pending=[];
  const chosenLevels=new Set(chosenTrailEntries().map(x=>Number(typeof x==='object'?x.level:0)).filter(Boolean));
  requiredTrailAbilityLevels(level).forEach(l=>{if(!chosenLevels.has(l))pending.push({level:l,type:'trail',label:'Escolher Habilidade de Trilha'});});
  [3,7].filter(l=>level>=l).forEach(l=>{if(!c.attribute_increases?.[l])pending.push({level:l,type:'attribute',label:'Aumento de Atributo (+1, máx. 5)'});});
  [2,6,9].filter(l=>level>=l).forEach(l=>{const done=(c.class_powers||[]).some(x=>Number(x?.level)===l);if(!done)pending.push({level:l,type:'review',label:'Poder da Classe — catálogo pendente'});});
  if(level>=4&&trainingGradeEntries().length<2)pending.push({level:4,type:'training',label:'Grau de Treinamento'});
  if(level>=8&&!c.versatility?.name)pending.push({level:8,type:'versatility',label:'Versatilidade'});
  return pending;
}

function renderProgressionStatus(){
  const level=Number(characterData.level)||1,pending=progressionPendingItems(level),chosen=chosenTrailEntries().length;
  return `<button type="button" class="progression-status-chip ${pending.some(x=>x.type!=='review')?'has-pending':''}" data-click-call="openProgressionMilestonesModal()"><span>PROGRESSÃO</span><b>${chosen} habilidade${chosen===1?'':'s'} de trilha</b><small>${pending.length?`${pending.length} marco(s) para revisar`:'Marcos do nível conferidos'}</small></button>`;
}
function trailAbilityOptionsForProgression(){
  const trail=getIdentityRule('trail',document.getElementById('char-archetype')?.value||characterData.archetype);
  if(!trail)return[];
  const chosen=new Set(chosenTrailEntries().map(x=>normalizeIdentityKey(typeof x==='object'?x.name:x)));
  return getTrailAbilityRules(trail).filter(a=>!chosen.has(normalizeIdentityKey(a.title||a.name||'')));
}
window.openProgressionMilestonesModal=function(){
  document.getElementById('progression-choice-overlay')?.remove();
  const level=Number(document.getElementById('char-level')?.value||characterData.level)||1;
  const pending=progressionPendingItems(level), chosen=chosenTrailEntries();
  const overlay=document.createElement('div');overlay.id='progression-choice-overlay';overlay.className='character-choice-overlay';
  const trailOptions=trailAbilityOptionsForProgression();
  const cards=pending.map(item=>{
    if(item.type==='trail')return `<article class="progression-choice-card"><header><span>NÍVEL ${item.level}</span><h3>Habilidade de Trilha</h3></header>${trailOptions.length?`<p>Escolha uma habilidade da trilha ${escapeHtml(characterData.archetype||'selecionada')} para este marco.</p><div class="progression-choice-buttons">${trailOptions.map(a=>`<button type="button" data-progression-trail="${item.level}" data-progression-name="${escapeAttr(a.title||a.name)}"><strong>${escapeHtml(a.title||a.name)}</strong><small>${escapeHtml(a.description||a.summary||'')}</small></button>`).join('')}</div>`:'<p class="progression-review-note">Escolha uma Trilha primeiro ou revise as habilidades já escolhidas.</p>'}</article>`;
    if(item.type==='attribute')return `<article class="progression-choice-card"><header><span>NÍVEL ${item.level}</span><h3>Aumento de Atributo</h3></header><p>Escolha +1 em um atributo, até o máximo 5. A escolha fica registrada e é revertida se o nível cair abaixo deste marco.</p><div class="progression-attribute-buttons">${[['strength','FOR'],['dexterity','AGI'],['intelligence','INT'],['presence','PRE'],['constitution','VIG']].map(([key,label])=>`<button type="button" data-progression-attribute="${key}" data-progression-level="${item.level}" ${(Number(characterData[key])||0)>=5?'disabled':''}><b>${label}</b><span>${Number(characterData[key])||0} → ${Math.min(5,(Number(characterData[key])||0)+1)}</span></button>`).join('')}</div></article>`;
    if(item.type==='training'){const chosen=trainingGradeEntries(),opts=trainedSkillsForProgression();return `<article class="progression-choice-card"><header><span>NÍVEL 4</span><h3>Grau de Treinamento</h3></header><p>Eleve <b>duas perícias treinadas</b> de +5 para +10. Escolhidas: ${chosen.length}/2.</p>${chosen.length?`<div class="progression-chosen">${chosen.map(x=>`<span>${escapeHtml(typeof x==='string'?x:x.name)}</span>`).join('')}</div>`:''}<div class="progression-choice-buttons">${opts.map(x=>`<button type="button" data-progression-training="${escapeAttr(x.name)}"><strong>${escapeHtml(x.name)}</strong><small>Bônus atual ${x.bonus} → ${x.bonus+5}</small></button>`).join('')||'<small>Treine mais perícias na ficha para concluir este marco.</small>'}</div></article>`;}
    if(item.type==='versatility'){const opts=versatilityOptionsForProgression();return `<article class="progression-choice-card"><header><span>NÍVEL 8</span><h3>Versatilidade</h3></header><p>Escolha a habilidade inicial de <b>outra Trilha da mesma Classe</b>. Isso não libera a progressão daquela Trilha.</p><div class="progression-choice-buttons">${opts.map(x=>`<button type="button" data-progression-versatility="${escapeAttr(x.name)}" data-progression-versatility-trail="${escapeAttr(x.trailId)}"><strong>${escapeHtml(x.trailTitle)} · ${escapeHtml(x.name)}</strong><small>${escapeHtml(x.description)}</small></button>`).join('')||'<small>Nenhuma outra trilha compatível encontrada.</small>'}</div></article>`;}
    return `<article class="progression-choice-card is-review"><header><span>NÍVEL ${item.level}</span><h3>${escapeHtml(item.label)}</h3></header><p>Este marco continua pendente porque o livro ainda não possui um catálogo final de Poderes de Classe. A ficha registra a pendência sem inventar bônus.</p></article>`;
  }).join('');
  overlay.innerHTML=`<div class="character-choice-modal progression-choice-modal"><div class="character-choice-head"><div><span class="section-eyebrow">PROGRESSÃO EDF</span><h2>Marcos até o nível ${level}</h2><p>Ganhos numéricos já são automáticos. Aqui ficam escolhas que precisam ficar registradas na ficha.</p></div><button type="button" class="character-choice-close">×</button></div>${chosen.length?`<div class="progression-chosen"><b>Habilidades de Trilha escolhidas</b>${chosen.map(x=>`<span>Nv ${Number(x.level)||'?'} · ${escapeHtml(x.name||x)}</span>`).join('')}</div>`:''}<div class="progression-choice-list">${cards||'<p class="character-choice-empty">Nenhuma escolha pendente.</p>'}</div></div>`;
  document.body.appendChild(overlay); const close=()=>overlay.remove(); overlay.querySelector('.character-choice-close')?.addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  overlay.querySelectorAll('[data-progression-trail]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;await chooseProgressionTrailAbility(Number(btn.dataset.progressionTrail),btn.dataset.progressionName);close();window.openProgressionMilestonesModal();}));
  overlay.querySelectorAll('[data-progression-attribute]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;await chooseProgressionAttribute(Number(btn.dataset.progressionLevel),btn.dataset.progressionAttribute);close();window.openProgressionMilestonesModal();}));
  overlay.querySelectorAll('[data-progression-training]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;await chooseProgressionTrainingSkill(btn.dataset.progressionTraining);close();window.openProgressionMilestonesModal();}));
  overlay.querySelectorAll('[data-progression-versatility]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;await chooseProgressionVersatility(btn.dataset.progressionVersatilityTrail,btn.dataset.progressionVersatility);close();window.openProgressionMilestonesModal();}));
};
async function chooseProgressionTrailAbility(level,name){
  const c=progressionChoices(), entries=chosenTrailEntries().filter(x=>Number(x.level)!==Number(level));entries.push({level:Number(level),name:String(name)});entries.sort((a,b)=>a.level-b.level);setProgressionChoices({...c,trail_abilities:entries});
  await window.saveCharacterData({silent:true});showCharacterAutomationToast(`Habilidade de Trilha · Nv ${level}`,`${name} foi registrada e passa a participar das automações da ficha/combate.`);switchTab('personagem',{force:true});
}
async function chooseProgressionAttribute(level,key){
  const current=Math.max(0,Number(characterData[key])||0);if(current>=5)return;
  const idMap={strength:'stat-strength',dexterity:'stat-dexterity',intelligence:'stat-intelligence',presence:'stat-presence',constitution:'stat-constitution'};
  characterData[key]=current+1;setLiveInputValue(idMap[key],current+1);dirtyFields.add(key);
  const c=progressionChoices(),inc={...(c.attribute_increases||{}),[level]:key};setProgressionChoices({...c,attribute_increases:inc});
  await window.saveCharacterData({silent:true});showCharacterAutomationToast(`Aumento de Atributo · Nv ${level}`,`${key.toUpperCase()} aumentado para ${current+1}.`);switchTab('personagem',{force:true});
}
async function chooseProgressionTrainingSkill(name){
  const chosen=trainingGradeEntries();if(chosen.length>=2||chosen.some(x=>String(typeof x==='string'?x:x?.name)===String(name)))return;
  const skill=characterData.skills?.[name];if(!skill||typeof skill!=='object'||!skill.trained)return;
  characterData.skills[name]={...skill,bonus:(Number(skill.bonus)||0)+5};
  const input=document.getElementById(`skill-bonus-${name}`);if(input)input.value=String(characterData.skills[name].bonus);
  const c=progressionChoices(),next=[...chosen,{name:String(name),level:4}];setProgressionChoices({...c,training_grade:{level:4,skills:next}});dirtyFields.add('skills');
  await window.saveCharacterData({silent:true});showCharacterAutomationToast('Grau de Treinamento',`${name} recebeu +5 adicional (${next.length}/2).`);switchTab('personagem',{force:true});
}
async function chooseProgressionVersatility(trailId,name){
  const c=progressionChoices();setProgressionChoices({...c,versatility:{level:8,trailId:String(trailId),name:String(name)}});
  await window.saveCharacterData({silent:true});showCharacterAutomationToast('Versatilidade',`${name} foi adquirida como habilidade inicial de outra Trilha da mesma Classe.`);switchTab('personagem',{force:true});
}
function revertProgressionChoicesAbove(target){
  const c=progressionChoices(), inc={...(c.attribute_increases||{})};
  const idMap={strength:'stat-strength',dexterity:'stat-dexterity',intelligence:'stat-intelligence',presence:'stat-presence',constitution:'stat-constitution'};
  for(const [lvl,key] of Object.entries(inc))if(Number(lvl)>target){const current=Math.max(0,Number(characterData[key])||0);characterData[key]=Math.max(0,current-1);setLiveInputValue(idMap[key],characterData[key]);dirtyFields.add(key);delete inc[lvl];}
  let training=c.training_grade;
  if(target<4&&Array.isArray(training?.skills)){
    for(const entry of training.skills){const name=typeof entry==='string'?entry:entry?.name,skill=characterData.skills?.[name];if(skill&&typeof skill==='object'){characterData.skills[name]={...skill,bonus:Math.max(0,(Number(skill.bonus)||0)-5)};dirtyFields.add('skills');}}
    training=null;
  }
  const trails=chosenTrailEntries().filter(x=>(Number(x.level)||1)<=target);
  setProgressionChoices({...c,attribute_increases:inc,trail_abilities:trails,training_grade:training,versatility:target>=8?c.versatility:null,class_powers:Array.isArray(c.class_powers)?c.class_powers.filter(x=>(Number(x.level)||1)<=target):[]});
}


function getLevelSelectionPreview(targetLevel){
  const {rule,progression}=getClassRuleAndProgression();
  const current=Math.max(1,parseInt(document.getElementById('char-level')?.value||characterData.level||1)||1);
  const target=Math.max(1,Math.min(10,parseInt(targetLevel)||current));
  if(!rule||!progression)return {error:'Selecione uma classe válida antes de ajustar o nível.'};
  if(target===current)return {rule,progression,current,target,direction:0,hpDelta:0,pdDelta:0,prDelta:0,milestones:[]};
  const direction=target>current?1:-1;
  const levels=Math.abs(target-current);
  const vig=parseInt(document.getElementById('stat-constitution')?.value||characterData.constitution||0)||0;
  const hpPerLevel=progression.hpPerLevel+vig;
  const milestoneLevels=[];
  if(direction>0){ for(let lvl=current+1;lvl<=target;lvl++)milestoneLevels.push(lvl); }
  else { for(let lvl=current;lvl>target;lvl--)milestoneLevels.push(lvl); }
  return {
    rule,progression,current,target,direction,vig,levels,
    hpDelta:direction*levels*hpPerLevel,
    pdDelta:direction*levels*progression.pdPerLevel,
    prDelta:direction*levels*progression.prPerLevel,
    milestones:milestoneLevels.map(level=>({level,label:CHARACTER_LEVEL_MILESTONES[level]||''})).filter(x=>x.label)
  };
}

window.openLevelUpModal=function(){
  document.getElementById('character-level-overlay')?.remove();
  const {rule}=getClassRuleAndProgression();
  if(!rule){showCharacterAutomationToast('Selecione uma classe','A progressão de PV, PD e PR depende da classe.');return;}
  const current=Math.max(1,parseInt(document.getElementById('char-level')?.value||characterData.level||1)||1);
  const overlay=document.createElement('div');overlay.id='character-level-overlay';overlay.className='character-choice-overlay';
  const levels=Array.from({length:10},(_,i)=>i+1).map(level=>`<button type="button" class="level-number-option ${level===current?'current':''}" data-level-number="${level}"><span>${level}</span>${level===current?'<small>Atual</small>':''}</button>`).join('');
  overlay.innerHTML=`<div class="character-choice-modal level-number-modal" role="dialog" aria-modal="true"><div class="character-choice-head"><div><span class="section-eyebrow">NÍVEL DO PERSONAGEM</span><h2>Selecionar nível</h2><p>Escolha diretamente o nível. A ficha recalcula automaticamente os ganhos ou reduções de PV, PD e PR pela classe ${escapeHtml(rule.title)}.</p></div><button class="character-choice-close">×</button></div><div class="level-number-grid">${levels}</div><div class="level-number-note">Ao reduzir nível, recursos numéricos de progressão são revertidos. Escolhas manuais de atributos, poderes e habilidades não são apagadas automaticamente.</div></div>`;
  document.body.appendChild(overlay);
  const close=()=>overlay.remove(); overlay.querySelector('.character-choice-close')?.addEventListener('click',close); overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  overlay.querySelectorAll('[data-level-number]').forEach(btn=>btn.addEventListener('click',async()=>{
    const target=parseInt(btn.dataset.levelNumber)||current;
    if(target===current){close();return;}
    btn.disabled=true;
    try{await applySelectedCharacterLevel(target);close();}catch(err){console.error(err);btn.disabled=false;showCharacterAutomationToast('Não foi possível alterar o nível',err?.message||'Tente novamente.');}
  }));
};

async function applySelectedCharacterLevel(targetLevel){
  const p=getLevelSelectionPreview(targetLevel);
  if(p.error)throw new Error(p.error);
  if(!p.direction)return;
  if(p.direction<0)revertProgressionChoicesAbove(p.target);
  const oldHpMax=parseInt(document.getElementById('hp-max')?.value||characterData.hp_max||0)||0;
  const oldHp=parseInt(document.getElementById('hp-curr')?.value||characterData.hp_current||0)||0;
  const oldPdMax=parseInt(document.getElementById('en-max')?.value||characterData.energy_max||0)||0;
  const oldPd=parseInt(document.getElementById('en-curr')?.value||characterData.energy_current||0)||0;
  const oldPr=parseInt(document.getElementById('stat-pr')?.value||characterData.resonance_points||0)||0;
  const nextHpMax=Math.max(1,oldHpMax+p.hpDelta);
  const nextPdMax=Math.max(0,oldPdMax+p.pdDelta);
  const nextHp=p.direction>0?oldHp+p.hpDelta:Math.min(oldHp,nextHpMax);
  const nextPd=p.direction>0?oldPd+p.pdDelta:Math.min(oldPd,nextPdMax);
  const nextPr=Math.max(0,oldPr+p.prDelta);
  setLiveInputValue('char-level',p.target);setLiveInputValue('hp-max',nextHpMax);setLiveInputValue('hp-curr',Math.max(0,nextHp));setLiveInputValue('en-max',nextPdMax);setLiveInputValue('en-curr',Math.max(0,nextPd));setLiveInputValue('stat-pr',nextPr);
  const levelTrigger=document.getElementById('char-level-picker');
  if(levelTrigger){ levelTrigger.dataset.currentLevel=String(p.target); const n=levelTrigger.querySelector('span'); if(n)n.textContent=String(p.target); }
  Object.assign(characterData,{level:p.target,hp_max:nextHpMax,hp_current:Math.max(0,nextHp),energy_max:nextPdMax,energy_current:Math.max(0,nextPd),resonance_points:nextPr});
  ['level','hp_max','hp_current','energy_max','energy_current','resonance_points'].forEach(f=>dirtyFields.add(f));isDirty=true;setSaveStatus('dirty');
  await window.saveCharacterData({silent:true});
  const sign=n=>n>0?`+${n}`:`${n}`;
  const crossed=p.milestones.map(m=>`Nv ${m.level}: ${m.label}`).join(' • ');
  showCharacterAutomationToast(`Nível alterado: ${p.current} → ${p.target}`, `${sign(p.hpDelta)} PV máx., ${sign(p.pdDelta)} PD máx. e ${sign(p.prDelta)} PR.${crossed?` Marcos: ${crossed}.`:''}`);
  switchTab('personagem',{force:true});
  if(p.direction>0&&progressionPendingItems(p.target).some(x=>x.type!=='review'))setTimeout(()=>window.openProgressionMilestonesModal?.(),120);
}

function syncCharacterDerivedDefense(){
  const vig=Math.max(0,Number(document.getElementById('stat-constitution')?.value??characterData.constitution)||0),armor=Math.max(0,Number(document.getElementById('stat-block')?.value??characterData.block)||0),total=5+vig+armor;
  const el=document.getElementById('stat-def');if(el)el.value=String(total);characterData.defense=total;dirtyFields.add('defense');return total;
}
window.syncCharacterDerivedDefense=syncCharacterDerivedDefense;

function renderCharacterSheet() {
  const skillsList = [
    ["Acrobacia","AGI"],["Adestramento","PRE"],["Artes","INT"],["Atletismo","FOR"],["Atuação","PRE"],
    ["Atualidades","INT"],["Ciências","INT"],["Conhecimento","INT"],["Diplomacia","PRE"],["Enganação","PRE"],
    ["Estratégia","INT"],["Fortitude","VIG"],["Furtividade","AGI"],["Iniciativa","AGI"],
    ["Intimidação","PRE"],["Intuição","PRE"],["Investigação","INT"],["Luta","FOR"],
    ["Medicina","INT"],["Ocultismo Elemental","INT"],["Percepção","PRE"],["Persuasão","PRE"],["Pilotagem","AGI"],["Pontaria","AGI"],
    ["Profissão","INT"],["Reflexos","AGI"],["Religião","PRE"],["Ressonância","INT"],
    ["Sobrevivência","INT"],["Tática","INT"],["Tecnologia","INT"],["Vontade","PRE"]
  ].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));

  window.toggleSkillTraining = function(skillName) {
    const checkbox = document.getElementById(`skill-trained-${skillName}`);
    const bonusInput = document.getElementById(`skill-bonus-${skillName}`);
    if (!checkbox || !bonusInput) return;
    const current = parseInt(bonusInput.value) || 0;
    const wasTrained = bonusInput.dataset.trained === 'true';
    const base = wasTrained ? current - 5 : current;
    bonusInput.value = checkbox.checked ? base + 5 : base;
    bonusInput.dataset.trained = checkbox.checked ? 'true' : 'false';
    markDirtyAndScheduleAutosave('skills');
  };

  const skillsHtml = skillsList.map(([name, attr]) => {
    const savedSkill = characterData.skills?.[name];

    const bonus =
      typeof savedSkill === 'object' && savedSkill !== null
        ? (savedSkill.bonus ?? 0)
        : (savedSkill ?? 0);

    const trained =
      typeof savedSkill === 'object' && savedSkill !== null
        ? !!savedSkill.trained
        : false;

    const others =
      typeof savedSkill === 'object' && savedSkill !== null
        ? (savedSkill.others ?? 0)
        : 0;

    return `
      <div class="skill-row">
        <span class="skill-name">${name}</span>
        <span class="skill-attr">${attr}</span>

        <input
          id="skill-bonus-${name}"
          class="skill-cell skill-bonus"
          type="text"
          data-skill="${name}"
          data-trained="${trained ? 'true' : 'false'}"
          value="${bonus}"
        >

        <input
          id="skill-trained-${name}"
          class="skill-check skill-trained"
          type="checkbox"
          data-skill="${name}"
          data-change-call="toggleSkillTraining('${name}')"
          ${trained ? 'checked' : ''}
        >

        <input
          class="skill-cell skill-others"
          type="text"
          data-skill="${name}"
          value="${others}"
        >
      </div>
    `;
  }).join('');

  const unlockedSkillsDetailed = [];

  for (const key in unlocked) {
    if (unlocked[key]) {
      const [element, skillName] = key.split('__');

      if (SKILLS[element]) {
        SKILLS[element].paths.forEach(path => {
          const found = path.skills.find(s => s.name === skillName);
          if (found) {
            unlockedSkillsDetailed.push({ ...found, element });
          }
        });
      }
    }
  }

  const skillsListHtml = unlockedSkillsDetailed.length > 0
    ? unlockedSkillsDetailed.map(s => `
        <div class="attack-card-mini border-l-2 border-l-purple-500">
          <div class="flex justify-between items-start mb-1">
            <span class="attack-input-name" style="border:none; color:#a5b4fc;">${s.name}</span>
            <span class="text-[9px] bg-purple-900/50 px-1 rounded text-purple-200">RES ${s.res}</span>
          </div>

          <div class="space-y-1">
            <div class="flex gap-1 text-[10px]">
              <span class="text-purple-400/70 uppercase font-bold">${s.type}</span>
              <span class="text-white/30">|</span>
              <span class="text-gray-400">${s.range}</span>
            </div>

            <p class="text-[14px] text-gray-300 leading-tight italic line-clamp-2" title="${s.desc}">
              ${s.desc}
            </p>

            <div class="bg-black/30 p-1 rounded border border-white/5">
              <p class="text-[14px] text-purple-200 leading-tight">
                <strong>EF:</strong> ${s.effect}
              </p>
            </div>
          </div>
        </div>
      `).join('')
    : '<p class="text-[10px] text-gray-500 italic p-4 text-center w-full">Nenhuma habilidade desbloqueada.</p>';

  return `
    <div class="sheet-wrapper fade-in p-4">
      <div class="glow-box character-summary p-3 mb-3">
        <div class="character-fields-grid grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div class="col-span-2 lg:col-span-1">
            <label class="sheet-info-label">Personagem</label>
            <input id="char-name" class="field-input" type="text" value="${characterData.name || ''}">
          </div>
          ${renderIdentityChoiceField('origin','Origem',characterData.origin || '')}
          ${renderIdentityChoiceField('class','Classe',characterData.class_name || '')}
          ${renderIdentityChoiceField('trail','Trilha',characterData.archetype || '')}
          ${renderIdentityChoiceField('element','Elemento',characterData.element || '')}
          <div><label class="sheet-info-label">Jogador</label><input id="char-player" class="field-input" type="text" value="${characterData.player_name || ''}"></div>
        </div>
        <div class="character-avatar-control mt-2">
          <label for="char-avatar" class="avatar-change-label">Alterar foto</label>
          <input id="char-avatar" type="file" accept="image/*" class="avatar-file-input">
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-[200px_0.3fr_1.3fr] gap-4 items-start">

        <div class="flex flex-col gap-4">
          <div class="glow-box p-4">
            <div class="section-title"><i data-lucide="zap" class="w-3 h-3 inline"></i> ATRIBUTOS</div>
            <div class="flex flex-col gap-3">
              ${[
                { sigla: 'FOR', id: 'stat-strength', value: characterData.strength ?? 0 },
                { sigla: 'AGI', id: 'stat-dexterity', value: characterData.dexterity ?? 0 },
                { sigla: 'INT', id: 'stat-intelligence', value: characterData.intelligence ?? 0 },
                { sigla: 'PRE', id: 'stat-presence', value: characterData.presence ?? 0 },
                { sigla: 'VIG', id: 'stat-constitution', value: characterData.constitution ?? 0 }
              ].map(a => `
                <div class="attr-box w-full">
                  <div class="attr-label">${a.sigla}</div>
                  <input id="${a.id}" class="attr-input" type="text" value="${a.value}">
                </div>
              `).join('')}
            </div>
          </div>

          <div class="glow-box p-4">
            <div class="section-title"><i data-lucide="shield" class="w-3 h-3 inline"></i> STATUS</div>
            <div class="space-y-4">
              <div class="status-card-pv">
                <button data-click-call="updateStat('hp-curr', -1)" class="status-btn">−</button>
                <div class="flex-1 text-center">
                  <div class="status-label-pv mb-1">PV</div>
                  <div class="flex items-center justify-center gap-1">
                    <input class="stat-main-input" id="hp-curr" type="text" value="${characterData.hp_current ?? 0}">
                    <span class="stat-divider">/</span>
                    <input class="stat-max-input" id="hp-max" type="text" value="${characterData.hp_max ?? 0}">
                  </div>
                </div>
                <button data-click-call="updateStat('hp-curr', 1)" class="status-btn">+</button>
              </div>

              <div class="status-card-pd">
                <button data-click-call="updateStat('en-curr', -1)" class="status-btn">−</button>
                <div class="flex-1 text-center">
                  <div class="status-label-pd mb-1">PD</div>
                  <div class="flex items-center justify-center gap-1">
                    <input class="stat-main-input" id="en-curr" type="text" value="${characterData.energy_current ?? 0}">
                    <span class="stat-divider">/</span>
                    <input class="stat-max-input" id="en-max" type="text" value="${characterData.energy_max ?? 0}">
                  </div>
                </div>
                <button data-click-call="updateStat('en-curr', 1)" class="status-btn">+</button>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div class="text-center">
                  <div class="mini-label">NÍVEL</div>
                  <button id="char-level-picker" type="button" class="mini-input level-number-trigger" aria-label="Selecionar nível do personagem" data-current-level="${characterData.level ?? 1}"><span>${characterData.level ?? 1}</span><b aria-hidden="true">⌄</b></button>
                  <input id="char-level" type="hidden" value="${characterData.level ?? 1}">
                </div>
                <div class="text-center">
                  <div class="mini-label">PR</div>
                  <input id="stat-pr" class="mini-input" type="text" value="${characterData.resonance_points ?? 3}">
                </div>
                <div class="text-center">
                  <div class="mini-label">RD</div>
                  <input id="stat-rd" class="mini-input" type="text" value="${characterData.damage_reduction ?? 0}">
                </div>
                <div class="text-center">
                  <div class="mini-label">DEFESA</div>
                  <input id="stat-def" class="mini-input" type="text" readonly title="Defesa Base = 5 + Vigor + Armadura; bônus de habilidades são somados no combate" value="${5 + (Number(characterData.constitution)||0) + (Number(characterData.block)||0)}">
                </div>
                <div class="text-center">
                  <div class="mini-label">ESQUIVA</div>
                  <input id="stat-dodge" class="mini-input" type="text" value="${characterData.dodge ?? 10}">
                </div>
                <div class="text-center">
                  <div class="mini-label">ARMADURA</div>
                  <input id="stat-block" class="mini-input" type="text" title="Bônus de Armadura somado à Defesa e ao teste de Bloqueio" value="${characterData.block ?? 0}">
                </div>
                <div class="text-center">
                  <div class="mini-label">DESLOCAMENTO</div>
                  <input id="stat-mov" class="mini-input" type="text" value="${characterData.movement_speed ?? 9}">
                </div>
              </div>
              ${renderProgressionStatus()}
            </div>
          </div>
        </div>

        <div class="glow-box p-4 h-full">
          <div class="section-title"><i data-lucide="book-open" class="w-3 h-3 inline"></i> PERÍCIAS</div>
          <div class="skill-header mb-2 text-[10px]">
            <span>NOME</span><span class="text-center">ATRIBUTO</span>
            <span>BONUS</span><span>TREINO</span><span>OUTROS</span>
          </div>
          <div class="space-y-0">
            ${skillsHtml}
          </div>
        </div>

        <div class="glow-box p-4 h-full overflow-y-auto scroll-container">
          <div class="section-title flex justify-between items-center mb-6">
            <div class="flex items-center gap-2">
              <i data-lucide="swords" class="w-4 h-4 text-purple-400"></i>
              <span class="uppercase tracking-widest">Ataques</span>
            </div>
            <button data-click-call="window.addAttack()" class="text-[9px] bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1 rounded border border-purple-500/30 transition-all font-bold">
              + ADICIONAR
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            ${characterAttacks.map((ataque, index) => `
              <div class="attack-card-mini attack-editor-card relative group">
                <button data-click-call="window.removeAttack(${index})" class="absolute -top-1 -right-1 bg-red-600/80 hover:bg-red-600 text-white text-[8px] w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">✕</button>

                <input class="attack-input-name" type="text" placeholder="Nome da Arma" value="${ataque.nome || ''}">

                <div class="space-y-1 mt-2">
                  <div class="flex items-center gap-1">
                    <span class="attack-mini-label">TESTE</span>
                    <input class="attack-input-field" type="text" placeholder="3d20+5" value="${ataque.teste || ''}">
                  </div>
                  <div class="grid grid-cols-2 gap-1">
                    <div class="flex items-center gap-1">
                      <span class="attack-mini-label">DANO</span>
                      <input class="attack-input-field" type="text" placeholder="2d6" value="${ataque.dano || ''}">
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="attack-mini-label text-[7px]">CRIT</span>
                      <input class="attack-input-field" type="text" placeholder="x2" value="${ataque.crit || ''}">
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="attack-mini-label">ALCANCE</span>
                    <input class="attack-input-field" type="text" placeholder="Curto" value="${ataque.alcance || ''}">
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="pt-6 border-t border-purple-500/30">
            <div class="flex items-center gap-3 mb-5">
              <i data-lucide="sparkles" class="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"></i>
              <span class="text-[16px] font-bold text-purple-400 uppercase tracking-[0.2em] font-['Orbitron']">
                Habilidades Desbloqueadas
              </span>
              <button type="button" data-click-call="switchTab('habilidades')" class="view-tree-btn">Ver árvore →</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${skillsListHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
// Função global para os botões de + e -
window.updateStat = function(id, delta) {
  const el = document.getElementById(id);
  if (el) {
    let currentVal = parseInt(el.value) || 0;
    el.value = Math.max(0, currentVal + delta);
    markDirtyAndScheduleAutosave(getDirtyFieldFromElement(el));
  }
};

window.saveCharacterData = async function(options = {}) {
  const silent = options.silent === true;
  const id = selectedUserId || currentUser?.id;
  if (!id || !dataReady) return;
  if (isSaving) { if (dirtyFields.size) markDirtyAndScheduleAutosave(); return; }
  if (!dirtyFields.size && !document.getElementById('char-avatar')?.files?.[0]) { setSaveStatus('saved'); return; }

  isSaving = true;
  if (autosaveTimer) clearTimeout(autosaveTimer);
  setSaveStatus('saving');
  try {
    const patch = {};
    const has = (key) => dirtyFields.has(key) || dirtyFields.has('*');
    const text = (id, fallback='') => document.getElementById(id)?.value ?? fallback;
    const int = (id, fallback=0) => parseInt(text(id, fallback)) || 0;
    const num = (id, fallback=0) => parseFloat(String(text(id, fallback)).replace(',', '.').replace('m','')) || 0;
    const fields = {
      name: () => text('char-name','Novo Personagem'), origin: () => text('char-origin'), class_name: () => text('char-class'), archetype: () => text('char-archetype'), element: () => text('char-element'), progression_choices: () => characterData.progression_choices||{}, player_name: () => text('char-player'), level: () => int('char-level',1),
      strength: () => int('stat-strength'), dexterity: () => int('stat-dexterity'), constitution: () => int('stat-constitution'), intelligence: () => int('stat-intelligence'), presence: () => int('stat-presence'),
      hp_current: () => int('hp-curr'), hp_max: () => int('hp-max'), energy_current: () => int('en-curr'), energy_max: () => int('en-max'), resonance_points: () => int('stat-pr',3), defense: () => int('stat-def',10), damage_reduction: () => int('stat-rd'), dodge: () => int('stat-dodge',10), block: () => int('stat-block'), movement_speed: () => num('stat-mov',9)
    };
    Object.entries(fields).forEach(([key, getter]) => { if (has(key)) patch[key] = getter(); });
    if (has('skills')) {
      const skills = {};
      document.querySelectorAll('.skill-row').forEach(row => {
        const bonus = row.querySelector('.skill-bonus'); const trained = row.querySelector('.skill-trained'); const others = row.querySelector('.skill-others'); const attr = row.querySelector('.skill-attr');
        if (bonus?.dataset.skill) skills[bonus.dataset.skill] = { bonus: parseInt(bonus.value)||0, trained: !!trained?.checked, others: parseInt(others?.value)||0, attr: attr?.textContent||'' };
      });
      patch.skills = skills;
    }
    if (has('attacks')) { window.saveCurrentAttacks(); patch.attacks = characterAttacks; }
    if (document.getElementById('char-avatar')?.files?.[0]) patch.avatar_url = await uploadCharacterAvatar(id);
    if (!Object.keys(patch).length) { isSaving=false; return; }

    const { data, error } = await supabaseClient.rpc('save_character_patch', { p_user_id: id, p_expected_updated_at: loadedUpdatedAt, p_patch: patch });
    if (error) throw error;
    if (!data?.ok) {
      backupCharacterLocally(id, { conflict: true, patch, server_updated_at: data?.updated_at });
      dirtyFields.clear(); isDirty = false;
      await loadCharacterData();
      setSaveStatus('error');
      if (!silent) alert('A ficha foi alterada em outro lugar. A versão mais recente foi carregada e sua alteração local ficou no backup.');
      return;
    }
    characterData = { ...characterData, ...patch, updated_at: data.updated_at };
    loadedUpdatedAt = data.updated_at;
    dirtyFields.clear(); isDirty = false;
    backupCharacterLocally(id, patch);
    updateHeaderIdentity(); setSaveStatus('saved');
    if (!silent) alert('Ficha salva com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar ficha:', err); setSaveStatus('error');
    if (!silent) alert('Erro ao salvar ficha: ' + err.message);
  } finally { isSaving = false; }
};

async function loadCharacterData() {
    if (!selectedUserId) return;

    const { data, error } = await supabaseClient
        .from('characters')
        .select('*')
        .eq('user_id', selectedUserId)
        .maybeSingle();

    if (error) {
        console.error('Erro ao carregar ficha:', error);
        return;
    }

    if (data) {
        characterData = {
            ...characterData,
            ...data,
            skills: data.skills || {},
            progression_choices: data.progression_choices || {},
            element: data.element || '',
            attacks: Array.isArray(data.attacks) && data.attacks.length > 0
                ? data.attacks
                : [{ nome: "", teste: "3d20+5", dano: "2d6", crit: "x2", alcance: "Curto" }]
        };

        characterAttacks = [...characterData.attacks];
        loadedUpdatedAt = data.updated_at || null;
        updateHeaderIdentity();
    } else {
        characterData = {
            name: 'Novo Personagem',
            origin: '',
            class_name: '',
            archetype: '',
            element: '',
            progression_choices: {},
            player_name: '',
            level: 1,

            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            presence: 0,

            hp_current: 0,
            hp_max: 0,
            energy_current: 0,
            energy_max: 0,
            resonance_points: 3,

            defense: 10,
            damage_reduction: 0,
            dodge: 10,
            block: 0,
            movement_speed: 9,

            skills: {},
            attacks: [
                { nome: "", teste: "3d20+5", dano: "2d6", crit: "x2", alcance: "Curto" }
            ]
        };

        characterAttacks = [...characterData.attacks];
    }

    switchTab(currentTab,{force:true});

    // Só a partir daqui é seguro salvar: a ficha atual reflete o que está
    // no banco (ou é comprovadamente uma ficha nova).
    dataReady = true;
    isDirty = false;
    dirtyFields.clear();
    subscribeToCharacterRealtime(selectedUserId);
    setSaveStatus('saved');
}

// Autosave: qualquer edição na ficha de personagem (campos de texto,
// atributos, perícias, ataques) agenda um salvamento automático silencioso
// depois de alguns segundos sem digitar. O toggle de habilidades já salva
// na hora (toggleSkill/saveSkills), então não precisa passar por aqui.
document.addEventListener('input', (e) => {
  if (!e.target.closest('#main-content')) return;
  if(['stat-constitution','stat-block'].includes(e.target.id))syncCharacterDerivedDefense();
  markDirtyAndScheduleAutosave(getDirtyFieldFromElement(e.target));
});
document.addEventListener('change', (e) => {
  if (!e.target.closest('#main-content')) return;
  if(['stat-constitution','stat-block'].includes(e.target.id))syncCharacterDerivedDefense();
  markDirtyAndScheduleAutosave(getDirtyFieldFromElement(e.target));
});




/* V15.32: seletores guiados de Origem / Classe / Trilha.
   Usa delegação própria para não depender do executor genérico de data-click-call. */
document.addEventListener('click', (event) => {
  const picker = event.target.closest && event.target.closest('[data-identity-picker]');
  if (!picker) return;
  event.preventDefault();
  const kind = picker.dataset.identityPicker;
  if (['origin','class','trail'].includes(kind)) window.openCharacterIdentityPicker(kind);
});

/* V15.34: nível usa um seletor próprio 1-10. O clique abre a grade e a
   progressão é aplicada pela classe salva, sem depender do RuleBook. */
document.addEventListener('click', (event) => {
  const picker = event.target.closest && event.target.closest('#char-level-picker');
  if (!picker) return;
  event.preventDefault();
  event.stopPropagation();
  window.openLevelUpModal?.();
});

/* Fallback de clique para builds antigos em cache que ainda exibam o botao de nivel. */
document.addEventListener('click', (event) => {
  const trigger = event.target.closest && event.target.closest('.level-up-trigger, #char-level-display');
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  window.openLevelUpModal?.();
});

/* RuleBook delegated term navigation */
document.addEventListener('click', (event) => {
  const button = event.target.closest && event.target.closest('[data-rule-id]');
  if (!button) return;
  event.preventDefault();
  const ruleId = button.dataset.ruleId;
  if (ruleId && typeof window.openRuleById === 'function') {
    window.openRuleById(ruleId);
  }
});

window.loadMasterHub = loadMasterHub;



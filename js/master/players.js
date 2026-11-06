// ---------- VISAO AGREGADA DO MESTRE ----------
let masterOverviewCache=[];
async function loadMasterPlayersOverview({ background=false } = {}){
  if(currentRole!=='admin')return;
  const main=document.getElementById('main-content'); if(!main)return;
  if(background && masterOverviewCache.length && window.UiFlow?.isFresh('jogadores',15000)) return;
  const title=document.getElementById('page-title'); if(title) title.textContent='Visão dos Jogadores';
  const label=document.getElementById('user-label'); if(label) label.textContent=`Mestre · ${currentProfile?.username||currentUser?.email||''}`;
  const avatar=document.getElementById('header-avatar'); if(avatar) avatar.innerHTML='<span>GM</span>';
  const saveBar=document.getElementById('save-bar'); if(saveBar) saveBar.classList.add('hidden');
  if(!background) main.innerHTML='<section class="master-overview"><p class="rules-empty">Carregando jogadores...</p></section>';
  else if(masterOverviewCache.length) main.innerHTML=renderMasterPlayersOverview();
  // Usa a RPC antiga/estável do Escudo do Mestre como fonte principal.
  // Isso evita depender de get_master_players_overview(), que pode ficar fora
  // do schema cache do PostgREST em alguns projetos Supabase.
  const {data,error}=await supabaseClient.rpc('get_master_shield_data');
  if(error){
    main.innerHTML=`<section class="master-overview"><div class="master-warning"><strong>Não foi possível carregar a visão dos jogadores.</strong><span>${escapeHtml(error.message)}</span></div></section>`;
    return;
  }

  masterOverviewCache=(data||[]).map(p=>({
    ...p,
    conditions:Array.isArray(p.conditions)?p.conditions:[],
    unlocked_skills:p.unlocked_skills||{}
  }));

  // Enriquecimento opcional com a árvore de habilidades. Se RLS/política não
  // permitir, a visão geral continua funcionando normalmente.
  try {
    const ids=masterOverviewCache.map(p=>p.user_id).filter(Boolean);
    if(ids.length){
      const skillRes=await supabaseClient
        .from('skill_trees')
        .select('user_id, unlocked_skills')
        .in('user_id',ids);
      if(!skillRes.error && Array.isArray(skillRes.data)){
        const byUser=new Map(skillRes.data.map(x=>[String(x.user_id),x.unlocked_skills||{}]));
        masterOverviewCache=masterOverviewCache.map(p=>({
          ...p,
          unlocked_skills:byUser.get(String(p.user_id))||p.unlocked_skills||{}
        }));
      }
    }
  } catch(err){
    console.warn('Não foi possível enriquecer a visão do mestre com skill_trees:',err);
  }

  main.innerHTML=renderMasterPlayersOverview();
}
function pctValue(a,b){return b>0?Math.max(0,Math.min(100,Math.round((a||0)/b*100))):0;}
function renderMasterPlayersOverview(){
  return `<section class="master-overview"><header class="section-hero master-overview-head"><div><span class="section-eyebrow">VISÃO DO MESTRE</span><h2>👥 Jogadores</h2><p>Todas as fichas em uma única tela. Consultar aqui não troca o personagem selecionado nem altera a ficha de ninguém.</p></div><span>${masterOverviewCache.length} personagens</span></header><div class="master-overview-grid">${masterOverviewCache.map(p=>{const hp=pctValue(p.hp_current,p.hp_max),pd=pctValue(p.energy_current,p.energy_max),conds=Array.isArray(p.conditions)?p.conditions:[];return `<article class="master-overview-card"><div class="master-overview-card-head"><div class="battle-avatar">${p.avatar_url?`<img src="${escapeAttr(p.avatar_url)}">`:escapeHtml((p.name||'?')[0])}</div><div><strong>${escapeHtml(p.name||'Sem nome')}</strong><small>${escapeHtml([p.class_name,p.archetype,p.origin].filter(Boolean).join(' • '))}</small><em>${escapeHtml(p.player_name||'')}</em></div><b>NV ${p.level||1}</b></div><div class="overview-resource"><span>PV</span><div><i style="width:${hp}%"></i></div><b>${p.hp_current??0}/${p.hp_max??0}</b></div><div class="overview-resource pd"><span>PD</span><div><i style="width:${pd}%"></i></div><b>${p.energy_current??0}/${p.energy_max??0}</b></div><div class="overview-stats"><span>PR <b>${p.resonance_points??3}</b></span><span>DEF <b>${5+(Number(p.constitution)||0)+(Number(p.block)||0)}</b></span><span>RD <b>${p.damage_reduction??0}</b></span><span>ESQ <b>${p.dodge??0}</b></span><span>ARM <b>${p.block??0}</b></span><span>DESL <b>${p.movement_speed??9}m</b></span></div><div class="overview-attributes"><span>FOR <b>${p.strength??0}</b></span><span>AGI <b>${p.dexterity??0}</b></span><span>INT <b>${p.intelligence??0}</b></span><span>PRE <b>${p.presence??0}</b></span><span>VIG <b>${p.constitution??0}</b></span></div>${conds.length?`<div class="condition-chips">${conds.map(c=>`<button data-click-call="searchRulesFromContext('${escapeAttr(conditionName(c))}')">${escapeHtml(conditionName(c))}</button>`).join('')}</div>`:'<small class="overview-no-condition">Sem condições</small>'}<div class="overview-card-actions"><button data-click-call="openMasterOverviewDetails('${p.user_id}')">Detalhes</button><button data-click-call="openMasterOverviewDetails('${p.user_id}','skills')">Habilidades</button></div></article>`;}).join('')||'<p class="rules-empty">Nenhum jogador encontrado.</p>'}</div></section>`;
}
function normalizeMiniSheetSkills(skills){
  if(!skills || typeof skills!=='object') return [];
  return Object.entries(skills).map(([name,raw])=>{
    let data=raw;
    if(typeof data==='string'){
      try{ data=JSON.parse(data); }catch(_){ data={}; }
    }
    return {
      name,
      attr:data?.attr||'',
      bonus:Number(data?.bonus||0),
      others:Number(data?.others||0),
      trained:Boolean(data?.trained)
    };
  }).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
}

function renderMiniSheetSkills(skills){
  const list=normalizeMiniSheetSkills(skills);
  if(!list.length) return '<p class="mini-sheet-empty">Nenhuma perícia cadastrada.</p>';
  return `<div class="mini-sheet-skills">${list.map(skill=>{
    const total=Number(skill.bonus||0)+Number(skill.others||0);
    return `<div class="mini-sheet-skill-row">
      <div class="mini-sheet-skill-name">${escapeHtml(skill.name)}</div>
      <span class="mini-sheet-skill-attr">${escapeHtml(skill.attr)}</span>
      <strong class="mini-sheet-skill-bonus">${total>=0?'+':''}${total}</strong>
      ${skill.trained?'<span class="mini-sheet-trained">✓ Treinada</span>':'<span class="mini-sheet-untrained">—</span>'}
    </div>`;
  }).join('')}</div>`;
}

function renderMiniSheetAttacks(attacks){
  if(!Array.isArray(attacks)||!attacks.length) return '<p class="mini-sheet-empty">Nenhum ataque cadastrado.</p>';
  return `<div class="mini-sheet-attacks">${attacks.map(a=>`<article class="mini-sheet-attack">
    <strong>${escapeHtml(a.nome||a.name||'Ataque')}</strong>
    <div>${[a.teste,a.dano,a.crit,a.alcance].filter(Boolean).map(v=>`<span>${escapeHtml(v)}</span>`).join('')}</div>
  </article>`).join('')}</div>`;
}

function renderMiniSheetStats(p){
  const stats=[
    ['PV',`${p.hp_current??0}/${p.hp_max??0}`,'hp'],['PD',`${p.energy_current??0}/${p.energy_max??0}`,'pd'],
    ['PR',p.resonance_points??3,''],['DEF',5+(Number(p.constitution)||0)+(Number(p.block)||0),''],['RD',p.damage_reduction??0,''],
    ['ESQ',p.dodge??0,''],['ARM',p.block??0,''],['DESL',`${p.movement_speed??9}m`,'']
  ];
  return `<div class="mini-sheet-stat-grid">${stats.map(([label,value,type])=>`<div class="mini-sheet-stat ${type?`mini-sheet-stat-${type}`:''}"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>
  ${currentRole==='admin'?`<div class="mini-sheet-resource-controls">
    <div><span>PV</span><button data-click-call="adjustMiniSheetResource('${p.user_id}','hp',-5)">−5</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','hp',-1)">−1</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','hp',1)">+1</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','hp',5)">+5</button></div>
    <div><span>PD</span><button data-click-call="adjustMiniSheetResource('${p.user_id}','pd',-5)">−5</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','pd',-1)">−1</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','pd',1)">+1</button><button data-click-call="adjustMiniSheetResource('${p.user_id}','pd',5)">+5</button></div>
  </div>`:''}`;
}

function getUnlockedSkillDetails(p){
  const raw=p?.unlocked_skills&&typeof p.unlocked_skills==='object'?p.unlocked_skills:{};
  const elementLabels={terra:'🌍 Terra',energia:'⚡ Energia',frio:'❄️ Frio',vento:'💨 Vento',agua:'💧 Água',fogo:'🔥 Fogo',universais:'✨ Universais',forca:'💪 Força Inata'};
  const result=[];
  for(const [key,value] of Object.entries(raw)){
    if(value!==true) continue;
    const parts=String(key).split('__');
    const element=parts.length>1?parts.shift():'';
    const name=parts.length?parts.join('__'):String(key);
    let skill=null,pathName='';
    if(element && SKILLS?.[element]?.paths){
      for(const path of SKILLS[element].paths){
        const found=(path.skills||[]).find(x=>x.name===name);
        if(found){skill=found;pathName=path.name||'';break;}
      }
    }
    if(!skill){
      for(const [el,data] of Object.entries(SKILLS||{})){
        for(const path of data?.paths||[]){
          const found=(path.skills||[]).find(x=>x.name===name);
          if(found){skill=found;pathName=path.name||'';result.push({key,name,element:el,elementLabel:elementLabels[el]||el,pathName,...normalizeSkill(found)});break;}
        }
        if(result.length && result[result.length-1].key===key) break;
      }
      if(result.length && result[result.length-1].key===key) continue;
    }
    result.push({key,name,element,elementLabel:elementLabels[element]||element||'Habilidade',pathName,...(skill?normalizeSkill(skill):{desc:'',prereq:'',type:'Habilidade',range:'',effect:'',res:0})});
  }
  return result.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
}

function renderMiniSheetAbilities(p){
  const list=getUnlockedSkillDetails(p);
  if(!list.length) return '<p class="mini-sheet-empty">Nenhuma habilidade desbloqueada.</p>';
  return `<div class="mini-sheet-ability-list">${list.map(skill=>{
    const rule=findRuleForSkill(skill.name);
    return `<article class="mini-sheet-ability-card">
      <div class="mini-sheet-ability-head"><div><span>${escapeHtml(skill.elementLabel)}</span><strong>${escapeHtml(skill.name)}</strong></div>${skill.res?`<b>Grau ${skill.res}</b>`:''}</div>
      <div class="mini-sheet-ability-meta">${[skill.type,skill.range,skill.pathName].filter(Boolean).map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</div>
      ${skill.desc?`<p>${linkifyRules(skill.desc)}</p>`:''}
      ${skill.effect?`<div class="mini-sheet-ability-effect"><b>Efeito:</b> ${linkifyRules(skill.effect)}</div>`:''}
      ${rule?`<button class="mini-sheet-rule-btn" data-click-call="document.getElementById('master-player-detail')?.remove();switchTab('regras');setTimeout(()=>openRuleById('${rule.id}'),0)">📖 Ver regra completa</button>`:''}
    </article>`;
  }).join('')}</div>`;
}

window.adjustMiniSheetResource=async function(userId,resource,delta){
  const modal=document.getElementById('master-player-detail');
  const section=modal?.dataset?.section||'summary';
  const {data,error}=await supabaseClient.rpc('master_adjust_character',{p_user_id:userId,p_resource:resource,p_delta:delta});
  if(error){alert('Não foi possível alterar o recurso. Execute o SQL atualizado.\n'+error.message);return;}
  const p=masterOverviewCache.find(x=>String(x.user_id)===String(userId));
  if(p && data){
    if(data.hp_current!==undefined) p.hp_current=data.hp_current;
    if(data.energy_current!==undefined) p.energy_current=data.energy_current;
  }
  await logBattle(`${p?.name||'Personagem'}: ${delta>0?'+':''}${delta} ${resource==='hp'?'PV':'PD'}`,'resource');
  openMasterOverviewDetails(userId,section);
};

window.openMasterFullSheet=async function(userId){
  if(currentRole!=='admin') return;
  document.getElementById('master-player-detail')?.remove();
  selectedUserId=userId;
  const select=document.getElementById('player-select'); if(select) select.value=userId;
  currentTab='personagem';
  dataReady=false;
  setSaveStatus('loading');
  await loadSkills();
  await loadCharacterData();
};

window.openMasterOverviewDetails=function(userId,section='summary'){
  const p=masterOverviewCache.find(x=>String(x.user_id)===String(userId));
  if(!p)return;
  const unlocked=p.unlocked_skills&&typeof p.unlocked_skills==='object'
    ?Object.entries(p.unlocked_skills).filter(([,v])=>v===true).map(([k])=>k.split('__').slice(1).join('__')).sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}))
    :[];
  const attacks=Array.isArray(p.attacks)?p.attacks:[];
  document.getElementById('master-player-detail')?.remove();

  const summarySection=`<div class="mini-sheet-panel">
    <section class="mini-sheet-section"><h4>Perícias</h4>${renderMiniSheetSkills(p.skills)}</section>
    <section class="mini-sheet-section"><h4>Ataques</h4>${renderMiniSheetAttacks(attacks)}</section>
  </div>`;
  const skillsSection=`<div class="mini-sheet-panel"><section class="mini-sheet-section"><h4>Habilidades adquiridas</h4>${renderMiniSheetAbilities(p)}</section></div>`;
  const detailSection=section==='skills'?skillsSection:summarySection;

  document.body.insertAdjacentHTML('beforeend',`<div id="master-player-detail" class="picker-modal" data-section="${section}">
    <button class="picker-backdrop" data-click-call="document.getElementById('master-player-detail').remove()"></button>
    <div class="picker-panel master-player-detail-panel mini-sheet">
      <div class="mini-sheet-header">
        <div><span class="section-eyebrow">MINI FICHA</span><h3>${escapeHtml(p.name||'Personagem')}</h3><small>${escapeHtml([p.class_name,p.archetype,p.origin].filter(Boolean).join(' • '))}</small></div>
        <div class="mini-sheet-header-actions"><button class="mini-sheet-full-btn" data-click-call="openMasterFullSheet('${p.user_id}')">Abrir ficha completa ↗</button><button class="mini-sheet-close" data-click-call="document.getElementById('master-player-detail').remove()">✕</button></div>
      </div>
      ${renderMiniSheetStats(p)}
      <div class="master-detail-tabs mini-sheet-tabs">
        <button class="${section!=='skills'?'active':''}" data-click-call="document.getElementById('master-player-detail').remove();openMasterOverviewDetails('${p.user_id}','summary')">Resumo</button>
        <button class="${section==='skills'?'active':''}" data-click-call="document.getElementById('master-player-detail').remove();openMasterOverviewDetails('${p.user_id}','skills')">Habilidades</button>
      </div>
      ${detailSection}
    </div>
  </div>`);
};

// Admin nao entra automaticamente na ficha do primeiro jogador.
loadPlayers = async function(){
  const {data,error}=await supabaseClient.rpc('get_players_for_admin');
  if(error||!data){console.error(error);alert('Erro ao carregar jogadores.');return;}
  profilesCache=data;
  const select=document.getElementById('player-select');
  if(select) select.innerHTML=data.map(p=>`<option value="${p.id}">${escapeHtml(p.username||'Jogador')}</option>`).join('');
  selectedUserId=null;
  currentTab='jogadores';
  renderTabs();
  await loadMasterPlayersOverview();
};


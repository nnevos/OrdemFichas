(function(){
  'use strict';

  const ACTION_LIMITS=Object.freeze({standard:1,movement:1,light:1,free:2,reaction:1,counter:1});
  const ACTION_LABELS=Object.freeze({standard:'Ação Padrão',movement:'Movimento',light:'Ação Leve',free:'Ação Livre',reaction:'Reação',passive:'Passivo'});
  const RESONANCE_DT=Object.freeze({1:10,2:13,3:16,4:20});
  const CANONICAL=Object.freeze({
    caido:'Caído',imobilizado:'Imobilizado',lento:'Lento',empurrado:'Empurrado',desorientado:'Desorientado',instavel:'Instável',sobrecarregado:'Sobrecarregado',atordoado:'Atordoado',resfriado:'Resfriado',congelando:'Congelando',congelado:'Congelado',queimando:'Queimando','em-chamas':'Em Chamas',abalado:'Abalado',enraizado:'Enraizado',deslocado:'Deslocado',exposto:'Exposto',encharcado:'Encharcado',saturado:'Saturado','marca-elemental':'Marca Elemental'
  });


  // Catálogo explícito: uma habilidade só APLICA estado quando está listada aqui.
  // Menções do tipo “se o alvo estiver X” são tratadas como exploração de combo, não aplicação.
  const ABILITY_EFFECTS=Object.freeze({
    'jato-de-agua':[{name:'Encharcado',rounds:1}],
    'impacto-hidraulico':[{name:'Saturado',rounds:1,requires:'Encharcado',conditional:true,note:'Se o alvo já estiver Encharcado, ele fica Saturado.'}],
    'abalo-continuo':[{name:'Caído',rounds:1,conditional:true}],
    'colapso-de-metal':[{name:'Caído',rounds:1,conditional:true}],
    'colapso-sismico':[{name:'Caído',rounds:1,conditional:true}],
    'correnteza-forcada':[{name:'Caído',rounds:1,conditional:true}],
    'fissura-sismica':[{name:'Caído',rounds:1,conditional:true}],
    'impacto-sismico':[{name:'Caído',rounds:1,conditional:true}],
    'torrente-devastadora':[{name:'Caído',rounds:1,requires:'Encharcado',conditional:true,note:'Alvos Encharcados ficam Caídos.'}],
    'tremor':[{name:'Caído',rounds:1,conditional:true}],
    'carcere-gelido':[{name:'Imobilizado',rounds:1,conditional:true}],
    'congelamento-total':[{name:'Congelado',rounds:1,conditional:true}],
    'prisao-cristalina':[{name:'Imobilizado',rounds:2,conditional:true}],
    'prisao-de-gelo':[{name:'Imobilizado',rounds:1,conditional:true}],
    'prisao-gelida':[{name:'Imobilizado',rounds:2,conditional:true}],
    'sepultamento-glacial':[{name:'Congelado',rounds:1,conditional:true}],
    'congelamento-parcial':[{name:'Lento',rounds:1}],
    'campo-reativo':[{name:'Sobrecarregado',rounds:2,conditional:true,note:'Aplica quando o mesmo inimigo atacar duas vezes no turno.'}],
    'pulso-instavel':[{name:'Sobrecarregado',rounds:2}],
    'sobrecarga':[{name:'Sobrecarregado',rounds:2}],
    'colapso-eletrico':[{name:'Atordoado',rounds:1,conditional:true}],
    'nucleo-de-sobrecarga':[{name:'Atordoado',rounds:1,conditional:true}],
    'colapso-arcano':[{name:'Atordoado',rounds:1,conditional:true}],
    'incendio-descontrolado':[{name:'Em Chamas',rounds:2}],
    'golpe-elemental':[{name:'Marca Elemental',rounds:1}]
  });

  function normalize(value=''){
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  function plain(value=''){
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }
  function uniqueEffects(items=[]){
    const map=new Map();
    items.filter(Boolean).forEach(item=>{
      const key=normalize(item.name||item.id||''); if(!key)return;
      const prev=map.get(key);
      const next={name:item.name||CANONICAL[key]||item.id,rounds:Math.max(0,Number(item.rounds)||0),conditional:!!item.conditional,source:item.source||'',note:item.note||''};
      if(!prev||next.rounds>prev.rounds||(!next.conditional&&prev.conditional))map.set(key,next);
    });
    return [...map.values()];
  }
  function ruleForSkill(skill){
    if(!skill||!window.RuleBook)return null;
    const title=skill.name||skill.title||'';
    const element=normalize(skill.element||'');
    const candidates=(RuleBook.getAll?.()||[]).filter(r=>['habilidades','habilidades-trilha'].includes(r.category)&&normalize(r.title)===normalize(title));
    return candidates.find(r=>!element||normalize(r.element||'')===element)||candidates[0]||null;
  }
  function actionSlotFromRule(rule,skill){
    const raw=plain(rule?.action||skill?.action||skill?.acao||'');
    if(/passiv/.test(raw))return'passive';
    if(/reac/.test(raw))return'reaction';
    if(/livre/.test(raw))return'free';
    if(/movimento/.test(raw))return'movement';
    if(/leve/.test(raw))return'light';
    return'standard';
  }
  function actionInfo(skill){
    const rule=ruleForSkill(skill),slot=actionSlotFromRule(rule,skill);
    return{slot,label:ACTION_LABELS[slot]||'Ação Padrão',rule};
  }
  function gradeFor(skill,rule=ruleForSkill(skill)){
    const n=Number(skill?.res??skill?.grade??rule?.grade??0);return Math.max(0,Math.min(4,Math.trunc(n)||0));
  }
  function pdCost(skill){
    const explicit=Number(skill?.pd_cost??skill?.cost?.value??(typeof skill?.cost==='number'?skill.cost:NaN));
    if(Number.isFinite(explicit)&&explicit>=0)return Math.trunc(explicit);
    return gradeFor(skill);
  }
  function isElemental(skill,rule=ruleForSkill(skill)){
    const element=normalize(rule?.element||skill?.element||'');
    return !!gradeFor(skill,rule) && element!=='forca-inata';
  }
  function resonanceInfo(skill,actor){
    const rule=ruleForSkill(skill),grade=gradeFor(skill,rule);
    if(!isElemental(skill,rule)||!grade)return{required:false,grade:0,dt:0,baseDt:0,affinity:false,bonus:0,rule};
    const actorElement=normalize(actor?.element||actor?.affinity||actor?.elemento||'');
    const skillElement=normalize(rule?.element||skill?.element||'');
    const affinity=!!actorElement&&!!skillElement&&skillElement!=='universal'&&actorElement===skillElement;
    const baseDt=RESONANCE_DT[grade]||0;
    return{required:true,grade,baseDt,dt:Math.max(1,baseDt-(affinity?1:0)),affinity,bonus:affinity?2:0,rule,attributeOptions:['INT','PRE']};
  }
  function durationFromText(text=''){
    const p=plain(text);
    let m=p.match(/(?:duracao:?\s*)?(\d+)\s*rodad/); if(m)return Number(m[1]);
    if(/ate o proximo turno|até o próximo turno|proximo turno/.test(p))return 1;
    return 0;
  }
  function effectsForSkill(skill){
    const rule=ruleForSkill(skill);
    const id=normalize(rule?.id||rule?.title||skill?.name||skill?.title||'');
    const explicit=ABILITY_EFFECTS[id]||ABILITY_EFFECTS[normalize(rule?.title||'')]||null;
    if(explicit){
      return explicit.map(e=>({
        name:e.name,
        rounds:Math.max(0,Number(e.rounds)||0),
        conditional:!!e.conditional,
        requires:e.requires||'',
        source:rule?.title||skill?.name||'',
        note:e.note||''
      }));
    }

    // Habilidades customizadas (ex.: bestiário) podem declarar condições estruturadas.
    const result=[];
    const add=(name,opts={})=>result.push({name,rounds:Math.max(0,Number(opts.rounds)||0),conditional:!!opts.conditional,requires:opts.requires||'',source:skill?.name||skill?.title||'',note:opts.note||''});
    (Array.isArray(skill?.appliesConditions)?skill.appliesConditions:[]).forEach(name=>add(String(name),{rounds:Number(skill?.conditionRounds)||1}));
    if(skill?.condition)add(String(skill.condition),{rounds:Number(skill?.conditionRounds)||1});

    // Fallback conservador: só reconhece verbos explícitos de aplicação, nunca simples menção ao status.
    const text=plain([skill?.effect,skill?.efeito,skill?.description,skill?.desc].filter(Boolean).join(' | '));
    const patterns=[
      ['Caído',/(?:fica|ficam|deixa|deixam) caid|derruba automaticamente/],
      ['Imobilizado',/(?:fica|ficam|deixa|deixam) imobiliz/],
      ['Lento',/(?:fica|ficam|deixa|deixam) lento/],
      ['Encharcado',/(?:fica|ficam|deixa|deixam) encharcad|aplica encharcad/],
      ['Sobrecarregado',/(?:fica|ficam|deixa|deixam) sobrecarregad|aplica sobrecarregad/],
      ['Atordoado',/(?:fica|ficam|deixa|deixam) atordoad|aplica atordoad/],
      ['Queimando',/(?:fica|ficam|deixa|deixam) queimando|aplica queimando/],
      ['Em Chamas',/(?:fica|ficam|deixa|deixam) em chamas|aplica em chamas/],
      ['Congelando',/(?:fica|ficam|deixa|deixam) congelando|aplica congelando/],
      ['Congelado',/(?:fica|ficam|deixa|deixam) congelad|aplica congelad/],
      ['Abalado',/(?:fica|ficam|deixa|deixam) abalad/],
      ['Enraizado',/(?:fica|ficam|deixa|deixam) enraizad/],
      ['Deslocado',/(?:fica|ficam|deixa|deixam) deslocad/],
      ['Exposto',/(?:fica|ficam|deixa|deixam) expost/],
      ['Desorientado',/(?:fica|ficam|deixa|deixam) desorientad/],
      ['Instável',/(?:fica|ficam|deixa|deixam) instavel/]
    ];
    for(const [name,re] of patterns)if(re.test(text))add(name,{rounds:durationFromText(text)||1,conditional:/se .*falh|teste evita/.test(text)});
    return uniqueEffects(result);
  }


  function damageFormulaForSkill(skill){
    const rule=ruleForSkill(skill);
    const direct=String(skill?.damage||skill?.dano||'').trim();
    if(direct)return direct;
    const primary=String(skill?.effect||skill?.efeito||'');
    let m=primary.match(/(?:^|[.;•]\s*)Dano\s*:?\s*(\d+d\d+(?:\s*[+\-]\s*\d+)?)/i);
    if(m)return m[1].replace(/\s+/g,'');
    const type=plain(rule?.type||skill?.type||'');
    if(!/ataque|area|área/.test(type))return'';
    const text=[primary,rule?.summary,rule?.description,...(rule?.mechanics||[])].filter(Boolean).join(' | ');
    const patterns=[/(?:causa|causam|sofre|sofrem)\s+(\d+d\d+(?:\s*[+\-]\s*\d+)?)\s+(?:de\s+)?dano/i,/(\d+d\d+(?:\s*[+\-]\s*\d+)?)\s+(?:de\s+)?dano/i];
    for(const re of patterns){m=text.match(re);if(m)return m[1].replace(/\s+/g,'');}
    return'';
  }
  function rangedRange(value=''){
    const p=plain(value);
    const meters=p.match(/(\d+(?:[.,]\d+)?)\s*m/);if(meters&&Number(String(meters[1]).replace(',','.'))>3)return true;
    return /medio|médio|longo|distancia|distância/.test(p);
  }
  function resolutionInfo(skill){
    const rule=ruleForSkill(skill),elemental=isElemental(skill,rule),type=plain(rule?.type||skill?.type||''),range=String(rule?.range||skill?.range||skill?.alcance||''),text=plain([rule?.summary,rule?.description,...(rule?.mechanics||[]),skill?.effect,skill?.efeito,skill?.desc,skill?.description].filter(Boolean).join(' | '));
    const area=isAreaSkill(skill)||/\barea\b|\blinha de\b|\bcone\b|todos os alvos|criaturas? (?:na|dentro da) area/.test(text);
    const hasTargetSave=/teste (?:de )?(forca|força|vigor|agilidade|presenca|presença|reflexos|fortitude)|teste evita|teste reduz|se (?:o alvo )?falhar no teste/.test(text);
    const isAttack=/ataque/.test(type)||/tags?:[^|]*ataque/.test(text);
    const explicitPrecision=/precisao|precisão|proj[eé]til|disparo|flecha|tiro|teste de ataque|pontaria/.test(text);
    let mode='automatic',label='Aplicação direta',needsAttackRoll=false,usesResonanceAsHit=false;
    if(!elemental){mode=isAttack?'weapon':'automatic';label=isAttack?'Teste de ataque':'Aplicação direta';needsAttackRoll=isAttack;}
    else if(area){mode=hasTargetSave?'resistance':'automatic';label=hasTargetSave?'Ressonância + Resistência':'Ressonância + Área';}
    else if(isAttack&&rangedRange(range)){mode='precision';label='Ressonância + Pontaria';needsAttackRoll=true;}
    else if(isAttack){mode='resonance-hit';label='Ressonância confirma o acerto';usesResonanceAsHit=true;}
    else if(hasTargetSave){mode='resistance';label='Ressonância + Resistência';}
    return{mode,label,elemental,isAttack,isArea:area,needsAttackRoll,usesResonanceAsHit,range,hasTargetSave,explicitPrecision,damageFormula:damageFormulaForSkill(skill),rule};
  }
  function pontariaInfo(actor){
    const row=actor?.skills?.['Pontaria']||actor?.skills?.Pontaria||{};
    const bonus=Number(row?.bonus)||0,others=Number(row?.others)||0,total=bonus+others;
    return{bonus,total,trained:!!row?.trained,attribute:'AGI'};
  }

  function actorStateKey(type,id){return `${type}:${id}`;}
  function actorUsage(battle,type,id){
    const state=battle?.reaction_state||{}; const row=state?.actors?.[actorStateKey(type,id)]||{};
    const turnMarker=`${Number(battle?.round)||1}:${Number(battle?.turn_index)||0}`;
    const currentTurn=row.turn_marker===turnMarker?row:{};
    const currentRound=Number(row.reaction_round)===Number(battle?.round||1)?row:{};
    return{standard:Number(currentTurn.standard)||0,movement:Number(currentTurn.movement)||0,light:Number(currentTurn.light)||0,free:Number(currentTurn.free)||0,reaction:Number(currentRound.reaction)||0,counter:Number(currentRound.counter)||0,counterAvailable:currentRound.counter_available||null,turnMarker};
  }
  function hasEffect(effects,type,id,name){
    const n=normalize(name);return (effects||[]).some(e=>String(e.entity_type)===String(type)&&String(e.entity_id)===String(id)&&normalize(e.name)===n);
  }
  function actionBudget(battle,effects,type,id){
    const used=actorUsage(battle,type,id), limits={...ACTION_LIMITS};
    if(hasEffect(effects,type,id,'Lento')||hasEffect(effects,type,id,'Congelando'))limits.light=0;
    if(hasEffect(effects,type,id,'Atordoado')||hasEffect(effects,type,id,'Congelado'))limits.standard=0;
    if(hasEffect(effects,type,id,'Imobilizado')||hasEffect(effects,type,id,'Congelado'))limits.movement=0;
    return{used,limits,available:{standard:Math.max(0,limits.standard-used.standard),movement:Math.max(0,limits.movement-used.movement),light:Math.max(0,limits.light-used.light),free:Math.max(0,limits.free-used.free),reaction:Math.max(0,limits.reaction-used.reaction),counter:Math.max(0,limits.counter-used.counter)}};
  }
  function canUseAction(battle,effects,type,id,slot){
    if(slot==='passive')return{ok:false,reason:'Habilidades passivas não são ativadas como ação.'};
    if(slot==='reaction')return{ok:actionBudget(battle,effects,type,id).available.reaction>0,reason:'A Reação desta rodada já foi usada.'};
    const b=actionBudget(battle,effects,type,id); return{ok:(b.available[slot]??0)>0,reason:`${ACTION_LABELS[slot]||slot} já foi usada neste turno.`};
  }
  function fusionPreview(existingNames=[],incomingName=''){
    const set=new Set(existingNames.map(normalize)),incoming=normalize(incomingName);
    if(incoming==='queimando'&&set.has('queimando'))return'Em Chamas';
    if(incoming==='saturado'&&set.has('encharcado'))return'Saturado';
    if(incoming==='resfriado'&&set.has('resfriado'))return'Congelando';
    if((incoming==='resfriado'&&set.has('congelando'))||(incoming==='congelando'&&(set.has('resfriado')||set.has('congelando'))))return'Congelado';
    return incomingName;
  }
  function isAreaSkill(skill){
    const rule=ruleForSkill(skill);
    const text=plain([rule?.type,rule?.summary,rule?.description,...(rule?.mechanics||[]),skill?.type,skill?.effect,skill?.description].filter(Boolean).join(' | '));
    return /(^|\b)area(\b|$)|\braio\b|linha de \d+m|todos os alvos|criaturas na area|inimigos na area/.test(text);
  }
  function activeTrailAbilities(character){
    if(!window.RuleBook)return [];
    const unlocked=unlockedTrailAbilities(character),trail=normalize(character?.archetype||character?.trail||''),versatility=character?.progression_choices?.versatility||null,versName=normalize(versatility?.name||''),versTrail=normalize(versatility?.trailId||'');
    return (RuleBook.getAll?.()||[])
      .filter(r=>{
        if(r.category!=='habilidades-trilha')return false;
        const currentTrailPick=unlocked.has(normalize(r.title))&&(!trail||!r.trailId||normalize(r.trailId)===trail);
        const versatilityPick=!!versName&&normalize(r.title)===versName&&(!versTrail||normalize(r.trailId||'')===versTrail);
        return currentTrailPick||versatilityPick;
      })
      .map(r=>({name:r.title,type:r.type||r.action||'Habilidade de Trilha',action:r.action||r.type||'',range:r.range||'',duration:r.duration||'',description:r.description||r.summary||'',effect:(r.mechanics||[]).join(' | ')||r.description||'',source:'trail',trailAbility:true,ruleId:r.id,res:0,element:''}));
  }

  function derivedModifiers(character){
    const origin=originAutomation(character?.origin||''),trail=trailAutomation(character);
    return{defense:Number(trail.defense)||0,rd:Number(trail.rd)||0,initiative:Number(trail.initiative)||0,combatAttackBonus:Number(origin.combatAttackBonus)||0,physicalResistanceBonus:Number(origin.physicalResistanceBonus)||0,skillBonuses:{...(trail.skillBonuses||{})},reminders:[...(origin.reminders||[]),...(trail.reminders||[])]};
  }
  function originAutomation(origin=''){
    const id=normalize(origin);
    const map={
      'soldado-da-guerra':{reminders:['+2 em ataques físicos ou testes de resistência.'],combatAttackBonus:2},
      'sobrevivente-do-norte':{reminders:['+2 em testes de resistência física.'],physicalResistanceBonus:2},
      'nobre-elemental':{reminders:['+2 em testes sociais em ambientes políticos ou formais.']},
      'mercador':{reminders:['+2 ao negociar preços, trocar itens ou perceber golpes.']},
      'peregrino':{reminders:['+2 em testes sociais.']},
      'academico-arcano':{reminders:['1x por cena: bônus em teste de INT para estudar/analisar/compreender fenômenos mágicos.']},
      'explorador':{reminders:['1x por cena: bônus para rastrear, navegar ou evitar perigos naturais.']},
      'artista-performista':{reminders:['1x por cena: pode chamar atenção ou influenciar emocionalmente um grupo.']},
      'inventor':{reminders:['Pode improvisar ferramentas ou pequenos dispositivos com materiais disponíveis.']},
      'criminoso':{reminders:['Possui acesso narrativo a informantes ou recursos ilegais nas cidades.']}
    };
    return map[id]||{reminders:[]};
  }
  function unlockedTrailAbilities(character){
    const choices=character?.progression_choices||{};
    const selected=Array.isArray(choices.trail_abilities)?choices.trail_abilities:[];
    return new Set(selected.map(x=>normalize(typeof x==='string'?x:x?.name)));
  }
  function trailAutomation(character){
    const mods={initiative:0,defense:0,rd:0,skillBonuses:{},reminders:[]};
    const active=activeTrailAbilities(character);
    for(const ability of active){
      const rule=ruleForSkill(ability),type=plain(rule?.type||rule?.action||ability.type||''),text=[rule?.summary,...(rule?.mechanics||[])].filter(Boolean).join(' | '),p=plain(text);
      const conditional=/\bse\b|\bquando\b|\bcontra\b|\bao\b|\benquanto\b|escolha|1x por/.test(p);
      if(/passiv/.test(type)&&!conditional){
        const defense=[...text.matchAll(/(?:recebe\s+)?\+(\d+)\s+defesa/gi)].reduce((a,m)=>a+Number(m[1]||0),0);mods.defense+=defense;
        const rd=[...text.matchAll(/(?:recebe\s+)?(?:\+(\d+)\s+rd|rd\s+(\d+)|reduz todo dano recebido em\s+(\d+)\s+ponto)/gi)].reduce((a,m)=>a+Number(m[1]||m[2]||m[3]||0),0);mods.rd+=rd;
        const initiative=[...text.matchAll(/\+(\d+)\s+iniciativa/gi)].reduce((a,m)=>a+Number(m[1]||0),0);mods.initiative+=initiative;
        for(const skill of ['Percepção','Furtividade','Tecnologia']){const re=new RegExp(`\\+(\\d+)\\s+(?:em\\s+)?(?:testes?\\s+de\\s+)?${skill}`,'i'),m=text.match(re);if(m)mods.skillBonuses[skill]=(mods.skillBonuses[skill]||0)+Number(m[1]);}
      }else if(/passiv/.test(type)||conditional){
        mods.reminders.push(`${ability.name}: ${rule?.summary||ability.description||'efeito condicional'}`);
      }
    }
    return mods;
  }


  window.EDFCombatRules=Object.freeze({normalize,ACTION_LIMITS,ACTION_LABELS,RESONANCE_DT,CANONICAL,ruleForSkill,actionInfo,gradeFor,pdCost,isElemental,resonanceInfo,effectsForSkill,isAreaSkill,damageFormulaForSkill,resolutionInfo,pontariaInfo,actorUsage,actionBudget,canUseAction,fusionPreview,originAutomation,trailAutomation,unlockedTrailAbilities,activeTrailAbilities,derivedModifiers});
})();

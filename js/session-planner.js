(function(){
  let plannedSessionsFetchedAt=0;
  'use strict';

  // Sessao = documento original + anotacoes inteligentes. O texto nunca e reescrito pelo sistema.
  const META={
    test:['Teste','🎲'],enemy:['Inimigo','👹'],npc:['NPC','🎭'],location:['Local','📍'],clue:['Pista','🔎'],
    objective:['Objetivo','🎯'],scene:['Cena','§'],mechanic:['Mecanica','⚙️'],map:['Mapa','🗺️'],document:['Documento','📄'],note:['Nota','📝']
  };
  const GUIDE_ORDER=['scene','test','enemy','objective','clue','npc','location','mechanic','map','document','note'];
  let workingAnalysis=null;
  let workingSource='';

  function norm(s=''){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
  function uid(p='item'){return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;}
  function cleanLine(s=''){return String(s).replace(/^\s*[-*•]\s*/,'').trim();}
  function stripMd(s=''){return cleanLine(String(s).replace(/^\s*#{1,6}\s*/,'')).replace(/^[^A-Za-zÀ-ÿ0-9]+/u,'').trim();}
  function parseNumber(v,fallback=0){const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:fallback;}

  function parseEnemyDraft(text=''){
    const raw=cleanLine(text); const m=raw.match(/^(?:x\s*)?(\d+)\s*[x×]?\s+(.+)$/i);
    const quantity=m?Math.max(1,Number(m[1])||1):1; const body=(m?m[2]:raw).trim();
    const name=(body.split(/\s+[—–-]\s+/)[0]||body).replace(/\s*\([^)]*(?:NEX|NV|NIVEL|NÍVEL)[^)]*\)\s*$/i,'').trim();
    return {text:raw,name,quantity};
  }

  function parseList(value=''){
    return String(value||'').split(/[,;|]/).map(x=>x.trim()).filter(Boolean);
  }
  function normalizeActionLabel(value=''){
    const n=norm(value);
    if(/passiv/.test(n))return'Passivo';
    if(/reacao|reação/.test(n))return'Reação';
    if(/livre/.test(n))return'Ação Livre';
    if(/leve/.test(n))return'Ação Leve';
    if(/movimento/.test(n))return'Ação de Movimento';
    return'Ação Padrão';
  }
  function parseVisibility(value=''){
    const out={name:false,hp:false,hp_numbers:false,conditions:false,defense:false,dodge:false,block:false,movement:false,attacks:false,abilities:false};
    const map={nome:'name',hp:'hp',pv:'hp',numeros:'hp_numbers','numeros de pv':'hp_numbers','pv numerico':'hp_numbers','pv numérico':'hp_numbers',condicoes:'conditions','condições':'conditions',defesa:'defense',esquiva:'dodge',armadura:'block',bloqueio:'block',deslocamento:'movement',ataques:'attacks',habilidades:'abilities'};
    parseList(value).forEach(x=>{const k=map[norm(x)];if(k)out[k]=true;});
    return out;
  }
  function parseEnemyText(text=''){
    const raw=String(text).trim(); const lines=raw.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
    let name='',quantity=1;
    const explicit=lines.find(l=>/^\s*(?:inimigo|monstro|criatura|nome)\s*:/i.test(l));
    if(explicit){const d=parseEnemyDraft(explicit.replace(/^\s*(?:inimigo|monstro|criatura|nome)\s*:\s*/i,''));name=d.name;quantity=d.quantity;}
    if(!name){
      const heading=lines.find((l,i)=>i<3 && !/^(?:pv|def|defesa|esq|esquiva|arm|armadura|bloqueio|deslocamento|ataque|dano|habilidade|elemento|categoria|nivel|nível|condicoes|condições|visivel|visível|subtitulo|subtítulo|ligacao|ligação|conceito|efeito)\s*:/i.test(cleanLine(l)) && !/^inimigos?\s*:/i.test(l));
      if(heading){const d=parseEnemyDraft(stripMd(heading).replace(/^\*+|\*+$/g,''));name=d.name;quantity=d.quantity;}
    }
    const joined=lines.join(' | ');
    const stat=(re)=>{const m=joined.match(re);return m?parseNumber(m[1],null):null;};
    const hp=stat(/\bPV\s*[:=]?\s*(\d+)/i);
    const defense=stat(/\b(?:DEF|Defesa)\s*[:=]?\s*(\d+)/i);
    const dodge=stat(/\b(?:ESQ|Esquiva)\s*[:=]?\s*(\d+)/i);
    const block=stat(/\b(?:ARM|Armadura|Bloqueio)\s*[:=]?\s*(\d+)/i);
    const rd=stat(/\b(?:RD|Redu[cç][aã]o de Dano)\s*[:=]?\s*(\d+)/i);
    const movement=stat(/\b(?:DESL|Deslocamento)\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
    const level=stat(/\b(?:Nv\.?|Nivel|Nível|NEX)\s*[:=]?\s*(\d+)/i);
    const rankMatch=joined.match(/\b(?:Categoria|Rank)?\s*:?\s*(comum|elite|chefe)\b/i);
    const elementMatch=joined.match(/\bElemento\s*[:=]\s*([^|,;]+)/i);
    const subtitleMatch=joined.match(/\b(?:Subt[ií]tulo|Título)\s*[:=]\s*([^|]+)/i);
    const conditionsLine=lines.find(l=>/^(?:condi[cç][oõ]es(?: padr[aã]o)?|status iniciais?)\s*:/i.test(cleanLine(l)));
    const initialConditions=conditionsLine?parseList(cleanLine(conditionsLine).replace(/^[^:]+:\s*/,'')):[];
    const visibilityLine=lines.find(l=>/^(?:vis[ií]vel(?: para jogadores)?|jogadores veem)\s*:/i.test(cleanLine(l)));
    const visibility=visibilityLine?parseVisibility(cleanLine(visibilityLine).replace(/^[^:]+:\s*/,'')):null;
    const attacks=[],abilities=[];
    let section='',current=null,currentList=null;
    const flush=()=>{if(current&&current.name){current.action=normalizeActionLabel(current.action||'Ação Padrão');if(current.appliesConditions?.length&&!current.conditionRounds)current.conditionRounds=1;currentList.push(current);}current=null;currentList=null;};
    const startAction=(kind,title,tail='')=>{
      flush();currentList=kind==='attack'?attacks:abilities;current={name:String(title||'').trim(),action:'Ação Padrão',test:'',damage:'',effect:'',type:kind==='attack'?'Ataque':'',range:'',element:'',res:0,prereq:'',desc:'',appliesConditions:[],conditionRounds:0};
      const dmg=(String(tail||'').match(/\b\d+d\d+(?:\s*[+\-]\s*\d+)?\b/i)||[''])[0];
      if(dmg)current.damage=dmg.replace(/\s+/g,'');
      const leftover=String(tail||'').replace(dmg,'').replace(/^\s*[:;,\-.—–]\s*/,'').trim();if(leftover)current.effect=leftover;
    };
    const fieldForCurrent=(key,value)=>{
      if(!current)return false;const k=norm(key),v=String(value||'').trim();
      if(k==='acao'||k==='ação'||k==='tipo de acao'||k==='tipo de ação'){current.action=normalizeActionLabel(v);return true;}
      if(k==='teste'||k==='ataque'||k==='teste de ataque'){current.test=v;return true;}
      if(k==='dano'){current.damage=v.replace(/\s+/g,'');return true;}
      if(k==='efeito'){current.effect=v;return true;}
      if(k==='tipo'){current.type=v;return true;}
      if(k==='alcance'){current.range=v;return true;}
      if(k==='elemento'){current.element=v;return true;}
      if(k==='res'||k==='grau'||k==='ressonancia'||k==='ressonância'){current.res=Math.max(0,parseNumber(v,0)||0);return true;}
      if(k==='requisito'||k==='prerequisito'||k==='pré-requisito'){current.prereq=v;return true;}
      if(k==='descricao'||k==='descrição'){current.desc=v;return true;}
      if(k==='condicao'||k==='condição'||k==='condicoes'||k==='condições'||k==='aplica'){current.appliesConditions=parseList(v);return true;}
      if(k==='duracao'||k==='duração'||k==='rodadas'){current.conditionRounds=Math.max(0,parseNumber(v,0)||0);return true;}
      if(k==='area'||k==='área'){if(/^(sim|true|1)$/i.test(v)&&!/area|área/i.test(current.type))current.type=(current.type?current.type+' · ':'')+'Área';return true;}
      return false;
    };
    for(let i=0;i<lines.length;i++){
      const line=lines[i],stripped=stripMd(line);
      if(/^ataques?\s*:?$/i.test(stripped)){flush();section='attacks';continue;}
      if(/^habilidades?\s*:?$/i.test(stripped)){flush();section='abilities';continue;}
      let m=line.match(/^\s*(?:Ataque|Golpe)\s*:\s*([^—–]+?)(?:\s*[—–]\s*(.+))?$/i);
      if(m){section='attacks';startAction('attack',m[1],m[2]||'');continue;}
      m=line.match(/^\s*Habilidade\s*:\s*([^—–]+?)(?:\s*[—–]\s*(.+))?$/i);
      if(m){section='abilities';startAction('ability',m[1],m[2]||'');continue;}
      if(/^#{1,6}\s+/.test(line)&&section==='abilities'){
        const title=stripMd(line);if(title&&!/^habilidades?$/i.test(title)&&!/^(?:conceito|efeito|dano|elemento|ligacao|ligação)$/i.test(title)){startAction('ability',title);continue;}
      }
      const field=cleanLine(line).match(/^([^:]{2,28})\s*:\s*(.*)$/);
      if(field&&fieldForCurrent(field[1],field[2]))continue;
      if(current&&section==='abilities'&&!field&& !/^#{1,6}\s+/.test(line)){
        const textLine=cleanLine(line);if(textLine)current.effect=[current.effect,textLine].filter(Boolean).join(' ');
      }
    }
    flush();
    return {name:name||'Novo inimigo',subtitle:subtitleMatch?subtitleMatch[1].trim():'',quantity,hp_max:hp,defense,dodge,block,damage_reduction:rd,movement_speed:movement,level,rank:rankMatch?rankMatch[1].toLowerCase():'',element:elementMatch?elementMatch[1].trim():'',conditions:initialConditions,visibility,attacks,abilities,source:raw,missing:{hp:hp==null,defense:defense==null,dodge:dodge==null,block:block==null,rd:rd==null,movement:movement==null,level:level==null,rank:!rankMatch,element:!elementMatch}};
  }

  function addAnnotation(out,seen,type,label,line,extra={}){
    label=cleanLine(label).replace(/\s+/g,' ').trim(); if(!label)return;
    const key=`${type}|${line}|${norm(label)}`; if(seen.has(key))return;seen.add(key);
    out.push({id:uid('mark'),type,label,line,...extra});
  }

  function analyzeDocument(source=''){
    const lines=String(source).replace(/\r/g,'').split('\n'); const annotations=[]; const seen=new Set();
    let blockType='';
    const labelMap={
      'local':'location','nome do local':'location','npc':'npc','npcs':'npc','personagem':'npc',
      'inimigo':'enemy','inimigos':'enemy','monstro':'enemy','monstros':'enemy','criatura':'enemy','criaturas':'enemy','ameaca':'enemy','ameacas':'enemy','ameaça':'enemy','ameaças':'enemy',
      'pista':'clue','pistas':'clue','objetivo':'objective','objetivos':'objective','mapa':'map','mapas':'map','teste':'test','teste sugerido':'test',
      'mecanica':'mechanic','mecânica':'mechanic','enigma':'mechanic','documento':'document','documentos':'document','nota':'note','notas':'note'
    };
    for(let i=0;i<lines.length;i++){
      const raw=lines[i]; const trimmed=raw.trim(); if(!trimmed){blockType='';continue;}
      const line=cleanLine(trimmed); const label=line.match(/^([^:]{2,30}):\s*(.*)$/);
      if(label){
        const key=norm(label[1]); const value=label[2].trim(); const type=labelMap[key]; blockType=type||'';
        if(type&&value){
          if(type==='enemy'){
            value.split(/\s*;\s*/).filter(Boolean).forEach(v=>{
              const context=lines.slice(i,Math.min(lines.length,i+5)).join('\n'); addAnnotation(annotations,seen,'enemy',v,i,{source:context,draft:parseEnemyText(`${v}\n${context}`)});
            });
          }else addAnnotation(annotations,seen,type,value,i,{source:raw});
        }
        continue;
      }
      if(blockType && /^\s*[-*•]/.test(trimmed)){
        if(blockType==='enemy'){
          const context=[line,...lines.slice(i+1,Math.min(lines.length,i+5))].join('\n');addAnnotation(annotations,seen,'enemy',line,i,{source:context,draft:parseEnemyText(context)});
        }else addAnnotation(annotations,seen,blockType,line,i,{source:raw});
        continue;
      }
      blockType='';

      for(const m of line.matchAll(/TESTE\s+DE\s+([A-ZÁÀÃÂÉÊÍÓÔÕÚÇ ]{3,})(?=\.|,|;|$)/gi)) addAnnotation(annotations,seen,'test',`Teste de ${m[1].trim()}`,i,{source:raw});
      const cd=line.match(/\b([A-Za-zÀ-ÿ ]{3,25})\s*\(CD\s*(\d+)\)/i); if(cd)addAnnotation(annotations,seen,'test',`${cd[1].trim()} • CD ${cd[2]}`,i,{source:raw});

      const next=(lines[i+1]||'').trim();
      if(next && /\bPV\s*[:=]\s*\d+/i.test(next) && !/^(?:pv|def|defesa|ataque|dano)\s*:/i.test(line)){
        const possible=stripMd(line).replace(/^\*+|\*+$/g,'');
        if(possible.length<90){const context=lines.slice(i,Math.min(lines.length,i+7)).join('\n');addAnnotation(annotations,seen,'enemy',parseEnemyDraft(possible).name,i,{source:context,draft:parseEnemyText(context)});}
      }
    }
    return {version:5,annotations};
  }

  function looksLikeSceneTitle(text=''){return /^(?:cena\s*\d+\b|abertura\b|ep[ií]logo\b|final da sess[aã]o\b)/i.test(stripMd(text));}
  function looksLikeEnemyTitle(text='',context=''){
    const t=stripMd(text),c=norm(context);
    if(!t||t.length>90||looksLikeSceneTitle(t))return false;
    if(/^(?:soldado|guardiao|guardi[aã]o|criatura|monstro|chefe|boss|zumbi|ghoul|afogado|ara[uú]to|vampiro|degolificado|rastejante)\b/i.test(t))return true;
    return false;
  }
  function collectEnemyBlock(blocks,start){
    const first=blocks[start];let out=[first?.text||''];const level=first?.level||2;
    for(let i=start+1;i<blocks.length;i++){
      const b=blocks[i];if(looksLikeSceneTitle(b.text||''))break;
      if(b.heading&&b.level<=level&&looksLikeEnemyTitle(b.text||'', '')&&!/^habilidades?$/i.test(stripMd(b.text||'')))break;
      out.push((b.heading?'# '.repeat(Math.max(1,b.level||2)):'')+(b.text||''));
    }
    return out.join('\n').trim();
  }
  function analyzeStructuredBlocks(blocks=[]){
    const annotations=[],seen=new Set();let scene='',section='';
    const add=(type,label,b,extra={})=>addAnnotation(annotations,seen,type,label,b.line??0,{source:b.source||b.text||'',anchor:b.anchor||'',...extra});
    for(let i=0;i<blocks.length;i++){
      const b=blocks[i],text=stripMd(b.text||'');if(!text)continue;
      if(b.heading){
        if(looksLikeSceneTitle(text)){scene=text;section='';add('scene',text,b,{importance:'navigation'});continue;}
        if(/objetivo principal/i.test(text)){section='objective';continue;}
        if(/^(?:habilidades?)$/i.test(text)){section='abilities';continue;}
        if(/^(?:cidade|setor|instalacao|instalação|montanha|porto|taverna|biblioteca|mansao|mansão|praia|catedral|fabrica|fábrica)\b/i.test(text)){add('location',text,b,{scene});section='';continue;}
        if(/^nome\s*:/i.test(text)){
          const name=text.replace(/^nome\s*:\s*/i,'').trim(),source=collectEnemyBlock(blocks,i);
          add('enemy',name,b,{scene,source,draft:parseEnemyText(source),confidence:'high'});section='enemy';continue;
        }
        const following=(blocks[i+1]?.text||'')+' '+(blocks[i+2]?.text||'');
        if(looksLikeEnemyTitle(text,`${scene} ${section}`)||/\bPV\s*[:=]?\s*\d+/i.test(following)){
          const source=collectEnemyBlock(blocks,i);add('enemy',text,b,{scene,source,draft:parseEnemyText(source),confidence:/\bPV\s*[:=]?\s*\d+/i.test(following)?'stats':'context'});section='enemy';continue;
        }
        section=norm(text);
      }
      const raw=text;
      if(section==='objective'&&b.listItem){add('objective',raw,b,{scene});continue;}
      if(/^objetivo\s*:/i.test(raw)){add('objective',raw.replace(/^objetivo\s*:\s*/i,''),b,{scene});continue;}
      if(/^local\s*:/i.test(raw)){add('location',raw.replace(/^local\s*:\s*/i,''),b,{scene});continue;}
      if(/^pistas?\s*:/i.test(raw)){const v=raw.replace(/^pistas?\s*:\s*/i,'');if(v)add('clue',v,b,{scene});section='clue';continue;}
      if(section==='clue'&&b.listItem){add('clue',raw,b,{scene});continue;}
      for(const m of raw.matchAll(/TESTE\s+DE\s+([A-ZÁÀÃÂÉÊÍÓÔÕÚÇ ]{3,})(?=\.|,|;|$)/gi))add('test',`Teste de ${m[1].trim()}`,b,{scene});
      const cd=raw.match(/\b([A-Za-zÀ-ÿ ]{3,25})\s*\(CD\s*(\d+)\)/i);if(cd)add('test',`${cd[1].trim()} • CD ${cd[2]}`,b,{scene});
    }
    for(const a of annotations.filter(x=>x.type==='enemy')){
      a.draft=parseEnemyText(a.source||a.label);
      if(!a.draft.element){const m=(a.source||'').match(/Elemento\s*:\s*\**([^\n*]+)/i);if(m){a.draft.element=m[1].trim();a.draft.missing.element=false;}}
      if(/guardiao|guardi[aã]o|eclipse|chefe/i.test(a.label)&&!a.draft.rank){a.draft.rank='chefe';a.draft.inferredRank=true;}
    }
    return {version:6,annotations};
  }
  function textToStructuredBlocks(text=''){
    return String(text||'').replace(/\r/g,'').split('\n').map((raw,i)=>{const t=raw.trim(),m=t.match(/^(#{1,6})\s+(.+)$/);return {text:m?m[2]:cleanLine(t),heading:!!m,level:m?m[1].length:0,listItem:/^\s*[-*•]\s+/.test(raw),line:i,anchor:`line-${i}`};}).filter(x=>x.text);
  }
  function htmlToStructuredBlocks(html='',fallbackText=''){
    if(typeof DOMParser==='undefined')return textToStructuredBlocks(fallbackText||html);
    const doc=new DOMParser().parseFromString(`<div>${String(html||'')}</div>`,'text/html'),root=doc.body.firstElementChild;if(!root)return textToStructuredBlocks(fallbackText);
    const blocks=[];let line=0;
    const push=(el,text,listItem=false)=>{text=String(text||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();if(!text)return;const tag=el?.tagName||'',heading=/^H[1-6]$/.test(tag);blocks.push({text,heading,level:heading?Number(tag[1]):0,listItem,line:line++,anchor:`block-${blocks.length}`});};
    for(const el of root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote'))push(el,el.innerText||el.textContent,el.tagName==='LI');
    return blocks.length?blocks:textToStructuredBlocks(fallbackText);
  }
  function analyzeDocumentHtml(html='',plain=''){return analyzeStructuredBlocks(htmlToStructuredBlocks(html,plain));}

  // Compatibilidade com testes e sessoes V5: ainda expomos uma visao de atos/cenas, sem usa-la na UI.
  function parseNarrativePlan(source=''){
    const lines=String(source).replace(/\r/g,'').split('\n'); const outline=[]; let act={id:uid('act'),title:'Sessao',scenes:[]};outline.push(act);let scene=null,buf=[];
    const flush=()=>{if(!scene)return;scene.body=buf.join('\n').trim();scene.resources=extractResources(scene.body);act.scenes.push(scene);scene=null;buf=[];};
    for(const raw of lines){const t=stripMd(raw);if(/^sess[aã]o\s*:/i.test(t))continue;if(/^(?:ato\s+\d+|ato\s+[ivxlcdm]+)\b/i.test(t)){flush();act={id:uid('act'),title:t.replace(/^ato\s+(?:\d+|[ivxlcdm]+)\s*[:—–-]?\s*/i,'')||'Ato',scenes:[]};outline.push(act);continue;}if(/^(?:cena\s*\d*\s*[:—–-]|\d+[.)-]\s+|abertura\s*[:—–-]|epilogo\b|epílogo\b)/i.test(t)){flush();scene={id:uid('scene'),title:t.replace(/^cena\s*\d*\s*[:—–-]\s*/i,'').replace(/^\d+[.)-]\s*/,'').trim()||'Cena',body:'',resources:[]};continue;}if(!scene)scene={id:uid('scene'),title:'Abertura',body:'',resources:[]};buf.push(raw);}
    flush();return {version:3,outline:outline.filter(a=>a.scenes.length)};
  }
  function extractResources(body=''){return analyzeDocument(body).annotations.map(a=>({id:a.id,type:a.type,text:a.label,template_id:a.template_id||''}));}
  function normalizePlan(plan){return plan||{};}
  function planStats(plan){if(plan?.annotations)return {acts:0,scenes:0,resources:plan.annotations.length};const scenes=(plan?.outline||[]).flatMap(a=>a.scenes||[]);return {acts:plan?.outline?.length||0,scenes:scenes.length,resources:scenes.reduce((n,s)=>n+(s.resources?.length||0),0)};}
  window.SessionPlannerDomain=Object.freeze({analyzeDocument,analyzeDocumentHtml,analyzeStructuredBlocks,textToStructuredBlocks,parseEnemyText,parseEnemyDraft,parseNarrativePlan,extractResources,normalizePlan,planStats});

  function sessionAnalysis(session){
    const p=session?.plan&&typeof session.plan==='object'?session.plan:{};
    if((p.version===4||p.version===5||p.version===6)&&Array.isArray(p.annotations))return {version:p.version,annotations:p.annotations,__desk:p.__desk||{}};
    const a=analyzeDocument(session?.source_text||'');a.__desk=p.__desk||{};return a;
  }
  function desk(session){const p=sessionAnalysis(session);return {scratch:String(p.__desk?.scratch||'')};}
  function countByType(a){const c={};for(const x of a||[])c[x.type]=(c[x.type]||0)+1;return c;}
  function bestiaryMatch(label){const n=parseEnemyDraft(label).name;return (masterBestiaryCache||[]).find(e=>norm(e.name)===norm(n));}

  window.renderSessionPlanner=function(){
    const sessions=Array.isArray(plannedSessionsCache)?plannedSessionsCache:[];
    return `<section class="doc-planner-home"><header><div><span class="section-eyebrow">PREPARACAO</span><h3>Documentos de sessao</h3><p>Um documento simples e editavel para cada sessao. Cole do Google Docs, mantenha a formatacao e abra rapidamente durante a mesa.</p></div><button class="primary-action" data-click-call="openSessionPlanComposer()">+ Novo documento</button></header><div class="doc-session-list">${sessions.map(renderSessionCard).join('')||`<div class="planner-empty-state"><strong>Nenhum documento de sessao</strong><p>Crie um documento, cole seu planejamento e edite livremente quando precisar.</p><button class="primary-action" data-click-call="openSessionPlanComposer()">Criar primeiro documento</button></div>`}</div></section>`;
  };
  function documentSummary(s){
    const text=String(s?.source_text||'').trim();
    if(!text)return 'Documento vazio';
    const words=text.split(/\s+/).filter(Boolean).length;
    return `${words} palavras`;
  }
  function renderSessionCard(s){
    const active=!!s.active;
    return `<article class="doc-session-row ${active?'active':''}"><div><span>${active?'● EM ANDAMENTO':'DOCUMENTO'}</span><h4>${escapeHtml(s.title||'Sessao')}</h4><p>${documentSummary(s)}</p></div><div>${active?`<button class="primary-action" data-click-call="openActiveSessionDocument()">Abrir documento</button>`:`<button class="primary-action" data-click-call="startPlannedSession('${escapeAttr(s.id)}')">▶ Iniciar</button>`}<button data-click-call="editSessionPlan('${escapeAttr(s.id)}')">Editar</button><button class="danger-text" data-click-call="deleteSessionPlan('${escapeAttr(s.id)}')">Excluir</button></div></article>`;
  }

  function plainTextToDocumentHtml(text=''){
    const lines=String(text||'').replace(/\r/g,'').split('\n');
    let html='',list='';
    const closeList=()=>{if(list){html+=`</${list}>`;list='';}};
    for(const raw of lines){
      const t=raw.trim();
      if(!t){closeList();html+='<p><br></p>';continue;}
      const heading=t.match(/^#{1,6}\s+(.+)$/);
      if(heading){closeList();const level=Math.min(4,(t.match(/^#+/)||['#'])[0].length+1);html+=`<h${level}>${escapeHtml(heading[1])}</h${level}>`;continue;}
      if(/^\s*[-*•]\s+/.test(raw)){if(list!=='ul'){closeList();list='ul';html+='<ul>';}html+=`<li>${escapeHtml(cleanLine(raw))}</li>`;continue;}
      const numbered=t.match(/^\d+[.)]\s+(.+)/);if(numbered){if(list!=='ol'){closeList();list='ol';html+='<ol>';}html+=`<li>${escapeHtml(numbered[1])}</li>`;continue;}
      closeList();html+=`<p>${escapeHtml(raw)}</p>`;
    }
    closeList();return html||'<p><br></p>';
  }

  function safeCssStyle(style=''){
    const allowed=new Set(['font-weight','font-style','text-decoration','text-align','font-size','color','background-color','margin-left','padding-left','list-style-type']);
    return String(style).split(';').map(x=>x.trim()).filter(Boolean).map(rule=>{
      const i=rule.indexOf(':');if(i<1)return '';const k=rule.slice(0,i).trim().toLowerCase(),v=rule.slice(i+1).trim();
      if(!allowed.has(k)||!/^[#(),.%\-\w\s]+$/.test(v))return '';
      if((k==='color'||k==='background-color') && /url|expression/i.test(v))return '';
      return `${k}:${v}`;
    }).filter(Boolean).join(';');
  }

  function sanitizeSessionHtml(html=''){
    if(typeof DOMParser==='undefined')return String(html||'');
    const doc=new DOMParser().parseFromString(`<div>${String(html||'')}</div>`,'text/html');
    const root=doc.body.firstElementChild; if(!root)return '';
    const allowed=new Set(['P','DIV','BR','H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','STRONG','B','EM','I','U','S','A','SPAN','HR','PRE','CODE','TABLE','THEAD','TBODY','TR','TH','TD']);
    const drop=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH','FORM','INPUT','BUTTON','TEXTAREA','SELECT','META','LINK']);
    const walk=(node)=>{
      for(const child of [...node.children]){
        if(drop.has(child.tagName)){child.remove();continue;}
        if(!allowed.has(child.tagName)){const children=[...child.childNodes];child.replaceWith(...children);for(const n of children)if(n.nodeType===1)walk(n);continue;}
        const style=safeCssStyle(child.getAttribute('style')||'');
        const href=child.tagName==='A'&&/^https?:\/\//i.test(child.getAttribute('href')||'')?child.getAttribute('href'):'';
        const colspan=/^\d{1,2}$/.test(child.getAttribute('colspan')||'')?child.getAttribute('colspan'):'';
        const rowspan=/^\d{1,2}$/.test(child.getAttribute('rowspan')||'')?child.getAttribute('rowspan'):'';
        for(const attr of [...child.attributes])child.removeAttribute(attr.name);
        if(style)child.setAttribute('style',style);
        if(href){child.setAttribute('href',href);child.setAttribute('target','_blank');child.setAttribute('rel','noopener noreferrer');}
        if((child.tagName==='TD'||child.tagName==='TH')&&colspan)child.setAttribute('colspan',colspan);
        if((child.tagName==='TD'||child.tagName==='TH')&&rowspan)child.setAttribute('rowspan',rowspan);
        walk(child);
      }
    };
    walk(root);return root.innerHTML;
  }

  function sessionDocumentHtml(session){
    const html=session?.plan?.document_html;
    return sanitizeSessionHtml(html||plainTextToDocumentHtml(session?.source_text||''));
  }

  function editorPlainText(){
    const el=document.getElementById('planner-source-rich');
    return String(el?.innerText||'').replace(/\u00a0/g,' ').replace(/\n{3,}/g,'\n\n').trimEnd();
  }
  function editorHtml(){const el=document.getElementById('planner-source-rich');return sanitizeSessionHtml(el?.innerHTML||'');}

  function refreshSessionDocumentNavigation(editor){
    const select=document.getElementById('session-doc-jump');
    if(!select||!editor)return;
    const current=select.value;
    const headings=[...editor.querySelectorAll('h1,h2,h3')].filter(h=>String(h.textContent||'').trim());
    select.innerHTML='<option value="">Ir para uma secao...</option>'+headings.map((h,i)=>`<option value="${i}">${escapeHtml(String(h.textContent||'').trim().slice(0,90))}</option>`).join('');
    if([...select.options].some(o=>o.value===current))select.value=current;
    select.disabled=!headings.length;
  }
  function initEditableSessionDocument(editorId){
    const editor=document.getElementById(editorId);if(!editor||editor.dataset.ready)return;editor.dataset.ready='1';
    let navTimer=null;
    editor.addEventListener('paste',ev=>{
      const html=ev.clipboardData?.getData('text/html');if(!html)return;
      ev.preventDefault();const clean=sanitizeSessionHtml(html);editor.focus();
      try{document.execCommand('insertHTML',false,clean);}catch(_){const sel=window.getSelection?.();if(sel?.rangeCount){const r=sel.getRangeAt(0);r.deleteContents();const frag=r.createContextualFragment(clean);r.insertNode(frag);r.collapse(false);}}
      clearTimeout(navTimer);navTimer=setTimeout(()=>refreshSessionDocumentNavigation(editor),120);
    });
    editor.addEventListener('input',()=>{const status=document.querySelector('[data-session-doc-status]');if(status)status.textContent='Alteracoes nao salvas';clearTimeout(navTimer);navTimer=setTimeout(()=>refreshSessionDocumentNavigation(editor),180);});
    refreshSessionDocumentNavigation(editor);
  }
  window.jumpSessionDocumentHeading=function(value){
    if(value==='')return;
    const editor=document.getElementById('session-quick-rich');if(!editor)return;
    const headings=[...editor.querySelectorAll('h1,h2,h3')].filter(h=>String(h.textContent||'').trim());
    const target=headings[Number(value)];if(!target)return;
    target.scrollIntoView({behavior:'smooth',block:'start'});
    target.classList.add('session-doc-jump-flash');
    setTimeout(()=>target.classList.remove('session-doc-jump-flash'),1100);
  };
  window.initRichSessionEditor=function(){initEditableSessionDocument('planner-source-rich');};
  function activeEditor(){return document.getElementById('planner-source-rich')||document.getElementById('session-quick-rich');}
  window.formatSessionDocument=function(command,value=''){
    const editor=activeEditor();if(!editor)return;editor.focus();
    if(command==='formatBlock')document.execCommand('formatBlock',false,value);else document.execCommand(command,false,value||null);
  };
  window.clearSessionDocumentFormatting=function(){const e=activeEditor();if(!e)return;e.focus();document.execCommand('removeFormat',false,null);};

  function documentToolbar(){return `<div class="rich-doc-toolbar" role="toolbar" aria-label="Formatacao do documento"><button title="Titulo" data-click-call="formatSessionDocument('formatBlock','h2')">Titulo</button><button title="Subtitulo" data-click-call="formatSessionDocument('formatBlock','h3')">Subtitulo</button><span></span><button title="Negrito" data-click-call="formatSessionDocument('bold')"><b>B</b></button><button title="Italico" data-click-call="formatSessionDocument('italic')"><i>I</i></button><button title="Sublinhado" data-click-call="formatSessionDocument('underline')"><u>U</u></button><span></span><button title="Lista" data-click-call="formatSessionDocument('insertUnorderedList')">• Lista</button><button title="Lista numerada" data-click-call="formatSessionDocument('insertOrderedList')">1. Lista</button><button title="Limpar formatacao" data-click-call="clearSessionDocumentFormatting()">Limpar</button></div>`;}

  window.openSessionPlanComposer=function(id=''){
    const existing=plannedSessionsCache.find(x=>String(x.id)===String(id));
    document.getElementById('session-plan-composer')?.remove();
    const docHtml=existing?sessionDocumentHtml(existing):'<p><br></p>';
    document.body.insertAdjacentHTML('beforeend',`<div id="session-plan-composer" class="planner-modal planner-modal-simple" data-session-id="${escapeAttr(existing?.id||'')}"><button class="picker-backdrop" data-click-call="closeSessionPlanComposer()"></button><section class="doc-composer doc-composer-simple"><header><div><span class="section-eyebrow">DOCUMENTO DA SESSAO</span><h3>${existing?'Editar '+escapeHtml(existing.title||'sessao'):'Nova sessao'}</h3><p>Cole do Google Docs e continue editando normalmente. Nenhuma analise ou modo de leitura.</p></div><div class="doc-composer-actions"><button data-click-call="closeSessionPlanComposer()">Fechar</button><button class="primary-action" data-click-call="saveSessionPlan()">Salvar</button></div></header><main class="doc-editor-simple"><label class="doc-title-field">Nome da sessao<input id="planner-title" value="${escapeAttr(existing?.title||'')}" placeholder="Ex.: Mansao dos Olhos"></label><div class="rich-doc-shell">${documentToolbar()}<div id="planner-source-rich" class="rich-doc-editor rich-doc-editor-simple" contenteditable="true" spellcheck="true" data-placeholder="Cole aqui seu documento do Google Docs ou escreva normalmente...">${docHtml}</div><footer><span>Formatacao principal do Google Docs preservada.</span><span data-session-doc-status>Pronto para editar</span></footer></div></main></section></div>`);
    setTimeout(()=>initEditableSessionDocument('planner-source-rich'),0);
  };
  window.closeSessionPlanComposer=function(){document.getElementById('session-plan-composer')?.remove();};
  window.editSessionPlan=function(id){openSessionPlanComposer(id);};

  window.saveSessionPlan=async function(){
    if(currentRole!=='admin')return;const title=(document.getElementById('planner-title')?.value||'').trim();const editor=document.getElementById('planner-source-rich');const source=String(editor?.innerText||'').replace(/\u00a0/g,' ').replace(/\n{3,}/g,'\n\n').trimEnd();const documentHtml=sanitizeSessionHtml(editor?.innerHTML||'');if(!title)return alert('De um nome para a sessao.');if(!source.trim())return alert('O documento da sessao esta vazio.');
    const modal=document.getElementById('session-plan-composer'),editId=modal?.dataset.sessionId||'',editing=plannedSessionsCache.find(x=>String(x.id)===String(editId));
    const plan={...(editing?.plan||{}),version:7,document_html:documentHtml,annotations:[]};const payload={owner_id:currentUser.id,title,source_text:source,plan,active:!!editing?.active,status:editing?.active?'active':(editing?.status==='finished'?'finished':'planned'),updated_at:new Date().toISOString()};
    const result=editId?await supabaseClient.from('game_sessions').update(payload).eq('id',editId).select().single():await supabaseClient.from('game_sessions').insert(payload).select().single();if(result.error)return alert('Nao foi possivel salvar.\n'+result.error.message);if(editing?.active)activeGameSession=result.data;closeSessionPlanComposer();await loadPlannedSessions();syncSessionDocumentLauncher();await loadMasterHub(editing?.active?'session':'planning');
  };

  window.renderActiveSessionPlan=function(){return '';};

  window.syncSessionDocumentLauncher=function(){
    document.getElementById('session-document-fab')?.remove();
    if(currentRole!=='admin'||!activeGameSession?.id)return;
    document.body.insertAdjacentHTML('beforeend',`<button id="session-document-fab" class="session-document-fab" title="Abrir documento da sessao" aria-label="Abrir documento da sessao" data-click-call="openActiveSessionDocument()"><span aria-hidden="true">📖</span><small>${escapeHtml(activeGameSession.title||'Sessao')}</small></button>`);
  };

  window.openActiveSessionDocument=function(){
    if(!activeGameSession)return;
    document.getElementById('active-session-document')?.remove();
    const html=sessionDocumentHtml(activeGameSession);
    document.body.insertAdjacentHTML('beforeend',`<div id="active-session-document" class="session-doc-drawer"><button class="session-doc-drawer-backdrop" data-click-call="closeActiveSessionDocument()" aria-label="Fechar documento"></button><section class="session-doc-drawer-panel"><header><div><span class="section-eyebrow">SESSAO EM ANDAMENTO</span><input id="session-quick-title" class="session-doc-title-input" value="${escapeAttr(activeGameSession.title||'Sessao')}" aria-label="Nome da sessao"></div><div class="session-doc-header-tools"><select id="session-doc-jump" class="session-doc-jump" data-change-call="jumpSessionDocumentHeading(this.value)" aria-label="Ir para secao do documento"><option value="">Ir para uma secao...</option></select><span data-session-doc-status>Pronto para editar</span><button data-click-call="closeActiveSessionDocument()">Fechar</button><button class="primary-action" data-click-call="saveActiveSessionDocument()">Salvar</button></div></header><div class="session-doc-drawer-body"><div class="rich-doc-shell">${documentToolbar()}<div id="session-quick-rich" class="rich-doc-editor rich-doc-editor-quick" contenteditable="true" spellcheck="true">${html}</div></div></div></section></div>`);
    setTimeout(()=>{initEditableSessionDocument('session-quick-rich');},0);
  };
  window.closeActiveSessionDocument=function(){document.getElementById('active-session-document')?.remove();};
  window.saveActiveSessionDocument=async function(){
    if(currentRole!=='admin'||!activeGameSession)return;const editor=document.getElementById('session-quick-rich');if(!editor)return;const title=(document.getElementById('session-quick-title')?.value||activeGameSession.title||'Sessao').trim()||'Sessao';const source=String(editor.innerText||'').replace(/\u00a0/g,' ').replace(/\n{3,}/g,'\n\n').trimEnd();const documentHtml=sanitizeSessionHtml(editor.innerHTML||'');const plan={...(activeGameSession.plan||{}),version:7,document_html:documentHtml,annotations:[]};const {data,error}=await supabaseClient.from('game_sessions').update({title,source_text:source,plan,updated_at:new Date().toISOString()}).eq('id',activeGameSession.id).select().single();if(error)return alert(error.message);activeGameSession=data;const i=plannedSessionsCache.findIndex(x=>String(x.id)===String(data.id));if(i>=0)plannedSessionsCache[i]=data;const st=document.querySelector('[data-session-doc-status]');if(st)st.textContent='Salvo';syncSessionDocumentLauncher();
  };

  function decorateDocumentHtml(session,annotations){
    const clean=sessionDocumentHtml(session);if(typeof DOMParser==='undefined')return clean;
    const doc=new DOMParser().parseFromString(`<article>${clean}</article>`,'text/html'),root=doc.body.firstElementChild;if(!root)return clean;
    const sourceLines=String(session?.source_text||'').replace(/\r/g,'').split('\n');
    const candidates=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote')];let cursor=0;
    const n=s=>norm(String(s||'').replace(/\s+/g,' '));
    candidates.forEach((el,i)=>{if(!el.id)el.id=`doc-line-${i}`;el.dataset.docBlock=String(i);});
    // Compatibilidade com marcacoes antigas baseadas em linha de texto puro.
    for(let i=0;i<sourceLines.length;i++){
      const target=n(sourceLines[i]);if(!target)continue;
      for(let j=cursor;j<candidates.length;j++){
        const txt=n(candidates[j].textContent);if(txt===target||txt.includes(target)||target.includes(txt)){candidates[j].dataset.sourceLine=String(i);cursor=j+1;break;}
      }
    }
    const groups={};for(const a of annotations||[]){const key=a.anchor||`line-${Number(a.line)||0}`;(groups[key]||(groups[key]=[])).push(a);}
    for(const [key,marks] of Object.entries(groups)){
      let anchor=null;
      if(/^block-\d+$/.test(key))anchor=candidates[Number(key.slice(6))]||null;
      if(!anchor&&/^line-\d+$/.test(key)){
        const line=Number(key.slice(5))||0;anchor=root.querySelector(`[data-source-line="${line}"]`)||root.querySelector(`#doc-line-${line}`);
        if(!anchor){const target=n(sourceLines[line]||'');anchor=candidates.find(x=>target&&n(x.textContent).includes(target));}
      }
      if(!anchor)continue;
      const nonScene=marks.filter(a=>a.type!=='scene');if(!nonScene.length)continue;
      const wrap=doc.createElement('div');wrap.className='inline-reminders-v7';
      for(const a of nonScene){const meta=META[a.type]||['Lembrete','•'];const badge=doc.createElement('div');badge.className=`inline-reminder-v7 ${a.type}`;const icon=doc.createElement('span');icon.textContent=meta[1];const copy=doc.createElement('div');const sm=doc.createElement('small');sm.textContent=meta[0];const strong=doc.createElement('strong');strong.textContent=a.label;copy.append(sm,strong);badge.append(icon,copy);wrap.appendChild(badge);}
      anchor.insertAdjacentElement('afterend',wrap);
    }
    return root.innerHTML;
  }

  window.renderActiveSessionPlan=function(){return '';};


  window.openEnemyFromSessionMark=function(markId){const a=sessionAnalysis(activeGameSession).annotations.find(x=>String(x.id)===String(markId));if(a)openBestiaryTextImporter(a.source||a.label);};
  window.openPlannedEnemy=function(templateId){switchTab('bestiario');setTimeout(()=>openEnemyDetails(templateId),80);};
  window.addPlannedEnemyToBattle=async function(templateId){const t=(masterBestiaryCache||[]).find(x=>String(x.id)===String(templateId));if(!t)return;if(typeof addTemplateToBattle==='function')await addTemplateToBattle(templateId);else {switchTab('bestiario');setTimeout(()=>openEnemyDetails(templateId),80);}};

  window.loadPlannedSessions=async function({force=false}={}){if(currentRole!=='admin')return;if(!force&&plannedSessionsFetchedAt&&Date.now()-plannedSessionsFetchedAt<15000&&plannedSessionsCache.length){syncSessionDocumentLauncher();return;}const {data,error}=await supabaseClient.from('game_sessions').select('*').eq('owner_id',currentUser.id).order('updated_at',{ascending:false});if(error){masterSetupWarnings.push('Planejamento: '+error.message);syncSessionDocumentLauncher();return;}plannedSessionsCache=data||[];plannedSessionsFetchedAt=Date.now();activeGameSession=plannedSessionsCache.find(x=>x.active)||null;syncSessionDocumentLauncher();};
  window.startPlannedSession=async function(id){if(currentRole!=='admin')return;const chosen=plannedSessionsCache.find(x=>String(x.id)===String(id));if(!chosen)return;if(activeGameSession?.id&&String(activeGameSession.id)!==String(id)&&!confirm(`Finalizar “${activeGameSession.title}” e iniciar “${chosen.title}”?`))return;await supabaseClient.from('game_sessions').update({active:false,status:'finished',ended_at:new Date().toISOString()}).eq('owner_id',currentUser.id).eq('active',true);const {data,error}=await supabaseClient.from('game_sessions').update({active:true,status:'active',started_at:new Date().toISOString(),ended_at:null,updated_at:new Date().toISOString()}).eq('id',id).select().single();if(error)return alert(error.message);activeGameSession=data;syncSessionClockTimer();await loadPlannedSessions();syncSessionDocumentLauncher();await loadMasterHub('session');};
  window.deleteSessionPlan=async function(id){const s=plannedSessionsCache.find(x=>String(x.id)===String(id));if(!s||s.active)return alert('Finalize a sessao antes de exclui-la.');if(!confirm(`Excluir “${s.title}”? O Bestiario nao sera alterado.`))return;const {error}=await supabaseClient.from('game_sessions').delete().eq('id',id);if(error)return alert(error.message);await loadPlannedSessions();await loadMasterHub('planning');};

  function valueOrBlank(v){return v==null?'':v;}
  function importerPreview(d){
    const missing=Object.entries(d.missing||{}).filter(([,v])=>v).map(([k])=>({hp:'PV',defense:'Defesa',dodge:'Esquiva',block:'Armadura',rd:'RD',movement:'Deslocamento',level:'Nivel',rank:'Categoria',element:'Elemento'}[k]||k));
    const abilities=d.abilities||[],conditions=d.conditions||[];
    const actionSummary=a=>[a.action,a.test?`Teste ${a.test}`:'',a.damage?`Dano ${a.damage}`:'',a.type,a.range,a.element,a.res?`RES ${a.res}`:'',a.appliesConditions?.length?`Aplica ${a.appliesConditions.join(', ')}`:'',a.conditionRounds?`${a.conditionRounds} rodada(s)`:'' ].filter(Boolean).join(' • ');
    return `<div class="enemy-text-review"><div class="enemy-import-warning ${missing.length?'show':''}">${missing.length?`⚠ Nao informado no texto: ${escapeHtml(missing.join(', '))}. Revise antes de salvar.`:'✓ Todos os atributos principais foram encontrados no texto.'}</div><div class="enemy-import-grid"><label>Nome<input id="enemy-import-name" value="${escapeAttr(d.name)}"></label><label>Subtitulo<input id="enemy-import-subtitle" value="${escapeAttr(d.subtitle||'')}"></label><label>Quantidade na referencia<input value="${d.quantity}" disabled></label><label>PV<input id="enemy-import-hp" type="number" placeholder="Nao informado" value="${valueOrBlank(d.hp_max)}"></label><label>Defesa<input id="enemy-import-def" type="number" placeholder="Nao informado" value="${valueOrBlank(d.defense)}"></label><label>Esquiva<input id="enemy-import-dodge" type="number" placeholder="Nao informado" value="${valueOrBlank(d.dodge)}"></label><label>Armadura<input id="enemy-import-block" type="number" placeholder="Nao informado" value="${valueOrBlank(d.block)}"></label><label>RD<input id="enemy-import-rd" type="number" placeholder="Nao informado" value="${valueOrBlank(d.damage_reduction)}"></label><label>Deslocamento<input id="enemy-import-move" type="number" step="0.5" placeholder="Nao informado" value="${valueOrBlank(d.movement_speed)}"></label><label>Nivel<input id="enemy-import-level" type="number" placeholder="Nao informado" value="${valueOrBlank(d.level)}"></label><label>Categoria<select id="enemy-import-rank"><option value="">Nao informada</option>${['comum','elite','chefe'].map(x=>`<option value="${x}" ${d.rank===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Elemento<input id="enemy-import-element" placeholder="Nao informado" value="${escapeAttr(d.element)}"></label><label>Condicoes iniciais<input id="enemy-import-conditions" value="${escapeAttr(conditions.join(', '))}" placeholder="Ex.: Lento, Encharcado"></label></div><div class="enemy-import-attacks"><strong>Ataques interpretados</strong>${d.attacks.length?d.attacks.map(a=>`<div><b>${escapeHtml(a.name)}</b><span>${escapeHtml(actionSummary(a)||'Ação Padrão')}</span><small>${escapeHtml(a.effect||a.desc||'')}</small></div>`).join(''):'<small>Nenhum ataque explicito encontrado.</small>'}<strong>Habilidades interpretadas</strong>${abilities.length?abilities.map(a=>`<div><b>${escapeHtml(a.name)}</b><span>${escapeHtml(actionSummary(a)||'Ação Padrão')}</span><small>${escapeHtml(a.effect||a.desc||'')}</small></div>`).join(''):'<small>Nenhuma habilidade estruturada encontrada.</small>'}</div><p>A importacao preserva ação, teste, dano, efeito, tipo, alcance, elemento, RES, requisito e condições automáticas de cada ação. Campos ausentes continuam revisáveis antes de salvar.</p></div>`;
  }

  window.openBestiaryTextImporter=function(initial=''){
    document.getElementById('enemy-text-importer')?.remove();const draft=parseEnemyText(initial||'');
    document.body.insertAdjacentHTML('beforeend',`<div id="enemy-text-importer" class="picker-modal"><button class="picker-backdrop" data-click-call="document.getElementById('enemy-text-importer').remove()"></button><section class="picker-panel enemy-text-importer"><header class="picker-head"><div><span class="section-eyebrow">BESTIARIO • DO TEXTO</span><h3>Interpretar inimigo</h3><small>Cole uma descricao ou bloco de ficha e revise o resultado.</small></div><button data-click-call="document.getElementById('enemy-text-importer').remove()">✕</button></header><label>Texto do inimigo<textarea id="enemy-import-source" placeholder="Ex.: Guardiao do Sino\nPV: 80 | DEF: 14\nAtaque: Martelo — 2d8 de dano">${escapeHtml(initial||'')}</textarea></label><button data-click-call="reanalyzeBestiaryText()">✦ Interpretar texto</button><div id="enemy-import-preview">${importerPreview(draft)}</div><footer><button data-click-call="document.getElementById('enemy-text-importer').remove()">Cancelar</button><button class="primary-action" data-click-call="saveBestiaryFromText()">Salvar no Bestiario</button></footer></section></div>`);
  };
  window.reanalyzeBestiaryText=function(){const d=parseEnemyText(document.getElementById('enemy-import-source')?.value||'');const p=document.getElementById('enemy-import-preview');if(p)p.innerHTML=importerPreview(d);};
  window.saveBestiaryFromText=async function(){if(currentRole!=='admin')return;const source=document.getElementById('enemy-import-source')?.value||'';const d=parseEnemyText(source);const name=(document.getElementById('enemy-import-name')?.value||d.name).trim();if(!name)return alert('Informe o nome do inimigo.');const existing=(masterBestiaryCache||[]).find(e=>norm(e.name)===norm(name));if(existing&&!confirm(`Ja existe “${existing.name}” no Bestiario. Criar outra ficha mesmo assim?`))return;const defaultVisibility={name:true,hp:true,hp_numbers:false,conditions:true,defense:false,dodge:false,block:false,movement:true,attacks:false,abilities:false};const payload={owner_id:currentUser.id,name,subtitle:(document.getElementById('enemy-import-subtitle')?.value||d.subtitle||'Criado a partir de texto').trim(),hp_max:Math.max(1,parseNumber(document.getElementById('enemy-import-hp')?.value,10)||10),defense:parseNumber(document.getElementById('enemy-import-def')?.value,10)??10,dodge:parseNumber(document.getElementById('enemy-import-dodge')?.value,0)??0,block:parseNumber(document.getElementById('enemy-import-block')?.value,d.block??0)??0,damage_reduction:parseNumber(document.getElementById('enemy-import-rd')?.value,d.damage_reduction??0)??0,movement_speed:parseNumber(document.getElementById('enemy-import-move')?.value,9)??9,level:Math.max(1,parseNumber(document.getElementById('enemy-import-level')?.value,1)||1),rank:document.getElementById('enemy-import-rank')?.value||d.rank||'comum',element:(document.getElementById('enemy-import-element')?.value||d.element||'').trim(),conditions:parseList(document.getElementById('enemy-import-conditions')?.value||'').length?parseList(document.getElementById('enemy-import-conditions')?.value||''):(d.conditions||[]),attacks:d.attacks,abilities:d.abilities||[],notes:`Importado do texto. Campos ausentes no original: ${Object.entries(d.missing||{}).filter(([,v])=>v).map(([k])=>k).join(', ')||'nenhum'}.\n\nFonte importada:\n${source}`,visibility:d.visibility?{...defaultVisibility,...d.visibility}:defaultVisibility};const {data,error}=await supabaseClient.from('enemy_templates').insert(payload).select().single();if(error)return alert(error.message);masterBestiaryCache.push(data);document.getElementById('enemy-text-importer')?.remove();if(currentTab==='bestiario')await loadMasterHub('bestiary');};

})();

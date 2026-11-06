(function(){
  'use strict';let menu=null;
  function close(){menu?.remove();menu=null;}
  function selectedEntity(id){return TabletopStore.state.entities.find(e=>String(e.id)===String(id));}
  function button(label,action,{danger=false,disabled=false}={}){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=danger?'danger-text':'';b.disabled=disabled;b.addEventListener('click',async()=>{close();try{await action();}catch(err){console.error(err);alert(err.message||'Não foi possível concluir a ação.');}});return b;}
  function open(event,id){if(currentRole!=='admin')return;event.preventDefault();event.stopPropagation();close();const e=selectedEntity(id);if(!e)return;TabletopSelection?.set(id);
    menu=document.createElement('div');menu.className='tabletop-context-menu';menu.setAttribute('role','menu');
    const title=document.createElement('div');title.className='tabletop-context-title';title.innerHTML=`<strong>${escapeHtml(e.label||'Token')}</strong><small>${escapeHtml(e.entity_type||'token')}</small>`;menu.append(title);
    if(e.entity_type==='player')menu.append(button('Abrir ficha',()=>window.openSelectedTabletopSheet?.()));
    if(e.entity_type==='enemy'&&e.source_type==='enemy_template')menu.append(button('Abrir no Bestiário',()=>window.openSelectedTabletopSheet?.()));
    if(e.entity_type==='enemy')menu.append(button(e.battle_entity_id?'Abrir combate':'Adicionar ao combate',()=>e.battle_entity_id?window.openSelectedTabletopInCombat?.():window.linkSelectedTabletopToCombat?.()));
    menu.append(button('Duplicar',()=>window.duplicateSelectedTabletopToken?.()));
    menu.append(button(e.locked?'Desbloquear':'Bloquear',()=>window.toggleSelectedTabletopLock?.()));
    menu.append(button(e.visibility_mode==='visible'?'Ocultar dos jogadores':'Revelar aos jogadores',()=>window.toggleSelectedTabletopVisibility?.()));
    const disp=document.createElement('div');disp.className='tabletop-context-disposition';disp.innerHTML='<small>Disposição</small>';
    for(const [value,label] of [['friendly','Aliado'],['neutral','Neutro'],['hostile','Hostil']])disp.append(button(label,()=>window.setSelectedTabletopDisposition?.(value),{disabled:e.disposition===value}));menu.append(disp);
    const control=document.createElement('div');control.className='tabletop-context-disposition';control.innerHTML='<small>Controle</small>';for(const [value,label] of [['gm','Mestre'],['owner','Dono'],['party','Grupo']])control.append(button(label,()=>window.setSelectedTabletopControl?.(value),{disabled:e.control_mode===value}));menu.append(control);
    menu.append(button('Remover da Mesa',()=>window.deleteSelectedTabletopToken?.(),{danger:true}));
    document.body.appendChild(menu);const x=Math.min(event.clientX,innerWidth-menu.offsetWidth-12),y=Math.min(event.clientY,innerHeight-menu.offsetHeight-12);menu.style.left=`${Math.max(8,x)}px`;menu.style.top=`${Math.max(8,y)}px`;
  }
  addEventListener('pointerdown',e=>{if(menu&&!menu.contains(e.target))close();},true);addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  window.TabletopContextMenu=Object.freeze({open,close});
})();

// Sincronizacao leve de dados globais. Atualiza a view atual sem recarregar a pagina.
let appLiveChannel = null;
const liveTimers = new Map();

function scheduleLiveRefresh(key, fn, delay=140){
  clearTimeout(liveTimers.get(key));
  liveTimers.set(key, setTimeout(async()=>{
    liveTimers.delete(key);
    try { await fn(); } catch(err){ console.warn('Live refresh:', key, err); }
  }, delay));
}

window.ensureAppLiveSync = function(){
  if(!currentUser?.id || appLiveChannel) return;
  appLiveChannel = supabaseClient.channel(`app-live:${currentUser.id}`)
    .on('postgres_changes',{event:'*',schema:'public',table:'characters'},()=>{
      window.UiFlow?.invalidate('jogadores'); window.UiFlow?.invalidate('mestre');
      if(currentRole==='admin' && currentTab==='jogadores') scheduleLiveRefresh('players',()=>loadMasterPlayersOverview({background:true}));
      if(currentRole==='admin' && currentTab==='mestre') scheduleLiveRefresh('master',()=>loadMasterHub(masterHubSection,{background:true}));
    })
    .on('postgres_changes',{event:'*',schema:'public',table:'enemy_templates'},()=>{
      window.UiFlow?.invalidate('bestiario');
      if(currentRole==='admin' && currentTab==='bestiario') scheduleLiveRefresh('bestiary',()=>loadMasterHub('bestiary',{background:true}));
    })
    .on('postgres_changes',{event:'*',schema:'public',table:'game_sessions'},()=>{
      window.UiFlow?.invalidate('mestre');
      if(typeof window.loadPlannedSessions==='function') scheduleLiveRefresh('sessions',async()=>{
        await window.loadPlannedSessions();
        if(currentRole==='admin' && currentTab==='mestre') await loadMasterHub(masterHubSection,{background:true});
      },180);
    })
    .subscribe();
};

window.scheduleAppWarmup = function(){
  const run = async()=>{
    if(!currentUser?.id) return;
    const jobs=[];
    // Biblioteca de documentos fica pronta antes do primeiro clique.
    if(typeof fetchDocumentsData==='function' && !documentsFetchedAt) jobs.push(fetchDocumentsData().then(()=>ensureDocumentsRealtime?.()).catch(()=>{}));
    if(window.TabletopPersistence && !window.TabletopStore?.state?.lastLoadedAt){
      jobs.push(TabletopPersistence.activeBoard().then(async board=>{
        if(!board)return;
        const [items,url]=await Promise.all([TabletopPersistence.entities(board.id),TabletopPersistence.signedBackground(board).catch(()=> '')]);
        TabletopStore.setBoard(board); TabletopStore.setEntities(items); TabletopStore.set({backgroundUrl:url,lastLoadedAt:Date.now()});
      }).catch(()=>{}));
    }
    if(currentRole==='admin'){
      if(!masterBestiaryCache.length) jobs.push(supabaseClient.from('enemy_templates').select('*').order('name').then(({data,error})=>{if(!error)masterBestiaryCache=data||[]}).catch(()=>{}));
      if(!masterOverviewCache.length) jobs.push(supabaseClient.rpc('get_master_shield_data').then(({data,error})=>{if(!error)masterOverviewCache=(data||[]).map(p=>({...p,conditions:Array.isArray(p.conditions)?p.conditions:[],unlocked_skills:p.unlocked_skills||{}}))}).catch(()=>{}));
      if(typeof window.loadPlannedSessions==='function') jobs.push(window.loadPlannedSessions().catch(()=>{}));
    }
    await Promise.allSettled(jobs);
  };
  if('requestIdleCallback' in window) requestIdleCallback(()=>run(),{timeout:1800});
  else setTimeout(run,350);
};

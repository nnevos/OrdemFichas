// Navegacao fluida: preserva views, scroll e evita flashes de recarregamento.
window.UiFlow = (() => {
  const views = new Map();
  const scroll = new Map();
  const fresh = new Map();
  const DEFAULT_TTL = 20000;

  function key(name){ return `${currentRole || 'guest'}:${name}`; }
  function save(name){
    const main = document.getElementById('main-content');
    if(!main || !name) return;
    views.set(key(name), main.innerHTML);
    scroll.set(key(name), main.scrollTop || 0);
  }
  function restore(name){
    const main = document.getElementById('main-content');
    const html = views.get(key(name));
    if(!main || html == null) return false;
    main.innerHTML = html;
    requestAnimationFrame(() => { main.scrollTop = scroll.get(key(name)) || 0; });
    if(window.lucide) window.lucide.createIcons();
    return true;
  }
  function commit(name){
    save(name);
    fresh.set(key(name), Date.now());
    setBusy(false);
  }
  function isFresh(name, ttl=DEFAULT_TTL){
    const at = fresh.get(key(name)) || 0;
    return Date.now() - at < ttl;
  }
  function setFresh(name){ fresh.set(key(name), Date.now()); }
  function invalidate(name){ fresh.delete(key(name)); }
  function setBusy(busy){
    document.documentElement.classList.toggle('app-data-busy', !!busy);
    const main = document.getElementById('main-content');
    if(main) main.setAttribute('aria-busy', busy ? 'true' : 'false');
  }
  function showSkeleton(label='Atualizando…'){
    const main = document.getElementById('main-content');
    if(!main) return;
    main.innerHTML = `<section class="flow-skeleton" aria-live="polite"><div class="flow-skeleton-head"><i></i><div><b></b><span></span></div></div><div class="flow-skeleton-grid"><i></i><i></i><i></i><i></i></div><small>${escapeHtml(label)}</small></section>`;
  }
  return { save, restore, commit, isFresh, setFresh, invalidate, setBusy, showSkeleton };
})();

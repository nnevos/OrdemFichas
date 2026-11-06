// Navegacao principal unica para jogador e mestre.

function renderTabs() {
  const container = document.getElementById('tabs-container');
  if (!container) return;

  const tabs = currentRole === 'admin'
    ? { jogadores:'👥 Jogadores', mesa:'🗺️ Mesa', combate:'⚔️ Combate', habilidades:'🌳 Habilidades', bestiario:'📚 Bestiário', documentos:'📂 Documentos', regras:'📖 Regras', mestre:'⚙️ Mestre' }
    : { personagem:'👤 Ficha', mesa:'🗺️ Mesa', combate:'⚔️ Combate', habilidades:'🌳 Habilidades', documentos:'📂 Documentos', regras:'📖 Regras' };

  const tabEntries = Object.entries(tabs);
  container.style.setProperty('--tab-count', String(tabEntries.length));
  container.dataset.tabCount = String(tabEntries.length);

  container.innerHTML = tabEntries.map(([key, label]) => {
    const match = label.match(/^(\S+)\s+(.+)$/);
    const icon = match ? match[1] : '';
    const text = match ? match[2] : label;
    return `<button class="tab-btn ${key === currentTab ? 'active' : ''}" data-tab="${key}" data-click-call="switchTab('${key}')" title="${escapeAttr(text)}" aria-current="${key === currentTab ? 'page' : 'false'}">
      <span class="nav-icon">${icon}</span><span class="nav-label">${escapeHtml(text)}</span>
    </button>`;
  }).join('');
}

async function switchTab(tab, { force=false } = {}) {
  if (!tab) return;
  const existingMain = document.getElementById('main-content');
  if (!force && tab === currentTab && existingMain?.children?.length) return;
  const previousTab = currentTab;
  if (previousTab === 'personagem' && tab !== 'personagem' && isDirty) {
    window.saveCharacterData({ silent:true });
  }

  window.UiFlow?.save(previousTab);
  currentTab = tab;
  renderTabs();
  document.body.dataset.section = tab;
  const main = document.getElementById('main-content');
  if (!main) return;

  const restored = !force && (window.UiFlow?.restore(tab) || false);
  if (!restored) window.UiFlow?.showSkeleton(`Abrindo ${tab}…`);
  window.UiFlow?.setBusy(true);

  try {
    if (currentRole === 'admin') {
      if (tab === 'personagem') {
        document.getElementById('save-bar')?.classList.remove('hidden');
        main.innerHTML = `<section class="master-full-sheet-bar"><button data-click-call="switchTab('jogadores')">← Voltar para Jogadores</button><div><span class="section-eyebrow">EDIÇÃO COMPLETA</span><strong>${escapeHtml(characterData?.name || 'Personagem')}</strong></div></section>${renderCharacterSheet()}`;
        window.syncCharacterDerivedDefense?.();
        if (window.lucide) window.lucide.createIcons();
        window.UiFlow?.commit(tab);
        return;
      }
      document.getElementById('save-bar')?.classList.add('hidden');
      if (tab === 'jogadores') await loadMasterPlayersOverview({ background:restored });
      else if (tab === 'mesa') await loadTabletopView({ background:restored });
      else if (tab === 'combate') await loadCombatView({ background:restored });
      else if (tab === 'habilidades') { main.innerHTML = renderAbilitiesHub(); if (window.lucide) window.lucide.createIcons(); }
      else if (tab === 'bestiario') await loadMasterHub('bestiary', { background:restored });
      else if (tab === 'documentos') await loadDocumentsPage({ silent:restored });
      else if (tab === 'regras') { main.innerHTML = renderRulesPage(); renderRulesContext(); searchRules(''); }
      else if (tab === 'mestre') await loadMasterHub(masterHubSection || 'session', { background:restored });
      window.UiFlow?.commit(tab);
      return;
    }

    document.getElementById('save-bar')?.classList.toggle('hidden', !['personagem'].includes(tab));
    if (tab === 'regras') { main.innerHTML = renderRulesPage(); renderRulesContext(); searchRules(''); }
    else if (tab === 'personagem') { main.innerHTML = renderCharacterSheet(); window.syncCharacterDerivedDefense?.(); if (window.lucide) window.lucide.createIcons(); }
    else if (tab === 'habilidades') { main.innerHTML = renderAbilitiesHub(); if (window.lucide) window.lucide.createIcons(); }
    else if (tab === 'mesa') await loadTabletopView({ background:restored });
    else if (tab === 'combate') await loadCombatView({ background:restored });
    else if (tab === 'documentos') await loadDocumentsPage({ silent:restored });
    window.UiFlow?.commit(tab);
  } catch (error) {
    console.error('Falha ao trocar de seção:', error);
    window.UiFlow?.setBusy(false);
    if (!restored) main.innerHTML = `<section class="flow-error"><strong>Não foi possível abrir esta área.</strong><p>${escapeHtml(error?.message || 'Tente novamente.')}</p></section>`;
  }
}

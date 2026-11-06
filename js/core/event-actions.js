(function () {
  'use strict';

  const EVENTS = ['click', 'change', 'input', 'submit', 'blur', 'focus', 'keydown', 'keyup'];
  const ALLOWED = new Set([
    'login','logout','saveCharacterData','loadSelectedPlayer','toggleThemeMenu','closeThemeMenu','setTheme',
    'openCharacterPicker','closeCharacterPicker','openRuleById','loadMasterHub','filterCharacterPicker','selectCharacterFromPicker','switchTab',
    'scheduleRuleSearch','filterRulesCategory','searchRules','backFromRule','openRuleForSkill','selectSkillElement',
    'toggleSkill','setMasterSection','rollMasterDie','adjustMasterResource','removeMasterCondition','addMasterCondition',
    'openMasterCharacter','openMasterSkills','scheduleMasterNotesSave','addTemplateToActiveBattle','filterBattleBestiary',
    'openInitiativeEditor','saveInitiative','advanceBattleTurn','searchRulesFromContext','removeBattleEffect',
    'resolveCombatAction','selectCombatTarget','addBattleEffect','quickAdjustPlayer','quickAdjustEnemy','advanceRound',
    'endBattle','startBattle','openBattleBestiaryPicker','closeBattleBestiaryPicker','openEnemyEditor','openEnemyDetails',
    'addTemplateToBattle','duplicateBestiary','searchBestiary','setBestiaryFilter','createEncounterTemplate',
    'startEncounterTemplate','deleteEncounterTemplate','endGameSession','startGameSession','toggleSkillTraining',
    'updateStat','addAttack','removeAttack','selectSessionEntity','useQuickAttack','useQuickSkill','openSessionRule',
    'toggleSessionFavorite','useEnemyManualAction','openSessionCommand','closeSessionCommand','renderSessionCommandResults',
    'openDocumentUploader','closeDocumentUploader','setDocumentSearch','setDocumentCategory','setDocumentFolder',
    'toggleDocumentFavorites','toggleDocumentUnread','toggleDocumentFavorite','openSharedDocument','closeSharedDocumentPreview','downloadSharedDocument','organizeSharedDocument',
    'editSharedDocument','deleteSharedDocument','uploadSharedDocument','loadDocumentsPage','openMasterOverviewDetails',
    'adjustMiniSheetResource','openMasterFullSheet','addEnemyActionRowV3','saveEnemyV3','deleteEnemy','saveBestiaryV3',
    'confirmManualCombatAction','openBestiaryEditor','deleteBestiary','duplicateBattleEnemy','openManualCombatAction','openEnemySkillTreePicker','closeEnemySkillTreePicker','filterEnemySkillTreePicker','addEnemySkillTreeAbility',
    'openSessionPlanComposer','closeSessionPlanComposer','saveSessionPlan','editSessionPlan','openActiveSessionDocument','closeActiveSessionDocument','saveActiveSessionDocument','jumpSessionDocumentHeading',
    'startPlannedSession','deleteSessionPlan','toggleSessionPlanItem','addPlannerItem','removePlannerItem','openPlannedEnemy','addPlannedEnemyToBattle',
    'selectPlannerScene','updatePlannerSceneTitle','updatePlannerSceneBody','refreshPlannerSceneResources','linkPlannerEnemy','createPlannerEnemy','setActiveSessionScene','saveSessionScratch','createActiveSceneEnemy',
    'formatSessionDocument','clearSessionDocumentFormatting','removeSessionGuideMark','openEnemyFromSessionMark','openBestiaryTextImporter','reanalyzeBestiaryText','saveBestiaryFromText',
    'createTabletopBoard','openTabletopMapPicker','openTabletopTokenPicker','closeTabletopTokenPicker','openTabletopAddMenu','closeTabletopAddMenu','openTabletopAddChoice','openTabletopMapMenu','addTabletopItemPrompt',
    'addTabletopPlayerToken','addTabletopEnemyToken','addTabletopNpcPrompt','deleteSelectedTabletopToken','openSelectedTabletopInCombat','resetTabletopCamera','zoomTabletopIn','zoomTabletopOut','focusSelectedTabletopToken','clearTabletopBackground','linkSelectedTabletopToCombat','unlinkSelectedTabletopCombat','clearTabletopSelection','undoTabletopAction','redoTabletopAction','openSelectedTabletopSheet','toggleSelectedTabletopLock','toggleSelectedTabletopVisibility','setSelectedTabletopDisposition','setSelectedTabletopControl','duplicateSelectedTabletopToken','openTabletopGridSettings','addTabletopEnemyBatch','selectTabletopEntity','tabletopStartCombat','tabletopNextTurn','tabletopUsePlayerAttack','tabletopUseEnemyAction','tabletopDamageSelected','tabletopHealSelected','tabletopConditionSelected','tabletopAdvanceRound','tabletopEndCombat','tabletopOpenBattleSetup','tabletopConfirmBattleSetup','tabletopChoosePlayerAttack','tabletopChoosePlayerSkill','tabletopChooseMasterPlayerAttack','tabletopChooseMasterPlayerSkill','tabletopChooseEnemyAction','tabletopCancelPendingAction','tabletopChooseCounterAttack','tabletopChooseCounterSkill','tabletopSkipCounterAttack','tabletopChooseEnemyCounterAction','tabletopSkipEnemyCounterAttack','tabletopFinishTurn','tabletopResolveDodge','tabletopResolveBlock','tabletopConfirmBlock','tabletopConfirmReaction','tabletopAcceptEnemyHit','tabletopBackToReactionChoice','tabletopDismissReactionFeedback','setTabletopMobilePanel'
  ]);

  function splitTopLevel(text, delimiter) {
    const out = [];
    let quote = null, escape = false, depth = 0, start = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (quote) {
        if (ch === '\\') escape = true;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") { quote = ch; continue; }
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
      else if (ch === delimiter && depth === 0) { out.push(text.slice(start, i).trim()); start = i + 1; }
    }
    out.push(text.slice(start).trim());
    return out.filter(Boolean);
  }

  function eventFacade(event, element) {
    return {
      target: element,
      currentTarget: element,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      originalEvent: event
    };
  }

  function parseValue(raw, event, element) {
    const value = raw.trim();
    if (value === 'event') return eventFacade(event, element);
    if (value === 'this') return element;
    if (value === 'this.value') return element.value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      return value.slice(1, -1).replace(/\\(['"\\])/g, '$1');
    }
    const inputValue = value.match(/^document\.getElementById\((['"])([^'"]+)\1\)\?*\.value\s*\|\|\s*(['"])\4$/);
    if (inputValue) return document.getElementById(inputValue[2])?.value || '';
    if (value.startsWith('{') && value.endsWith('}')) {
      const category = value.match(/^\{\s*category\s*:\s*(['"])(.*?)\1\s*\}$/);
      if (category) return { category: category[2] };
    }
    throw new Error('Argumento de evento não suportado: ' + value);
  }

  function invoke(call, event, element) {
    call = call.trim();
    if (!call) return;
    if (call === 'event.stopPropagation()') { event.stopPropagation(); return; }
    if (call === 'event.preventDefault()') { event.preventDefault(); return; }

    let m = call.match(/^document\.getElementById\((['"])([^'"]+)\1\)\?*\.remove\(\)$/);
    if (m) { document.getElementById(m[2])?.remove(); return; }
    m = call.match(/^this\.closest\((['"])(.*?)\1\)\.remove\(\)$/);
    if (m) { element.closest(m[2])?.remove(); return; }
    m = call.match(/^setTimeout\(\(\)=>\s*(.+),\s*(\d+)\)$/);
    if (m) { setTimeout(() => invoke(m[1], event, element), Number(m[2])); return; }

    // Compatibilidade temporária para o helper antigo quickButtons().
    m = call.match(/^quickAdjustPlayer\.bind\(null,\s*(['"])(.*?)\1,\s*(['"])(.*?)\3\)\((-?\d+)\)$/);
    if (m) {
      if (typeof window.quickAdjustPlayer === 'function') window.quickAdjustPlayer(m[2], m[4], Number(m[5]));
      return;
    }

    m = call.match(/^(?:window\.)?([A-Za-z_$][\w$]*)\((.*)\)$/s);
    if (!m) throw new Error('Ação de evento não reconhecida: ' + call);
    const name = m[1];
    if (!ALLOWED.has(name)) throw new Error('Ação de evento bloqueada: ' + name);
    const fn = window[name];
    if (typeof fn !== 'function') throw new Error('Ação indisponível: ' + name);
    const args = m[2].trim() ? splitTopLevel(m[2], ',').map(v => parseValue(v, event, element)) : [];
    return fn(...args);
  }

  function dispatch(event) {
    const attr = `data-${event.type}-call`;
    const element = event.target.closest(`[${attr}]`);
    if (!element) return;
    if (event.type === 'submit') event.preventDefault();
    const code = element.getAttribute(attr) || '';
    try {
      for (const statement of splitTopLevel(code, ';')) invoke(statement, event, element);
    } catch (error) {
      console.error('[event-actions] Evento bloqueado ou inválido:', error, { code, element });
    }
  }

  EVENTS.forEach(type => document.addEventListener(type, dispatch, type === 'focus' || type === 'blur'));
  window.SafeEventActions = Object.freeze({ allowed: ALLOWED });
})();

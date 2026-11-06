(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CombatDomain = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function toFiniteNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, toFiniteNumber(value, min)));
  }

  function adjustResource(current, delta, max = Infinity, min = 0) {
    const safeMax = Number.isFinite(Number(max)) ? Number(max) : Infinity;
    return clamp(toFiniteNumber(current) + toFiniteNumber(delta), min, safeMax);
  }

  function conditionName(condition) {
    if (typeof condition === 'string') return condition || 'Condição';
    return condition && condition.name ? String(condition.name) : 'Condição';
  }

  function conditionDuration(condition) {
    if (!condition || typeof condition !== 'object') return 0;
    return Math.max(0, Math.trunc(toFiniteNumber(condition.rounds, condition.rounds_remaining || 0)));
  }

  function nextTurn(order, turnIndex = 0, round = 1) {
    const list = Array.isArray(order) ? order : [];
    if (!list.length) return { turnIndex: 0, round: Math.max(1, toFiniteNumber(round, 1)), actor: null, wrapped: false };
    const current = clamp(Math.trunc(toFiniteNumber(turnIndex, 0)), 0, list.length - 1);
    const candidate = current + 1;
    const wrapped = candidate >= list.length;
    const nextIndex = wrapped ? 0 : candidate;
    const nextRound = Math.max(1, Math.trunc(toFiniteNumber(round, 1))) + (wrapped ? 1 : 0);
    return { turnIndex: nextIndex, round: nextRound, actor: list[nextIndex] || null, wrapped };
  }

  function tickEffects(effects) {
    const source = Array.isArray(effects) ? effects : [];
    const expired = [];
    const updated = [];
    const persistent = [];
    for (const effect of source) {
      const rounds = Math.max(0, Math.trunc(toFiniteNumber(effect && effect.rounds_remaining, 0)));
      if (rounds === 1) expired.push(effect);
      else if (rounds > 1) updated.push({ ...effect, rounds_remaining: rounds - 1 });
      else persistent.push(effect);
    }
    return { expired, updated, persistent };
  }

  return Object.freeze({ toFiniteNumber, clamp, adjustResource, conditionName, conditionDuration, nextTurn, tickEffects });
});

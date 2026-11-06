# Frozen Checkpoint V15.25

## Player Reactions + Rulebook UX

Base: V15.24.

### Critical fix
Player reactions no longer call `apply_manual_combat_action` as the enemy actor. The target Player resolves their own pending `enemy_attack_reaction` through `resolve_battle_reaction`. The function validates ownership, locks the request and character row, applies HP once, records the resolution, and closes the request atomically.

### Rulebook alignment
- Esquiva: Reflexos (AGI) vs attack result.
- Attribute dice reminder: AGI N => Nd20 best; AGI 0 => 2d20 worst.
- Natural 20 and natural 1 effects are represented without digital dice automation.
- “Bloqueio” remains a campaign/ficha concept because the supplied book does not define a base formula; UI asks for remaining damage instead of inventing one.
- Successful Dodge exposes the general Counter-Attack path.

### Required migration
`supabase-migration-v11-player-combat-reactions.sql`

### Changed files
- `js/tabletop/combat-dock.js`
- `js/core/event-actions.js`
- `css/tabletop.css`
- `index.html`
- continuity files

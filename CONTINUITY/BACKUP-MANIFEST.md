# Manifesto de Backups

Atualizado em 2026-08-29 para V15.0.

## Freeze V13 — Mobile / Pré-Mesa-Virtual

- Arquivo: `skill-tree-rpg-mobile-v13.zip`
- SHA-256: `10d0efcf8ca48000aacfdd3706b21b4249ddb17ae00a437d55ea47796158b464`
- Uso: rollback estável anterior à reestruturação Tabletop.
- Regra: não sobrescrever.

## Checkpoint V14.2 + Continuity — Pré-Tabletop

- Arquivo: `skill-tree-rpg-v14-2-continuity-snapshot.zip`
- SHA-256: `54463d746141697145dd2a3ffdd410baca31d373a271204542301d7df8571db7`
- Uso: retorno imediato ao estado anterior à implementação da Mesa.
- Regra: não sobrescrever.

## Linha atual V15.0 — Tabletop Foundation

- Artefato de entrega: `skill-tree-rpg-v15-tabletop-foundation.zip`
- Estado: desenvolvimento ativo; não substitui os freezes anteriores.
- O SHA-256 final do ZIP acompanha a entrega no arquivo externo `skill-tree-rpg-v15-checksums.txt`. O hash não é gravado dentro do próprio ZIP porque qualquer alteração no manifesto alteraria o hash do artefato.

## Política daqui em diante

Toda versão relevante deve:
1. atualizar `CONTINUITY/CURRENT-STATE.md`;
2. atualizar `CONTINUITY/CHANGELOG-CHECKPOINT.md`;
3. atualizar `CONTINUITY/PROJECT_STATE.json`;
4. atualizar roadmap/decisões quando necessário;
5. manter V13 e V14.2 disponíveis como rollback;
6. gerar checksum externo do novo ZIP.

## V15.1 — Tabletop Live + Combat

- Arquivo esperado: `skill-tree-rpg-v15-1-tabletop-live-combat.zip`.
- Base: V15.0 Tabletop Foundation.
- Migrations: V7 + V8.
- Mudancas principais: mesa sem fundo obrigatorio, Presence/lock, bridge persistente e overlay PV/condicoes/turno.
- O SHA-256 do pacote final e entregue em arquivo externo junto do ZIP para evitar checksum circular dentro do proprio pacote.

## V15.2 — Tabletop Core Rewrite

Checkpoint criado em 2026-08-29 após reescrita do motor de interação.

Características de identificação:
- `index.html` carrega `coordinates.js`, `board-view.js`, `token-view.js` e `controller.js`;
- `index.html` não carrega `js/tabletop/interactions.js`;
- teste `tests/tabletop-architecture.test.cjs` presente;
- 27/27 testes no momento do empacotamento;
- 30 arquivos sem handlers inline;
- migrations exigidas continuam V7 + V8; nenhuma V9 necessária.

O SHA-256 do ZIP distribuído acompanha o arquivo externo `skill-tree-rpg-v15-2-checksum.txt` para evitar hash autorreferencial dentro do próprio pacote.


## V15.3
- checkpoint: `skill-tree-rpg-v15-3-tabletop-large-world.zip`
- migration adicional: `supabase-migration-v9-tabletop-large-world.sql`
- hash SHA-256: ver arquivo externo `skill-tree-rpg-v15-3-checksum.txt` gerado junto ao checkpoint.

## V15.6
Checkpoint: `skill-tree-rpg-v15-6-selection-transform.zip`
Checksum SHA-256 distribuído em arquivo externo `skill-tree-rpg-v15-6-checksum.txt` para evitar auto-referência do ZIP.

## V15.7 Scene Engine Refactor
Arquivo de entrega: `skill-tree-rpg-v15-7-scene-engine.zip`.
Base: V15.6 Selection & Transform. Nova migration: V10 Tabletop Scene Engine. Não sobrescreve freezes V13/V14.2.

- V15.12: Mesa + Combate integrado; dock presencial-first; 63/63 testes.

- V15.13 — Combat UI Total Merge: Mesa reutiliza o mesmo renderer de Ações Rápidas/Iniciativa da aba Combate. 67/67 testes.


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

# Failsafe / Recuperação do Projeto

## Objetivo

Permitir continuar o desenvolvimento mesmo se o chat, contexto ou ambiente atual forem perdidos.

## Arquivos essenciais

- `CONTINUITY/START-HERE.md` — porta de entrada.
- `CONTINUITY/CURRENT-STATE.md` — o que existe hoje.
- `CONTINUITY/ARCHITECTURE.md` — como o código está organizado.
- `CONTINUITY/PRODUCT-DECISIONS.md` — decisões que não devem ser revertidas sem intenção.
- `CONTINUITY/TABLETOP-ROADMAP.md` — Mesa Virtual.
- `CONTINUITY/COMBAT-UX-ROADMAP.md` — novo combate.
- `CONTINUITY/CHANGELOG-CHECKPOINT.md` — últimas mudanças importantes.
- `CONTINUITY/PROJECT_STATE.json` — resumo estruturado.
- `CONTINUITY/NEXT-CHAT-PROMPT.md` — prompt de retomada.

## Backups

### Freeze principal

**V13 — Mobile / Pré-Mesa-Virtual**

Esse arquivo foi congelado antes da grande reestruturação planejada. Não deve ser sobrescrito.

### Snapshot atual

**V14.2 — fluidez + temas corrigidos**

Este pacote contém a versão V14.2 mais os documentos de continuidade.

## Estratégia recomendada a partir de agora

Para cada marco grande:

1. duplicar o projeto;
2. aumentar versão (`V15`, `V16`...);
3. atualizar `PROJECT_STATE.json`;
4. atualizar `CHANGELOG-CHECKPOINT.md`;
5. rodar testes;
6. gerar ZIP de checkpoint;
7. nunca apagar o ZIP do último checkpoint funcional.

Sugestão de nomes:

```text
skill-tree-rpg-v15-tabletop-foundation.zip
skill-tree-rpg-v16-tabletop-realtime.zip
skill-tree-rpg-v17-combat-jrpg.zip
```

## Antes de editar

```bash
npm test
npm run check:inline-events
```

Registrar o resultado inicial. Se testes já falharem antes da mudança, documentar em vez de mascarar.

## Depois de editar

Rodar novamente os testes e fazer smoke test manual de:
- login;
- troca de abas;
- ficha;
- combate;
- bestiário;
- documentos;
- mestre;
- tema;
- mobile básico.

Para Tabletop, adicionar smoke test de dois clientes simultâneos.

## Se uma versão nova quebrar

1. não tentar consertar sobre o freeze;
2. comparar com o último checkpoint funcional;
3. reverter apenas a feature problemática;
4. preservar migrations já aplicadas; criar migration corretiva se necessário;
5. atualizar este documento com a causa.

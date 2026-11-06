# FREEZE CHECKPOINT — V15.23

Status: FROZEN / SAFE RETURN POINT

Este checkpoint congela o projeto após a rodada de mobile UX da Mesa. Não iniciar novas refatorações antes de retomar conscientemente a partir deste estado.

## Estado funcional congelado

- Mesa virtual grande, com mapa opcional e remoção de fundo.
- Tokens móveis, multi-seleção, resize, rotação, realtime e locks.
- Menu unificado Adicionar: Player, Item, NPC, Inimigo, Mapa.
- Mesa + Combate integrados.
- Setup de combate seleciona participantes presentes na Mesa e iniciativa física.
- Ordem de turno/rodada persistente e editável.
- Ações Rápidas do Player permanecem visíveis.
- Ataque/Habilidade -> alvo no mapa -> rolagem física -> resultado/dano informado.
- Reação de Esquiva via battle_action_requests.
- Contra-Ataque permanece manual devido à regra ambígua.
- Mobile V15.23: mapa prioritário, quick actions horizontais, iniciativa e grupo em painéis móveis separados, navegação inferior.

## Migrations necessárias para este checkpoint

Consulte os arquivos SQL do projeto. Em especial, o fluxo recente depende de:
- supabase-migration-v9-tabletop-battle-flow.sql
- supabase-migration-v10-battle-action-requests-rls.sql

Não reaplicar migrations antigas sem necessidade.

## Regra de retomada

Ao retomar:
1. partir deste ZIP congelado;
2. confirmar visualmente `V15.23`;
3. validar Mesa desktop e mobile;
4. validar dois clientes;
5. validar ataque Player -> Inimigo;
6. validar ataque Inimigo -> Player -> Esquiva;
7. só então criar a próxima versão.

## Não fazer durante o freeze

- Não trocar renderer.
- Não reescrever Supabase.
- Não incorporar engine externa.
- Não mudar regras de combate automaticamente.
- Não automatizar rolagens físicas.

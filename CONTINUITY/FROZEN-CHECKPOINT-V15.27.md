# FROZEN CHECKPOINT — V15.27

## Symmetric Reaction Popout

- Reações de ataque agora são simétricas por controlador do alvo.
- Inimigo atacando Player -> popout prioritário no cliente do Player.
- Player atacando inimigo -> request criado para o Mestre da batalha e popout prioritário no cliente do Mestre.
- Popout mostra alvo, atacante, ação, ataque, dano anunciado, AGI/ESQ e RD antes de Esquivar / Bloquear-reduzir / Receber.
- No mobile o popout vira bottom sheet grande e não fecha ao tocar no backdrop.
- Player consegue ler o próprio request de ataque contra inimigo somente para exibir "aguardando reação do Mestre"; não recebe permissão para resolvê-lo.
- Turno não pode ser encerrado enquanto existir reação relevante pendente.
- `resolve_battle_reaction` resolve Player ou inimigo de forma atômica/idempotente.
- Nova migration obrigatória: `supabase-migration-v12-symmetric-combat-reactions.sql`.
- Testes: 83/83 passando no checkpoint.

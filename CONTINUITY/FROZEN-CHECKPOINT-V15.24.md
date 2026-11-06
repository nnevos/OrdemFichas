# FREEZE CHECKPOINT — V15.24

Status: SAFE RETURN POINT

Versão criada a partir da V15.23 após revisão das telas reais de Player e Mestre, com foco no fluxo de combate presencial, mobile-first e recuperação da sincronização rápida.

## Principais correções

- Mestre voltou a ter acesso à aba **Habilidades** e ao atalho de habilidades de cada personagem.
- Ações Rápidas do Player permanecem visíveis fora de combate, fora do turno e durante reações.
- Mestre selecionando um Player ou Inimigo na Mesa vê as ações rápidas daquele token; execução continua limitada ao ator do turno.
- Fluxo de ataque ficou explícito: **selecionar ação → selecionar alvo → rolar dados físicos → informar ataque/teste → informar dano → aplicar/registrar**.
- A ação selecionada recebe estado visual persistente e alvos válidos recebem destaque no tabletop até o clique.
- Inimigos aceitam imagem por upload (bucket público `avatars`) ou URL, com preview; a imagem também é propagada para tokens vinculados quando possível.
- Menu de adicionar inimigo ganhou busca, cards com imagem/status e controle de quantidade.
- Mesa desktop ganhou viewport maior e rolagem vertical da página; a navegação `Mesa / Ações / Turnos / Grupo` fica restrita ao mobile.
- Mobile mantém tabletop prioritário, botões maiores e atalho compacto para iniciativa sem quebrar a visualização.
- Reações de ataque foram reorganizadas em **Esquivar / Bloquear / Receber**. Bloqueio registra o dano restante resolvido com dados/regras físicas em vez de inventar fórmula.
- Esquiva bem-sucedida pode abrir um painel de Contra-Ataque usando as ações reais do personagem e o mesmo fluxo de dados físicos.
- Sincronização de combate usa Postgres Realtime + broadcast `combat_refresh` + fallback de polling (~2,2 s) para recuperar clientes quando um evento rápido é perdido.

## Banco / migrations

A V15.24 não cria migration nova. Ela continua dependendo das migrations já existentes no projeto, especialmente:

- `supabase-migration-v7-tabletop.sql`
- `supabase-migration-v8-tabletop-live-combat.sql`
- `supabase-migration-v9-tabletop-large-world.sql`
- `supabase-migration-v10-tabletop-scene-engine.sql`
- `supabase-migration-v9-tabletop-battle-flow.sql`
- `supabase-migration-v10-battle-action-requests-rls.sql`

## Validação automática

- `npm test`: **78/78 passando**.
- `npm run check:inline-events`: **41 arquivos sem handlers inline**.
- `node --check`: todos os JS alterados passaram.

## Smoke test recomendado antes da sessão

1. Abrir uma janela como Mestre e outra como Player.
2. Confirmar que o Mestre abre Habilidades de um personagem.
3. Fora de combate, confirmar Ações Rápidas visíveis no Player.
4. Iniciar combate e conferir iniciativa no desktop e no celular.
5. Player: selecionar habilidade, confirmar destaque da habilidade e dos inimigos válidos, clicar inimigo e registrar ataque/dano físico.
6. Mestre: selecionar Player e Inimigo no mapa e conferir suas ações rápidas.
7. Inimigo: atacar Player e validar Esquivar, Bloquear e Receber.
8. Alterar PV/turno em um cliente e conferir propagação nos demais sem refresh manual.
9. Testar upload de imagem de inimigo e adição em lote pelo novo picker.

## Regra preservada

O sistema continua **presencial-first**: não rola dados automaticamente e não inventa regras ambíguas. Ele mostra a referência da ficha, recebe os resultados rolados fisicamente e sincroniza o estado compartilhado.

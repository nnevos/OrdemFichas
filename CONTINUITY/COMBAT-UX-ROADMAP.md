# Roadmap — Combate com UI de JRPG, mantendo RPG presencial

## Objetivo

Reestruturar a apresentação do combate para ficar mais imersiva e imediata, inspirada na clareza de interfaces de Pokémon/Final Fantasy/JRPG, sem transformar o sistema em videogame automatizado.

## Princípio

O jogador/mestre rola fisicamente e informa o resultado. A UI facilita selecionar alvo, consultar ficha, registrar dano/cura/condição e entender turno/iniciativa.

## Estrutura visual proposta

### Desktop / Mesa

```text
┌─────────────────────────────────────────────────────────────┐
│ Rodada 3       Turno: Cass                    [Histórico]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│      INIMIGOS / AMEAÇAS          GRUPO                     │
│      [token + PV]                 [retrato + PV]            │
│      [token + PV]                 [retrato + PV]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Alvo selecionado          COMANDOS                          │
│ Guardião — 72/100 PV      [Registrar dano] [Cura]          │
│ Condições: ...            [Condição] [Ficha] [Mais]        │
└─────────────────────────────────────────────────────────────┘
```

Quando Tabletop estiver disponível, a área central pode ser o mapa e os comandos/estado de combate viram overlays/painéis ao redor dele.

## Interações desejadas

### Seleção
- tocar/clicar em personagem ou inimigo seleciona sem abrir modal imediatamente;
- segundo nível de ação abre ficha/detalhes;
- alvo atual sempre evidente.

### Registro de ação
Fluxo rápido:
1. pessoa rola dado físico;
2. escolhe alvo;
3. registra dano/cura/condição/resultados;
4. interface dá feedback curto;
5. estado sincroniza para todos.

### Turno
- participante atual destacado;
- botão mestre `Próximo turno` claro;
- rodada visível;
- iniciativa acessível sem ocupar metade da tela.

### PV
- barra + número quando permitido;
- mestre vê dados completos;
- jogador vê apenas o que regras/permissões permitem para inimigos.

## O que manter do combate atual

- domínio de PV e condições;
- iniciativa/rodada;
- battle log/histórico;
- integração de inimigos;
- suporte a mestre e jogadores;
- nenhuma rolagem automática obrigatória.

## O que refatorar

- reduzir cards administrativos;
- separar `estado` de `renderização`;
- evitar rerender completo a cada pequena mudança;
- componentes visuais pequenos atualizáveis por entidade;
- ponte explícita para Tabletop.

## Fases

### C1 — componentizar sem mudar comportamento
- separar lista de iniciativa, entidade, painel de alvo, comandos e histórico;
- testes de regressão.

### C2 — novo layout JRPG
- aplicar nova composição visual;
- transições curtas;
- feedback de dano/cura/condição.

### C3 — ponte Tabletop
- mesmo estado de combate alimenta overlays no mapa;
- selecionar token seleciona alvo no combate;
- combatente sem token continua funcionando.

### C4 — mobile
- mapa/combate ocupa área principal;
- painel de comandos vira bottom sheet;
- swipe/abas somente onde não atrapalhar seleção de token.

## Estado após V15.0

A Mesa já existe como área independente e o combate atual continua intacto. Ainda **não** iniciar C2 (redesign JRPG) antes de concluir a bridge estrutural mínima:
- relacionar token a `battle_enemy`/participante quando o mestre solicitar;
- manter entidade de Mesa independente;
- propagar PV/condições e turno sem duplicar estado;
- permitir combate tradicional sem token.

Depois dessa ponte, executar C1/C2 com menos risco de refazer a UI duas vezes.


## V15.12 — Mesa + Combate integrado
- A barra inferior da Mesa virou um dock de combate presencial-first.
- Exploração continua funcionando sem batalha ativa.
- Com batalha ativa, mostra rodada/turno, token selecionado/alvo, ataques/habilidades relevantes e comandos de PV/condição/próximo turno.
- Ataques reutilizam `openManualCombatAction`: dados continuam físicos; o sistema recebe o resultado.
- Selecionar token da Mesa também sincroniza o alvo do combate quando houver vínculo.
- Inimigos fora do combate podem ser adicionados sem sair da Mesa.
- Mesa e Combate seguem separados no domínio; a UI agora oferece uma superfície integrada.


## V15.13 — Combat UI Total Merge
- A Mesa não mantém mais uma versão simplificada das ações do jogador: ela reutiliza `renderCombatQuickActions()` da aba Combate por `window.CombatSurface`.
- O mesmo painel `Seu turno / Ações rápidas / Alvo / Ataques / Habilidades` aparece abaixo do mapa.
- A iniciativa do Combate também é renderizada dentro da Mesa usando a mesma função.
- O Mestre recebe ações do inimigo selecionado, PV, condição, ficha, rodada, próximo turno, iniciativa e encerramento sem sair da Mesa.
- `battle_action_requests` e `battle_log` agora atualizam a Mesa via realtime; confirmações pendentes aparecem na superfície integrada.
- A aba Combate permanece como fallback/visão completa, mas a Mesa é a superfície principal de jogo.
- Regra preservada: rolagem física; a UI só escolhe ação/alvo e registra o resultado.


## V15.14 — Player Combat Surface Fix
- Corrigido o merge da Mesa para jogadores: o `CombatSurface.syncState()` agora combina o snapshot público da batalha com os dados locais da própria ficha do jogador, garantindo ataques privados/locais na Mesa.
- Habilidades continuam vindo do mesmo `unlocked/SKILLS` usado pela aba Combate.
- A Mesa do jogador agora prioriza imediatamente `Seu turno / Ações rápidas / Alvo / Ataques / Habilidades`; cabeçalho administrativo e iniciativa expandida ficam no layout do Mestre.
- Nenhuma rolagem foi automatizada; ações continuam enviando/registrando o resultado físico.


## V15.17 — Combat Workspace na Mesa
- O combate da Mesa virou painel recolhível; a barra horizontal permanece sempre disponível e o corpo de ataques/habilidades pode abrir/fechar.
- O painel lateral direito, durante combate, agora é dedicado à iniciativa (ordem, valor, turno atual e próximo turno). Fora de combate volta a ser contexto do token.
- A antiga faixa horizontal de iniciativa foi removida da Mesa; ações do Mestre ficam na faixa horizontal compacta: PV, condição, ficha, iniciativa, rodada, próximo turno e encerrar.
- Selecionar inimigo vinculado sincroniza o alvo; adicionar inimigo ao combate selecionado também passa a torná-lo alvo imediatamente.
- Ataques/habilidades usam o mesmo `openManualCombatAction`: escolha de alvo, referência da ficha, valor de dano rolado fisicamente, custo/recurso e condição opcional.
- Corrigidos fluxos que ainda tratavam `currentTab=mesa` como Central do Mestre: editor/salvamento de iniciativa, avanço de turno, confirmação de ação e aplicação manual agora atualizam a Mesa sem navegar para outra tela.
- Não há automação de rolagem. O sistema registra e aplica apenas os valores informados após a rolagem física.


## V15.18 — Combate contextual e iniciativa única
- Removida a segunda iniciativa/atalho de iniciativa da faixa inferior. A única iniciativa visível na Mesa durante combate é o painel lateral direito.
- A área inferior agora tem zero ocupação quando nenhum token está selecionado. Ao clicar em um token, surge um menu contextual compacto com as ações daquele token.
- Mestre selecionando inimigo vinculado vê Ataques, Habilidades, PV, Condição e Ficha; inimigo fora da batalha mostra apenas Adicionar ao combate.
- Jogador selecionando alvo/personagem recebe as mesmas Ações Rápidas do Combate, sem painel permanente.
- Próximo turno, editar iniciativa, avançar rodada e encerrar combate foram concentrados no painel lateral de Iniciativa.
- Iniciar combate foi movido para a barra superior do Mestre quando não existe batalha ativa.


## V15.19 — Fluxo de batalha tabletop-first
- `Iniciar combate` agora abre preparação da batalha usando somente Player/NPC/Inimigo presentes no mapa; o Mestre marca quem participa e informa iniciativa física antes de iniciar.
- A ordem de iniciativa é o estado central do combate. Ao chegar ao fim, `CombatDomain.nextTurn` incrementa a rodada e reinicia no primeiro da ordem. A iniciativa continua editável durante a batalha para espera/adiamento.
- Ações do Player só aparecem no próprio turno. Fluxo da Mesa: escolher Ataque/Habilidade -> clicar no inimigo participante no mapa -> modal mostra referência de rolagem -> informar valor físico -> confirmar.
- Turno de inimigo usa o mesmo fluxo controlado pelo Mestre: escolher ação -> clicar Player participante -> informar resultado do ataque e dano.
- Ataques de inimigo contra Player criam uma reação pendente para o alvo em vez de aplicar dano imediatamente. O Player pode registrar Esquiva ou aceitar o ataque.
- Esquiva usa a regra fornecida pelo projeto: Reflexos (AGI) contra resultado do ataque; sucesso = 0 dano; 20 natural/movimento, 1 natural/+1d6, penalidades e impedimentos são exibidos como instrução presencial e não automatizados.
- Após Esquiva bem-sucedida, Contra-Ataque pode ser registrado manualmente. A frase ambígua “metade do resultado no teste de ataque” permanece explicitamente não automatizada/pending review.
- Encerrar combate retorna a Mesa ao modo exploração.
- Migration nova: `supabase-migration-v9-tabletop-battle-flow.sql`, adicionando somente metadados de setup/reação em `battles`; rolagens continuam físicas.


## V15.20 — Ações Rápidas persistentes do Player
- Corrigida a interpretação da V15.19: Ações Rápidas são uma barra permanente do Player na região inferior da Mesa, inclusive fora do próprio turno e fora de combate.
- Fora de combate elas servem como consulta e avisam que é preciso iniciar uma batalha para executar. Durante combate, permanecem visíveis o tempo todo; a execução continua bloqueada até o turno do Player.
- No próprio turno, o painel recebe destaque e mantém o fluxo Ação -> alvo no mapa -> rolagem física -> valor -> confirmação.
- Reações como Esquiva aparecem adicionalmente, sem substituir/desaparecer com a barra de Ações Rápidas.


## V15.21 — RLS hotfix de reações
- Corrigido erro `new row violates row-level security policy for table battle_action_requests`.
- Causa: a V15.19 cria request de reação pelo Mestre com `user_id` do Player alvo, mas a policy antiga só aceitava `user_id = auth.uid()`.
- Migration `supabase-migration-v10-battle-action-requests-rls.sql` permite INSERT do próprio Player OU de admin; SELECT do próprio Player OU admin; UPDATE do próprio Player OU admin.
- Isso preserva isolamento entre jogadores e permite Esquiva/Contra-Ataque direcionados pelo Mestre.

## V15.22 — Combat sync fix
Reações pendentes agora são preservadas no store; resultado do ataque/teste e dano são informados separadamente; PV é atualizado imediatamente após a RPC. Sem migration nova.


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

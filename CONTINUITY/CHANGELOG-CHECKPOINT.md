# Últimas mudanças relevantes

## V15.1 — Tabletop Live + Combat

- Mesa funciona sem imagem: fundo visual é opcional.
- Novo espaço neutro amplo para exploração e posicionamento livre.
- Mestre continua podendo mover qualquer token.
- Presence Realtime mostra clientes conectados.
- Lock temporário de drag por Broadcast + TTL evita disputa pelo mesmo token.
- Migration V8 adiciona bridge persistente opcional Mesa ↔ Combate.
- Inimigo do Bestiário pode ser vinculado explicitamente ao combate ativo.
- PV/condições do combate aparecem no token e inspector.
- Turno atual recebe destaque visual no mapa.
- Mudanças de battle/battle_enemy/battle_effect/character atualizam overlay sem reload.
- Remover fundo não remove tokens.
- Continuidade atualizada junto da implementação.

## V15.0 — Tabletop Foundation

- Nova aba principal `Mesa` para mestre e jogadores.
- Migration `supabase-migration-v7-tabletop.sql`.
- Novo domínio modular em `js/tabletop/`.
- Mesa pode existir sem combate.
- Upload de imagem como mapa.
- Pan/zoom e centralização.
- Tokens de personagem, Bestiário e NPC rápido.
- PV visível no token/inspector quando disponível.
- Mestre move qualquer token; jogador apenas o próprio.
- Movimento otimista + broadcast realtime com throttle.
- Posição final persistida no banco.
- Warmup da Mesa em idle.
- Ponte inicial com Combate sem acoplamento automático.
- Novo teste `tabletop-domain.test.cjs`.
- Continuidade atualizada para nova linha V15.

## V14.2 — checkpoint pré-Tabletop

- Mantém refatoração de fluidez iniciada na V14.
- Seletor de temas funciona novamente após regressão da V14.1.
- Códigos hexadecimais não aparecem como texto nas opções de tema.
- Paletas internas continuam inalteradas.

## V14

- Cache de views e scroll via `js/ui-flow.js`.
- Atualizações em background em vez de sensação de reload.
- Supabase Realtime global em `js/live-sync.js`.
- Warmup em idle de dados comuns.
- Melhor reaproveitamento de documentos e bestiário.
- Oito identidades visuais.

## V13 — freeze estável

- Navegação mobile principal em barra inferior.
- Ajustes mobile da Central do Mestre e Documentos.
- Documento da sessão mais utilizável no celular.
- Freeze declarado antes do projeto Tabletop.

## Histórico anterior

`REFACTOR-NOTES.md` mantém detalhes históricos. Não usar sozinho como especificação atual.

## V15.1.1 — Tabletop interaction hotfix

- Corrigido clique/seleção de tokens na Mesa.
- Corrigido drag de tokens com acompanhamento do ponteiro no `window`, evitando perda do gesto ao sair da hitbox/viewport.
- Tokens agora têm hit testing explícito (`pointer-events`) e imagens internas não interceptam o gesto.
- Adicionado fallback quando `CSS.escape` não está disponível.
- Movimento continua otimista/realtime e persiste somente a posição final.
- Nenhuma migration nova é necessária sobre a V15.1.

## V15.2 — Tabletop Core Rewrite

- reescrita do motor de interação da Mesa;
- `coordinates.js`, `board-view.js`, `token-view.js` e `controller.js` adicionados;
- `interactions.js` legado deixa de ser carregado;
- drag usa estado temporário local e DOM estável;
- threshold de 5 px separa clique de arraste;
- renderer passa a sincronizar tokens incrementalmente;
- realtime não força reconstrução de token durante drag;
- nenhuma migration nova;
- 27/27 testes passando;
- 30 arquivos sem handlers inline.


## V15.3 — Tabletop Large World

- Mesa mínima passa de 2400×1400 para 7200×4800.
- Imagem de fundo deixa de controlar o tamanho do mundo.
- Limites do mundo ficam visíveis nas quatro bordas.
- Zoom mínimo passa para 7% para visão geral.
- Adicionada migration V9 para atualizar defaults e boards existentes.
- Adicionados testes de dimensão, limite visual, zoom e fundo.


## V15.4 — Tabletop Touch Foundation
- Adicionado `js/tabletop/touch-gestures.js`.
- Pinch-to-zoom com dois dedos e pan simultâneo no tablet/celular.
- Zoom limitado ao mesmo intervalo do mundo: 7%–350%.
- Gestos ficam separados do controller de drag dos tokens e não rerenderizam a token layer.
- Próxima prioridade: seleção múltipla do mestre + criação em lote do Bestiário; depois ficha pelo token, minimapa e controles rápidos de combate.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## V15.6 — Tabletop Selection & Transform
- Ligação definitiva do selection model à Mesa.
- Shift+click multi-select.
- Shift+drag marquee.
- Group drag com locks e persistência final.
- Undo/Redo por command history.
- Resize/rotation do token principal pelo Mestre.
- Inspector específico para múltiplos tokens.
- 36/36 testes passando; 35 arquivos sem handlers inline.

### V15.7 — Scene Engine Refactor
Refatoração estrutural baseada nas auditorias de FreeBeeGee, whiteboards e Gravewright. Tokens agora têm disposição/controle/visibilidade/lock, scene layers são explícitas, grid/snap virou funcional, Bestiário suporta lote e o Mestre ganhou menu contextual.

## V15.8 — 2026-08-29
- Corrigido spawn longe do usuário.
- Corrigida rotação do wrapper inteiro do token.
- Corrigido pinch com propriedade de câmera errada (`zoom` vs `scale`).
- Câmera passa a enquadrar conteúdo no primeiro carregamento.
- Zoom distante ganha simplificação visual progressiva.
- Toolbar e HUD de seleção refeitos para uso real em viewport estreito.
- 48/48 testes; 39 JS sem handlers inline.


## V15.9 — Asset Loading Repair (critical)
- Root cause found: `@import url('./css/tabletop.css')` was appended after normal CSS rules in `styles.css`; CSS imports are required to precede normal rules and browsers may ignore that late import. This explains the effectively unstyled Tabletop seen in the screenshot.
- `css/tabletop.css` is now linked explicitly from `index.html`.
- Every `js/tabletop/*.js` script URL receives `?v=15.9` to bypass stale browser/hosting caches during this development phase.
- The Mesa visibly renders `SCENE ENGINE · V15.9 · CSS OK` and exposes `window.TABLETOP_BUILD = '15.9'` so deployment can be verified immediately.
- V15.8 UX code (viewport-centered spawn, face-only rotation, camera repair, zoom HUD) remains active and can finally be applied by the browser.
- Do not add CSS `@import` after regular rules again. Prefer explicit `<link>` or keep imports at the very top.


## V15.10 — Tabletop Interaction Polish
- Câmera ganhou limites de pan: o mundo não pode mais ser perdido completamente fora do viewport.
- Zoom de wheel ficou contínuo/suave e mantém o ponto sob o cursor como âncora.
- A UI do token usa compensação visual de escala para labels, PV, badges e handles permanecerem utilizáveis em zoom intermediário.
- Duplo clique em token seleciona e focaliza; tecla `F` focaliza a seleção e `0` enquadra o conteúdo.
- Clique simples no fundo limpa a seleção sem quebrar o gesto normal de pan.
- Tokens individuais recém-criados são focalizados; lotes do Bestiário são enquadrados em conjunto.
- Toolbar foi reorganizada em grupos de histórico, câmera e cena.
- HUD de seleção ganhou ação explícita `Focar`.
- O build visível da Mesa é `V15.10`; assets do Tabletop usam cache-busting `?v=15.10`.
- Nenhuma migration nova. Schema atual permanece até V10.
- Próximo passo recomendado: teste real desktop/mobile/multicliente desta UX; depois começar objetos de cena (imagem/nota/marcador) e comando/revision realtime, sem adicionar features antes da câmera/manipulação estarem aprovadas.


## V15.11 — Game Table Layout
- Reestruturada a Mesa conforme feedback visual: Players e Histórico em rail próprio à esquerda, canvas no centro, contexto à direita e command bar estilo RPG abaixo do canvas.
- Players usa os tokens de personagens da cena e mostra PV/turno.
- Histórico usa os últimos eventos de `battle_log` quando existe combate ativo.
- Adicionado botão explícito `Tirar mapa`; remove somente a imagem de fundo e preserva tokens/cena.
- Mobile/tablet empilha Players/Histórico abaixo da Mesa, sem roubar o canvas.
- Build/cache bust atualizado para 15.11.


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


## V15.15 — Menu unificado Adicionar
- A Mesa recupera uma entrada persistente `+ Adicionar` no topo do Mestre, disponível em exploração e combate.
- O menu centraliza Player, Item, NPC, Inimigo e Mapa.
- Player abre seletor de personagens; Inimigo abre somente o Bestiário com quantidade; NPC cria token rápido; Item cria objeto simples com nome/emoji; Mapa permite adicionar/trocar e tirar a imagem de fundo.
- Tirar mapa continua sem remover tokens, posições ou combate.
- O objetivo é impedir que ferramentas de preparação desapareçam quando a UI de combate assume a faixa inferior.


## V15.16 — Item creation hotfix
- Corrigido `Adicionar > Item`: V15.15 tentava inserir `entity_type=item`, mas a constraint histórica de `tabletop_entities` aceita apenas player/enemy/npc/marker.
- Item agora usa `entity_type=marker` como tipo persistente compatível e `metadata.kind=item` / `state.kind=item` como semântica de RPG.
- A UI continua exibindo o objeto como Item e respeita seu emoji personalizado.
- Adicionado tratamento de erro explícito no fluxo de criação para nunca falhar silenciosamente.
- Não exige migration nova. A decisão reforça que `entity_type` é compatibilidade de entidade e `metadata.kind` pode representar subtipos de objetos de RPG.


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

## V15.24 — Combat UX + Realtime Recovery
- Corrigido acesso do Mestre à árvore/aba de Habilidades.
- Ações Rápidas ficam persistentes e com seleção visual; alvo válido é destacado no tabletop.
- Mestre vê ações rápidas do token Player/Inimigo selecionado.
- Fluxo ação → alvo → ataque/teste físico → dano físico foi reorganizado em etapas claras.
- Upload/URL de imagem para inimigos e novo seletor de inimigos com busca e quantidade.
- Layout desktop ganhou tabletop maior + scroll; navegação móvel não aparece mais no desktop.
- Mobile recebeu iniciativa compacta e controles de toque maiores.
- Reações ganharam Esquivar/Bloquear/Receber e Contra-Ataque manual.
- Realtime ganhou broadcast de refresh e fallback de polling de ~2,2 s.
- Sem migration nova. Testes: 78/78.

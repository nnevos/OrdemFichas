# Arquitetura Atual — V15.2 Tabletop Core Rewrite

## Visão geral

Frontend HTML/CSS/JavaScript sem framework SPA. Supabase fornece Auth, Postgres, Storage e Realtime. Navegação troca conteúdo de `#main-content` e reaproveita views com `UiFlow`.

## Princípio arquitetural da Mesa

Mesa, ficha e combate são identidades diferentes:

1. **Fonte de ficha** — personagem ou template do Bestiário.
2. **Entidade da Mesa** — posição/token/visualização.
3. **Participante de Combate** — iniciativa e estado de batalha.

Nunca colapsar essas três camadas numa tabela única.

## Tabletop V15.2

```text
js/tabletop/
  domain.js
  store.js
  persistence.js
  realtime.js
  coordinates.js
  board-view.js
  token-view.js
  controller.js
  renderer.js
  app.js
  interactions.js   # legado, não carregado
css/tabletop.css
supabase-migration-v7-tabletop.sql
supabase-migration-v8-tabletop-live-combat.sql
tests/tabletop-domain.test.cjs
```

## Responsabilidades

### `domain.js`
Regras puras: clamp, permissão, normalização e PV.

### `coordinates.js`
Converte coordenadas de tela para mundo. Não lê banco, não renderiza UI e não conhece realtime.

### `board-view.js`
Mantém somente a apresentação da câmera: `translate3d + scale`, zoom no ponto do cursor e centralização.

### `token-view.js`
É a única camada responsável pelo DOM individual dos tokens. Usa nós estáveis e patches incrementais. Movimento atualiza `transform`, não `innerHTML`.

### `controller.js`
Controlador central de interação, inspirado nos padrões observados nos projetos de referência enviados pelo usuário:

```text
idle
  ↓ pointerdown
pressed
  ├─ movimento < threshold → seleção/clique
  └─ movimento >= threshold → dragging
                              ↓ pointerup
                           released
```

Durante drag:
- não atualizar store a cada pixel;
- não recriar DOM;
- mover apenas o nó visual;
- broadcast pode ocorrer com throttle;
- persistência só ocorre em `release`.

### `renderer.js`
Monta a página e sincroniza a coleção de tokens por chave. `patchFromState()` não substitui todo o conteúdo da token layer; adiciona/remove/atualiza somente o necessário.

### `realtime.js`
Não manipula DOM diretamente. Movimento remoto passa pelo `TabletopController.remoteMove()`. Se o mesmo token estiver sendo arrastado localmente, a atualização remota é adiada.

### `store.js`
Estado canônico depois que uma alteração é confirmada. O preview de drag não deve virar estado global a cada `pointermove`.

## Renderização e performance

V15.2 continua em DOM/CSS deliberadamente, mas remove a maior causa de instabilidade: reconstrução de nodes durante interação.

Se testes futuros mostrarem limite de performance com muitos tokens/mapas grandes, avaliar Konva/Pixi mantendo controller/store/persistence/realtime independentes do renderer.

## Backend

Nenhuma migration nova na V15.2. Usar V7 + V8.

## Referências estudadas

Foram analisados os arquivos enviados pelo usuário:
- FreeBeeGee: separação de controlador de mouse, seleção, drag e DOM incremental;
- character-sheet-app: drag baseado em posição inicial + listeners globais durante o gesto;
- Living Codex e RPGUI: referências secundárias de organização/UX.

A implementação V15.2 foi escrita para este projeto; não copiar código/licença dos projetos de referência.


## Tabletop V15.3 — espaço lógico

A Mesa possui espaço lógico próprio e não deriva suas dimensões do asset de background. `TabletopDomain.boardSize()` impõe mínimo de 7200×4800. Renderer, câmera, clamp e spawn usam essa dimensão efetiva. Background é um recurso visual contido nesse mundo. A migration V9 persiste os novos defaults. Essa separação é necessária para permitir exploração sem imagem, trocar mapas sem deslocar tokens e futuramente adicionar minimap/camadas.


## V15.4 — Tabletop Touch Foundation
- Adicionado `js/tabletop/touch-gestures.js`.
- Pinch-to-zoom com dois dedos e pan simultâneo no tablet/celular.
- Zoom limitado ao mesmo intervalo do mundo: 7%–350%.
- Gestos ficam separados do controller de drag dos tokens e não rerenderizam a token layer.
- Próxima prioridade: seleção múltipla do mestre + criação em lote do Bestiário; depois ficha pelo token, minimapa e controles rápidos de combate.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## Selection/Transform pipeline — V15.6
`selection.js` é a fonte de verdade da seleção visual. `store.selectedId` continua apenas como compatibilidade/primary selection. `controller.js` interpreta gestures e nunca persiste dentro de `pointermove`. Para movimento em grupo, mantém snapshots iniciais e previews por ID; no release, persiste cada entidade e registra um único comando conceitual em `history.js`. Resize e rotação usam os campos `size` e `rotation` que já existem em `tabletop_entities`. `token-view.js` aplica posição/tamanho incrementalmente e gira apenas a face do token para manter nome/PV legíveis.

## V15.7 Scene Engine

Camadas do mundo agora são uma estrutura arquitetural, não somente z-index informal:

`map -> objects -> tokens -> markings -> gm -> UI`

Novos módulos:
- `scene-model.js`: modelo canônico de objetos/tokens;
- `layers.js`: criação e descoberta das layers;
- `grid.js`: grid e snap, independente do controller;
- `context-menu.js`: ações contextuais de Mestre.

`object-model.js` agora é somente um adapter de compatibilidade para `scene-model.js`.

O renderer continua DOM nesta versão, de propósito. A API está sendo desacoplada gradualmente para permitir renderer Pixi no futuro se mapas/objetos grandes justificarem a troca.

## Camera/viewport contract — V15.8
A câmera possui uma única escala canônica: `camera.scale`. Desktop wheel, botões e pinch devem usar `TabletopBoardView` e nunca criar propriedades paralelas como `zoom`. Criação de objetos deve usar coordenadas do viewport atual (`viewportCenterWorld`) em vez do centro lógico do board. Transform do token posiciona o wrapper; rotação é apresentação da face interna, preservando UI legível.


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

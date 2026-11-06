# Estado Atual — V15.24 Combat UX + Realtime Recovery

## Snapshot

Linha ativa: **V15.24 — Combat UX + Realtime Recovery**. O histórico abaixo preserva a evolução desde V15.3; o retorno seguro atual está em `FROZEN-CHECKPOINT-V15.24.md`. Os checkpoints anteriores continuam preservados para rollback.

## Migrations necessárias

1. `supabase-migration-v7-tabletop.sql` — boards, entidades, bucket, RLS e realtime.
2. `supabase-migration-v8-tabletop-live-combat.sql` — vínculo persistente opcional Mesa ↔ Combate.

**V15.3 adiciona `supabase-migration-v9-tabletop-large-world.sql`.** O frontend já aplica um mínimo de 7200×4800 mesmo antes da migration, mas a V9 deve ser executada para persistir os novos defaults e ampliar boards existentes no banco.

## Por que a V15.2 existe

A implementação V15.1/15.1.1 misturava renderização, eventos e sincronização em caminhos que podiam reconstruir tokens durante o uso. Isso tornou clique/drag frágil. Foram estudados os projetos de referência enviados pelo usuário, especialmente FreeBeeGee e o utilitário Dragger do character-sheet-app, e adotados os princípios compatíveis sem copiar código:

- controlador central de gesto;
- estado explícito `pressed → dragging → released`;
- threshold antes de considerar drag;
- posição inicial do ponteiro + posição inicial do token;
- DOM estável durante o gesto;
- persistência apenas no final;
- estado/realtime/render separados.

## Núcleo Tabletop atual

- Mesa funciona com ou sem imagem de fundo.
- Mestre move qualquer token; jogador move apenas seu personagem.
- Clique/toque seleciona token sem iniciar drag automaticamente.
- Drag só começa depois de 5 px de movimento.
- O token não é recriado enquanto está sendo arrastado.
- Movimento visual usa `translate3d` diretamente no nó existente.
- `TabletopStore` só recebe a posição final ao soltar.
- Persistência no Postgres acontece somente no fim do gesto.
- Broadcast efêmero continua durante o drag.
- Atualizações remotas do mesmo token são adiadas enquanto ele estiver sendo arrastado localmente.
- Pan só começa quando o gesto nasce fora de um token.
- Zoom continua independente do renderer.

## Nova divisão de módulos

- `coordinates.js` — conversão viewport/mundo e utilidades geométricas.
- `board-view.js` — câmera, pan/zoom visual e centralização.
- `token-view.js` — cria/reutiliza/atualiza nós DOM dos tokens.
- `controller.js` — máquina de estados de clique, seleção, pan e drag.
- `store.js` — estado canônico estável.
- `persistence.js` — banco/storage.
- `realtime.js` — presence, locks, broadcast e mudanças remotas.
- `renderer.js` — composição da tela e patches incrementais.

`interactions.js` legado continua no snapshot apenas como arquivo histórico, mas **não é mais carregado por `index.html`**.

## V15.3 — Large World

- mundo lógico mínimo aumentado para **7200 × 4800**;
- boards antigos menores são tratados no frontend com esse mínimo e podem ser persistidos pela migration V9;
- imagem de fundo não reduz mais as dimensões do mundo;
- fundo usa `object-fit: contain`, preservando proporção dentro da Mesa;
- bordas possuem marcação visível `LIMITE DA MESA`;
- zoom mínimo reduzido para 7% para permitir visão geral do mundo;
- centralização enquadra o mundo inteiro;
- clamp/spawn de tokens usam dimensões efetivas do mundo grande.

## Mesa ↔ Combate

Permanece igual à V15.1:
- Mesa não exige combate;
- vínculo com `battle_enemy` é explícito;
- PV, condições e turno podem aparecer no mapa;
- remover/desvincular não apaga a entidade original indevidamente.

## Validação automática

- `npm test`: **31/31 passando**;
- `node scripts/check-inline-events.mjs`: **30 arquivos sem handlers inline**;
- todos os módulos Tabletop V15.2 passaram em `node --check`.

## Próxima prioridade

1. smoke test real do mundo 7200×4800 em desktop + tablet/mobile;
2. teste multi-cliente com 4 navegadores;
3. adicionar pinch dedicado apenas depois de confirmar o núcleo;
4. quantidade ao adicionar inimigos;
5. abrir ficha pelo token;
6. iniciativa/ações rápidas na Mesa;
7. grid/régua/ping;
8. fog of war;
9. redesign JRPG do combate quando o Tabletop estiver estável.


## V15.4 — Tabletop Touch Foundation
- Adicionado `js/tabletop/touch-gestures.js`.
- Pinch-to-zoom com dois dedos e pan simultâneo no tablet/celular.
- Zoom limitado ao mesmo intervalo do mundo: 7%–350%.
- Gestos ficam separados do controller de drag dos tokens e não rerenderizam a token layer.
- Próxima prioridade: seleção múltipla do mestre + criação em lote do Bestiário; depois ficha pelo token, minimapa e controles rápidos de combate.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## V15.6 — Selection & Transform Engine
Estado atual do Tabletop após a fundação V15.5:
- seleção de token conectada ao `TabletopSelection`;
- Shift+clique adiciona/remove tokens da seleção;
- Shift+arraste no fundo cria marquee de seleção sem substituir o pan normal;
- arrastar qualquer token selecionado move todos os tokens selecionados que o usuário tem permissão para mover;
- movimento do grupo mantém preview local incremental, locks realtime e persiste apenas no release;
- cada movimento concluído entra como um único comando no `TabletopHistory`;
- Undo/Redo real por Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z ou Ctrl/Cmd+Y e botões ↶/↷;
- mestre recebe alça de resize e alça de rotação no token principal;
- resize usa o campo `size` já existente (24–360); rotação usa `rotation` já existente, sem migration nova;
- Shift durante rotação encaixa em intervalos de 15°;
- nenhuma persistência é executada dentro do `pointermove`;
- renderer continua incremental e não reconstrói a camada inteira de tokens.

Próximo foco recomendado: criação de inimigos em lote + ficha/context menu pelo token + grid/snap opcional. Depois, minimapa/régua/ping e camadas GM.

## V15.7 — Scene Engine Refactor

O Tabletop deixou de ser tratado apenas como uma camada de tokens sobre um fundo e passou a usar um modelo explícito de cena.

Implementado:
- Scene Token com `disposition`, `control_mode`, `visibility_mode`, `layer_name`, `locked`, `object_type`, `revision` e `metadata`;
- camadas reais `map / objects / tokens / markings / gm`;
- grid configurável com tamanho, visibilidade e snap;
- Alt ignora snap temporariamente durante movimento;
- criação em lote de inimigos do Bestiário (1–30);
- context menu do Mestre por clique direito;
- ficha, combate, duplicar, bloquear, ocultar/revelar e disposição a partir do token;
- pointer capture adicionado ao controller mantendo listeners globais como fallback;
- UI do Tabletop refeita para priorizar a cena e reduzir painéis genéricos.

Migration obrigatória nova: `supabase-migration-v10-tabletop-scene-engine.sql` depois de V7/V8/V9.

Próximo bloco recomendado: renderer contract + comandos realtime semânticos/revision; depois objetos reais de cena (nota/imagem/marcador/área) e gerenciamento de camadas.

## V15.8 — Viewport UX Repair
Checkpoint criado a partir de teste visual real do usuário. A V15.7 tinha arquitetura melhor, mas UX ainda ruim.

Correções concretas:
- novos tokens nascem no centro do viewport atual, não no centro matemático de 7200x4800;
- câmera inicial enquadra o conteúdo existente, não abre em uma região arbitrária do mundo;
- zoom mínimo agora é derivado do viewport + board e evita estados patologicamente pequenos;
- em zoom distante, labels/PV/badges são reduzidos progressivamente para evitar sobreposição;
- rotação afeta somente a face/arte do token; nome, PV, badges e handles permanecem retos;
- pinch corrigido: V15.4 usava `zoom`, enquanto a câmera real usa `scale`;
- toolbar reestruturada, sem wrap destrutivo, com controles - / enquadrar / % / +;
- HUD flutuante de seleção mantém ações acessíveis quando o inspector lateral é ocultado por largura de tela.

Sem migration nova. V10 continua sendo a migration mais recente do Tabletop.


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

## V15.22 — Attack result + reaction delivery + HP sync
- Corrigido `TabletopStore.setCombat`: agora preserva `requests`, então reações pendentes (Esquiva) chegam ao Player na Mesa.
- Formulário manual agora sempre registra `Resultado do ataque/teste` e `Dano rolado`; ataques de Player e inimigo exibem a referência cadastrada quando existir.
- Ataque inimigo usa o resultado informado como dificuldade da Esquiva e continua sem aplicar dano antes da reação.
- Resultado da RPC `apply_manual_combat_action` é aplicado imediatamente ao estado da Mesa (PV do inimigo/Player), seguido de refresh do Supabase.
- Nenhuma migration nova nesta versão; a migration V10 de RLS da V15.21 continua necessária.


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

## V15.24 — Estado atual
- Checkpoint ativo: `CONTINUITY/FROZEN-CHECKPOINT-V15.24.md`.
- Foco: combate tabletop-first, mobile-first e sincronização resiliente.
- Mestre acessa Habilidades e vê ações rápidas do token selecionado.
- Player mantém Ações Rápidas visíveis fora de combate e durante reações.
- Fluxo presencial: ação → alvo → rolagem física de ataque/teste → rolagem física de dano → registro/aplicação.
- Inimigos suportam imagem, busca e quantidade no picker.
- Desktop: Mesa maior e página rolável; mobile: iniciativa acessível sem cobrir o mapa.
- Sync: Postgres Realtime + broadcast + fallback periódico.
- Validação atual: 78/78 testes e 41 arquivos sem handlers inline.

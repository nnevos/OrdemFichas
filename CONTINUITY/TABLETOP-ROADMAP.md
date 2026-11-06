# Roadmap — Mesa Virtual / Tabletop 2D

## Visão

Criar uma Mesa Virtual 2D compartilhada e leve, integrada ao sistema existente. Não construir um clone completo do Tabletop Simulator.

## Experiência-alvo

O mestre sobe uma imagem de mapa. Jogadores conectados veem o mesmo mapa e movem seus próprios tokens praticamente em tempo real. O mestre controla todos os tokens, pode adicionar inimigos/NPCs e iniciar/gerenciar combate sem sair da Mesa.

## Fase 0 — preparação arquitetural ✅ V15.0

Antes de UI:
- criar migration nova para mapas/entidades/snapshots;
- definir modelo de dados;
- criar `js/tabletop/` modular;
- adicionar testes de domínio;
- manter V13/V14.2 intactas como rollback.

### Modelo conceitual mínimo

**tabletop_boards**
- id
- session_id/campaign context
- name
- background asset/url
- width/height lógica
- grid config opcional
- created_by
- timestamps

**tabletop_entities**
- id
- board_id
- entity_type: player/enemy/npc/marker
- source_id opcional
- label
- token image
- x/y
- size
- rotation opcional
- visible_to_players
- owner_user_id opcional
- local state JSON mínimo

**tabletop_snapshots** ou persistência equivalente
- salvar estado estável sem gravar cada pixel do drag.

Combate deve continuar em suas tabelas atuais; criar ponte, não duplicar tudo.

## Fase 1 — mapa + câmera + tokens 🟡 parcialmente entregue na V15.0

Entregar primeiro:
- criar Mesa;
- upload de imagem de fundo;
- pan/zoom fluido;
- adicionar token simples;
- mover token livremente;
- selecionar token;
- salvar posição final;
- remover token;
- desktop e touch básicos.

Critério de sucesso: 4+ pessoas conseguem abrir a mesma Mesa e mover tokens sem reload de página.

## Fase 2 — realtime e permissões 🟡 base entregue na V15.0

- Supabase Realtime para movimento efêmero;
- persistir posição no fim do drag ou em throttle seguro;
- movimento otimista local;
- jogador move próprio token;
- mestre move qualquer token;
- presença simples;
- lock temporário/ownership durante drag para evitar disputa;
- reconectar e receber snapshot atual.

Não escrever no banco 60 vezes por segundo.

## Fase 3 — integração com ficha e Bestiário

- adicionar personagem à Mesa;
- adicionar inimigo do Bestiário;
- quantidade ao adicionar inimigos;
- token com retrato configurável;
- PV visível de forma compacta;
- condições principais;
- abrir ficha/template pelo token;
- NPC rápido sem ficha completa.

## Fase 4 — ponte com Combate

- selecionar entidade(s) da Mesa e `Adicionar ao combate`;
- entidade permanece na Mesa sem precisar entrar em combate;
- participante de combate referencia token/entidade;
- turno atual destacado no mapa;
- PV/condições sincronizados;
- iniciar/encerrar combate sem apagar tokens;
- combate atual também pode funcionar sem Mesa aberta.

## Fase 5 — ferramentas de mesa

Somente depois do núcleo estável:
- grid quadrado opcional;
- snap opcional;
- régua;
- ping;
- marcadores;
- camada exclusiva do mestre;
- fog of war manual;
- trocar mapa preservando mapas anteriores.

## Fase 6 — polish/performance

- testar mapas grandes;
- limitar/comprimir upload;
- thumbnails;
- reduzir custo de render;
- perfis mobile/tablet/desktop;
- acessibilidade;
- reconexão em rede ruim;
- telemetria local de performance se necessário.

## Renderização

Não decidir biblioteca antes de protótipo de performance.

Opções:
- Canvas 2D próprio para V1 simples;
- Konva para cena 2D e interação;
- PixiJS caso número de elementos/efeitos cresça muito.

Evitar uma árvore DOM enorme de tokens/overlays se isso prejudicar pan/zoom.

## Critérios de não-regressão

- ficha atual continua funcionando;
- combate atual continua utilizável sem Tabletop;
- documentos e mestre continuam acessíveis;
- nenhuma rolagem automática obrigatória;
- sem reload completo ao navegar;
- mobile não perde acesso às funções essenciais.


## Checkpoint V15.0

Entregue:
- migration V7;
- módulos `js/tabletop/`;
- mapa por imagem;
- pan/zoom;
- tokens;
- PV;
- permissões básicas;
- broadcast de movimento + persistência final;
- ponte mínima para Combate.

Ainda pendente antes de considerar Fase 2 concluída:
- teste real multi-cliente;
- presence;
- lock/ownership temporário durante drag;
- reconexão testada em rede ruim;
- pinch dedicado/mobile polish.


## Checkpoint V15.1 — Live + Combat

Entregue em código:
- mesa sem mapa/fundo obrigatório;
- background pode ser adicionado ou removido sem apagar tokens;
- Presence multi-cliente;
- lock temporário de token com TTL;
- bridge persistente opcional via migration V8;
- overlay de PV, condições e turno do combate no Tabletop;
- refresh de estado de batalha via Realtime.

A Fase 2 está funcional em código, mas depende de validação real com múltiplos dispositivos. A Fase 4 está parcialmente entregue: o vínculo enemy-token ↔ battle_enemy existe e o overlay funciona, porém iniciativa e ações completas ainda pertencem à tela de Combate.

### V15.1.1 — concluído
- [x] Corrigir hitbox e seleção dos tokens.
- [x] Tornar drag resiliente a perda de pointer capture/saída do viewport.
- [x] Garantir clique/toque em tokens separado do pan do mapa.
- [x] Fallback de seletor para navegadores sem `CSS.escape`.

## Checkpoint V15.2 — Core Rewrite ✅

Motivo: os hotfixes V15.1.1 não resolveram a fragilidade de clique/drag. O frontend da Mesa foi reestruturado com base em padrões observados nos projetos de referência enviados pelo usuário.

Entregue:
- [x] controlador central de interação;
- [x] threshold entre clique e drag;
- [x] token DOM estável durante drag;
- [x] movimento visual por `translate3d`;
- [x] store atualizado apenas ao soltar;
- [x] persistência somente ao soltar;
- [x] realtime remoto desacoplado do renderer;
- [x] atualização remota do token localmente arrastado é adiada;
- [x] token renderer incremental sem recriar a layer inteira;
- [x] board/camera separados do controller;
- [x] V7/V8 preservadas, sem migration nova.

Critério antes de adicionar novas ferramentas: validar clique, seleção, drag, pan e zoom em navegadores reais. Não adicionar fog/régua/ping enquanto o core não estiver comprovadamente estável.


## Checkpoint V15.3 — Large World ✅

Entregue:
- [x] mundo mínimo 7200×4800 independente da resolução da imagem;
- [x] limite visual em todas as bordas;
- [x] zoom out até 7% para visão geral;
- [x] centralização enquadra toda a Mesa;
- [x] upload de mapa não encolhe mais o board;
- [x] migration V9 amplia defaults e boards existentes;
- [x] testes do large-world adicionados.

Próximas prioridades recomendadas, antes de fog of war:
1. pinch-to-zoom e pan com dois dedos no tablet/mobile;
2. seleção múltipla e mover grupo de tokens para o mestre;
3. adicionar quantidade de inimigos do Bestiário em uma única ação;
4. abrir ficha/personagem/inimigo diretamente pelo token;
5. mini visão geral/minimap opcional para mundos grandes;
6. controles rápidos de PV/condição/iniciativa sem sair da Mesa;
7. régua, ping e grid/snap opcionais;
8. camada do mestre/fog somente após os itens anteriores estarem estáveis.


## V15.4 — Tabletop Touch Foundation
- Adicionado `js/tabletop/touch-gestures.js`.
- Pinch-to-zoom com dois dedos e pan simultâneo no tablet/celular.
- Zoom limitado ao mesmo intervalo do mundo: 7%–350%.
- Gestos ficam separados do controller de drag dos tokens e não rerenderizam a token layer.
- Próxima prioridade: seleção múltipla do mestre + criação em lote do Bestiário; depois ficha pelo token, minimapa e controles rápidos de combate.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## Concluído na V15.6
- [x] seleção simples integrada à engine
- [x] Shift+clique multisseleção
- [x] marquee por Shift+arraste
- [x] mover grupo sem rerender da token layer
- [x] Undo/Redo real de movimento
- [x] resize persistente de token
- [x] rotação persistente de token

## Próxima sequência
1. Adicionar quantidade ao inserir inimigos do Bestiário e distribuir o grupo na Mesa.
2. Context menu/ficha do token sem sair da Mesa.
3. Grid quadrado configurável + snap opcional (movimento livre continua padrão).
4. Minimapa para o mundo 7200×4800.
5. Régua e ping.
6. Camadas/visibilidade `visible`, `hidden`, `gm_only` e bloqueio de objetos.
7. Ferramentas de mapa/nota/marcador e, só depois, fog of war.

## Concluído — V15.7 Scene Engine
- disposição e controle independentes do tipo de token;
- visibilidade e lock persistentes;
- scene layers reais;
- grid/snap + Alt bypass;
- add-many do Bestiário;
- context menu do token;
- pointer capture no drag.

## Próximas fases
1. **V15.8 Realtime Commands & Revision** — eventos semânticos, `revision`, conflito otimista e agrupamento de patches.
2. **V15.9 Scene Objects** — notas, imagens, marcadores, áreas e objetos usando `object_type`/layers.
3. **V16 Renderer Contract** — registrar DOM renderer e preparar Pixi renderer opcional; só migrar rendering pesado se métricas justificarem.
4. Grid avançado/régua/ping.
5. Ferramentas GM e Fog depois da estabilidade do núcleo.

## Depois da V15.8
Antes de novas features pesadas, validar visualmente mouse + touch + 2 clientes. Depois: comandos/revision no realtime, objetos genéricos de cena e minimapa. Renderer Pixi continua opcional somente quando DOM incremental provar limite real de performance.


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

# Refatoração 2026-08 — mesa física primeiro

## Princípio de combate preservado
O sistema continua sendo um **assistente de mesa física**, não um videogame. Ataques e habilidades não rolam dados automaticamente: a mesa rola os dados físicos e registra o resultado final. As automações ficam restritas a ficha, limites de recursos, ordem de iniciativa, duração de efeitos, histórico e organização.

## 1. `app.js` modularizado
O antigo arquivo monolítico foi dividido em:
- `js/app/character-rules.js` — estado da ficha, autosave, habilidades e livro de regras;
- `js/app/master.js` — central do mestre, presença, bestiário e iniciativa;
- `js/app/combat.js` — estado/visualização do combate e organização de efeitos;
- `js/app/auth-character.js` — autenticação, carregamento e edição da ficha;
- `js/combat/domain.js` — funções puras do domínio de combate, sem Supabase/DOM.

`app.js` permanece apenas como marcador de compatibilidade.

## 2. Eventos inline e XSS
Todos os `onclick`, `oninput`, `onchange` e `onsubmit` foram removidos de HTML/JS gerado. `js/core/event-actions.js` usa delegação de eventos e uma allowlist explícita; não usa `eval` nem `new Function`.

O avatar do cabeçalho deixou de ser interpolado via `innerHTML`: agora é criado com DOM APIs e URL validada (`http`, `https`, `blob` ou `data:image`).

## 3. Testes
Execute:

```bash
npm test
npm run check:inline-events
```

Cobertura inicial: limites de PV/recursos, avanço de turno/rodada, duração de efeitos, normalização de condições, integridade básica do livro e busca de regras.

## Dívida de conteúdo detectada
O livro possui referências `related` para IDs ainda não cadastrados. O runtime já ignora essas referências ausentes com segurança. Elas não foram inventadas nesta refatoração; devem ser revisadas junto com o conteúdo das regras.

## Planejador de sessao (v6)

A Central do Mestre agora possui a aba **Planejamento**.

Fluxo:
1. Clique em **Planejar sessao**.
2. De um nome para a sessao e cole as anotacoes brutas.
3. O parser local organiza destinos, locais, mapas, NPCs, inimigos, encontros, objetivos, pistas, recompensas e notas.
4. Revise/edite o resultado antes de salvar.
5. Na lista de planejamentos, clique em **Iniciar**.
6. Durante a mesa, a aba **Sessao** exibe o guia preparado em paineis recolhiveis.

O parser nao usa IA e nao cria conteudo narrativo novo. Ele apenas classifica o texto fornecido. Isso preserva o mestre como autor da sessao e evita automatizar gameplay.

Antes de usar o recurso em uma instalacao existente, execute `supabase-migration-v6-session-planner.sql` no Supabase.

## Planejador v2 — quadro de preparacao

O planejador anterior, baseado em grandes campos por categoria, foi substituido por um quadro de preparacao mais proximo do fluxo real de um mestre de mesa.

Fluxo atual:
1. Cole/escreva o preparo bruto.
2. Clique em **Montar quadro**.
3. Revise cartoes de Cenas, Locais, NPCs, Ameacas, Pistas, Objetivos, Mapas e Notas.
4. Ao salvar, ameacas novas viram rascunhos em `enemy_templates`; inimigos ja existentes apenas sao vinculados.
5. Durante a sessao, o Escudo da Sessao permite consultar/marcar referencias e abrir a ficha do inimigo ou adiciona-lo ao combate. Nenhuma rolagem ou resolucao de gameplay e automatizada.

O Bestiario agora possui exclusao visivel nos cards e no editor. Excluir um template nao apaga copias ja criadas em combates nem o texto historico de sessoes.

## Escudo da sessao v4
- O escudo ativo deixou de ser checklist: nenhum item precisa ser marcado como concluido.
- Qualquer referencia preparada pode ser colocada em "Em cena" para ganhar destaque durante a narracao.
- Referencias ficam agrupadas por uso: roteiro/lugares, pessoas/ameacas, pistas/direcao e apoio do mestre.
- Ameacas vinculadas mantem atalhos de Ficha e + Combate; adicionar ao combate continua sendo decisao manual do mestre.
- Foi adicionado um rabisco rapido persistente dentro do plano da sessao (`plan.__desk`), sem nova migration.
- O texto original do planejamento fica acessivel em uma gaveta recolhivel para consulta.

## V5 — Planejamento narrativo e UI do Mestre

- Planejamento remodelado de quadro por categorias para `Sessao -> Atos -> Cenas -> Recursos`.
- O texto original permanece salvo e cada cena preserva seu conteudo narrativo.
- Recursos detectados (local, NPC, inimigo, pista, objetivo, mapa, teste e mecanica) ficam vinculados a cena onde aparecem.
- Inimigos nao sao mais criados automaticamente ao salvar uma sessao. O mestre confirma `Criar no Bestiario` quando quiser transformar uma referencia em ficha reutilizavel.
- Blocos com ficha explicita (`PV`, `DEF` etc.) podem ser reconhecidos como inimigo; mencoes narrativas a criaturas/inimigos nao poluem o Bestiario.
- Modo Mestre redesenhado em layout estavel: roteiro fixo a esquerda, cena atual no centro e recursos/rabisco a direita.
- O dashboard de cards que competia por espaco com a cena foi removido da sessao ativa; Jogadores, Bestiario e Combate ficam como atalhos/paginas proprias.
- Central do Mestre ganhou navegacao lateral fixa e area de trabalho unica para evitar paineis mudando de posicao.
- Testes do planejador atualizados para atos/cenas, contexto de recursos e protecao contra falsos inimigos.

## V6 — Documento + Guia Rapido
- O planejamento voltou a ser um documento unico; nao ha mais editor obrigatorio de Atos/Cenas.
- A analise gera somente anotacoes (testes, inimigos, pistas, NPCs, locais, objetivos e mecanicas), mantendo `source_text` como fonte de verdade.
- Durante a mesa, lembretes aparecem inline no documento e tambem em um Guia Rapido fixo.
- O Bestiario ganhou `Criar do texto`: interpreta PV/DEF/Esquiva/Deslocamento/Nivel/Categoria/Elemento e ataques explicitos, mas exige revisao antes de salvar.
- Inimigos detectados na sessao nao sao criados automaticamente.
- Nenhuma automacao de gameplay foi adicionada: dados, decisoes e resolucoes continuam na mesa fisica.

## V7 — Documento rico + Guia Rapido revisado

- O planejamento deixou de usar textarea de texto puro e agora usa editor rich text.
- Colagem HTML do Google Docs preserva a formatacao principal: titulos, negrito, italico, sublinhado, listas, citacoes, alinhamento, links, tabelas e tamanhos de texto seguros.
- O HTML colado passa por sanitizacao por allowlist antes de ser armazenado/exibido. Scripts, iframes, formularios, SVG e atributos/eventos arbitrarios sao removidos.
- A sessao guarda duas representacoes: `plan.document_html` para exibicao formatada e `source_text` para analise do Guia Rapido.
- Sessoes V6/anteriores continuam abrindo; o texto puro e convertido para documento quando nao houver `document_html`.
- O Guia Rapido foi simplificado para um fluxo unico na ordem do documento, em vez de varios quadros por categoria.
- Falsos positivos podem ser removidos do Guia durante a edicao antes de salvar.
- Alterar o documento marca o guia como desatualizado ate uma nova analise.
- Durante a mesa, clicar no Guia leva ao trecho correspondente e os lembretes aparecem junto ao documento sem substituir sua formatacao.
- O Bestiario continua com `Criar do texto`; inimigos detectados na sessao so vao para o Bestiario apos revisao manual.
- Nenhuma automacao de rolagem ou resolucao de gameplay foi adicionada.

## V8 - analisador estrutural do documento

- O Guia Rapido agora usa a hierarquia do rich text (H1-H6, paragrafos e listas) em vez de depender apenas de regex no texto plano.
- Titulos `Cena N` entram como navegacao no Guia, sem duplicar o documento.
- `Objetivo Principal` usa os itens de lista como lembretes de objetivo.
- Inimigos podem ser reconhecidos por estrutura e evidencia: nomes como Soldado/Guardiao, `Nome: ...`, ou bloco seguido de PV explicito.
- Habilidades encontradas dentro do bloco do inimigo sao anexadas ao rascunho da criatura e nao viram entradas separadas.
- O importador de Bestiario nao preenche visualmente PV/DEF/Esquiva/Nivel ausentes. Campos nao informados ficam vazios para revisao e sao registrados nas notas se o mestre salvar usando minimos tecnicos exigidos pelo banco.
- Marcacoes novas usam indices dos blocos do documento formatado, melhorando o salto do Guia para o trecho correto apos colar do Google Docs.
- Nenhuma criatura e salva no Bestiario sem confirmacao do mestre.

## V9 — Sessao como documento simples
- Removido da interface o fluxo de "Analisar documento" e o Guia Rapido da sessao.
- Planejamento agora e somente um documento rich text editavel, preservando a formatacao principal ao colar do Google Docs.
- Documento ativo nao tem modo de leitura bloqueado: abre sempre editavel.
- Adicionado botao flutuante 📖 no canto inferior direito durante uma sessao ativa.
- O botao abre uma gaveta lateral sobre qualquer tela (combate, bestiario, mestre etc.) sem trocar de pagina.
- Documento e titulo podem ser alterados durante a sessao e salvos diretamente pela gaveta.
- A tela principal do Mestre nao renderiza mais o documento inteiro nem paineis de analise; fica focada nos atalhos da mesa.
- O importador de inimigos por texto do Bestiario continua disponivel de forma independente.

## V10 - visualizacao interna de documentos
- A Biblioteca de Documentos agora abre arquivos dentro da propria pagina, sem exigir nova aba ou download.
- DOCX e convertido em HTML formatado no navegador usando Mammoth e sanitizado antes de ser exibido.
- PDF e imagens usam preview embutido; TXT/MD/CSV sao exibidos como texto preservando quebras de linha.
- Formatos nao suportados exibem fallback claro com opcao de download.
- O visualizador e fechado/aberto sem sair da Biblioteca e funciona em layout responsivo.

## V11 — sessao e documentos
- Corrigido scroll do documento da sessao no painel lateral, com corpo realmente rolavel e toolbar fixa.
- Adicionado seletor "Ir para uma secao" baseado em H1/H2/H3 para navegar documentos longos durante a mesa.
- Removido foco automatico ao abrir o documento da sessao para evitar saltos de rolagem.
- Superficies da sessao e Documentos agora usam fundos solidos e hierarquia visual mais clara.
- Area Documentos refeita em master/detail: biblioteca fixa + visualizador unico, sem inserir uma segunda copia visual do documento acima da lista.
- Preview permanece estavel durante atualizacoes realtime e filtros.
- Excluir o documento atualmente aberto limpa o preview imediatamente e nao deixa referencia fantasma.
- Exclusao remove primeiro o registro da biblioteca e faz limpeza do Storage em seguida, evitando cards quebrados se a limpeza do arquivo falhar.
- Validacao: 21/21 testes e 0 handlers inline.

## V13 — navegacao mobile
- Navegacao principal virou barra inferior fixa no celular, sem carrossel horizontal de abas.
- Conteudo principal ganhou scroll proprio, safe-area e espaco para a barra inferior.
- Botao do documento da sessao fica acima da navegacao, sem cobrir controles.
- Central do Mestre usa grade compacta para secoes internas em vez de uma faixa horizontal longa.
- Drawer do documento da sessao ocupa a tela no celular, com seletor de secoes e botoes Fechar/Salvar em grade.
- Documentos usa leitura em primeiro plano no celular, com controles maiores e preview ocupando o espaco util.
- Cabecalho mobile foi compactado para priorizar conteudo e toque.

## V14 - Navegacao fluida e temas

- Navegacao SPA com cache de views e preservacao de scroll por secao.
- Dados em cache aparecem imediatamente; atualizacoes remotas acontecem em segundo plano.
- Barra de progresso sutil substitui flashes de "Carregando" nas telas ja visitadas.
- Pre-aquecimento ocioso de Documentos, Bestiario, Jogadores e Sessoes.
- Realtime global invalida/atualiza caches de personagens, bestiario e sessoes.
- Documentos usa cache em memoria dos ultimos arquivos abertos para evitar downloads repetidos.
- Realtime de Documentos foi debounceado para evitar varias recargas simultaneas.
- Central do Mestre carrega apenas os dados da subsecao acessada (Notas e Sessoes nao puxam combate/bestiario sem necessidade).
- Bestiario faz atualizacoes locais apos salvar, duplicar e excluir em vez de recarregar toda a pagina.
- Oito temas revisados: Escuro, Gelo, Fogo, Terra, Energia, Agua, Ar e Vazio.
- Gelo e Ar possuem superficies claras e contraste proprio; os demais usam superficies escuras coerentes com suas paletas.

## Checkpoint de continuidade — V14.2

A partir deste snapshot, o estado atual e os próximos planos são mantidos em `CONTINUITY/`. Em caso de perda de contexto/chat, começar por `CONTINUITY/START-HERE.md`. O freeze V13 deve permanecer intacto; Tabletop e refatoração JRPG do combate são as próximas grandes iniciativas planejadas.

## V15.0 — Tabletop Foundation (2026-08-29)

- Partiu do checkpoint V14.2 + Continuity.
- Nova aba Mesa para mestre e jogadores.
- Migration V7 cria boards/entities/bucket/RLS/realtime.
- Upload de mapa, pan/zoom, tokens de personagem/inimigo/NPC.
- Movimento otimista com broadcast; persistência ao soltar.
- PV visível e permissões básicas de movimento.
- Bridge inicial explícita com Combate, sem acoplamento automático.
- Novo teste de domínio Tabletop.
- Continuidade atualizada integralmente.


## V15.1 — Tabletop Live + Combat
- Mesa sem imagem obrigatória e fundo removível sem afetar tokens.
- Presence e lock efêmero multi-cliente.
- Migration V8 para bridge persistente com combate.
- PV, condições e turno refletidos na Mesa.
- Estado de combate continua opcional; exploração funciona sem batalha ativa.
- Continuidade atualizada no mesmo checkpoint.

## V15.1.1 — Hotfix Tabletop
- Corrigido clique e drag dos tokens.
- Drag agora acompanha eventos globais de ponteiro e não depende do viewport manter o gesto.
- Hit testing explícito na camada/token evita overlays bloqueando interação.
- Imagens internas dos tokens não interceptam pointer events.
- Fallback para `CSS.escape` no renderer.
- 27/27 testes passando; 26 arquivos sem handlers inline.

## V15.3 — Tabletop Core Rewrite

Reescrita do motor de interação após comparar os projetos de referência enviados pelo usuário. A Mesa agora separa controller, coordenadas, câmera, token DOM, realtime e persistência. Tokens não são reconstruídos durante drag; clique e drag são separados por threshold; store/banco recebem posição final. `js/tabletop/interactions.js` permanece apenas como legado e não é carregado.


### Checkpoint V15.3
Mesa ampliada para mínimo 7200×4800, limites visíveis, fundo desacoplado do tamanho do mundo e migration V9 adicionada. Próxima prioridade: UX de mundo grande (pinch/mobile, múltipla seleção, quantidade de inimigos, ficha pelo token e minimap opcional).


## V15.4 — Tabletop Touch Foundation
- Adicionado `js/tabletop/touch-gestures.js`.
- Pinch-to-zoom com dois dedos e pan simultâneo no tablet/celular.
- Zoom limitado ao mesmo intervalo do mundo: 7%–350%.
- Gestos ficam separados do controller de drag dos tokens e não rerenderizam a token layer.
- Próxima prioridade: seleção múltipla do mestre + criação em lote do Bestiário; depois ficha pelo token, minimapa e controles rápidos de combate.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## V15.6 — Tabletop Selection & Transform
- `selection.js` conectado aos tokens.
- Shift+clique e Shift+arraste.
- Group drag incremental com locks.
- `history.js` async/serializado para Undo/Redo real.
- Resize e rotação persistentes usando schema V7 existente.
- UI de alças e inspector de multisseleção.
- 36/36 testes; 35 arquivos sem handlers inline.

## V15.7 — Scene Engine
Refatorados modelo, layers, grid/snap, batch tokens e menu contextual. Nova migration V10. Gravewright usado apenas como referência arquitetural; nenhum código copiado.

### V15.8
A captura real mostrou que V15.7 melhorou o modelo mas não a ergonomia. Corrigido contrato único de câmera (`scale`), spawn viewport-first, face rotation e simplificação de UI por nível de zoom.


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

## V15.22
`TabletopStore.setCombat` deve sempre preservar todos os campos do overlay usados pela UI, especialmente `requests`. A aplicação manual faz optimistic patch do PV e depois reconcilia com Supabase.


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

## V15.29
- `auth-character.js`: identidade guiada, relação Classe→Trilha, automação de perícias garantidas e level-up.
- `character-rules.js`: `resonance_points` adicionado ao autosave/realtime da ficha.
- `character.css`: modal/bottom-sheet mobile-first para seletores e progressão.
- Não automatizar marcos cujo efeito numérico não está definido no livro; apenas informar e deixar decisão manual.

## V15.30
- Identidade deixou de ser somente botão/hidden input: Origem, Classe e Trilha são inputs editáveis com busca lateral.
- Progressão passou de `level-up` unidirecional para `level adjustment` bidirecional e confirmável.
- Delevel preserva recursos já gastos: apenas reduz teto e limita o atual se ultrapassar o novo teto.

## V15.32
- Substituído campo texto + lupa por seletor guiado clicável em toda a área.
- Persistência de Origem/Classe/Trilha passa a salvar imediatamente após a escolha.
- Novo layout de picker: origens em accordion, classes em cards, trilhas filtradas pela classe com preview das habilidades.
- Adicionado resumo de Formação EDF na ficha.
- Nenhuma migration nova; arquivos de migrations antigas são excluídos do pacote de entrega.

## V15.33
- Corrigido cache-bust ausente de `styles.css`, causa provável de CSS antigo continuar ativo após deploy.
- Origem/Classe/Trilha não exigem pesquisa para selecionar; busca é somente filtro opcional.
- Nível usa select nativo e handler em capture para impedir autosave parcial antes do recálculo de progressão.


## V15.34 — correção de seletores e nível
- Origem usa cards próprios com descrição, perícias, habilidade e efeito sempre visíveis.
- Trilha usa layout de uma coluna com habilidades legíveis e busca apenas opcional.
- Nível voltou a ser um seletor 1–10 por popout; a progressão resolve a classe diretamente da ficha e não depende do RuleBook estar carregado.
- Cache-bust dos assets de ficha atualizado para 15.34.


## V15.41 — Seletor de Skill Tree sem modal sobre modal
- Ao abrir a Skill Tree a partir da ficha de inimigo, o editor pai é temporariamente ocultado e marcado como `inert`, preservando todos os campos já preenchidos.
- O seletor passa a ser uma etapa exclusiva, com botão explícito `Voltar à ficha`; ao fechar, o mesmo formulário reaparece no estado anterior, incluindo habilidades adicionadas.
- Corrige a sobreposição visual e a disputa de foco entre o editor do Bestiário e o seletor da árvore.

# Continuidade do projeto

Estado atual: **V15.28 — PD + Counterattack Flow**.

Comece em `CONTINUITY/START-HERE.md`.

Atenção: `js/tabletop/interactions.js` é legado da V15.1.1 e não deve voltar ao carregamento. O núcleo ativo usa `coordinates.js`, `board-view.js`, `token-view.js` e `controller.js`.


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

## Checkpoint V15.6
Tabletop possui multisseleção, seleção por área, movimento em grupo, Undo/Redo e transformações persistentes. Sem migration nova. Consulte `CONTINUITY/CURRENT-STATE.md`.

## V15.7
Tabletop refatorado para Scene Engine. Ver `CONTINUITY/CURRENT-STATE.md` e `CONTINUITY/GRAVEWRIGHT-AUDIT.md`. Migration nova: V10.

## V15.8 — Viewport UX Repair
Base atual recomendada. Corrige câmera/zoom, spawn no viewport, rotação somente da arte, pinch `scale`, toolbar e HUD de seleção. Sem migration nova. Testes: 48/48.


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
Corrigidos delivery de Esquiva (`requests` descartado pelo store), campo de resultado do ataque/teste e atualização imediata de PV após ação manual. Sem migration nova.


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

## V15.24 — Combat UX + Realtime Recovery
Checkpoint: `CONTINUITY/FROZEN-CHECKPOINT-V15.24.md`.

- Mestre: Habilidades restauradas e ações rápidas do token selecionado.
- Player: Ações Rápidas persistentes e fluxo ação → alvo → dados físicos com feedback visual.
- Reações: Esquivar, Bloquear, Receber e Contra-Ataque manual.
- Inimigos: imagem por arquivo/URL e picker com busca/quantidade.
- Layout: tabletop desktop maior com scroll; mobile-first com iniciativa compacta.
- Sincronização: Realtime + broadcast + polling de recuperação.
- Sem migration nova; `npm test` 78/78.


## V15.26 — Player Reactions + Rulebook UX
- Corrigido o bug em que Esquivar/Bloquear/Receber reutilizava `apply_manual_combat_action` com ator inimigo e falhava para Players com “Somente o mestre controla inimigos”.
- Nova migration `supabase-migration-v11-player-combat-reactions.sql` cria `resolve_battle_reaction`, RPC SECURITY DEFINER validada pelo dono da reação/admin, transacional e idempotente.
- Player agora resolve a própria reação; o Mestre continua sendo o único controlador de inimigos.
- Dano + resolução da request + battle log acontecem atomicamente no banco, evitando dano duplicado em double tap/retry.
- Esquiva foi alinhada ao livro: Reflexos (AGI), teste de atributo por quantidade de d20, 20 natural, 1 natural (+1d6 informado fisicamente), impedimento por Imobilizado e aviso de Caído/Lento/Congelando.
- “Bloqueio” deixou de ser apresentado como fórmula oficial: o livro não define uma regra-base de Bloqueio. A UI chama “Bloquear / reduzir” e recebe o dano restante após RD/habilidade/regra da mesa.
- Reação virou estado prioritário no mobile; Ações Rápidas ficam visíveis, mas visualmente secundárias até a reação ser resolvida.
- `prompt()` de Esquiva removido; todas as reações usam painel mobile-first, confirmação explícita e feedback de resolução.
- Contra-Ataque continua disponível após Esquiva bem-sucedida conforme a regra geral de Reações do livro.


## V15.27 — Symmetric Reaction Popout
- Player atacando inimigo não aplica mais dano imediatamente: cria `player_attack_reaction` para o Mestre que iniciou a batalha.
- Mestre recebe popout prioritário informando exatamente qual inimigo está sendo atacado, atacante, habilidade/ataque, resultado, dano, ESQ e RD.
- Player também recebe o ataque inimigo como popout prioritário, mobile-first, sem fechamento acidental pelo backdrop.
- Ambos os lados usam Esquivar / Bloquear-reduzir / Receber com rolagens físicas.
- `resolve_battle_reaction` agora resolve de forma atômica tanto `characters` quanto `battle_enemies`.
- O Player pode ler somente o request do próprio ataque para exibir `Aguardando reação do Mestre`, mas somente admin pode resolver reação de inimigo.
- Turno não avança enquanto existir reação relevante pendente; a criação de request também rejeita duplicata pendente do mesmo atacante.
- Migration nova: `supabase-migration-v12-symmetric-combat-reactions.sql`.
- Checkpoint: `CONTINUITY/FROZEN-CHECKPOINT-V15.27.md`.


## V15.28 — PD + Counterattack Flow
- Habilidades agora custam PD por Grau/RES: 1→1, 2→2, 3→3, 4→4.
- Saldo de PD é validado no cliente para UX e no banco para autoridade.
- O débito acontece ao confirmar a habilidade, antes da reação do alvo.
- Contra-Ataque após Esquiva bem-sucedida aplica 50% do dano rolado (regra de mesa solicitada), mantendo o custo integral de PD da habilidade.
- Migration obrigatória: `supabase-migration-v13-pd-counterattack.sql`.
- Checkpoint: `CONTINUITY/FROZEN-CHECKPOINT-V15.28.md`.

## V15.29 — ficha guiada + level-up
- Seletores pesquisáveis de Origem/Classe/Trilha; trilhas filtradas pela classe.
- Progressão automática de PV/PD/PR baseada no livro até nível 10, sem inventar marcos não especificados.
- PR corrigido para `resonance_points`; RD separado.
- Novas perícias da origem/classe adicionadas à ficha: Atuação, Conhecimento, Persuasão, Ocultismo Elemental.
- Sem migration nova. Checkpoint: `CONTINUITY/FROZEN-CHECKPOINT-V15.29.md`.

## V15.30 — edição direta + correção bidirecional de nível
- Origem, Classe e Trilha continuam pesquisáveis pelo Livro de Regras, mas agora também são campos de texto editáveis diretamente na ficha.
- O botão de busca ao lado do campo mantém a seleção guiada e o filtro de Trilhas por Classe.
- Nível agora abre "Ajustar nível" com botões − e +, preview antes de salvar e confirmação obrigatória.
- Ao reduzir nível, o sistema reverte os ganhos numéricos daquele nível; PV/PD atuais não são reduzidos além do novo máximo e PR nunca fica negativo.
- Redução de nível não apaga escolhas manuais (atributos, poderes, habilidades/trilhas); a UI avisa isso explicitamente.
- Sem migration nova.

## V15.32 — seleção guiada real de Origem / Classe / Trilha
- Campos da ficha agora são botões de seleção completos; clicar no próprio campo abre o seletor.
- Seletor usa cards pesquisáveis inspirados no fluxo de criação mostrado como referência, mas com conteúdo EDF.
- Origem: lista expansível, descrição, perícias, habilidade e efeito; ao escolher, perícias concedidas são treinadas e a escolha é salva imediatamente.
- Classe: cards com PV/PD/PR, perícias e proficiências; recursos iniciais continuam automáticos apenas para ficha nova/zerada.
- Trilha: só mostra opções da classe selecionada e exibe as habilidades vinculadas antes de escolher.
- A ficha mostra um resumo de Formação EDF com Origem, Classe e Trilha aplicadas.
- Seletores têm event delegation própria e não dependem de data-click-call, corrigindo o clique que não abria/aplicava corretamente em algumas telas.
- Nenhuma migration nova. Migrations antigas ficam fora do ZIP de distribuição a partir desta versão.

## V15.32 — nivel direto e ficha mais enxuta
- Removido o bloco redundante "FORMAÇÃO EDF" da ficha.
- Nível agora abre um seletor direto de 1 a 10; clicar no número aplica imediatamente a alteração.
- Saltos de vários níveis recalculam PV máximo, PD máximo e PR para todos os níveis atravessados conforme a classe e o VIG atual.
- Redução de nível reverte os recursos numéricos de progressão sem apagar automaticamente escolhas manuais de atributos/poderes/habilidades.
- Pacote de release não inclui migrations antigas nem arquivos APPLY-MIGRATION já utilizados.

## V15.33 — seletores visíveis e nível direto confiável
- Origem agora mostra descrição, perícias, habilidade e efeito sempre visíveis; não depende mais de acordeão.
- Classe e Trilha exibem botão Escolher no topo do card; Trilha também pode ser selecionada clicando no próprio card.
- Habilidades de Trilha são resolvidas pelo `trailId`, evitando colisões de IDs/títulos com habilidades elementais de mesmo nome.
- Nível virou `<select>` real de 1 a 10 na própria ficha. A troca chama a automação de PV/PD/PR antes do salvamento.
- Mantido fallback para o botão de nível de builds antigos em cache.
- Cache-bust atualizado para styles.css, character.css, rules-bundle e auth-character para evitar interface antiga persistindo após deploy.


## V15.34 — correção de seletores e nível
- Origem usa cards próprios com descrição, perícias, habilidade e efeito sempre visíveis.
- Trilha usa layout de uma coluna com habilidades legíveis e busca apenas opcional.
- Nível voltou a ser um seletor 1–10 por popout; a progressão resolve a classe diretamente da ficha e não depende do RuleBook estar carregado.
- Cache-bust dos assets de ficha atualizado para 15.34.

## V15.39 — Consolidação mecânica e automações

- Economia de ações consolidada e explícita (Padrão, Movimento, Leve, Livre e Reação).
- PD/PR/Ressonância separados no fluxo de uso de habilidades.
- Contra-Ataque causa 50% do dano final e mantém custo integral de PD.
- Reação limitada a 1 por rodada; ataques de área com resistência própria não oferecem Esquiva genérica.
- Catálogo explícito de estados por habilidade (aplica/explora/consome), evitando inferência por simples menção.
- Água: Encharcado consolidado e Saturado adicionado como estado avançado apenas por aplicação explícita; Impacto Hidráulico promove Encharcado para Saturado.
- Defesa derivada = 5 + VIG + Armadura; Bloqueio usa Fortitude + Armadura contra o resultado do ataque.
- Progressão: N3/N7 atributo, N4 Grau de Treinamento, N8 Versatilidade automatizados; N2/N6/N9 permanecem pendentes de catálogo de Poderes de Classe.
- Analisador de balanceamento atualizado para V15.39.
- Pacote contém apenas a migration nova V15; migrations antigas permanecem fora do ZIP.

## V15.40 — Habilidades da Skill Tree no Bestiário
- A ficha de inimigo agora permite adicionar habilidades diretamente da Skill Tree EDF por um seletor pesquisável.
- O seletor filtra por elemento e Grau de Ressonância e exibe caminho, descrição, alcance, ação, dano e resolução esperada.
- Habilidades importadas preservam metadados estruturados (`source`, `element`, `path`, `res`, `type`, `range`, `prereq`, `desc`) dentro do JSON `abilities` já existente; nenhuma migration é necessária.
- O mestre ainda pode editar nome, ação, dano e efeito após importar, sem perder a origem/mecânica-base da habilidade.
- Habilidades da árvore usadas por inimigos passam pelo mesmo motor EDF de Ressonância, resolução, dano e aplicação de status/combos que as habilidades dos personagens.
- O elemento do inimigo é considerado na Afinidade de Ressonância quando a habilidade importada tem elemento correspondente.
- O picker é mobile-first e evita adicionar a mesma habilidade duas vezes na mesma ficha.


## V15.41 — Seletor de Skill Tree sem modal sobre modal
- Ao abrir a Skill Tree a partir da ficha de inimigo, o editor pai é temporariamente ocultado e marcado como `inert`, preservando todos os campos já preenchidos.
- O seletor passa a ser uma etapa exclusiva, com botão explícito `Voltar à ficha`; ao fechar, o mesmo formulário reaparece no estado anterior, incluindo habilidades adicionadas.
- Corrige a sobreposição visual e a disputa de foco entre o editor do Bestiário e o seletor da árvore.

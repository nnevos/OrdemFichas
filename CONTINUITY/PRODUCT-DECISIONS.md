# Decisões de Produto que Não Devem se Perder

## 1. Mesa física primeiro

O sistema é um companion para RPG presencial.

- jogadores continuam rolando dados físicos;
- mestre continua narrando e decidindo;
- sistema registra e organiza;
- automações de bookkeeping são desejáveis;
- automações que substituem decisão/rolagem são indesejáveis.

## 2. Sessão é um documento

Após várias tentativas de parser, cards e Guia Rápido, a decisão atual é simplificar:

- o planejamento é um documento rich text;
- deve aceitar conteúdo vindo do Google Docs;
- deve continuar editável durante a sessão;
- evitar transformar automaticamente cada trecho em entidades/cards;
- parsing automático não é prioridade atual.

## 3. Tabletop não é sinônimo de combate

O mapa deve funcionar fora de combate.

Exemplos:
- exploração;
- posicionamento social;
- dungeon crawl sem iniciativa;
- mostrar cenário;
- mover NPCs e jogadores livremente.

Adicionar um token ao mapa **não** deve iniciar combate nem colocá-lo na iniciativa.

## 4. Combate com linguagem visual de JRPG, lógica de mesa presencial

Referências de sensação de UI: Pokémon, Final Fantasy e JRPGs clássicos, sem copiar assets ou interfaces protegidas.

Desejado:
- leitura rápida de grupo versus ameaças;
- foco visual claro no turno/alvo atual;
- comandos grandes e legíveis;
- retrato/nome/PV/condições visíveis;
- transições curtas e responsivas;
- painel de detalhes sob demanda;
- feedback visual para dano/cura/condição registrado.

Não desejado:
- botão que rola ataque sozinho por padrão;
- combate resolvido automaticamente;
- animações longas que atrapalhem a mesa;
- menus profundos para operações frequentes.

## 5. Bestiário continua sendo fonte reutilizável

- template de inimigo é reutilizável;
- token de mapa referencia template, mas pode ter estado próprio;
- cópia em combate não deve destruir o template;
- excluir template não deve apagar histórico ou entidade já instanciada sem confirmação específica.

## 6. Fluidez é requisito funcional

A experiência não pode parecer um site que dá F5 a cada clique.

Preservar:
- cache local de views;
- atualizações em background;
- optimistic UI onde for seguro;
- realtime com debounce;
- scroll/contexto de navegação;
- skeleton apenas quando necessário.

## 7. Mobile é primeira classe

Tabletop completo pode ser melhor no desktop/tablet, mas celular deve permitir:
- mover próprio token;
- consultar PV/condições;
- abrir ficha;
- ping;
- acompanhar iniciativa/turno;
- usar documento da sessão no mestre.

## Decisão V15 — Mesa como área principal

- `Mesa` é aba principal para jogador e mestre.
- Mesa não depende de batalha ativa.
- Token presente no mapa não é participante de combate por definição.
- Movimento é livre e não representa automaticamente ação mecânica/consumo de deslocamento.
- Mestre pode mover todos; jogador apenas o próprio token.
- V15 usa DOM/CSS como renderer de validação; renderer final permanece uma decisão aberta.
- Broadcast de drag é efêmero; banco recebe posição final para evitar excesso de writes.

## Decisão V15.2 — estabilidade antes de features

- Não empilhar hotfixes sobre o motor de interação antigo.
- Tabletop deve ter um único controlador de gestos.
- Não rerenderizar/recriar tokens durante drag.
- Diferenciar clique de drag com threshold.
- Persistir posição apenas no fim do gesto.
- Realtime não é autorizado a dominar o gesto local.
- Só avançar para fog/grid/régua depois de validar o core em dispositivos reais.


## Mundo Tabletop
- A resolução da imagem de fundo **não** define o tamanho da Mesa.
- O mundo deve continuar utilizável sem background.
- Tamanho mínimo atual: 7200×4800.
- Limites devem ser visíveis para o mestre/jogadores saberem quando chegaram à borda.


## V15.5 — Engine Foundation after open-source audit
Auditoria de Excalidraw, Quickdraw, Offline Whiteboard e InfiniteBoard registrada em `CONTINUITY/OPEN-SOURCE-TABLETOP-AUDIT.md`. Criados `object-model.js`, `selection.js`, `history.js` e `editor-shortcuts.js`. A decisão é evoluir a engine existente, não embutir um whiteboard de terceiros. Próximo incremento: ligar multi-seleção/marquee aos tokens existentes e registrar movimentos como comandos undo/redo; depois resize/rotation.

## Decisões V15.6
- Pan do fundo permanece gesto padrão; marquee exige Shift+arraste no desktop para não quebrar a navegação que já funciona.
- Shift+clique é o padrão de multisseleção.
- Apenas o Mestre pode resize/rotacionar tokens; jogadores continuam focados em mover o próprio token.
- Resize de tokens é uniforme (`size`), não largura/altura independentes, para preservar o modelo de token circular e evitar migration desnecessária.
- Undo/Redo atua sobre mudanças do Tabletop feitas localmente; realtime continua recebendo os patches persistidos.

## Scene Engine decisions (V15.7)
- O Tabletop não será um clone de Excalidraw/Gravewright.
- `entity_type` descreve o vínculo RPG; `object_type` descreve o objeto de cena.
- disposição (`friendly/neutral/hostile`) não muda o tipo da entidade.
- estar na Mesa continua independente de estar em Combate.
- lock é ferramenta de edição/segurança, não regra de gameplay.
- grid é opcional e Alt sempre permite movimento livre ao Mestre/usuário autorizado.
- renderer Pixi é possibilidade futura, não dependência atual.

## V15.8 — viewport-first
Uma engine tecnicamente organizada não é suficiente se a Mesa não for manipulável. Prioridade imediata é previsibilidade visual: objeto nasce onde o Mestre está olhando, zoom não destrói UI, controles permanecem legíveis e transformação não gira informação textual.


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


## V15.23 — Mobile UX Freeze
- Mesa mobile reorganizada: mapa permanece prioridade visual; Ações Rápidas continuam logo abaixo do mapa.
- Navegação móvel fixa: Mesa / Ações / Turnos / Grupo.
- Iniciativa abre como painel móvel dedicado; Players + Histórico abrem como painel Grupo.
- Quick Actions viram faixa horizontal rolável no celular para não consumir altura excessiva.
- Modais de batalha/adicionar adaptados a viewport móvel.
- Criado `CONTINUITY/FROZEN-CHECKPOINT-V15.23.md`.
- Estado marcado como FROZEN / safe return point. Próximas melhorias devem partir desse checkpoint, não de branches intermediárias.

# TABLETOP OPEN-SOURCE AUDIT — V15.5

## Referências estudadas
- Excalidraw: MIT. Referência de editor maduro para seleção, transformações, histórico e viewport. Não incorporar o pacote inteiro: arquitetura React é maior que a necessidade atual.
- Quickdraw: MIT. Principal referência para núcleo enxuto de editor: store/editor/geometry, eventos de ponteiro, wheel, seleção e undo.
- Offline Whiteboard: MIT. Referência para implementação compacta, touch-action, wheel e histórico; não usar arquitetura monolítica como base.
- InfiniteBoard: licença não encontrada no ZIP analisado. Usar somente como referência conceitual. Canvas 2D vanilla demonstra pan/zoom e ferramentas simples.
- FreeBeeGee: permanece referência anterior para tabletop KISS e interação previsível.
- RPGUI: apenas inspiração visual, não engine.

## Classificação
A — IMPLEMENTAR: seleção independente, multi-seleção, histórico por comandos, modelo de objetos extensível, viewport separado do estado persistente, patches incrementais.
B — ADAPTAR: ferramentas de desenho, camadas, grid/snap, resize/rotation, import/export — sempre convertidos para objetos de RPG.
C — REFERÊNCIA: engine completa do Excalidraw e canvas imediato do InfiniteBoard.
D — IGNORAR agora: colaboração própria dos whiteboards, chat complexo e features de diagramação sem valor para RPG.

## Decisão de arquitetura
Não trocar o Tabletop por Excalidraw nem por outro whiteboard. Evoluir a V15.2+ incrementalmente. `object-model.js` define vocabulário extensível; `selection.js` mantém seleção fora do renderer; `history.js` implementa command history; persistence/realtime continuam incrementais via Supabase. Tokens existentes permanecem compatíveis.

## Fases
1. Engine: multi-seleção, marquee, resize/rotation, undo/redo.
2. RPG: token/mapa/camadas/grid e ficha.
3. Mestre: hidden/GM-only/notas/ping/bloqueio.
4. Integrações: RuleBook, ficha e log; rolagem automática não será adotada porque o projeto é tabletop presencial-first.
5. Persistência/realtime incremental já existente será estendido para novos object types.

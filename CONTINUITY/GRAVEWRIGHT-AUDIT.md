# Gravewright audit — decisões aplicadas na V15.7

## O que foi confirmado no projeto enviado

O pacote Gravewright inclui licença principal Apache-2.0 e uma licença MIT separada para a API pública. O código analisado foi usado como referência arquitetural, não copiado para o Skill Tree RPG.

Padrões relevantes observados:

- registro/fábrica de renderer (`board-renderer.js`), permitindo trocar implementação sem trocar domínio;
- token com `friendly / neutral / hostile` separado do tipo de entidade;
- controle `gm / owner / party / none` separado da entidade;
- drag de grupo baseado no delta do token principal;
- `setPointerCapture()` durante o gesto;
- snap opcional e Alt para movimento livre;
- serviços de cena e objetos separados do renderer;
- comandos semânticos e operações em lote;
- arquitetura preparada para renderer Pixi, tiles e LOD em mapas grandes.

## O que substituímos na V15.7

1. **Token simples → Scene Token**
   - `disposition`
   - `control_mode`
   - `visibility_mode`
   - `layer_name`
   - `locked`
   - `object_type`
   - `revision`
   - `metadata`

2. **Um único token layer conceitual → Scene Layers reais**
   - map
   - objects
   - tokens
   - markings
   - gm

3. **Grid apenas visual → Grid configurável**
   - visibilidade
   - tamanho
   - snap
   - Alt ignora snap temporariamente

4. **Adicionar inimigo um por vez → operação em lote**
   - quantidade de 1 a 30
   - spawn em formação compacta
   - uma única inserção Supabase para o lote

5. **Ações espalhadas no inspector → Context menu de token**
   - ficha
   - combate
   - duplicar
   - bloquear
   - ocultar/revelar
   - disposição
   - remover

6. **Drag dependente apenas de listeners globais → pointer capture + fallback global**

## O que NÃO foi adotado

- iluminação dinâmica;
- paredes/portas;
- dados digitais obrigatórios;
- chat complexo;
- automação de regras;
- shaders/partículas;
- engine de visão.

Esses itens conflitam com a prioridade de RPG presencial e aumentariam muito a complexidade antes do núcleo de cena estar maduro.

## Próximas substituições planejadas

- renderer DOM atrás de um contrato/fábrica, preparando Pixi sem obrigar migração imediata;
- comandos realtime semânticos e `revision` para optimistic concurrency;
- objetos de cena reais (nota, imagem, marcador, área) usando o mesmo modelo;
- camadas editáveis pelo Mestre;
- minimapa/culling quando a quantidade de objetos justificar.

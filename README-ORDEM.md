# Arquivo da Ordem — Ficha presencial (v11)

Clone independente do Elemento do Frio para fichas de **Ordem Paranormal RPG 1.2**. O código legado foi preservado em arquivos próprios, mas a nova aplicação usa a interface da pasta `ordem/`.


## Correções v11 — Dados de armas, defesa direta e exclusão dos registros

- **Armas de fichas anteriores:** fichas que guardavam somente nome/categoria/espaços agora recuperam dano, crítico, alcance, tipo e grupo do catálogo oficial resumido pelo identificador ou nome exato. Campos que já tenham valor não são sobrescritos. O complemento aparece imediatamente na ficha e será persistido na próxima edição/salvamento da ficha; recomendamos exportar backup antes de publicar a atualização. Itens personalizados sem equivalente no catálogo não recebem estatísticas inventadas e continuam editáveis.
- **Defesa, Esquiva e Bloqueio:** os números finais do card são entradas editáveis. Quando alterados, o valor salvo passa a ser um **ajuste manual final**, substituindo o cálculo automático daquela estatística. O botão **Editar** abre as opções de bônus e os botões **Restaurar automático**, para retornar ao cálculo das regras do livro. Alterar apenas Defesa mantém Esquiva automática dependente da nova Defesa, exceto quando a Esquiva também tem ajuste manual.
- **Remoção acessível:** rituais e habilidades agora exibem **Editar** e **Remover** diretamente nos cards da ficha principal. Poderes escolhidos podem ser removidos sem apagar benefícios automáticos de origem/trilha. Itens e armas podem ser removidos nos detalhes de seus cards. A confirmação evita exclusões acidentais; a exclusão sincroniza pelo salvamento do personagem.
- **Migração de banco:** nenhuma alteração de tabelas Supabase é necessária. Os novos campos `defenseOverride`, `dodgeOverride`, `blockOverride` e as estatísticas recuperadas ficam no JSON da ficha. Recomenda-se backup antes do primeiro uso com a v11.
- **Validação:** testes automatizados de regras, catálogo, UI e recuperação de fichas antigas. Ainda não foi possível validar o layout no Chromium (o processo não inicializa neste ambiente), nem testar a conexão Realtime em um projeto Supabase real.

## Uso sem login

1. Abra o site.
2. Crie uma campanha ou selecione uma existente.
3. Dentro da campanha, crie fichas pelo botão **+ Nova ficha**.
4. Clique em qualquer personagem para ver a ficha completa em uma única página rolável, sem alternar abas.
5. Abra **Painel do mestre** para ver todos os agentes, incluindo PV, PE, SAN, Defesa, NEX, classe, trilha, jogador e ícone/emoji.
6. Use os botões `+`/`−` para atualizar rapidamente PV, PE e SAN no painel do mestre. Essas alterações também aparecem na ficha individual.
7. Exporte um JSON de backup regularmente; os JSONs da versão anterior também podem ser importados.

Nenhuma conta é solicitada; todos os participantes têm acesso igual. A aba **Painel do mestre** é apenas outra visão dos mesmos dados, não uma área protegida. Exclusão de campanha apaga todas as fichas daquela campanha.

## Modo local — funciona sem Supabase

```sh
cd skill-tree-rpg
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Campanhas e fichas ficam em `localStorage` do navegador, e são atualizadas entre abas abertas **no mesmo navegador e origem** via evento `storage`. Outros dispositivos **não** veem os dados, e limpar os dados do navegador pode excluir as fichas. O sistema importa automaticamente, sem apagar o original, as fichas locais que foram criadas na v1 (em uma campanha "Campanha importada").

## Modo compartilhado no Supabase — para várias pessoas e dispositivos

1. Crie um projeto **NOVO** no Supabase, não utilize o projeto original Elemento do Frio.
2. No Supabase SQL Editor, execute **uma vez** `ordem/supabase-schema.sql`.
3. Confirme no Dashboard > Database > Replication que as tabelas `ordem_campaigns` e `ordem_characters` estão habilitadas para Realtime / `supabase_realtime`.
4. Copie `ordem-config.example.js` para `ordem-config.js` e preencha `url` e `anonKey` com a URL e a chave **publishable / anon pública** desse projeto. Nunca coloque `service_role` ou secret key no site.
5. Hospede os arquivos em HTTPS (hosting estático serve) ou use o servidor local para desenvolvimento. Todos devem abrir **o mesmo endereço do site**, conectado ao **mesmo projeto Supabase**.
6. Criar e editar uma ficha grava o JSON no Supabase; as atualizações geram eventos Realtime e recarregam as fichas/painel nos outros dispositivos.

Quando configurar o Supabase, o sistema passa a usar os dados **daquele banco**, sem importar automaticamente os dados locais antigos. Para migrar, exporte JSON no modo local antes de configurar e importe no modo Supabase.

**AVISO DE SEGURANÇA IMPORTANTE:** como o requisito é **sem login e com acesso livre**, as políticas RLS criadas no SQL permitem ler, criar, alterar e excluir **todas** as campanhas e fichas para qualquer usuário anônimo que possa acessar a API e tenha a chave pública. Não existe isolamento privado entre campanhas, proteção contra exclusão maliciosa ou auditoria de autoria. Não use dados pessoais ou segredos. Para um projeto divulgado publicamente, recomenda-se adicionar convites por código/controle de acesso, proteção contra abuso e backups automáticos antes de publicar. A chave anon não é um segredo. O Realtime exige conexão ativa e pode ter atrasos; mudanças simultâneas na **mesma** ficha seguem o último salvamento (não há resolução de conflitos de edição colaborativa).

## O que funciona nesta versão

- Landing page de campanhas: criar, abrir e excluir.
- Fichas separadas por campanha: criar, listar, selecionar, editar e excluir.
- Acesso igual a todas as fichas, sem cadastro.
- Painel do mestre com todos os agentes e recursos PV, PE e SAN, mais valores de combate, classe, NEX, nome do jogador e ícone/emoji.
- Atualização imediata no próprio navegador; sincronização entre dispositivos via Supabase Realtime quando configurado.
- Motor da v1: três classes, 15 trilhas, 26 origens, 28 perícias, progressão por NEX, PV/PE/SAN, defesa, inventário, carga, rituais manuais, anotações e JSON.
- Ficha integral responsiva inspirada no fluxo de leitura da interface original: recursos no topo, identidade, atributos, defesa, 28 perícias, poderes, inventário, rituais e notas na mesma página. Atalhos saltam para as seções; telas separadas permanecem apenas para adicionar e editar coleções.

## Limites e pendências

- **Sem Supabase, não há compartilhamento entre dispositivos**.
- Edição simultânea da mesma ficha pode sobrescrever mudanças anteriores (last-write-wins). Não é um editor colaborativo com fusão de alterações.
- O painel do mestre ainda não controla iniciativas, turnos, cenas ou ameaças; a mesa virtual do código original ainda não foi integrada.
- Não há perfis de mestre/jogador, permissões ou ocultação de fichas por design.
- Nem todos os poderes, rituais e condições estão automaticamente aplicados; permanecem as limitações de regras descritas no relatório da v1.
- A sincronização com um banco real **não foi testada**, porque não há projeto Supabase/credenciais fornecidos. O modo local e fluxos do UI foram testados de forma automatizada.

## Testes

```sh
npm run test:ordem
```

**36 testes aprovados**: 24 testes de regras + 4 testes de fluxos UI + 3 testes do assistente + 5 testes de catálogos (campanhas, fichas, painel e separação por campanha). Teste real em múltiplos navegadores com Supabase ainda pendente. Não execute migrations legadas do sistema antigo no banco novo.

## Estrutura alterada

- `index.html`: entrada de campanhas e controles de navegação.
- `ordem/main.mjs`: seleção de campanha, fichas, mestre, importação/exportação e estado.
- `ordem/sync.mjs`: adaptador opcional Supabase com CRUD e Realtime.
- `ordem/style.css`: UX responsiva para campanhas e cards do mestre.
- `ordem/supabase-schema.sql`: tabelas e políticas RLS públicas explícitas para o uso sem login.
- `ordem-config.js`: modo local padrão; configurar para o Supabase.
- `tests-ordem/ui-smoke.test.mjs`: testes do fluxo sem login.

## Alteração v3 — leitura em uma página

Na aba **Ficha completa**, as informações são mostradas num único fluxo vertical, inclusive no celular: recursos editáveis, identificação, atributos, estatísticas de combate, as 28 perícias com rolagem rápida, poderes já cadastrados, equipamentos, rituais e textos de história/anotações. Botões “Adicionar / editar” levam aos formulários especializados, mas **não são necessários para consultar** a ficha. A navegação curta “Ir para” utiliza âncoras dentro da mesma página. O layout mobile dispensa tabelas horizontais para a consulta de perícias e inventário. O painel do mestre e a sincronização Supabase seguem iguais à v2.

## Alteração v4 — Ficha mobile-first + assistente de criação (06/11/2026)

### Fluxo

**Abrir o site → escolher/criar campanha → + Nova ficha → 6 etapas de criação → ficha completa → painel do mestre.**

A ficha **não é mais criada imediatamente** ao tocar em `+ Nova ficha`. O assistente trabalha com um rascunho temporário (somente na página atual) e só grava no armazenamento/Supabase quando a pessoa confirma **Criar ficha** na revisão final. Cancelar não cria um personagem vazio. Rascunhos não são recuperados depois de atualizar a página.

As etapas são:

1. Identidade (nome, jogador, ícone, conceito).
2. Origem, classe, NEX, trilha quando aplicável e escolhas obrigatórias do Combatente.
3. Distribuição dos cinco atributos com validação de pontos e limites.
4. Treinamento de perícias, com as obrigatórias sinalizadas.
5. Poderes de classe, rituais e habilidades adicionais — **registro de nomes e dados**, sem catálogo integral reproduzido nem automatização completa de efeitos.
6. Revisão e confirmação, com erros e avisos do motor.

### Ficha de consulta

Baseada na imagem de referência enviada: no desktop, layout dividido em **identidade, atributos e recursos (esquerda) / perícias (centro) / combate, rituais, habilidades e inventário (direita)**. No celular, tudo ocupa uma coluna nesta sequência: identidade → atributos → vida/sanidade/esforço → defesa → perícias → combate → rituais → habilidades → inventário → descrição. A informação continua presente em **uma página**, sem precisar alternar seções para consultar.

A ficha completa mostra os poderes de origem automaticamente, a trilha escolhida, poderes de classe registrados e habilidades extras. Os botões **Editar** levam a telas especializadas, permitindo alterações **após a criação**. Acrescentados cadastro/remoção de **ataques** (nome, dano, crítico, observações) e **habilidades extras** (nome e descrição). Os valores de PV, PE e SAN podem ser ajustados no resumo e seguem compartilhados com o painel do mestre.

### Supabase

O banco continua usando as mesmas tabelas de v3. Não precisa executar uma migração adicional para este layout: os novos campos `attacks` e `abilities` são incluídos no JSON do personagem, na coluna de dados já existente. Use o schema `ordem/supabase-schema.sql` de uma **instalação nova**, caso ainda não tenha configurado. As políticas públicas continuam sem isolamento/controle de alterações — **não é seguro expor a instância a desconhecidos**.

### Validação e limitações

`npm run test:ordem`: **31 testes aprovados** (regras, campanhas, criação guiada, fichas em uma tela, edição pós-cadastro, mestre e validação de campos). Tentativa de testar no Chromium foi bloqueada (`ERR_BLOCKED_BY_ADMINISTRATOR` ao acessar o servidor local); assim, **layout real em dispositivos móveis e Realtime com credenciais Supabase não foram validados neste ambiente**. O sistema não reproduz nem aplica automaticamente todo o catálogo de rituais/poderes do livro; referências a efeitos são entradas manuais. Ataques são registros para consulta, sem rolagem de dano automatizada.

## V5 — Catálogos do livro, perícias e cadastros rápidos

- **Perícias:** 28 registros com atributo-base, condições de treinamento e seletor por grau. Na criação e na edição, o usuário escolhe **Leigo +0 / Treinado +5 / Veterano +10 / Expert +15**, respeitando os limites básicos de NEX. Perícias fixas de origem/classe são aplicadas automaticamente. A ficha completa continua mostrando os bônus.
- **Rituais:** seletor de **85 registros de nome/elemento/círculo** conferidos com a lista de rituais das páginas impressas **122–123** do livro v1.2. Há seleção no assistente e no editor pós-criação. Rituais personalizados continuam disponíveis. A lista identifica os rituais; seus textos completos, requisitos especiais, aprimoramentos e fórmulas de efeito **não foram transcritos nem automatizados**.
- **Armas/munições:** **41 entradas** das tabelas das páginas impressas **56–57**, preenchendo nome, dano e crítico nos ataques, sem impedir edição manual.
- **Equipamentos/proteções:** **30 entradas** das tabelas das páginas impressas **62–63**, preenchendo nome, categoria, tipo e espaços; sem aplicação automática de proteção/defesa ou de bônus especiais por equipamentos. O catálogo de itens paranormais/amaldiçoados e todas as modificações ainda **não estão completos**.
- **Persistência:** os dados escolhidos no catálogo são copiados para o JSON normal da ficha; não há necessidade de criar tabelas adicionais no Supabase. O cadastro é independente e pode ser corrigido depois.
- **Aviso de regras:** seleção em um catálogo não garante que o personagem cumpra os pré-requisitos para usar o registro. Confirme os limites de NEX, patente, proficiência, aprendizado de rituais e permissões do mestre. As mudanças ainda usam sincronização por último salvamento quando o Supabase estiver configurado.

Arquivo do catálogo: `ordem/catalog.mjs`. Para reexecutar os testes: `npm test`.

## V6 — Perícias diretamente na ficha, criação livre e catálogo visual de rituais

**Mudança de fluxo:** a tela **Ficha completa** agora apresenta seletor direto em cada uma das 28 perícias, com os valores **0, 5, 10 e 15** e rolagem adjacente. Não é necessário abrir a aba de edição para alterar o treinamento. O mesmo seletor com os quatro graus está disponível na etapa de criação e na aba de perícias. Seleções são salvas na ficha e sincronizadas pelo mesmo mecanismo de campanhas.

**Modo de cadastro livre:** os bloqueios de pontos/treinamento/NEX do assistente foram retirados para permitir campanhas personalizadas, fichas já evoluídas ou ajustes autorizados pelo mestre. O nome é necessário para confirmar o novo personagem. Avisos de desvios das regras são informativos e não impedem o salvamento. As fórmulas de atributos, recursos, combate, carga e progressão continuam baseadas no livro v1.2; essa liberdade de cadastro não altera automaticamente as regras de rolagem. Para valores de perícia concedidos por origem/classe, um registro explícito 0 no modo livre pode substituir o treinamento automático.

**Catálogo de rituais em janela:** em vez da lista nativa de opções que ocupava a tela, os botões **Abrir catálogo de rituais / Explorar catálogo de rituais** abrem um diálogo responsivo com filtros por **elemento, círculo e busca textual**. Cada ritual pode ser expandido para visualizar **nome, elemento, círculo, resumo breve, execução, alcance, alvo/área, duração e resistência** quando o livro fornecer essas informações. A referência indica a página impressa, e o botão `+` adiciona uma cópia à ficha na criação ou edição posterior. Pode-se adicionar vários rituais antes de fechar. Os campos adicionais e anotações manuais continuam editáveis após adicionar. Foram indexadas 85 entradas (82 nomes distintos, por repetição do ritual Amaldiçoar Arma em quatro elementos).

**Limitação importante:** resumos do catálogo derivam do índice do livro; não são transcrições integrais das regras, e os aprimoramentos Discente/Verdadeiro não foram automatizados. Consulte o PDF fornecido para executar efeitos complexos. O diálogo usa metadados estruturados extraídos das descrições, sem adicionar novas tabelas ao Supabase. A versão 6 mantém as mesmas configurações e o mesmo esquema de campanhas da v5.

**Teste:** `node --test tests-ordem/*.test.mjs`: **39 aprovados, 0 falhas**. Testes cobrem regras, catálogo, assistente, painel do mestre e interações simuladas do diálogo. Não foi possível concluir a captura visual de navegador Chromium no ambiente; os estilos responsivos e a sincronização Realtime externa devem ser conferidos ao publicar.

## V7 — UX presencial e ficha única (06/11/2026)

- **Correção do catálogo de rituais:** a região rolável usa cards de altura própria em coluna flexível, evitando que 85 entradas sejam comprimidas em linhas vazias. Os cards possuem título, elemento, círculo, detalhes expansíveis e botão de adicionar. A posição da lista é mantida ao expandir um item.
- **Equipamentos no mesmo padrão:** botão na ficha abre um popup com busca, filtro por tipo, 71 registros (armas, munições e equipamentos), estatísticas resumidas, categoria/espaços e botão `+` para copiar o item para o inventário.
- **Ficha como tela principal:** botões *Editar* das seções abrem uma janela sobre a ficha, em vez de navegar para outras abas. As informações continuam disponíveis na visão única. Na criação, o assistente permanece em etapas e o catálogo de rituais também funciona nele.
- **Rolagens presenciais:** removidos os botões de jogar dados das perícias. Cada perícia indica diretamente o conjunto de dados físicos e bônus, como `3d20 (maior) +5` ou `2d20 (menor)` se atributo zero. Os graus 0/5/10/15 continuam editáveis no próprio resumo. Ataques mostram dano e crítico registrados, sem rolar automaticamente.
- **Edição após criação:** formulários para atributos, ataques, inventário, habilidades, poderes e rituais ficam em popups próprios; atualizam ficha e persistem normalmente. No celular, o editor prioriza uma coluna e controles com espaço adequado.
- **Supabase:** mesmas tabelas e política de sincronização v6, sem nova migration. Catálogos são locais no código; somente os registros adicionados à ficha são salvos no banco. Não é necessária autenticação para o fluxo atual, mas as políticas de acesso público permitem alterações por qualquer usuário conectado (ver aviso acima).
- **Validação:** `npm test` => **41 testes aprovados**. A integração Supabase real não foi testada; Chromium bloqueado neste ambiente, portanto a correção visual ainda exige conferência no navegador do dispositivo. O popup usa dados resumidos do catálogo e não substitui o livro de regras.

## V8 — Inventário com estatísticas, habilidades por classe/trilha e edição direta

- **Inventário na ficha:** cada item apresenta quantidade, tipo, espaços e, quando cadastrados, dano e crítico. Ao expandir, são exibidos alcance, tipo de dano, categoria, grupo e proficiência. Armas escolhidas no catálogo agora **preservam as estatísticas no inventário**; antes essas informações ficavam apenas no catálogo. Para fichas antigas, use *Editar inventário → Estatísticas do item* para preencher manualmente os campos que foram salvos antes da atualização.
- **Editar estatísticas:** no popup de inventário, cada item possui um painel expansível de dano, crítico, alcance, tipo de dano, grupo, proficiência e notas. Edição por campo; todos os valores são salvos no JSON da ficha e podem sincronizar pelo mesmo Supabase já configurado.
- **Habilidades e poderes:** novo popup com filtros de Combatente, Especialista, Ocultista, Origens e Poderes Paranormais. As três classes têm filtros internos por trilha; o popup permite pesquisar, expandir e adicionar. O índice inicial contém **148 referências de nomes** (nem todas têm descrição resumida). Essas entradas são indicações para consulta, não implementações completas de poderes nem validação de pré-requisitos. As habilidades escolhidas viram registros próprios, com nome, categoria, trilha, descrição e notas editáveis.
- **Fichas mobile-first:** a ficha completa permanece rolável em uma única página. Atributos e Defesa têm agora editores curtos próprios, acessíveis por seus botões *Editar*, em vez de abrir o cadastro inteiro. A seção de habilidades exibe descrições expansíveis. Não existem botões de rolagem automática.
- **Versão do livro:** referências e nomenclaturas com base no PDF v1.2 fornecido. Resumos não substituem a descrição completa do livro; vários poderes do índice ainda têm efeito em branco para edição manual. Alguns nomes de trilha/poderes especiais merecem conferência antes de publicação pública. A aplicação automática de habilidades e os pré-requisitos ainda não estão implementados.
- **Compatibilidade:** não é necessária uma migração de tabelas do Supabase. Os campos novos são guardados dentro do JSON do personagem. Não foi feita alteração no projeto original nem nos dados remotos.
- **Validação:** `npm test` — **44 testes automatizados aprovados** (41 preexistentes e 3 novos). Os cenários de Supabase remoto, navegação visual em dispositivos móveis e comportamento real no navegador continuam pendentes de validação.

## V9 — Combate separado de inventário, ficha editável e correção de habilidades (06/11/2026)

- **Combate** agora lista armas provenientes de `items` (tipo `Arma`, ou registro de arma com dano) e ataques personalizados antigos. Dados de **dano, crítico, alcance, tipo de dano, categoria, espaços e grupo ficam visíveis sem expandir**. O botão **Editar arma** abre os campos na própria ficha; também permite remover a arma. **Adicionar arma** abre o catálogo já filtrado para armas.
- **Inventário** agora exibe **somente itens não classificados como armas**, organizados com quantidade/tipo/espaços e botão de edição. Possui uma área de **notas livres** para consumíveis, pistas e itens sem estatística. O catálogo de inventário lista apenas itens que não são armas. O total de carga permanece calculado sobre TODOS os equipamentos, inclusive as armas exibidas em Combate.
- **Dados anteriores preservados:** nenhuma arma é movida ou removida do JSON da ficha. A separação é **visual**: `items` continua sendo a fonte única de equipamento. Ataques personalizados existentes em `attacks` permanecem em Combate com destaque "Ataque manual"; não são duplicados automaticamente.
- **Atributos e defesa** possuem controles numéricos visíveis na própria ficha: os cinco atributos, proteção, outros bônus de Defesa, bônus de esquiva, bloqueio e deslocamento. Alterar e sair do campo confirma/salva e atualiza os cálculos derivados.
- **Habilidades:** corrigido utilitário de busca/filtro e fluxo de adicionar sem fechar o catálogo; os grupos Combatente/Especialista/Ocultista/Origens/Poderes Paranormais e filtros de trilha permanecem no popup. Selecionar adiciona um registro editável à ficha. Regras detalhadas e efeitos automáticos ainda não estão implementados para todos os poderes.
- **Testes:** `npm test` passou com **47/47 testes**, incluindo testes de abrir, expandir e selecionar uma habilidade, campos diretos, separação de inventário/armas e dados de catálogo. A inicialização visual do Chromium continua bloqueada neste ambiente, então o layout em navegador real e a sincronização Supabase remoto devem ser verificados no deploy.
- **Supabase:** permanece compatível com o schema v8. A nova nota `inventoryNotes` fica dentro do JSON do personagem; nenhuma migration nova é necessária. O código não acessa credenciais privadas e o original não foi alterado.

## V10 - melhoria da ficha no celular (6 de novembro de 2026)

- **Combate compacto:** os cards de armas mostram nome, dano e crítico na primeira linha. Toque na seta para ver alcance, categoria, espaços, tipo de dano e grupo; use **Editar** para alterar os dados. Os atributos da arma permanecem preservados no JSON da ficha.
- **Topo mobile reduzido:** título menor, menu **Opções** para importar/exportar fichas, campanha e abas Fichas/Painel do mestre organizadas em duas linhas, personagens em lista horizontal compacta e botão Nova ficha sem ocupar uma linha inteira.
- **Ordem de consulta corrigida:** os botões de adicionar ritual e habilidade estão agora **dentro** de suas respectivas seções. Isso elimina o erro anterior em que apareciam antes de Atributos no celular.
- **Sem alterações no Supabase:** continuam sendo utilizados o mesmo esquema e a mesma estrutura de JSON. Não é necessário alterar tabelas ou migrar fichas.
- **Testes:** 50 testes automatizados aprovados com `node --test tests-ordem/*.test.mjs`.
- **Limitação:** o navegador Chromium do ambiente bloqueou o acesso tanto via localhost quanto via file URL; portanto, a renderização mobile final e o Supabase Realtime ainda precisam de teste em dispositivos reais.

### Atualização v13 — Dano dos rituais

Os cards de rituais mostram dados de dano diretamente abaixo do nome, como os cards de armas. O catálogo fornece os danos verificados no livro v1.2 para Eletrocussão (3d6, 6d6, 8d6) e Decadência (2d8+2, 3d8+3, 8d8+8). Para outros rituais, os danos podem ser preenchidos no editor; quando não há dado registrado, a interface mostra explicitamente "Dano: não cadastrado", sem inventar estatísticas. Rituais já salvos com `catalogId` recuperam os valores conhecidos sem sobrescrever personalizações. Não é necessária migração SQL.

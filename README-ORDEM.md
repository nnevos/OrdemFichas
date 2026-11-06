# Arquivo da Ordem — Campanhas, fichas e painel do mestre (v2)

Clone independente do Elemento do Frio para fichas de **Ordem Paranormal RPG 1.2**. O código legado foi preservado em arquivos próprios, mas a nova aplicação usa a interface da pasta `ordem/`.

## Uso sem login

1. Abra o site.
2. Crie uma campanha ou selecione uma existente.
3. Dentro da campanha, crie fichas pelo botão **+ Nova ficha**.
4. Clique em qualquer personagem para ver/editar a ficha completa.
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
- UI responsiva baseada na identidade do clone da v1.

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

**27 testes aprovados**: 24 testes de regras + 3 testes de fluxos UI (campanhas, fichas, painel e separação por campanha). Teste real em múltiplos navegadores com Supabase ainda pendente. Não execute migrations legadas do sistema antigo no banco novo.

## Estrutura alterada

- `index.html`: entrada de campanhas e controles de navegação.
- `ordem/main.mjs`: seleção de campanha, fichas, mestre, importação/exportação e estado.
- `ordem/sync.mjs`: adaptador opcional Supabase com CRUD e Realtime.
- `ordem/style.css`: UX responsiva para campanhas e cards do mestre.
- `ordem/supabase-schema.sql`: tabelas e políticas RLS públicas explícitas para o uso sem login.
- `ordem-config.js`: modo local padrão; configurar para o Supabase.
- `tests-ordem/ui-smoke.test.mjs`: testes do fluxo sem login.

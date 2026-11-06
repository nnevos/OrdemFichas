# Auditoria, adaptação e escopo — Ordem Paranormal v1.2

## Arquivos fornecidos

- Projeto base: ZIP `skill-tree-rpg.zip` (arquivos extraídos sem diretório `.git`, mantendo a árvore de código).
- Livro: `iniciativa-t20-ordem-paranormal-rpg-v1-2-vs-1-4.pdf`, cujo conteúdo se identifica como **Ordem Paranormal RPG v1.2** (330 páginas do arquivo; registro de atualização na p. 8 do PDF). O PDF **não** foi copiado para o projeto nem para o pacote final.

## Auditoria resumida do código legado

| Aspecto | Localização no projeto original | Situação na migração |
|---|---|---|
| Página inicial, navegação | `index.html`, `js/navigation.js`, `js/ui-flow.js` | Nova página inicial baseada no conceito de navegação por abas; interface legada arquivada em `legacy.html` |
| Fichas e automações originais | `js/app/auth-character.js`, `js/app/character-rules.js` | Motor novo em `ordem/rules.mjs`; modelo de dados incompatível, não há conversão automática |
| Livro próprio Elemento do Frio | `rules/`, `rules-bundle.js`, `skills-data.js` | Mantidos como histórico, não carregados no app Ordem |
| Layout e estilos | `css/*`, `styles.css` | Reutilização de `css/base.css` e `css/character.css`; visual adaptado em `ordem/style.css` |
| Supabase e perfis | `js/supabase.js`, `js/live-sync.js` | Endpoint original retirado; modo local independente, cloud ainda não integrada |
| Combate e ameaças | `js/app/combat.js`, `js/combat/*` | Preservados como código legado; adaptação completa ainda pendente |
| Mesa/tokens | `js/tabletop/*` | Preservados como código legado; adaptador de personagem e banco ainda pendente |
| Mestre, documentos, sessões | `js/app/master.js`, `js/documents.js`, `js/session-planner.js` | Preservados como código legado; integrações ainda pendentes |
| Banco original | `supabase-migration-*.sql` | Arquivos legados mantidos; não devem ser aplicados no banco original; schema novo inicial em `ordem/supabase-schema.sql` |
| Testes existentes | `tests/*` | Preservados, com `npm run test:legacy` para consulta; novos testes em `tests-ordem/` |

## Entregue nesta versão

- `index.html`: nova interface principal para fichas Ordem Paranormal.
- `ordem/rules.mjs`: cálculos base independentes da UI, com dados de classes, 26 origens, 28 perícias, patentes e regras de carga.
- `ordem/main.mjs`: múltiplas fichas, edição, salvamento em localStorage, exportação/importação JSON, rolagens, inventário, rituais, notas e validação.
- `ordem/style.css`: tema e UI responsiva.
- `tests-ordem/`: 29 testes automatizados executados com sucesso (24 de regras + 5 de interface simulada).
- `README-ORDEM.md`: instalação, uso, cobertura, limites e referências.
- `ordem/supabase-schema.sql`: esquema isolado para futura integração, **não conectado**.

## Verificação e limitações

- `node --check` nas novas fontes: sem erro de sintaxe.
- `npm test`: **29/29 aprovados** nos testes do clone.
- **Baseline original antes da adaptação:** 119 testes / 115 aprovados / 4 falharam (principalmente devido a migrações e versões de cache busting). 
- **Validação com navegador gráfico:** não concluída neste ambiente; Chromium headless não conseguiu produzir screenshot. O arquivo foi verificado pela sintaxe e pelos testes unitários e de UI simulada, mas precisa ser testado manualmente em navegador real.
- Não foi possível validar autenticação, Realtime, RLS, colaboração, usuários de mestre ou mesa neste ambiente, pois a migração destas áreas não foi executada.
- Não está sendo afirmada compatibilidade total com todas as mecânicas do livro; os subsistemas incompletos estão descritos em `README-ORDEM.md`.

## Próximos componentes prioritários

1. Escolhas de poderes e trilhas com pré-requisitos, efeitos passivos e progressão.
2. Catálogos estruturados de equipamentos e ações de combate.
3. Condições, resistências, ataques, efeitos e testes com contextos de ação.
4. Supabase isolado com identidade, autorização e tabelas de fichas, campanhas, mestre e mesa.
5. Migração dos módulos Mesa e Combate e testes de integração em navegadores reais.

## Nota de respeito ao livro

Esta aplicação transforma regras numéricas e nomes de mecânicas em código, mas não inclui uma cópia do PDF, imagens, logotipos protegidos nem o texto integral dos rituais e habilidades. Não substitui o livro de regras original.

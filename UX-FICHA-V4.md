# UX/UI — ficha completa, criação guiada e painel do mestre

## Referência visual
A imagem fornecida mostra três regiões no desktop: personagem/atributos/recursos; perícias; combate/rituais/habilidades. O clone agora segue essa hierarquia visual. No mobile, ela é reorganizada em uma coluna única, sem depender de rolagem lateral para consultar informações.

## Caminho principal
1. Campanhas — listar, criar, abrir e excluir.
2. Campanha — mostrar fichas e botão para criar.
3. Assistente de ficha — seis etapas, sem criar personagem persistente antes de confirmar.
4. Ficha completa — leitura contínua, com PV/PE/SAN ajustáveis e seções detalhadas.
5. Edição — botões de cada seção abrem formulários especializados e permitem voltar ao resumo.
6. Mestre — resumo coletivo dos recursos de todas as fichas da campanha.

## Estados e mensagens
- Campos essenciais e pontos de atributos são validados no assistente.
- Perícias automáticas são visíveis como escolhas fixas; outras escolhas podem ser alteradas.
- Erros de regras impedem confirmar a ficha; avisos são exibidos para revisão.
- Somente confirmar a ficha gera uma gravação no Supabase ou armazenamento local.
- Sem autenticação, todo participante pode editar e excluir: fazer backups regularmente.

## Questões para uma próxima versão
- Incorporar uma lista estruturada e verificável de poderes, habilidades de trilha e rituais para seleção (respeitando direitos de uso do material).
- Automatizar os pré-requisitos, efeitos, custos complexos e progressão de NEX mais detalhada.
- Criar testes reais de UI com viewport mobile e de sincronização multiusuário com credenciais do projeto Supabase.
- Tratar conflitos de edição simultânea e restringir a exposição pública da API.

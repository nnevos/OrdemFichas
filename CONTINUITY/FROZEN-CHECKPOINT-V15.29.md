# FROZEN CHECKPOINT — V15.29

Base: V15.28.

## Ficha e progressão
- Origem, Classe e Trilha deixaram de ser texto livre e ganharam seletores pesquisáveis.
- Trilhas são filtradas pela classe usando `classId` do Livro de Regras.
- Origens exibem perícias, habilidade e efeito; perícias que existem na ficha são treinadas automaticamente.
- A lista da ficha agora inclui Atuação, Conhecimento, Persuasão e Ocultismo Elemental, presentes no livro.
- Ao escolher uma classe em uma ficha nova de nível 1 e recursos zerados, PV/PD/PR iniciais são configurados pela classe.
- O botão de nível abre preview e confirmação de level-up.
- Level-up aplica por nível: PV da classe + VIG, +2 PR, e PD por classe (+3 Combatente/Especialista; +4 Arcanista).
- PV e PD atuais recebem apenas o ganho do nível; recursos gastos/dano prévio não são totalmente restaurados.
- Marcos 1..10 são mostrados. Aumento de Atributo, Grau de Treinamento, Versatilidade, Poder da Classe e qual Habilidade de Trilha entra no marco continuam como decisões manuais quando o livro não especifica a mecânica completa.
- Corrigido o rótulo PR da ficha: `resonance_points` agora aparece como PR e `damage_reduction` aparece separadamente como RD.

## Banco
- Nenhuma migration nova: `characters.resonance_points` e `save_character_patch` já existem desde V5.

## Validação
- `npm test`: 93/93.
- `npm run check:inline-events`: 41 arquivos sem handlers inline.
- `node --check js/app/auth-character.js` e `js/app/character-rules.js` aprovados.

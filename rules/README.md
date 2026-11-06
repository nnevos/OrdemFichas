# Base estruturada de regras — Elemento do Frio

Gerada a partir do livro enviado. O objetivo é funcionar como uma base de conhecimento, não como uma transcrição linear.

## Arquivos
- `basic-rules.js` — atributos, testes e ações básicas.
- `skills-rules.js` — perícias, treinamento, proficiências, iniciativa, DT e Bloqueio (marcado para revisão).
- `combat-rules.js` — Defesa, Esquiva, Contra-Ataque, ataque, dano, RD, alcance etc.
- `resources-rules.js` — PV, PD, PR e recuperação.
- `resonance-rules.js` — Ressonância, graus, DT, afinidade, instabilidade e uso criativo.
- `conditions-rules.js` — condições e status.
- `classes-rules.js` — Combatente, Especialista e Arcanista Elemental.
- `trails-rules.js` — todas as trilhas por classe.
- `trail-abilities-rules.js` — habilidades e passivas próprias das trilhas.
- `origins-rules.js` — origens da tabela do livro.
- `equipment-rules.js` — armas, alcances e armaduras.
- `elemental-rules.js` — elementos e bônus iniciais.
- `progression-rules.js` — progressão de classe.
- `skill-tree-rules.js` — regras da Skill Tree.
- `abilities-rules.js` — 115 habilidades extraídas e estruturadas das seções Universal, Fogo, Água, Terra, Vento, Energia, Frio e Força Inata.
- `combo-rules.js` — relações condição ↔ habilidades que aplicam/aproveitam.
- `review-issues.js` — ambiguidades e inconsistências que precisam de revisão humana.
- `index.js` — agrega tudo e fornece busca ponderada por título, alias, keyword e conteúdo.

## Busca
`searchRules('esquiva')` prioriza a regra Esquiva, em vez de simples ocorrências textuais.
`searchRules('desviar')` também encontra Esquiva por palavra-chave.
`searchRules('reduzir dano')` prioriza RD.
`searchRules('pontos de magia')` aponta para PR por alias.

## Regras marcadas `needs-review`
Nenhuma lacuna foi inventada. Quando o livro usa um conceito sem definição completa ou apresenta ambiguidade, a entrada recebe `status: "needs-review"` e uma `note`. Veja também `review-issues.js`.

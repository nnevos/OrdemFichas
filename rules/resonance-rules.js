export default [
  {
    "id": "ressonancia",
    "title": "Ressonância Elemental",
    "category": "ressonancia",
    "summary": "Conexão entre o personagem e o elemento que manipula.",
    "description": "Conexão entre o personagem e o elemento que manipula.",
    "mechanics": [
      "Determina capacidade de moldar, sustentar e controlar efeitos elementais.",
      "Efeitos mais complexos exigem maior Grau de Ressonância."
    ],
    "examples": [],
    "related": [
      "grau-de-ressonancia",
      "teste-de-ressonancia",
      "afinidade-elemental",
      "pr",
      "uso-criativo"
    ],
    "keywords": [
      "ressonância",
      "ressonancia",
      "magia elemental"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "grau-de-ressonancia",
    "title": "Grau de Ressonância",
    "category": "ressonancia",
    "summary": "Nível de domínio que limita a complexidade das habilidades.",
    "description": "Nível de domínio que limita a complexidade das habilidades.",
    "mechanics": [
      "Grau 1 — Inicial: manipulações simples.",
      "Grau 2 — Estável: uso consistente em combate.",
      "Grau 3 — Avançado: controle refinado e efeitos complexos.",
      "Grau 4 — Elevado: grande poder e larga escala."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "teste-de-ressonancia",
      "skill-tree"
    ],
    "keywords": [
      "grau",
      "grau de ressonância",
      "grau de ressonancia"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "teste-de-ressonancia",
    "title": "Teste de Ressonância",
    "category": "ressonancia",
    "summary": "Teste realizado ao utilizar habilidades elementais.",
    "description": "Teste realizado ao utilizar habilidades elementais.",
    "mechanics": [
      "Antes do teste, o personagem declara a habilidade e paga o custo de PD da tentativa.",
      "Role 1d20 + Intelecto ou Presença.",
      "DT Grau 1: 10.",
      "DT Grau 2: 13.",
      "DT Grau 3: 16.",
      "DT Grau 4: 20.",
      "Sucesso: a habilidade é manifestada/executada; em habilidades elementais corpo a corpo, este sucesso também confirma o acerto.",
      "Falha: habilidade falha; a ação e o PD já gastos na tentativa não são devolvidos.",
      "Falha por 5 ou mais: Ressonância Instável.",
      "20 natural: efeitos numéricos aumentam 50%, arredondando para cima.",
      "PR nunca é gasto para executar a habilidade; PR serve apenas para desbloquear/evoluir a Skill Tree."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "grau-de-ressonancia",
      "ressonancia-instavel",
      "afinidade-elemental",
      "intelecto",
      "presenca"
    ],
    "keywords": [
      "teste de ressonância",
      "teste de ressonancia",
      "dt ressonância",
      "dt ressonancia"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "ressonancia-instavel",
    "title": "Ressonância Instável",
    "category": "ressonancia",
    "summary": "Efeito colateral provocado por falhar por 5 ou mais no Teste de Ressonância.",
    "description": "Efeito colateral provocado por falhar por 5 ou mais no Teste de Ressonância.",
    "mechanics": [
      "Fogo: sofre 1d6 de fogo.",
      "Água: -3m de deslocamento por 1 rodada.",
      "Terra: -1 em ataques.",
      "Vento: -1 Defesa.",
      "Energia: -1 em todos os testes por 1 rodada.",
      "Frio: fica Lento."
    ],
    "examples": [],
    "related": [
      "teste-de-ressonancia",
      "lento",
      "fogo",
      "agua",
      "terra",
      "vento",
      "energia",
      "frio"
    ],
    "keywords": [
      "instabilidade",
      "ressonância instável",
      "ressonancia instavel",
      "falha por 5"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "afinidade-elemental",
    "title": "Afinidade Elemental",
    "category": "ressonancia",
    "summary": "Vantagem mecânica ao utilizar habilidades do elemento principal do personagem.",
    "description": "Vantagem mecânica ao utilizar habilidades do elemento principal do personagem.",
    "mechanics": [
      "+2 no Teste de Ressonância.",
      "Reduz a DT em 1."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "elementos",
      "teste-de-ressonancia"
    ],
    "keywords": [
      "afinidade",
      "elemento principal"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "uso-criativo",
    "title": "Uso Criativo dos Elementos",
    "category": "ressonancia",
    "summary": "Permite tentar efeitos não descritos nas habilidades.",
    "description": "Permite tentar efeitos não descritos nas habilidades.",
    "mechanics": [
      "O mestre define o Grau necessário.",
      "O mestre define a DT.",
      "O mestre determina o efeito resultante.",
      "Quanto mais complexo/poderoso, maior o Grau exigido."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "grau-de-ressonancia",
      "teste-de-ressonancia"
    ],
    "keywords": [
      "uso criativo",
      "improvisar magia",
      "criar efeito"
    ],
    "aliases": [],
    "status": "ok"
  }
];

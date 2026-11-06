export default [
  {
    "id": "pv",
    "title": "PV — Pontos de Vida",
    "category": "recursos",
    "summary": "Representam a vitalidade do personagem.",
    "description": "Representam a vitalidade do personagem.",
    "mechanics": [],
    "examples": [],
    "related": [
      "vigor",
      "dano",
      "classes"
    ],
    "keywords": [
      "pv",
      "pontos de vida",
      "vida"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "pd",
    "title": "PD — Pontos de Determinação",
    "category": "recursos",
    "summary": "Recurso de Determinação definido pela classe e aumentado com níveis.",
    "description": "Recurso de Determinação definido pela classe e aumentado com níveis.",
    "mechanics": [
      "PD é o recurso gasto para tentar usar habilidades em combate.",
      "Por padrão, o custo em PD é igual ao Grau/RES da habilidade: Grau 1 = 1 PD, Grau 2 = 2 PD, Grau 3 = 3 PD e Grau 4 = 4 PD.",
      "Uma habilidade pode declarar custo diferente; o custo explícito prevalece.",
      "PD é gasto no início da tentativa, antes do Teste de Ressonância. Falhar no teste não devolve o PD."
    ],
    "examples": [],
    "related": [
      "combatente",
      "especialista",
      "arcanista-elemental"
    ],
    "keywords": [
      "pd",
      "pontos de determinação",
      "pontos de determinacao",
      "determinação",
      "determinacao"
    ],
    "aliases": [],
    "status": "revised",
    "note": "Uso de PD consolidado pela regra de mesa aprovada na V15.39."
  },
  {
    "id": "pr",
    "title": "PR — Pontos de Ressonância",
    "category": "recursos",
    "summary": "Pontos usados para adquirir e evoluir habilidades da Skill Tree.",
    "description": "Pontos usados para adquirir e evoluir habilidades da Skill Tree.",
    "mechanics": [
      "Recebidos ao longo da campanha, normalmente por sessões, combates ou marcos.",
      "Grau 1 custa 1 PR.",
      "Grau 2 custa 2 PR.",
      "Grau 3 custa 3 PR.",
      "Grau 4 custa 4 PR."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "skill-tree",
      "grau-de-ressonancia",
      "progressao-skill-tree"
    ],
    "keywords": [
      "pr",
      "pontos de ressonância",
      "pontos de ressonancia",
      "comprar habilidade",
      "evoluir habilidade",
      "pontos de magia"
    ],
    "aliases": [
      "pontos de magia"
    ],
    "status": "ok"
  },
  {
    "id": "recuperacao",
    "title": "Recuperação",
    "category": "recursos",
    "summary": "Recuperação de PV, condições e outros recursos.",
    "description": "Recuperação de PV, condições e outros recursos.",
    "mechanics": [],
    "examples": [],
    "related": [
      "pv",
      "pd",
      "pr",
      "remocao-de-status"
    ],
    "keywords": [
      "recuperação",
      "recuperacao",
      "cura",
      "descanso"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "Existem várias habilidades de cura e remoção, mas não há uma regra global consolidada de descanso/recuperação de PV, PD e PR."
  }
];

export default [
  {
    "id": "skill-tree",
    "title": "Skill Tree Elemental",
    "category": "skill-tree",
    "summary": "Sistema de evolução de técnicas elementais por linhas de Grau 1 a 4.",
    "description": "Sistema de evolução de técnicas elementais por linhas de Grau 1 a 4.",
    "mechanics": [
      "Cada linha evolui de Grau 1 a Grau 4.",
      "Para evoluir, é necessário possuir a versão anterior.",
      "Ao evoluir, versões anteriores continuam disponíveis.",
      "Cada uso ainda exige Teste de Ressonância conforme o Grau."
    ],
    "examples": [],
    "related": [
      "pr",
      "grau-de-ressonancia",
      "progressao-skill-tree",
      "sinergia-e-combos"
    ],
    "keywords": [
      "skill tree",
      "árvore de habilidades",
      "arvore de habilidades"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "progressao-skill-tree",
    "title": "Progressão e Limitações da Skill Tree",
    "category": "skill-tree",
    "summary": "Requisitos extras para adquirir habilidades avançadas.",
    "description": "Requisitos extras para adquirir habilidades avançadas.",
    "mechanics": [
      "Grau 3: possuir outra habilidade Grau 2 OU duas habilidades Grau 1.",
      "Grau 4: possuir duas habilidades Grau 2 OU uma Grau 3 e outra Grau 1."
    ],
    "examples": [],
    "related": [
      "skill-tree",
      "pr",
      "grau-de-ressonancia"
    ],
    "keywords": [
      "requisito grau 3",
      "requisito grau 4",
      "progressão habilidade",
      "progressao habilidade"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "sinergia-e-combos",
    "title": "Sinergia e Combos",
    "category": "skill-tree",
    "summary": "Interação estratégica entre dano, controle, área, efeitos contínuos e fortalecimento.",
    "description": "Interação estratégica entre dano, controle, área, efeitos contínuos e fortalecimento.",
    "mechanics": [
      "Combinar habilidades pode ampliar impacto e criar sequências eficientes.",
      "O sistema suporta especialização, versatilidade e construções focadas em combos."
    ],
    "examples": [],
    "related": [
      "skill-tree",
      "combos-elementais"
    ],
    "keywords": [
      "combo",
      "sinergia",
      "setup",
      "combinação",
      "combinacao"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "habilidades-elementais",
    "title": "Habilidades Elementais",
    "category": "skill-tree",
    "summary": "Técnicas de manipulação direta dos elementos.",
    "description": "Técnicas de manipulação direta dos elementos.",
    "mechanics": [
      "Toda habilidade elemental exige Teste de Ressonância para ser executada.",
      "Em habilidade elemental corpo a corpo, sucesso na Ressonância já confirma a execução e o acerto; não há segundo teste de Luta/ataque.",
      "Em ataque elemental à distância que precise acertar um alvo específico, após a Ressonância faça um teste de Pontaria contra a Defesa do alvo.",
      "Em efeitos de área ou habilidades que indiquem resistência, a Ressonância cria o efeito e o alvo realiza o teste de resistência descrito; não há Pontaria genérica.",
      "Suporte, defesa, cura, pessoal e efeitos sem teste de acerto aplicam diretamente após uma Ressonância bem-sucedida, salvo texto específico.",
      "O mestre pode ajustar testes e efeitos em usos criativos ou situações não cobertas pelo texto da habilidade."
    ],
    "examples": [],
    "related": [
      "ressonancia",
      "teste-de-ressonancia",
      "acao-padrao"
    ],
    "keywords": [
      "habilidade elemental",
      "poder elemental"
    ],
    "aliases": [],
    "status": "revised",
    "note": "Fluxo de acerto consolidado na V15.39: Ressonância executa a habilidade; Pontaria só entra em ataques à distância que exigem precisão."
  }
];

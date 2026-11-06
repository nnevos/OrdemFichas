export default [
  {
    "id": "caido",
    "title": "Caído",
    "category": "condicoes",
    "summary": "Condição física de queda.",
    "description": "Condição física de queda.",
    "mechanics": [
      "-2 Defesa.",
      "Ataques corpo a corpo contra o alvo recebem +1 no teste.",
      "Levantar-se custa 1 ação de movimento."
    ],
    "examples": [],
    "related": [
      "queda",
      "defesa",
      "esquiva"
    ],
    "keywords": [
      "caído",
      "caido",
      "derrubado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "imobilizado",
    "title": "Imobilizado",
    "category": "condicoes",
    "summary": "O alvo não pode se deslocar.",
    "description": "O alvo não pode se deslocar.",
    "mechanics": [
      "Deslocamento 0.",
      "-2 Defesa.",
      "Pode terminar por teste de Força com DT da habilidade ou pelo fim da duração."
    ],
    "examples": [],
    "related": [
      "deslocamento",
      "defesa",
      "congelado",
      "prisao-de-gelo"
    ],
    "keywords": [
      "imobilizado",
      "imobilizar"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "lento",
    "title": "Lento",
    "category": "condicoes",
    "summary": "Condição que reduz ações e movimento.",
    "description": "Condição que reduz ações e movimento.",
    "mechanics": [
      "Perde 1 ação leve.",
      "-3m de deslocamento.",
      "Aplica -2 em Esquiva conforme a regra de Esquivar."
    ],
    "examples": [],
    "related": [
      "acao-leve",
      "deslocamento",
      "esquiva",
      "frio"
    ],
    "keywords": [
      "lento",
      "lentidão",
      "lentidao"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "empurrado",
    "title": "Empurrado",
    "category": "condicoes",
    "summary": "Movimento forçado pela distância indicada.",
    "description": "Movimento forçado pela distância indicada.",
    "mechanics": [
      "Move-se automaticamente.",
      "Pode gerar colisões conforme a habilidade."
    ],
    "examples": [],
    "related": [
      "deslocamento",
      "colisao"
    ],
    "keywords": [
      "empurrado",
      "empurrar",
      "knockback"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "desorientado",
    "title": "Desorientado",
    "category": "condicoes",
    "summary": "Interferência que prejudica ataques.",
    "description": "Interferência que prejudica ataques.",
    "mechanics": [
      "-2 em testes de ataque."
    ],
    "examples": [],
    "related": [
      "ataque",
      "energia"
    ],
    "keywords": [
      "desorientado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "instavel",
    "title": "Instável",
    "category": "condicoes",
    "summary": "Interferência geral que prejudica testes.",
    "description": "Interferência geral que prejudica testes.",
    "mechanics": [
      "-1 em todos os testes."
    ],
    "examples": [],
    "related": [
      "energia",
      "ressonancia-instavel"
    ],
    "keywords": [
      "instável",
      "instavel"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "sobrecarregado",
    "title": "Sobrecarregado",
    "category": "condicoes",
    "summary": "Estado de Energia que amplifica dano elétrico posterior.",
    "description": "Estado de Energia que amplifica dano elétrico posterior.",
    "mechanics": [
      "Ao receber dano de Energia, sofre +1d6 adicional.",
      "Dura 2 rodadas ou até ser consumido."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarga",
      "corrente-instavel",
      "colapso-eletrico"
    ],
    "keywords": [
      "sobrecarregado",
      "sobrecarga",
      "energia"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "atordoado",
    "title": "Atordoado",
    "category": "condicoes",
    "summary": "Condição que remove a ação padrão.",
    "description": "Condição que remove a ação padrão.",
    "mechanics": [
      "Perde a ação padrão.",
      "Mantém apenas ações leves."
    ],
    "examples": [],
    "related": [
      "acao-padrao",
      "acao-leve",
      "energia"
    ],
    "keywords": [
      "atordoado",
      "atordoar",
      "stun"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "resfriado",
    "title": "Resfriado",
    "category": "condicoes",
    "summary": "Estado leve de Frio.",
    "description": "Estado leve de Frio.",
    "mechanics": [
      "-3m de deslocamento."
    ],
    "examples": [],
    "related": [
      "frio",
      "deslocamento",
      "congelando"
    ],
    "keywords": [
      "resfriado",
      "frio"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "congelando",
    "title": "Congelando",
    "category": "condicoes",
    "summary": "Estado intermediário de Frio.",
    "description": "Estado intermediário de Frio.",
    "mechanics": [
      "-6m de deslocamento.",
      "-1 em testes.",
      "Aplica -2 em Esquiva conforme a regra de Esquivar."
    ],
    "examples": [],
    "related": [
      "frio",
      "resfriado",
      "congelado",
      "esquiva"
    ],
    "keywords": [
      "congelando",
      "congelamento parcial"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "congelado",
    "title": "Congelado",
    "category": "condicoes",
    "summary": "Estado severo de Frio que paralisa o alvo e o torna vulnerável.",
    "description": "Estado severo de Frio que paralisa o alvo e o torna vulnerável.",
    "mechanics": [
      "Conta como Imobilizado.",
      "Perde a ação padrão.",
      "Recebe +2d6 de dano adicional."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "congelando",
      "congelamento-total",
      "sepultamento-glacial"
    ],
    "keywords": [
      "congelado",
      "congelar",
      "frozen"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "queimando",
    "title": "Queimando",
    "category": "condicoes",
    "summary": "Estado de fogo que causa dano contínuo.",
    "description": "Estado de fogo que causa dano contínuo.",
    "mechanics": [
      "Sofre 1d4 de dano por rodada.",
      "Dura 2 rodadas ou até ser apagado."
    ],
    "examples": [],
    "related": [
      "fogo",
      "em-chamas"
    ],
    "keywords": [
      "queimando",
      "queima",
      "burn"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "em-chamas",
    "title": "Em Chamas",
    "category": "condicoes",
    "summary": "Estado intenso de Fogo.",
    "description": "Estado intenso de Fogo.",
    "mechanics": [
      "Sofre 1d6 de dano por rodada.",
      "-1 em testes."
    ],
    "examples": [],
    "related": [
      "fogo",
      "queimando",
      "chama-breve",
      "incendio-descontrolado"
    ],
    "keywords": [
      "em chamas",
      "chamas",
      "incendiado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "abalado",
    "title": "Abalado",
    "category": "condicoes",
    "summary": "Estado associado a Terra que prejudica a defesa.",
    "description": "Estado associado a Terra que prejudica a defesa.",
    "mechanics": [
      "-1 Defesa."
    ],
    "examples": [],
    "related": [
      "terra",
      "defesa"
    ],
    "keywords": [
      "abalado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "enraizado",
    "title": "Enraizado",
    "category": "condicoes",
    "summary": "Estado associado a Terra que aumenta estabilidade.",
    "description": "Estado associado a Terra que aumenta estabilidade.",
    "mechanics": [
      "Não pode ser empurrado.",
      "+2 em testes contra queda."
    ],
    "examples": [],
    "related": [
      "terra",
      "empurrado",
      "queda"
    ],
    "keywords": [
      "enraizado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "deslocado",
    "title": "Deslocado",
    "category": "condicoes",
    "summary": "Estado de Vento usado por habilidades para efeitos adicionais.",
    "description": "Estado de Vento usado por habilidades para efeitos adicionais.",
    "mechanics": [
      "Sofre efeitos adicionais de habilidades de Vento."
    ],
    "examples": [],
    "related": [
      "vento"
    ],
    "keywords": [
      "deslocado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "exposto",
    "title": "Exposto",
    "category": "condicoes",
    "summary": "Estado que reduz Defesa e facilita ataques.",
    "description": "Estado que reduz Defesa e facilita ataques.",
    "mechanics": [
      "-1 Defesa.",
      "Ataques contra o alvo recebem +1 no teste."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ataque"
    ],
    "keywords": [
      "exposto"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "encharcado",
    "title": "Encharcado",
    "category": "condicoes",
    "summary": "Estado de Água utilizado como preparação para combos.",
    "description": "Estado de Água utilizado como preparação para combos.",
    "mechanics": [
      "Jato de Água aplica Encharcado até o próximo turno.",
      "Encharcado impõe -1 em testes físicos enquanto estiver ativo.",
      "Habilidades de Água que citam Encharcado aplicam seus efeitos ampliados normalmente."
    ],
    "examples": [],
    "related": [
      "agua",
      "jato-de-agua",
      "correnteza-forcada",
      "arsenal-hidrostatico"
    ],
    "keywords": [
      "encharcado",
      "molhado",
      "soaked"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "saturado",
    "title": "Saturado",
    "category": "condicoes",
    "summary": "Estado avançado de Água; representa um alvo já completamente encharcado e mais vulnerável ao controle hidráulico.",
    "description": "Estado avançado de Água aplicado por habilidades que explicitamente elevam Encharcado a Saturado.",
    "mechanics": [
      "-2 em testes físicos.",
      "Conta como Encharcado para requisitos, combos e efeitos de habilidades de Água.",
      "Não surge ao reaplicar Encharcado por si só; a habilidade precisa dizer que aplica ou eleva para Saturado.",
      "Impacto Hidráulico: se o alvo já estiver Encharcado, ele fica Saturado até o próximo turno."
    ],
    "examples": [],
    "related": ["agua","encharcado","impacto-hidraulico"],
    "keywords": ["saturado","agua","encharcado"],
    "aliases": [],
    "status": "revised"
  },
  {
    "id": "marca-elemental",
    "title": "Marca Elemental",
    "category": "condicoes",
    "summary": "Marca aplicada por Golpe Elemental para preparar detonações e combos.",
    "description": "Marca aplicada por Golpe Elemental para preparar detonações e combos.",
    "mechanics": [
      "Golpe Elemental mantém a marca até o fim do próximo turno.",
      "Impacto Elemental pode consumir a marca para dano adicional."
    ],
    "examples": [],
    "related": [
      "golpe-elemental",
      "impacto-elemental"
    ],
    "keywords": [
      "marca elemental",
      "marcado"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "acumulo-de-status",
    "title": "Acúmulo de Status",
    "category": "condicoes",
    "summary": "Regra geral para coexistência de condições.",
    "description": "Regra geral para coexistência de condições.",
    "mechanics": [
      "Status iguais normalmente não acumulam; reaplicar renova a duração.",
      "Efeitos diferentes podem coexistir.",
      "Progressão de Fogo adicionada: Queimando + Queimando se torna Em Chamas.",
      "Progressão de Frio adicionada: Resfriado + Resfriado se torna Congelando; Resfriado + Congelando ou Congelando + Congelando se torna Congelado.",
      "Outras combinações só fundem quando uma habilidade disser explicitamente; caso contrário coexistem."
    ],
    "examples": [],
    "related": [
      "remocao-de-status",
      "resistencia-a-status"
    ],
    "keywords": [
      "acúmulo",
      "acumulo",
      "status iguais",
      "condições"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "resistencia-a-status",
    "title": "Resistência a Status",
    "category": "condicoes",
    "summary": "Teste usado para resistir a determinadas condições.",
    "description": "Teste usado para resistir a determinadas condições.",
    "mechanics": [
      "Pode usar Força, Vigor, Agilidade ou Presença conforme a habilidade.",
      "A DT é definida pela habilidade."
    ],
    "examples": [],
    "related": [
      "atributos",
      "remocao-de-status"
    ],
    "keywords": [
      "resistência",
      "resistencia",
      "teste contra status"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "remocao-de-status",
    "title": "Remoção de Status",
    "category": "condicoes",
    "summary": "Condições podem terminar por tempo, habilidades ou ações apropriadas.",
    "description": "Condições podem terminar por tempo, habilidades ou ações apropriadas.",
    "mechanics": [],
    "examples": [],
    "related": [
      "acumulo-de-status",
      "resistencia-a-status"
    ],
    "keywords": [
      "remover condição",
      "remover status",
      "cura condição"
    ],
    "aliases": [],
    "status": "ok"
  }
];

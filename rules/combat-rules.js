export default [
  {
    "id": "defesa",
    "title": "Defesa",
    "category": "combate",
    "summary": "Valor defensivo usado por ataques e modificado por armaduras, habilidades e condições.",
    "description": "Valor defensivo usado por ataques e modificado por armaduras, habilidades e condições.",
    "mechanics": [
      "Defesa Base = 5 + Vigor.",
      "Some Armadura e outros bônus objetivos de habilidades/condições.",
      "O ataque acerta quando o resultado é igual ou maior que a Defesa; em empate, quem ataca tem prioridade."
    ],
    "examples": ["Ataque 10 contra Defesa 10 acerta; Ataque 10 contra Defesa 11 erra."],
    "related": [
      "esquiva",
      "armaduras",
      "caido",
      "imobilizado",
      "exposto",
      "abalado"
    ],
    "keywords": [
      "defesa",
      "defender"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro usa Defesa extensivamente, mas não apresenta uma fórmula-base única para calcular a Defesa do personagem."
  },
  {
    "id": "esquiva",
    "title": "Esquiva",
    "category": "combate",
    "summary": "Reação para evitar completamente um ataque bem-sucedido.",
    "description": "Reação para evitar completamente um ataque bem-sucedido.",
    "mechanics": [
      "Pode ser usada quando você é alvo de um ataque bem-sucedido.",
      "Faça Reflexos (AGI) contra o resultado do ataque inimigo.",
      "Sucesso: evita o ataque e recebe 0 dano.",
      "20 natural: evita o ataque e pode mover 1,5m gratuitamente.",
      "1 natural: recebe +1d6 de dano adicional.",
      "Lento ou Congelando: -2 no teste.",
      "Terreno difícil: -1 no teste.",
      "Não pode esquivar se estiver Imobilizado.",
      "Caído: o livro permite apenas com desvantagem."
    ],
    "examples": [
      "Ataque inimigo resulta 17; o personagem testa Reflexos contra 17."
    ],
    "related": [
      "reacao",
      "reflexos",
      "agilidade",
      "defesa",
      "contra-ataque",
      "lento",
      "congelando",
      "imobilizado",
      "caido"
    ],
    "keywords": [
      "esquiva",
      "esquivar",
      "desviar",
      "desvio",
      "reflexos"
    ],
    "aliases": [
      "desviar",
      "desvio"
    ],
    "status": "ok"
  },
  {
    "id": "contra-ataque",
    "title": "Contra-Ataque",
    "category": "combate",
    "summary": "Reação que transforma uma defesa bem-sucedida ou erro inimigo em ataque imediato.",
    "description": "Reação que transforma uma defesa bem-sucedida ou erro inimigo em ataque imediato.",
    "mechanics": [
      "Pode ser usado quando um inimigo erra um ataque contra você ou quando você esquiva com sucesso.",
      "Faça o teste de ataque normalmente.",
      "Se acertar, role o dano normalmente e aplique 50% do dano final (arredondado para baixo).",
      "Se usar uma habilidade, o custo integral de PD é pago normalmente.",
      "Quando nasce de uma Esquiva bem-sucedida, é continuação da mesma janela de Reação e não consome uma segunda Reação.",
      "Máximo de 1 contra-ataque por turno.",
      "Funciona com armas corpo a corpo ou habilidades apropriadas."
    ],
    "examples": [],
    "related": [
      "reacao",
      "esquiva",
      "ataque",
      "duelista"
    ],
    "keywords": [
      "contra ataque",
      "contra-ataque",
      "retaliação",
      "retaliacao"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "ataque",
    "title": "Ataque",
    "category": "combate",
    "summary": "Ação ofensiva usada para atingir um alvo.",
    "description": "Ação ofensiva usada para atingir um alvo.",
    "mechanics": [],
    "examples": [],
    "related": [
      "defesa",
      "dano",
      "critico",
      "ataque-corpo-a-corpo",
      "ataque-a-distancia"
    ],
    "keywords": [
      "ataque",
      "acerto",
      "atacar"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro descreve diversos bônus e penalidades de ataque, mas não consolida em uma única seção a fórmula do teste de ataque contra Defesa."
  },
  {
    "id": "ataque-corpo-a-corpo",
    "title": "Ataque Corpo a Corpo",
    "category": "combate",
    "summary": "Ataque realizado em alcance próximo com arma ou golpe físico.",
    "description": "Ataque realizado em alcance próximo com arma ou golpe físico.",
    "mechanics": [],
    "examples": [],
    "related": [
      "ataque",
      "forca",
      "contra-ataque"
    ],
    "keywords": [
      "corpo a corpo",
      "melee"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "ataque-a-distancia",
    "title": "Ataque à Distância",
    "category": "combate",
    "summary": "Ataque realizado com armas ou habilidades de alcance.",
    "description": "Ataque realizado com armas ou habilidades de alcance.",
    "mechanics": [],
    "examples": [],
    "related": [
      "ataque",
      "agilidade",
      "alcance"
    ],
    "keywords": [
      "ataque distância",
      "ataque a distancia",
      "ranged"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "dano",
    "title": "Dano",
    "category": "combate",
    "summary": "Valor que reduz os PV ou é mitigado por efeitos defensivos.",
    "description": "Valor que reduz os PV ou é mitigado por efeitos defensivos.",
    "mechanics": [],
    "examples": [],
    "related": [
      "pv",
      "rd",
      "critico"
    ],
    "keywords": [
      "dano",
      "ferimento"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "critico",
    "title": "Crítico",
    "category": "combate",
    "summary": "Resultado excepcional de uma rolagem.",
    "description": "Resultado excepcional de uma rolagem.",
    "mechanics": [
      "Quando um ataque for considerado crítico, role o dobro da quantidade de dados de dano do ataque.",
      "Bônus fixos não dobram, salvo regra específica.",
      "O gatilho universal que torna um ataque crítico ainda é uma regra pendente; o sistema permite marcar manualmente o crítico."
    ],
    "examples": ["Um ataque de 2d6 considerado crítico rola 4d6; bônus fixo +3 permanece +3."],
    "related": [
      "teste-de-ressonancia",
      "esquiva",
      "ataque"
    ],
    "keywords": [
      "crítico",
      "critico",
      "20 natural"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro define sucesso crítico de Ressonância e críticos específicos de Esquiva, mas não apresenta uma regra geral única de crítico para todos os ataques."
  },
  {
    "id": "rd",
    "title": "RD — Redução de Dano",
    "category": "combate",
    "summary": "Reduz dano recebido e aparece em armaduras/habilidades defensivas.",
    "description": "Reduz dano recebido e aparece em armaduras/habilidades defensivas.",
    "mechanics": [
      "RD fixa reduz o dano pelo valor indicado.",
      "Quando uma fonte manda rolar dados para reduzir dano, use o resultado rolado como redução daquela fonte.",
      "Efeitos que ignoram RD ignoram a RD fixa indicada, salvo texto mais específico.",
      "O acúmulo de múltiplas fontes de RD fixa permanece pendente de regra global."
    ],
    "examples": [],
    "related": [
      "dano",
      "defesa",
      "terra",
      "barreira-elemental"
    ],
    "keywords": [
      "rd",
      "redução de dano",
      "reducao de dano",
      "mitigação",
      "mitigacao"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O conceito é usado consistentemente como Redução de Dano, mas o livro não traz uma seção geral explicando ordem de aplicação, mínimo de dano ou acumulação entre fontes."
  },
  {
    "id": "alcance",
    "title": "Alcance",
    "category": "combate",
    "summary": "Distância máxima ou categoria de distância de ataques e habilidades.",
    "description": "Distância máxima ou categoria de distância de ataques e habilidades.",
    "mechanics": [
      "Curto: até aproximadamente 9m.",
      "Médio: até aproximadamente 18m.",
      "Longo: até aproximadamente 30m."
    ],
    "examples": [],
    "related": [
      "ataque-a-distancia",
      "armas"
    ],
    "keywords": [
      "alcance",
      "curto",
      "médio",
      "medio",
      "longo"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "cobertura",
    "title": "Cobertura",
    "category": "combate",
    "summary": "Proteção concedida pelo ambiente contra ataques.",
    "description": "Proteção concedida pelo ambiente contra ataques.",
    "mechanics": [],
    "examples": [],
    "related": [
      "defesa",
      "ataque-a-distancia",
      "atirador"
    ],
    "keywords": [
      "cobertura"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro menciona cobertura em habilidades como Cobertura Tática e Lâmina Direcionada, mas não define uma regra global de bônus/penalidades de cobertura."
  },
  {
    "id": "ataque-de-oportunidade",
    "title": "Ataque de Oportunidade",
    "category": "combate",
    "summary": "Ataque/reação associado à movimentação em alcance hostil.",
    "description": "Ataque/reação associado à movimentação em alcance hostil.",
    "mechanics": [],
    "examples": [],
    "related": [
      "movimento",
      "reacao",
      "passo-elemental",
      "passo-do-vento"
    ],
    "keywords": [
      "ataque de oportunidade",
      "oportunidade",
      "reação ao movimento"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "Diversas habilidades dizem que ignoram ou não provocam ataques de oportunidade, mas o livro não apresenta uma regra-base completa do gatilho e resolução."
  },
  {
    "id": "deslocamento",
    "title": "Deslocamento",
    "category": "combate",
    "summary": "Distância que o personagem pode percorrer, modificada por condições e habilidades.",
    "description": "Distância que o personagem pode percorrer, modificada por condições e habilidades.",
    "mechanics": [],
    "examples": [],
    "related": [
      "movimento",
      "lento",
      "resfriado",
      "congelando"
    ],
    "keywords": [
      "deslocamento",
      "movimento",
      "metros",
      "mover"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "movimento",
    "title": "Movimento",
    "category": "combate",
    "summary": "Reposicionamento do personagem no campo de batalha.",
    "description": "Reposicionamento do personagem no campo de batalha.",
    "mechanics": [],
    "examples": [],
    "related": [
      "deslocamento",
      "terreno-dificil",
      "ataque-de-oportunidade"
    ],
    "keywords": [
      "movimento",
      "mover",
      "andar"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro usa ação de movimento, deslocamento e efeitos de mobilidade, mas não consolida uma regra-base completa de movimento."
  },
  {
    "id": "terreno-dificil",
    "title": "Terreno Difícil",
    "category": "combate",
    "summary": "Terreno que dificulta deslocamento e interfere em algumas ações.",
    "description": "Terreno que dificulta deslocamento e interfere em algumas ações.",
    "mechanics": [],
    "examples": [],
    "related": [
      "movimento",
      "deslocamento",
      "esquiva"
    ],
    "keywords": [
      "terreno difícil",
      "terreno dificil"
    ],
    "aliases": [],
    "status": "needs-review",
    "note": "O livro usa “terreno difícil” e aplica -1 em Esquiva, mas não define uma regra geral de custo de movimento para terreno difícil."
  },
  {
    "id": "queda",
    "title": "Queda / Derrubado",
    "category": "combate",
    "summary": "Efeito que coloca o personagem no estado Caído.",
    "description": "Efeito que coloca o personagem no estado Caído.",
    "mechanics": [],
    "examples": [],
    "related": [
      "caido",
      "empurrado",
      "agilidade"
    ],
    "keywords": [
      "queda",
      "derrubado",
      "cair"
    ],
    "aliases": [],
    "status": "ok"
  }
];

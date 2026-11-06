// Regras básicas estruturadas a partir do livro.
export default [
  {
    "id": "atributos",
    "title": "Atributos",
    "category": "basico",
    "summary": "As cinco capacidades básicas do personagem: FOR, AGI, INT, PRE e VIG.",
    "description": "Os atributos variam de 0 a 5 e influenciam testes, combate, resistência e Ressonância.",
    "mechanics": [
      "Todos começam em 1.",
      "O livro informa 4 pontos iniciais para distribuir.",
      "Um atributo pode ser reduzido a 0 para liberar pontos extras."
    ],
    "examples": [],
    "related": [
      "teste-de-atributo",
      "forca",
      "agilidade",
      "intelecto",
      "presenca",
      "vigor"
    ],
    "keywords": [
      "atributo",
      "for",
      "agi",
      "int",
      "pre",
      "vig"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "teste-de-atributo",
    "title": "Teste de Atributo",
    "category": "basico",
    "summary": "Teste usado quando uma ação possui chance de falha.",
    "description": "Teste usado quando uma ação possui chance de falha.",
    "mechanics": [
      "Role 1d20 para cada ponto do atributo e escolha o maior resultado.",
      "Com atributo 0, role 2d20 e escolha o pior resultado."
    ],
    "examples": [
      "FOR 3: role 3d20 e use o maior.",
      "INT 0: role 2d20 e use o pior."
    ],
    "related": [
      "atributos"
    ],
    "keywords": [
      "teste",
      "d20",
      "rolagem",
      "atributo"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "forca",
    "title": "Força (FOR)",
    "category": "basico",
    "summary": "Potência física e capacidade de impacto.",
    "description": "Potência física e capacidade de impacto.",
    "mechanics": [
      "Usada em ataques corpo a corpo, força bruta, empurrar/quebrar objetos e resistência física direta."
    ],
    "examples": [],
    "related": [
      "atributos",
      "ataque-corpo-a-corpo"
    ],
    "keywords": [
      "for",
      "força",
      "forca"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "agilidade",
    "title": "Agilidade (AGI)",
    "category": "basico",
    "summary": "Reflexos, coordenação e velocidade.",
    "description": "Reflexos, coordenação e velocidade.",
    "mechanics": [
      "Usada em esquiva, reação, furtividade, ataques à distância e movimentação."
    ],
    "examples": [],
    "related": [
      "atributos",
      "esquiva",
      "reflexos",
      "deslocamento"
    ],
    "keywords": [
      "agi",
      "agilidade",
      "desviar",
      "reflexo"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "intelecto",
    "title": "Intelecto (INT)",
    "category": "basico",
    "summary": "Raciocínio, memória e conhecimento.",
    "description": "Raciocínio, memória e conhecimento.",
    "mechanics": [
      "Usado em análise, investigação, uso técnico de habilidades, planejamento e compreensão da Ressonância."
    ],
    "examples": [],
    "related": [
      "atributos",
      "ressonancia",
      "teste-de-ressonancia"
    ],
    "keywords": [
      "int",
      "intelecto",
      "investigação",
      "investigacao"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "presenca",
    "title": "Presença (PRE)",
    "category": "basico",
    "summary": "Força de vontade, percepção e influência.",
    "description": "Força de vontade, percepção e influência.",
    "mechanics": [
      "Usada para perceber ameaças, resistir a efeitos mentais, interação social e parte dos testes de Ressonância."
    ],
    "examples": [],
    "related": [
      "atributos",
      "ressonancia",
      "teste-de-ressonancia"
    ],
    "keywords": [
      "pre",
      "presença",
      "presenca",
      "vontade"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "vigor",
    "title": "Vigor (VIG)",
    "category": "basico",
    "summary": "Resistência física e vitalidade.",
    "description": "Resistência física e vitalidade.",
    "mechanics": [
      "Relaciona-se a PV, resistência a efeitos físicos e sobrevivência."
    ],
    "examples": [],
    "related": [
      "atributos",
      "pv",
      "resistencia"
    ],
    "keywords": [
      "vig",
      "vigor",
      "vida",
      "resistência",
      "resistencia"
    ],
    "aliases": [],
    "status": "ok"
  },
  {
    "id": "acao-padrao",
    "title": "Ação Padrão",
    "category": "basico",
    "summary": "Tipo de ação usado por muitas habilidades e ataques.",
    "description": "Tipo de ação usado por muitas habilidades e ataques.",
    "mechanics": [
      "Cada personagem possui 1 Ação Padrão no próprio turno.",
      "Ataques normais e habilidades marcadas como Ação Padrão consomem este espaço.",
      "Atordoado e Congelado impedem o uso de Ação Padrão enquanto o efeito estiver ativo."
    ],
    "examples": [],
    "related": [
      "acao-livre",
      "acao-leve",
      "reacao"
    ],
    "keywords": [
      "ação padrão",
      "acao padrao",
      "ação",
      "acao"
    ],
    "aliases": [],
    "status": "revised",
    "note": "Regra consolidada na revisão V15.39 para fechar a economia de ações."
  },
  {
    "id": "acao-livre",
    "title": "Ação Livre",
    "category": "basico",
    "summary": "Ação utilizada por várias habilidades sem consumir a ação padrão.",
    "description": "Ação utilizada por várias habilidades sem consumir a ação padrão.",
    "mechanics": [
      "Cada personagem possui até 2 Ações Livres por turno por padrão.",
      "Ação Livre só pode ser usada quando a habilidade ou regra disser explicitamente Ação Livre, ou para interação trivial autorizada pelo Mestre.",
      "Ação Livre não substitui ataque normal, movimento completo, Ação Padrão nem teste relevante, salvo texto expresso da habilidade."
    ],
    "examples": [
      "Passo Rápido é Ação Livre porque a habilidade declara isso.",
      "Um ataque comum não pode ser convertido em Ação Livre."
    ],
    "related": [
      "acao-padrao",
      "acao-leve",
      "reacao"
    ],
    "keywords": [
      "ação livre",
      "acao livre"
    ],
    "aliases": [],
    "status": "revised",
    "note": "Limite de 2 Ações Livres por turno adicionado em V15.39 para evitar encadeamento ilimitado."
  },
  {
    "id": "acao-leve",
    "title": "Ação Leve",
    "category": "basico",
    "summary": "Ação menor usada em movimento, utilidade e por alguns efeitos.",
    "description": "Ação menor usada em movimento, utilidade e por alguns efeitos.",
    "mechanics": [
      "Cada personagem possui 1 Ação Leve por turno por padrão.",
      "Lento remove a Ação Leve base; efeitos que concedem Ações Leves extras podem restaurar capacidade de agir conforme o texto.",
      "Ataque Leve é um ataque especial concedido por habilidades específicas e não é sinônimo de Ação Leve."
    ],
    "examples": [],
    "related": [
      "acao-padrao",
      "acao-livre",
      "reacao",
      "lento"
    ],
    "keywords": [
      "ação leve",
      "acao leve"
    ],
    "aliases": [],
    "status": "revised",
    "note": "Ação Leve e Ataque Leve foram separados explicitamente na revisão V15.39."
  },
  {
    "id": "reacao",
    "title": "Reação",
    "category": "basico",
    "summary": "Resposta realizada durante o combate a um gatilho.",
    "description": "Resposta realizada durante o combate a um gatilho.",
    "mechanics": [
      "Cada personagem pode realizar 1 Reação por rodada; ela é renovada no início do próprio turno.",
      "As duas principais reações descritas são Esquivar e Contra-Atacar."
    ],
    "examples": [],
    "related": [
      "esquiva",
      "contra-ataque"
    ],
    "keywords": [
      "reação",
      "reacao",
      "reagir"
    ],
    "aliases": [],
    "status": "revised",
    "note": "A janela de Reação passou a ser por rodada na V15.39 para impedir Esquiva contra todos os ataques da mesma rodada."
  },
  {
    "id": "acao-movimento",
    "title": "Ação de Movimento",
    "category": "basico",
    "summary": "Espaço do turno usado para o deslocamento normal do personagem.",
    "description": "Cada personagem possui 1 Ação de Movimento por turno por padrão.",
    "mechanics": ["Usar o deslocamento normal consome a Ação de Movimento.", "Imobilizado e Congelado impedem deslocamento normal.", "Habilidades podem conceder movimento adicional sem consumir este espaço quando disserem explicitamente."],
    "examples": [], "related": ["acao-padrao","acao-livre","acao-leve"], "keywords": ["movimento","ação de movimento","acao de movimento"], "aliases": [], "status": "added"
  },
  {
    "id": "ataque-leve",
    "title": "Ataque Leve",
    "category": "basico",
    "summary": "Ataque extra especial concedido por certas habilidades; não é Ação Leve.",
    "description": "Ataque Leve só existe quando uma habilidade o concede explicitamente.",
    "mechanics": ["Causa dano normal, mas não recebe bônus de habilidades quando a habilidade que o concede disser isso.", "Não consome automaticamente a Ação Leve base; segue o texto da habilidade que o concedeu."],
    "examples": ["Passo do Vento concede 1 Ataque Leve adicional por turno."], "related": ["acao-leve"], "keywords": ["ataque leve"], "aliases": [], "status": "added"
  }
];

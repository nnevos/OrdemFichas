// Habilidades estruturadas automaticamente a partir das seções de habilidades do livro.
export default [
  {
    "id": "embuir-arma",
    "title": "Embuir Arma",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você canaliza sua afinidade elemental para envolver uma arma que esteja empunhando com energia do elemento escolhido.",
    "description": "Você canaliza sua afinidade elemental para envolver uma arma que esteja empunhando com energia do elemento escolhido.",
    "grade": "1",
    "type": "Aprimoramento",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Buff",
      "Setup",
      "Elemental"
    ],
    "mechanics": [
      "A arma passa a emitir efeitos visuais e energéticos relacionados ao elemento invocado.",
      "Seus ataques causam +1d6 de dano elemental do tipo escolhido.",
      "Efeito adicional por elemento:",
      "Fogo: alvo sofre 1d4 dano no próximo turno",
      "Água: empurra 1,5m",
      "Terra: +1 dano fixo",
      "Vento: +1 no teste de ataque",
      "Energia: alvo sofre −1 em testes de ataque",
      "Frio: alvo sofre −3m de deslocamento",
      "Limite:",
      "Apenas um efeito de Embuir Arma pode estar ativo por vez.",
      "O personagem dá o primeiro passo na Ressonância ofensiva, revestindo sua arma com energia instável."
    ],
    "examples": [],
    "related": [
      "universal",
      "instavel",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "embuir arma",
      "universal",
      "aprimoramento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "arma-energizada",
    "title": "Arma Energizada",
    "category": "habilidades",
    "element": "universal",
    "summary": "A energia elemental se torna mais densa e agressiva, reagindo com maior intensidade ao impacto.",
    "description": "A energia elemental se torna mais densa e agressiva, reagindo com maior intensidade ao impacto.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Embuir Arma",
    "tags": [
      "Buff",
      "Pressão",
      "Combo"
    ],
    "mechanics": [
      "Seus ataques causam +2d6 de dano elemental.",
      "Os efeitos secundários são aprimorados:",
      "Fogo: 1d6 dano no próximo turno",
      "Água: empurra 3m",
      "Terra: +2 dano fixo",
      "Vento: +2 no teste de ataque",
      "Energia: −2 em testes de ataque",
      "Frio: −6m de deslocamento",
      "Extra:",
      "Se acertar dois ataques no mesmo alvo na duração, o efeito secundário é aplicado duas vezes.",
      "O elemento deixa de ser apenas um reforço — ele começa a dominar o impacto."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "arma energizada",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "arsenal-elemental",
    "title": "Arsenal Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você domina o fluxo elemental ao ponto de adaptá-lo em tempo real durante o combate.",
    "description": "Você domina o fluxo elemental ao ponto de adaptá-lo em tempo real durante o combate.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arma Energizada",
    "tags": [
      "Área",
      "Combo",
      "Versatilidade"
    ],
    "mechanics": [
      "Seus ataques causam +2d6 de dano elemental.",
      "Você pode trocar o elemento como Ação Livre 1x por rodada.",
      "Os ataques passam a afetar o entorno:",
      "Inimigos adjacentes ao alvo sofrem 1d6 dano elemental",
      "Efeitos secundários recebem melhoria adicional:",
      "Fogo: dano contínuo dura 2 rodadas",
      "Água: empurra e pode derrubar (teste evita)",
      "Terra: +2 dano e aplica −1 deslocamento",
      "Vento: +2 ataque e pode reposicionar 1,5m",
      "Energia: −2 testes gerais (não só ataque)",
      "Frio: reduz movimento e aplica −1 ação leve",
      "O combatente não escolhe mais um elemento — ele domina o fluxo entre eles."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "acao-livre",
      "acao-leve"
    ],
    "keywords": [
      "arsenal elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "manifestacao-belica",
    "title": "Manifestação Bélica",
    "category": "habilidades",
    "element": "universal",
    "summary": "Sua arma se torna um canal direto da força elemental, liberando energia a cada golpe.",
    "description": "Sua arma se torna um canal direto da força elemental, liberando energia a cada golpe.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arsenal Elemental",
    "tags": [
      "Área",
      "Burst",
      "Combo",
      "Domínio"
    ],
    "mechanics": [
      "Seus ataques causam +3d6 de dano elemental.",
      "Ao acertar um ataque:",
      "causa 1d6 dano em área (3m ao redor do alvo)",
      "Você pode trocar o elemento livremente (sem limite por rodada).",
      "Efeitos secundários são potencializados:",
      "Fogo: 1d6 dano contínuo por 2 rodadas",
      "Água: empurra 3m + derruba automaticamente (teste reduz)",
      "Terra: +3 dano e aplica −3m movimento",
      "Vento: +3 ataque e pode se reposicionar 3m",
      "Energia: −2 em todos os testes por 1 rodada",
      "Frio: reduz movimento e pode imobilizar (teste evita)",
      "Efeito adicional (Combo):",
      "Se o alvo já estiver sob efeito elemental, recebe +1d6 dano adicional.",
      "A arma deixa de ser uma ferramenta — ela se torna uma extensão do próprio elemento."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "manifestação bélica",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "embuir-armadura",
    "title": "Embuir Armadura",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você canaliza energia elemental para reforçar sua armadura ou seu próprio corpo, envolvendo-se com o elemento escolhido.",
    "description": "Você canaliza energia elemental para reforçar sua armadura ou seu próprio corpo, envolvendo-se com o elemento escolhido.",
    "grade": "1",
    "type": "Aprimoramento",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Defesa",
      "Setup",
      "Sustentação"
    ],
    "mechanics": [
      "Recebe +2 Defesa.",
      "Efeito adicional por elemento:",
      "Fogo: inimigos que te atacam corpo a corpo sofrem 1d4 dano",
      "Água: reduz 1d6 dano (1x por rodada)",
      "Terra: recebe RD 2",
      "Vento: recebe +3m deslocamento",
      "Energia: recebe +1 em testes de resistência",
      "Frio: inimigos adjacentes sofrem −3m deslocamento",
      "Limite:",
      "Apenas um efeito de Embuir pode estar ativo por vez.",
      "O corpo do usuário começa a ressoar com o elemento, criando uma camada protetora instável."
    ],
    "examples": [],
    "related": [
      "universal",
      "instavel",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "embuir armadura",
      "universal",
      "aprimoramento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "armadura-elemental",
    "title": "Armadura Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "A energia se condensa, tornando a proteção mais consistente e reativa.",
    "description": "A energia se condensa, tornando a proteção mais consistente e reativa.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Embuir Armadura",
    "tags": [
      "Defesa",
      "Reativo",
      "Sustentação"
    ],
    "mechanics": [
      "Recebe +3 Defesa.",
      "Efeitos elementais aprimorados:",
      "Fogo: dano refletido 1d6",
      "Água: reduz 1d6 dano (2x por rodada)",
      "Terra: RD 3",
      "Vento: +6m deslocamento",
      "Energia: +2 em testes de resistência",
      "Frio: inimigos adjacentes sofrem −6m deslocamento",
      "Extra:",
      "Ao sofrer dano, pode ativar o efeito elemental mesmo se o ataque errar (ex: fogo ainda causa dano ao atacante adjacente).",
      "A defesa deixa de ser passiva — o elemento começa a responder ao ambiente."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "armadura elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "nucleo-defensivo-universal",
    "title": "Núcleo Defensivo",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você estabiliza a energia ao redor do corpo, criando um núcleo constante de proteção e interferência.",
    "description": "Você estabiliza a energia ao redor do corpo, criando um núcleo constante de proteção e interferência.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Armadura Elemental",
    "tags": [
      "Área",
      "Controle",
      "Suporte",
      "Tank"
    ],
    "mechanics": [
      "Recebe +3 Defesa e RD 3.",
      "Efeitos elementais passam a afetar área adjacente (3m):",
      "Fogo: inimigos na área sofrem 1d6 dano ao início do turno",
      "Água: aliados na área reduzem 1d6 dano (1x por rodada)",
      "Terra: aliados recebem +1 Defesa",
      "Vento: inimigos sofrem −1 em ataques à distância",
      "Energia: inimigos sofrem −1 em testes gerais",
      "Frio: inimigos sofrem −3m deslocamento e −1 ação leve",
      "Extra (Combo):",
      "Se estiver dentro de um Campo Elemental, recebe +1 Defesa adicional",
      "O personagem não protege apenas a si mesmo — ele influencia o espaço ao redor."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "núcleo defensivo",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "forma-elemental",
    "title": "Forma Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Seu corpo se torna um canal direto do elemento, assumindo uma forma parcialmente transformada.",
    "description": "Seu corpo se torna um canal direto do elemento, assumindo uma forma parcialmente transformada.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Núcleo Defensivo",
    "tags": [
      "Aura",
      "Controle",
      "Suporte",
      "Tank",
      "Domínio"
    ],
    "mechanics": [
      "Recebe:",
      "+4 Defesa",
      "RD 5",
      "Área de 3m ao redor ativa constantemente efeitos elementais.",
      "Efeitos aprimorados:",
      "Fogo: inimigos sofrem 1d6 por turno ao permanecer na área",
      "Água: aliados recuperam 1d6 PV por rodada",
      "Terra: aliados recebem +2 Defesa e RD 2",
      "Vento: aliados recebem +3m deslocamento e não sofrem ataques de oportunidade",
      "Energia: inimigos sofrem −2 em testes gerais",
      "Frio: inimigos podem ficar Imobilizados (teste evita)",
      "Efeito adicional (Reativo):",
      "Quando sofrer dano, pode causar 1d6 dano elemental ao atacante (1x por rodada).",
      "O usuário não veste mais o elemento — ele se torna parte dele, alterando o campo de batalha com sua presença."
    ],
    "examples": [],
    "related": [
      "universal",
      "imobilizado",
      "defesa",
      "rd",
      "ressonancia",
      "pv",
      "pr"
    ],
    "keywords": [
      "forma elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "golpe-elemental",
    "title": "Golpe Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você concentra energia elemental em um único impacto instável.",
    "description": "Você concentra energia elemental em um único impacto instável.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "Corpo a corpo ou arma",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Setup",
      "Marca"
    ],
    "mechanics": [
      "Causa +2d6 de dano elemental.",
      "Efeito adicional por elemento:",
      "Fogo: aplica Marca Ígnea (1d4 no próximo turno)",
      "Água: empurra 3m",
      "Terra: +2 dano fixo",
      "Vento: +2 no ataque",
      "Energia: alvo sofre −2 no próximo teste",
      "Frio: −3m deslocamento",
      "Especial — Marca Elemental:",
      "Se acertar, o alvo fica Marcado pelo elemento até o fim do próximo turno.",
      "(isso é a base da árvore)",
      "O golpe não é só dano — ele marca o alvo com energia instável."
    ],
    "examples": [],
    "related": [
      "universal",
      "instavel",
      "marca-elemental",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "golpe elemental",
      "universal",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel",
      "marca-elemental"
    ]
  },
  {
    "id": "impacto-elemental",
    "title": "Impacto Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você aprende a detonar a marca elemental no momento do impacto.",
    "description": "Você aprende a detonar a marca elemental no momento do impacto.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Golpe Elemental",
    "tags": [
      "Burst",
      "Detonação",
      "Combo"
    ],
    "mechanics": [
      "Causa +2d6 dano elemental.",
      "Se o alvo estiver Marcado:",
      "consome a marca e causa +2d6 dano adicional",
      "Efeito extra ao consumir:",
      "Fogo: espalha para inimigos adjacentes (1d6)",
      "Água: empurra + derruba",
      "Terra: aplica −2 Defesa",
      "Vento: permite atacar novamente (−2 no teste)",
      "Energia: −2 em todos os testes (1 rodada)",
      "Frio: reduz movimento e impede reação",
      "O usuário aprende a transformar energia acumulada em explosão direcionada."
    ],
    "examples": [],
    "related": [
      "universal",
      "marca-elemental",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "impacto elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "marca-elemental"
    ]
  },
  {
    "id": "ruptura-elemental",
    "title": "Ruptura Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você rompe completamente o fluxo de energia do alvo.",
    "description": "Você rompe completamente o fluxo de energia do alvo.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Impacto Elemental",
    "tags": [
      "Quebra",
      "Anti-tank",
      "Combo"
    ],
    "mechanics": [
      "Causa +3d6 dano elemental",
      "Ignora 2 Defesa",
      "Se o alvo estiver sob qualquer efeito elemental:",
      "causa +2d6 dano adicional",
      "prolonga todos os efeitos em +1 rodada",
      "Efeito adicional:",
      "remove bônus defensivos do alvo por 1 rodada",
      "Você não só ataca — você quebra a estabilidade do inimigo."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "ruptura elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "execucao-elemental",
    "title": "Execução Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você transforma o estado do alvo em uma oportunidade de finalização absoluta.",
    "description": "Você transforma o estado do alvo em uma oportunidade de finalização absoluta.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Ruptura Elemental",
    "tags": [
      "Burst",
      "Execução",
      "Explosão de Estado",
      "Combo"
    ],
    "mechanics": [
      "Causa +3d6 dano elemental",
      "Ignora 3 Defesa",
      "Se o alvo estiver:",
      "Marcado → +2d6 dano",
      "Sob efeito elemental → +2d6 dano adicional",
      "Se ambos:",
      "+4d6 total",
      "Execução:",
      "Se o alvo estiver com menos de 50% PV:",
      "+2d6 adicional",
      "aplica automaticamente efeito elemental (sem teste)",
      "Efeito Final:",
      "Após o ataque, todos os efeitos elementais no alvo são consumidos e aplicados novamente em área (3m)",
      "O personagem transforma o acúmulo de energia em um ponto crítico —",
      "onde tudo colapsa de uma vez."
    ],
    "examples": [],
    "related": [
      "universal",
      "marca-elemental",
      "defesa",
      "ressonancia",
      "pv"
    ],
    "keywords": [
      "execução elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "marca-elemental"
    ]
  },
  {
    "id": "explosao-elemental",
    "title": "Explosão Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você libera energia elemental concentrada em uma área, afetando múltiplos alvos ao mesmo tempo.",
    "description": "Você libera energia elemental concentrada em uma área, afetando múltiplos alvos ao mesmo tempo.",
    "grade": "2",
    "type": "Área",
    "action": "Padrão",
    "range": "9m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Área",
      "Setup",
      "Controle leve"
    ],
    "mechanics": [
      "Área: 3m",
      "Alvos na área sofrem 2d6 de dano elemental.",
      "Teste de Agilidade reduz o dano pela metade.",
      "Efeito adicional por elemento:",
      "Fogo: 1d4 dano contínuo (1 rodada)",
      "Água: empurra 1,5m",
      "Terra: derruba (teste evita)",
      "Vento: empurra 3m",
      "Energia: −1 em testes (1 rodada)",
      "Frio: −3m deslocamento",
      "Especial — Aplicação em Massa:",
      "Todos os alvos atingidos ficam sob um efeito elemental ativo até o próximo turno.",
      "O usuário não foca mais em um alvo — ele espalha sua Ressonância pelo campo."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "explosão elemental",
      "universal",
      "área"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "expansao-elemental",
    "title": "Expansão Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você amplia o alcance e a influência da explosão, tornando-a uma ferramenta de controle real.",
    "description": "Você amplia o alcance e a influência da explosão, tornando-a uma ferramenta de controle real.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Explosão Elemental",
    "tags": [
      "Área",
      "Zona",
      "Setup forte"
    ],
    "mechanics": [
      "Área aumenta para 6m",
      "Causa 2d6 de dano elemental",
      "Efeitos adicionais aprimorados:",
      "Fogo: 1d6 dano contínuo (2 rodadas)",
      "Água: empurra 3m e pode derrubar",
      "Terra: derruba e aplica −1 deslocamento",
      "Vento: empurra 6m",
      "Energia: −2 em testes (1 rodada)",
      "Frio: −6m deslocamento",
      "Especial — Zona Instável:",
      "A área permanece ativa até o próximo turno.",
      "Inimigos que entram ou permanecem sofrem 1d6 dano elemental",
      "A explosão deixa de ser um instante — passa a ser um espaço perigoso."
    ],
    "examples": [],
    "related": [
      "universal",
      "instavel",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "expansão elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "colapso-elemental",
    "title": "Colapso Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você cria uma ruptura violenta que desestabiliza completamente o campo de batalha.",
    "description": "Você cria uma ruptura violenta que desestabiliza completamente o campo de batalha.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Expansão Elemental",
    "tags": [
      "Área",
      "Controle",
      "Setup massivo",
      "Combo"
    ],
    "mechanics": [
      "Área: 6m",
      "Causa 3d6 de dano elemental",
      "Efeitos adicionais fortes:",
      "Fogo: aplica 1d6 contínuo (2 rodadas) em todos",
      "Água: empurra, derruba e impede reação (1 turno)",
      "Terra: derruba e aplica −2 Defesa",
      "Vento: empurra 6m e desorganiza formação (−1 ataque)",
      "Energia: −2 em todos os testes (1 rodada)",
      "Frio: pode Imobilizar (teste evita)",
      "Especial — Saturação Elemental:",
      "Todos os alvos atingidos:",
      "contam como sob efeito elemental ativo",
      "(para fins de combo com outras habilidades)",
      "Zona:",
      "A área permanece por 2 rodadas, causando 1d6 dano por turno.",
      "O campo de batalha entra em colapso — energia pura molda o espaço."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia"
    ],
    "keywords": [
      "colapso elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "passo-elemental",
    "title": "Passo Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você utiliza o elemento para se mover com maior eficiência.",
    "description": "Você utiliza o elemento para se mover com maior eficiência.",
    "grade": "2",
    "type": "Mobilidade",
    "action": "Livre",
    "range": "Pessoal",
    "duration": "1 rodada",
    "prerequisite": null,
    "tags": [
      "Mobilidade",
      "Setup",
      "Posicionamento"
    ],
    "mechanics": [
      "Recebe +6m de deslocamento e ignora terreno difícil.",
      "Efeito adicional por elemento:",
      "Fogo: deixa rastro (1d4 dano em quem atravessar)",
      "Água: pode atravessar superfícies instáveis",
      "Terra: não pode ser empurrado",
      "Vento: não sofre ataque de oportunidade",
      "Energia: +1 iniciativa",
      "Frio: cria área escorregadia (teste ou queda)",
      "Especial — Reposicionamento:",
      "Se terminar o movimento adjacente a um inimigo, recebe +1 no próximo ataque contra ele.",
      "O personagem começa a usar o elemento não só para atacar, mas para se mover através do combate."
    ],
    "examples": [],
    "related": [
      "universal",
      "empurrado",
      "ressonancia",
      "ataque-de-oportunidade",
      "terreno-dificil",
      "pr"
    ],
    "keywords": [
      "passo elemental",
      "universal",
      "mobilidade"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado"
    ]
  },
  {
    "id": "fluxo-elemental",
    "title": "Fluxo Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Seu movimento se torna contínuo e integrado ao fluxo elemental.",
    "description": "Seu movimento se torna contínuo e integrado ao fluxo elemental.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Passo Elemental",
    "tags": [
      "Mobilidade",
      "Atravessar",
      "Pressão"
    ],
    "mechanics": [
      "Recebe +9m de deslocamento",
      "Ignora terreno difícil e obstáculos leves",
      "Pode atravessar espaços ocupados por inimigos (sem parar neles)",
      "Efeitos adicionais aprimorados:",
      "Fogo: rastro causa 1d6 dano",
      "Água: pode atravessar qualquer superfície líquida ou instável",
      "Terra: recebe RD 2 durante o movimento",
      "Vento: pode se mover sem gerar reações e reposicionar-se livremente",
      "Energia: +2 iniciativa e +1 em testes até o fim do turno",
      "Frio: área escorregadia aumenta (3m)",
      "Especial — Movimento Ofensivo:",
      "Se passar adjacente a inimigos durante o movimento:",
      "causa 1d6 dano elemental (1x por alvo)",
      "O personagem não apenas se move — ele flui pelo campo de batalha."
    ],
    "examples": [],
    "related": [
      "universal",
      "instavel",
      "rd",
      "ressonancia",
      "terreno-dificil",
      "pr"
    ],
    "keywords": [
      "fluxo elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "transicao-elemental",
    "title": "Transição Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você rompe as limitações físicas, deslocando-se instantaneamente através do elemento.",
    "description": "Você rompe as limitações físicas, deslocando-se instantaneamente através do elemento.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Fluxo Elemental",
    "tags": [
      "Mobilidade",
      "Burst Posicional",
      "Combo"
    ],
    "mechanics": [
      "Teleporte até 12m",
      "Ignora completamente:",
      "terreno",
      "obstáculos",
      "inimigos",
      "Efeitos adicionais por elemento:",
      "Fogo: origem e destino causam 1d6 dano em área (3m)",
      "Água: remove efeitos negativos leves ao usar",
      "Terra: ganha RD 3 por 1 rodada após chegar",
      "Vento: pode agir novamente com −2 no teste",
      "Energia: recebe +2 em todos os testes no turno",
      "Frio: cria área que pode Imobilizar (teste evita)",
      "Especial — Ponto de Vantagem:",
      "Após o teleporte, seu próximo ataque recebe:",
      "+1d6 dano OU +2 no teste (escolha)",
      "O personagem deixa de se mover através do campo — ele redefine sua posição na realidade."
    ],
    "examples": [],
    "related": [
      "universal",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "transição elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "projetil-elemental",
    "title": "Projétil Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você condensa energia elemental em forma sólida e a dispara contra o alvo.",
    "description": "Você condensa energia elemental em forma sólida e a dispara contra o alvo.",
    "grade": "3",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Alcance",
      "Precisão"
    ],
    "mechanics": [
      "Causa 2d6 de dano elemental.",
      "Efeito adicional por elemento:",
      "Fogo: causa 1d6 dano contínuo (1 rodada)",
      "Água: empurra 3m",
      "Terra: causa +1d6 dano adicional",
      "Vento: recebe +2 no teste de ataque",
      "Energia: alvo sofre −1 em testes (1 rodada)",
      "Frio: alvo sofre −3m deslocamento",
      "Especial — Impacto Direcionado:",
      "Se o alvo estiver isolado (sem aliados adjacentes):",
      "causa +1d6 dano adicional",
      "A energia deixa de ser difusa — ela é comprimida em um disparo preciso e direto."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "projétil elemental",
      "universal",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "disparo-elemental",
    "title": "Disparo Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você aperfeiçoa a compressão do elemento, criando um disparo extremamente destrutivo.",
    "description": "Você aperfeiçoa a compressão do elemento, criando um disparo extremamente destrutivo.",
    "grade": "4",
    "type": null,
    "action": "Se o ataque exceder a Defesa do alvo em 5 ou mais:",
    "range": null,
    "duration": null,
    "prerequisite": "Projétil Elemental",
    "tags": [
      "Burst",
      "Precisão",
      "Penetração"
    ],
    "mechanics": [
      "Causa 3d6 de dano elemental",
      "Ignora 2 Defesa",
      "Efeitos adicionais aprimorados:",
      "Fogo: 1d6 contínuo por 2 rodadas",
      "Água: empurra e pode derrubar",
      "Terra: +2d6 dano total",
      "Vento: +3 no teste de ataque",
      "Energia: −2 em testes (1 rodada)",
      "Frio: reduz movimento e impede reação",
      "Especial — Perfuração:",
      "Se o ataque exceder a Defesa do alvo em 5 ou mais:",
      "o projétil atravessa e atinge outro alvo atrás (mesmo dano base)",
      "O disparo não é apenas forte — ele atravessa resistência e mantém sua força."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "disparo elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "campo-elemental",
    "title": "Campo Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você cria uma área imbuída com energia elemental que interfere no ambiente e nos combatentes.",
    "description": "Você cria uma área imbuída com energia elemental que interfere no ambiente e nos combatentes.",
    "grade": "3",
    "type": "Controle",
    "action": "Padrão",
    "range": "9m",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Controle",
      "Área",
      "Setup"
    ],
    "mechanics": [
      "Área: 3m",
      "Efeito base:",
      "A área aplica efeitos a criaturas que entram ou iniciam o turno nela.",
      "Efeitos por elemento:",
      "Fogo: sofre 1d4 dano ao entrar",
      "Água: terreno difícil",
      "Terra: aliados recebem +1 Defesa",
      "Vento: inimigos sofrem −1 em ataques à distância",
      "Energia: inimigos sofrem −1 em testes",
      "Frio: inimigos sofrem −3m deslocamento",
      "Especial — Zona Ativa:",
      "Criaturas que permanecem na área continuam sendo afetadas a cada rodada.",
      "O usuário impõe sua Ressonância no ambiente, alterando o comportamento do campo de batalha."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "terreno-dificil"
    ],
    "keywords": [
      "campo elemental",
      "universal",
      "controle"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "zona-elemental",
    "title": "Zona Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você fortalece a área, tornando-a mais opressiva e vantajosa para aliados.",
    "description": "Você fortalece a área, tornando-a mais opressiva e vantajosa para aliados.",
    "grade": "4",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Campo Elemental",
    "tags": [
      "Área",
      "Buff",
      "Debuff",
      "Controle"
    ],
    "mechanics": [
      "Área aumenta para 6m",
      "Efeitos aprimorados:",
      "Fogo: 1d6 dano por rodada (não só ao entrar)",
      "Água: terreno difícil + inimigos recebem −1 em ataques",
      "Terra: aliados recebem +2 Defesa",
      "Vento: inimigos sofrem −2 em ataques à distância",
      "Energia: inimigos sofrem −2 em testes",
      "Frio: inimigos sofrem −6m deslocamento",
      "Especial — Influência Tática:",
      "Aliados dentro da área recebem:",
      "+1 em testes de ataque OU +1 Defesa (escolha ao criar)",
      "O campo deixa de ser apenas um efeito — ele se torna uma zona de vantagem tática."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "terreno-dificil",
      "pr"
    ],
    "keywords": [
      "zona elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "dominio-elemental",
    "title": "Domínio Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você assume controle quase total da área, moldando o combate dentro dela.",
    "description": "Você assume controle quase total da área, moldando o combate dentro dela.",
    "grade": "4 (Avançado)",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Zona Elemental",
    "tags": [
      "Domínio",
      "Controle Total",
      "Combo",
      "Zona"
    ],
    "mechanics": [
      "Área: 6m",
      "Efeitos por elemento (versão avançada):",
      "Fogo: inimigos sofrem 1d6 dano por rodada e 1d6 ao entrar",
      "Água: inimigos ficam em terreno difícil e sofrem −2 deslocamento adicional",
      "Terra: aliados recebem +2 Defesa e RD 2",
      "Vento: inimigos sofrem −2 em ataques e não podem fazer ataques de oportunidade",
      "Energia: inimigos sofrem −2 em todos os testes",
      "Frio: inimigos podem ficar Imobilizados (teste evita) ao iniciar o turno",
      "Especial — Sinergia de Campo:",
      "Habilidades usadas dentro da área recebem:",
      "+1d6 dano OU +1 no teste (escolha por uso)",
      "Especial — Controle Absoluto:",
      "Você pode mover a área até 3m por rodada (Ação Livre)",
      "O campo deixa de ser um efeito estático — ele se torna uma extensão da vontade do usuário."
    ],
    "examples": [],
    "related": [
      "universal",
      "imobilizado",
      "defesa",
      "rd",
      "ressonancia",
      "acao-livre",
      "terreno-dificil"
    ],
    "keywords": [
      "domínio elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "reforco-elemental",
    "title": "Reforço Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você canaliza energia elemental em um aliado, fortalecendo suas ações.",
    "description": "Você canaliza energia elemental em um aliado, fortalecendo suas ações.",
    "grade": "2",
    "type": "Suporte",
    "action": "Padrão",
    "range": "Toque",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Suporte",
      "Buff",
      "Setup"
    ],
    "mechanics": [
      "O alvo recebe +1d6 em testes OU dano (escolha ao aplicar).",
      "Efeito adicional por elemento:",
      "Fogo: +1 dano fixo",
      "Água: recupera 1d6 PV ao aplicar",
      "Terra: +1 Defesa",
      "Vento: +3m deslocamento",
      "Energia: +1 em testes",
      "Frio: resistência leve (−1 dano recebido)",
      "Especial — Sincronização:",
      "Se o alvo usar uma habilidade elemental, recebe +1 no Teste de Ressonância.",
      "O usuário alinha sua Ressonância com outro, amplificando sua capacidade de agir."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "pv"
    ],
    "keywords": [
      "reforço elemental",
      "universal",
      "suporte"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "amplificacao-elemental",
    "title": "Amplificação Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você intensifica a conexão, permitindo que o aliado libere mais poder em menos tempo.",
    "description": "Você intensifica a conexão, permitindo que o aliado libere mais poder em menos tempo.",
    "grade": "3",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Reforço Elemental",
    "tags": [
      "Buff",
      "Potencialização",
      "Pico"
    ],
    "mechanics": [
      "O alvo recebe:",
      "+1d6 em testes E dano",
      "Efeitos adicionais aprimorados:",
      "Fogo: +2 dano fixo",
      "Água: cura 2d6 ao aplicar",
      "Terra: +2 Defesa",
      "Vento: +6m deslocamento",
      "Energia: +2 em testes",
      "Frio: −2 dano recebido",
      "Especial — Pico de Poder:",
      "1x durante a duração, o alvo pode:",
      "rolar um dado adicional (extra 1d6) em uma ação",
      "A energia deixa de apenas reforçar — ela passa a elevar o limite do aliado."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "amplificação elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "sobrecarga-elemental",
    "title": "Sobrecarga Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você força o fluxo de energia além do limite natural do alvo.",
    "description": "Você força o fluxo de energia além do limite natural do alvo.",
    "grade": "4",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Amplificação Elemental",
    "tags": [
      "Buff",
      "Overclock",
      "Combo",
      "Risco"
    ],
    "mechanics": [
      "O alvo recebe:",
      "+2d6 em testes OU dano (escolhe a cada uso)",
      "Efeitos adicionais:",
      "Fogo: ataques causam 1d6 adicional em área (1,5m)",
      "Água: cura 2d6 ao aplicar + 1d6 por rodada",
      "Terra: +2 Defesa + RD 2",
      "Vento: pode se mover após ações sem custo (1x por turno)",
      "Energia: +2 em todos os testes",
      "Frio: reduz dano recebido e inimigos adjacentes sofrem penalidades",
      "Especial — Sobrecarga:",
      "Durante a duração, 1x por turno:",
      "o alvo pode receber +1d6 adicional em uma ação",
      "Ao final da duração:",
      "sofre −1 em testes por 1 rodada (fadiga)",
      "O usuário empurra o aliado além de seus limites, sabendo que haverá um preço."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "sobrecarga elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "convergencia-elemental",
    "title": "Convergência Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você conecta múltiplas fontes de Ressonância em um único fluxo amplificado.",
    "description": "Você conecta múltiplas fontes de Ressonância em um único fluxo amplificado.",
    "grade": "4 (Avançado)",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Sobrecarga Elemental",
    "tags": [
      "Suporte",
      "Sinergia",
      "Combo",
      "Grupo"
    ],
    "mechanics": [
      "Alcance passa a ser 3m (área)",
      "Afeta até 2 aliados",
      "Os alvos recebem:",
      "+1d6 em testes e dano",
      "+1 no Teste de Ressonância",
      "Efeitos adicionais:",
      "habilidades usadas pelos alvos geram +1d6 extra se estiverem próximos",
      "Especial — Combo Compartilhado:",
      "Se dois alvos afetados atacarem o mesmo inimigo no mesmo turno:",
      "o segundo ataque recebe +2d6 dano adicional",
      "O usuário deixa de fortalecer indivíduos — ele conecta o grupo como um único fluxo de poder."
    ],
    "examples": [],
    "related": [
      "universal",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "convergência elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "barreira-elemental",
    "title": "Barreira Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você cria uma proteção elemental ao seu redor, absorvendo impactos e interferindo em quem se aproxima.",
    "description": "Você cria uma proteção elemental ao seu redor, absorvendo impactos e interferindo em quem se aproxima.",
    "grade": "1",
    "type": "Defesa",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Defesa",
      "Sustentação",
      "Reação leve"
    ],
    "mechanics": [
      "Reduz o dano recebido em 1d6.",
      "Efeito adicional por elemento:",
      "Fogo: inimigos que atacam corpo a corpo sofrem 1d4 dano",
      "Água: pode reduzir +1d6 dano (1x por rodada)",
      "Terra: recebe RD 2 adicional",
      "Vento: recebe +1 Defesa",
      "Energia: recebe +1 em testes de resistência",
      "Frio: inimigos adjacentes sofrem −3m deslocamento",
      "Especial — Defesa Ativa:",
      "Se reduzir qualquer dano, recebe +1 no próximo teste de Ressonância.",
      "O usuário aprende a transformar energia em proteção constante."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "barreira elemental",
      "universal",
      "defesa"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "manto-elemental",
    "title": "Manto Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "A barreira se torna mais estável e começa a reagir ao combate.",
    "description": "A barreira se torna mais estável e começa a reagir ao combate.",
    "grade": "2",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Barreira Elemental",
    "tags": [
      "Defesa",
      "Retaliação",
      "Sustentação"
    ],
    "mechanics": [
      "Reduz dano em 1d6 + 1",
      "Efeitos adicionais aprimorados:",
      "Fogo: reflete 1d6 dano",
      "Água: pode reduzir +1d6 (2x por rodada)",
      "Terra: recebe RD 3",
      "Vento: +2 Defesa",
      "Energia: +2 resistência",
      "Frio: inimigos adjacentes sofrem −6m deslocamento",
      "Especial — Retaliação:",
      "1x por rodada, ao sofrer ataque:",
      "pode causar 1d6 dano elemental no agressor",
      "A defesa deixa de ser passiva — ela responde ao combate."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "manto elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "nucleo-defensivo-universal-2",
    "title": "Núcleo Defensivo",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você concentra a barreira em um núcleo altamente eficiente.",
    "description": "Você concentra a barreira em um núcleo altamente eficiente.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Manto Elemental",
    "tags": [
      "Defesa",
      "Mitigação",
      "Conversão"
    ],
    "mechanics": [
      "Reduz dano em 2d6",
      "Recebe +1 Defesa",
      "Efeitos adicionais:",
      "Fogo: refletido causa 1d6 + aplica 1d4 contínuo",
      "Água: pode reduzir +2d6 (1x por rodada)",
      "Terra: recebe RD 4",
      "Vento: +2 Defesa e ignora ataques de oportunidade",
      "Energia: +2 em todos os testes de resistência",
      "Frio: inimigos adjacentes sofrem −6m e −1 ação leve",
      "Especial — Absorção:",
      "Se reduzir dano a 0:",
      "ganha +1d6 no próximo ataque ou teste",
      "O usuário transforma impacto em energia reaproveitável."
    ],
    "examples": [],
    "related": [
      "universal",
      "defesa",
      "rd",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "núcleo defensivo",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "egide-elemental",
    "title": "Égide Elemental",
    "category": "habilidades",
    "element": "universal",
    "summary": "Você manifesta uma defesa quase impenetrável, convertendo dano em vantagem.",
    "description": "Você manifesta uma defesa quase impenetrável, convertendo dano em vantagem.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Núcleo Defensivo",
    "tags": [
      "Defesa",
      "Tank",
      "Conversão",
      "Sustain"
    ],
    "mechanics": [
      "Reduz dano em 2d6 + 2",
      "Recebe +2 Defesa",
      "Efeitos adicionais avançados:",
      "Fogo: reflete 1d6 + 1d4 contínuo em todos os inimigos adjacentes",
      "Água: pode reduzir +2d6 (2x por rodada)",
      "Terra: recebe RD 5",
      "Vento: +3 Defesa e não pode ser flanqueado",
      "Energia: +2 em todos os testes",
      "Frio: inimigos adjacentes podem ficar Lentos (teste evita)",
      "Especial — Conversão de Impacto:",
      "Sempre que reduzir dano:",
      "armazena energia (máx. 3 cargas)",
      "Cada carga pode ser usada para:",
      "+1d6 em ataque",
      "+1d6 em teste",
      "O personagem não apenas resiste — ele transforma o ataque inimigo em combustível."
    ],
    "examples": [],
    "related": [
      "universal",
      "lento",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "égide elemental",
      "universal"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "lento"
    ]
  },
  {
    "id": "chama-breve",
    "title": "Chama Breve",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Você cria uma pequena explosão de fogo em direção a um alvo.",
    "description": "Você cria uma pequena explosão de fogo em direção a um alvo.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "9m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Burn",
      "Setup"
    ],
    "mechanics": [
      "Causa 2d6 de dano de fogo.",
      "Se o alvo falhar em um teste de Vigor:",
      "sofre 1d4 de dano de fogo no próximo turno",
      "Especial — Ignição:",
      "Se o alvo já estiver sob efeito de fogo:",
      "recebe +1d6 de dano adicional",
      "Uma faísca controlada — simples, mas capaz de iniciar algo maior."
    ],
    "examples": [],
    "related": [
      "fogo",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "chama breve",
      "fogo",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "chama-intensificada",
    "title": "Chama Intensificada",
    "category": "habilidades",
    "element": "fogo",
    "summary": "O fogo se torna mais agressivo e persistente.",
    "description": "O fogo se torna mais agressivo e persistente.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Chama Breve",
    "tags": [
      "Burn",
      "Pressão",
      "Multi-alvo leve"
    ],
    "mechanics": [
      "Causa 2d6 de dano de fogo",
      "Se falhar no teste:",
      "sofre 1d6 de dano por 2 rodadas",
      "Especial — Propagação Leve:",
      "Se o alvo estiver adjacente a outro inimigo:",
      "o segundo alvo sofre 1d6 de dano de fogo",
      "O fogo começa a se espalhar — ainda controlado, mas mais difícil de conter."
    ],
    "examples": [],
    "related": [
      "fogo",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "chama intensificada",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "explosao-incandescente",
    "title": "Explosão Incandescente",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Você transforma a chama em uma detonação instável.",
    "description": "Você transforma a chama em uma detonação instável.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Chama Intensificada",
    "tags": [
      "Burst",
      "Área leve",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano de fogo",
      "Alvos adjacentes sofrem 1d6 de dano",
      "Se falhar no teste:",
      "sofre 1d6 por 2 rodadas",
      "Especial — Combustão:",
      "Se o alvo já estiver sob efeito de fogo:",
      "causa +2d6 de dano imediato",
      "O fogo deixa de ser contido — ele começa a explodir."
    ],
    "examples": [],
    "related": [
      "fogo",
      "instavel",
      "ressonancia"
    ],
    "keywords": [
      "explosão incandescente",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "incendio-descontrolado",
    "title": "Incêndio Descontrolado",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Você libera fogo de forma quase incontrolável, consumindo tudo ao redor.",
    "description": "Você libera fogo de forma quase incontrolável, consumindo tudo ao redor.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Explosão Incandescente",
    "tags": [
      "Área",
      "Burn",
      "Propagação",
      "Pressão"
    ],
    "mechanics": [
      "Causa 3d6 de dano de fogo",
      "Área: 3m ao redor do alvo",
      "Todos os afetados sofrem:",
      "1d6 de dano por 2 rodadas",
      "Especial — Reação em Cadeia:",
      "Se um alvo sob efeito de fogo for atingido:",
      "espalha o efeito para inimigos adjacentes (1d6)",
      "Especial — Pressão Térmica:",
      "Inimigos em chamas sofrem −1 em testes",
      "O usuário perde a necessidade de controle fino — o fogo se torna um fenômeno."
    ],
    "examples": [],
    "related": [
      "fogo",
      "em-chamas",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "incêndio descontrolado",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "em-chamas"
    ]
  },
  {
    "id": "lamina-flamejante",
    "title": "Lâmina Flamejante",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Descrição: Você envolve sua arma em chamas instáveis que reagem ao impacto, habilitando a sua capacidade de acumular calor.",
    "description": "Descrição: Você envolve sua arma em chamas instáveis que reagem ao impacto, habilitando a sua capacidade de acumular calor.",
    "grade": "1",
    "type": "Aprimoramento (Ativação)",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Melee",
      "Pressão",
      "Ativação"
    ],
    "mechanics": [
      "Efeito: * Ativação: Encanta a arma e habilita a Mecânica de Combo.",
      "Dano: Seus ataques corpo a corpo causam +1d4 de dano de fogo.",
      "Especial — Escalada de Calor (Combo): * Cada acerto consecutivo no mesmo alvo aumenta o dano em +1 (máx. +3).",
      "Quebra de Fluxo: Se errar o ataque ou trocar de alvo, as chamas se apagam e o combo reinicia.",
      "Especial — Ignição (Finalizador): * Ao atingir o máximo de acúmulo (+3), o próximo ataque causa +1d6 de dano de fogo adicional e o contador reinicia."
    ],
    "examples": [],
    "related": [
      "fogo",
      "em-chamas",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "lâmina flamejante",
      "fogo",
      "aprimoramento (ativação)"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "em-chamas"
    ]
  },
  {
    "id": "corte-incandescente",
    "title": "Corte Incandescente",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Descrição: Seus ataques começam a liberar a energia acumulada na Lâmina em golpes mais violentos e explosivos.",
    "description": "Descrição: Seus ataques começam a liberar a energia acumulada na Lâmina em golpes mais violentos e explosivos.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Lâmina Flamejante ativa",
    "tags": [
      "Burst",
      "Melee",
      "Combo"
    ],
    "mechanics": [
      "Efeito: * Dano Base: +1d6 de fogo.",
      "Especial — Pressão: Se o alvo já estiver sob efeito de fogo (queima), recebe +1d6 de dano adicional.",
      "Especial — Explosão de Calor (Finalizador): * Ao atingir o 3º acerto consecutivo com a Lâmina ativa: * → O golpe causa +2d6 de dano adicional ao alvo principal. * → Inimigos adjacentes sofrem 1d6 de dano pela onda de choque."
    ],
    "examples": [],
    "related": [
      "fogo",
      "lento",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "corte incandescente",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "lento"
    ]
  },
  {
    "id": "furia-flamejante",
    "title": "Fúria Flamejante",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Descrição: Você entra em um estado agressivo onde o teto de poder do seu fogo responde à sua ofensiva constante.",
    "description": "Descrição: Você entra em um estado agressivo onde o teto de poder do seu fogo responde à sua ofensiva constante.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Lâmina Flamejante ativa",
    "tags": [
      "Melee",
      "Ramp-up",
      "Pressão Contínua"
    ],
    "mechanics": [
      "Efeito: * Evolução de Combo: O limite de dano da Lâmina Flamejante é ampliado.",
      "Escalonamento: Cada ataque bem-sucedido no mesmo alvo concede +1d6 de fogo (acumula até o máximo de +3d6).",
      "Foco: O bônus acumulado é perdido imediatamente ao errar um ataque ou trocar de alvo.",
      "Especial — Queimar Vivo: * Alvos sob seu foco (alvo atual do combo) sofrem 1d6 de dano de fogo por rodada enquanto você mantiver a ofensiva."
    ],
    "examples": [],
    "related": [
      "fogo",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "fúria flamejante",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "carnificina-ignea",
    "title": "Carnificina Ígnea",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Descrição: Você libera toda a energia acumulada em uma sequência devastadora, tornando-se um incêndio vivo no campo de batalha.",
    "description": "Descrição: Você libera toda a energia acumulada em uma sequência devastadora, tornando-se um incêndio vivo no campo de batalha.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Lâmina Flamejante ativa",
    "tags": [
      "Melee",
      "Execução",
      "Multi-hit",
      "Combo Máximo"
    ],
    "mechanics": [
      "Efeito: * Dano de Estado: Enquanto a habilidade durar, seus ataques causam +2d6 de dano de fogo base.",
      "Especial — Execução em Cadeia: * Massacre: 1x por turno, ao atingir o alvo do seu combo, você pode realizar um ataque gratuito contra outro inimigo adjacente.",
      "Especial — Colapso Térmico: * Se o alvo estiver em chamas: * → Sofre +2d6 de dano adicional. * → Espalha 1d6 de dano de fogo para todos os adjacentes a ele.",
      "Especial — Consumo (Finalizador): * Ao final da sequência de ataques, todos os alvos atingidos sofrem 1d6 de dano extra para cada acerto acumulado no combo atual."
    ],
    "examples": [],
    "related": [
      "fogo",
      "em-chamas",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "carnificina ígnea",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "em-chamas"
    ]
  },
  {
    "id": "onda-de-calor",
    "title": "Onda de Calor",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Você libera calor intenso ao seu redor, tornando o ambiente sufocante.",
    "description": "Você libera calor intenso ao seu redor, tornando o ambiente sufocante.",
    "grade": "1",
    "type": "Controle",
    "action": "Padrão",
    "range": "Pessoal (aura 3m)",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Aura",
      "Controle",
      "Pressão"
    ],
    "mechanics": [
      "Inimigos dentro da área (3m) sofrem:",
      "1d6 de dano de fogo por rodada",
      "Se falharem em um teste de Vigor:",
      "sofrem −1 em testes até o próximo turno",
      "Especial — Pressão Térmica:",
      "Inimigos que permanecem na área por 2 rodadas consecutivas:",
      "sofrem −3m de deslocamento",
      "O calor não explode — ele sufoca lentamente quem se aproxima."
    ],
    "examples": [],
    "related": [
      "fogo",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "onda de calor",
      "fogo",
      "controle"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "calor-crescente",
    "title": "Calor Crescente",
    "category": "habilidades",
    "element": "fogo",
    "summary": "O calor se intensifica conforme o combate se prolonga.",
    "description": "O calor se intensifica conforme o combate se prolonga.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Onda de Calor",
    "tags": [
      "Pressão",
      "Escala",
      "Anti-melee"
    ],
    "mechanics": [
      "Dano aumenta para 1d6 + 1 por rodada",
      "Debuff:",
      "−2 em testes (em vez de −1)",
      "Especial — Acúmulo Térmico:",
      "Para cada rodada dentro da área:",
      "o inimigo recebe +1 dano adicional (máx. +3)",
      "Ficar perto de você se torna cada vez mais insustentável."
    ],
    "examples": [],
    "related": [
      "fogo",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "calor crescente",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "zona-de-combustao",
    "title": "Zona de Combustão",
    "category": "habilidades",
    "element": "fogo",
    "summary": "O calor se torna tão intenso que começa a afetar o espaço ao redor.",
    "description": "O calor se torna tão intenso que começa a afetar o espaço ao redor.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Calor Crescente",
    "tags": [
      "Área",
      "Controle",
      "Sinergia com burn"
    ],
    "mechanics": [
      "Área aumenta para 6m",
      "Inimigos sofrem:",
      "1d6 dano por rodada",
      "−2 em testes",
      "Especial — Ignição Passiva:",
      "Inimigos sob efeito de fogo:",
      "sofrem +1d6 adicional por rodada",
      "Especial — Ambiente Hostil:",
      "Entrar na área causa 1d6 dano imediato",
      "O ambiente ao seu redor se torna um verdadeiro forno."
    ],
    "examples": [],
    "related": [
      "fogo",
      "rd",
      "ressonancia"
    ],
    "keywords": [
      "zona de combustão",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "inferno-localizado",
    "title": "Inferno Localizado",
    "category": "habilidades",
    "element": "fogo",
    "summary": "Você transforma a área ao seu redor em um núcleo de calor extremo.",
    "description": "Você transforma a área ao seu redor em um núcleo de calor extremo.",
    "grade": "4",
    "type": null,
    "action": "4 rodadas",
    "range": null,
    "duration": "4 rodadas",
    "prerequisite": "Zona de Combustão",
    "tags": [
      "Controle",
      "Zona",
      "Pressão extrema",
      "Combo"
    ],
    "mechanics": [
      "Área: 6m",
      "Inimigos sofrem:",
      "2d6 dano por rodada",
      "−2 em testes",
      "−3m deslocamento",
      "Especial — Colapso Térmico:",
      "Inimigos com efeito de fogo:",
      "sofrem +2d6 dano imediato (1x por rodada)",
      "Especial — Domínio de Calor:",
      "Aliados dentro da área recebem:",
      "+1d6 dano de fogo em ataques",
      "Você não cria uma explosão — você cria um inferno controlado."
    ],
    "examples": [],
    "related": [
      "fogo",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "inferno localizado",
      "fogo"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "jato-de-agua",
    "title": "Jato de Água",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você dispara um jato pressurizado de água contra um inimigo.",
    "description": "Você dispara um jato pressurizado de água contra um inimigo.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Controle",
      "Reposicionamento",
      "Setup"
    ],
    "mechanics": [
      "Causa 2d6 de dano.",
      "Se o alvo falhar em um teste de Força:",
      "é empurrado 3m",
      "Especial — Encharcar:",
      "O alvo fica Encharcado até o próximo turno.",
      "Encharcado: −1 em testes físicos e habilita os gatilhos de Água que exigem Encharcado.",
      "A água não destrói — ela desloca, desestabiliza e prepara."
    ],
    "examples": [],
    "related": [
      "agua",
      "empurrado",
      "encharcado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "jato de água",
      "agua",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado",
      "encharcado"
    ]
  },
  {
    "id": "correnteza-forcada",
    "title": "Correnteza Forçada",
    "category": "habilidades",
    "element": "agua",
    "summary": "O fluxo de água se torna mais forte e difícil de resistir.",
    "description": "O fluxo de água se torna mais forte e difícil de resistir.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Jato de Água",
    "tags": [
      "Controle",
      "Knockback",
      "Combo"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Empurra 6m",
      "Se falhar no teste:",
      "também fica Caído",
      "Especial — Fluxo Contínuo:",
      "Se o alvo já estiver Encharcado:",
      "não pode evitar o empurrão",
      "recebe +1d6 dano adicional",
      "A água deixa de apenas empurrar — ela começa a arrastar."
    ],
    "examples": [],
    "related": [
      "agua",
      "caido",
      "encharcado",
      "ressonancia"
    ],
    "keywords": [
      "correnteza forçada",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido",
      "encharcado"
    ]
  },
  {
    "id": "impacto-hidraulico",
    "title": "Impacto Hidráulico",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você concentra pressão suficiente para causar impacto real.",
    "description": "Você concentra pressão suficiente para causar impacto real.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Correnteza Forçada",
    "tags": [
      "Controle",
      "Burst situacional",
      "Interação com mapa"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Empurra 6m",
      "Se colidir com obstáculo ou criatura:",
      "sofre +2d6 dano adicional",
      "Especial — Colisão:",
      "Criaturas no caminho sofrem 1d6 dano e podem ser empurradas",
      "Especial — Saturação:",
      "Se o alvo já estiver Encharcado, fica Saturado até o próximo turno.",
      "Saturado: −2 em testes físicos e conta como Encharcado para todos os gatilhos de Água.",
      "A água se transforma em força física brutal."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "impacto hidráulico",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "torrente-devastadora",
    "title": "Torrente Devastadora",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você libera uma corrente massiva que domina o espaço e o movimento.",
    "description": "Você libera uma corrente massiva que domina o espaço e o movimento.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Impacto Hidráulico",
    "tags": [
      "Área linear",
      "Controle",
      "Reposicionamento massivo"
    ],
    "mechanics": [
      "Linha de 12m",
      "Todos os alvos na linha sofrem:",
      "3d6 de dano",
      "são empurrados 6m",
      "Teste reduz efeito pela metade.",
      "Especial — Arrasto:",
      "Alvos Encharcados:",
      "são empurrados automaticamente",
      "ficam Caídos",
      "Especial — Fluxo Dominante:",
      "Você pode escolher se mover junto com a corrente (até 6m)",
      "A água deixa de ser um ataque — ela se torna uma força que redefine o campo."
    ],
    "examples": [],
    "related": [
      "agua",
      "caido",
      "empurrado",
      "encharcado",
      "ressonancia"
    ],
    "keywords": [
      "torrente devastadora",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido",
      "empurrado",
      "encharcado"
    ]
  },
  {
    "id": "arsenal-hidrostatico",
    "title": "Arsenal Hidrostático",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você molda água em uma arma de alta pressão (lâmina, lança, projétil) e a dispara contra o alvo.",
    "description": "Você molda água em uma arma de alta pressão (lâmina, lança, projétil) e a dispara contra o alvo.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Perfuração",
      "Execução leve"
    ],
    "mechanics": [
      "Causa 2d6 de dano perfurante + água",
      "Se o alvo falhar em um teste de Vigor:",
      "a arma implode dentro do corpo, causando +1d6 de dano adicional",
      "Especial — Pressão Interna:",
      "Se o alvo estiver Encharcado:",
      "sofre automaticamente o dano de implosão",
      "A água assume forma sólida por um instante — atravessa o alvo e colapsa internamente."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "arsenal hidrostático",
      "agua",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "arma-compressiva",
    "title": "Arma Compressiva",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você aumenta a densidade e multiplica suas construções de água.",
    "description": "Você aumenta a densidade e multiplica suas construções de água.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arsenal Hidrostático",
    "tags": [
      "Multi-hit",
      "Burst",
      "Combo"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Implosão causa +2d6 dano adicional",
      "Especial — Formação Dupla:",
      "Você pode criar 2 armas simultaneamente:",
      "atingir o mesmo alvo",
      "ou dividir entre dois alvos",
      "Especial — Sinergia:",
      "Alvos Encharcados:",
      "recebem +1d6 dano adicional",
      "A água deixa de ser um disparo único — ela se fragmenta em múltiplas formas letais."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia"
    ],
    "keywords": [
      "arma compressiva",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "ruptura-hidrostatica",
    "title": "Ruptura Hidrostática",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você domina a pressão interna, causando colapsos destrutivos dentro do alvo.",
    "description": "Você domina a pressão interna, causando colapsos destrutivos dentro do alvo.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arma Compressiva",
    "tags": [
      "Burst",
      "Execução",
      "Anti-resistência"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Implosão causa +2d6 dano",
      "Especial — Colapso Interno:",
      "Se o alvo estiver sob qualquer efeito (Encharcado ou controle):",
      "causa +2d6 dano adicional",
      "Especial — Instabilidade:",
      "O alvo sofre −1 em testes físicos por 1 rodada",
      "A água não apenas perfura — ela destrói de dentro para fora."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "ruptura hidrostática",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "arsenal-abissal",
    "title": "Arsenal Abissal",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você cria múltiplas armas de água altamente instáveis, atacando simultaneamente e colapsando o alvo.",
    "description": "Você cria múltiplas armas de água altamente instáveis, atacando simultaneamente e colapsando o alvo.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Ruptura Hidrostática",
    "tags": [
      "Burst",
      "Multi-hit",
      "Execução",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Implosão causa +3d6 dano adicional",
      "Especial — Formação Múltipla:",
      "Você cria até 3 armas, podendo:",
      "focar um alvo",
      "ou dividir entre vários",
      "Especial — Implosão em Cadeia:",
      "Se o alvo estiver Encharcado:",
      "cada impacto aplica implosão completa",
      "Especial — Colapso Total:",
      "Se o alvo estiver com menos de 50% PV:",
      "causa +2d6 dano adicional",
      "A água se fragmenta em múltiplas formas letais, atravessando e colapsando tudo simultaneamente."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pv"
    ],
    "keywords": [
      "arsenal abissal",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "cura-fluida",
    "title": "Cura Fluida",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você canaliza água vital no alvo, restaurando seu fluxo interno.",
    "description": "Você canaliza água vital no alvo, restaurando seu fluxo interno.",
    "grade": "1",
    "type": "Suporte",
    "action": "Padrão",
    "range": "Toque",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Cura",
      "Flexibilidade",
      "Suporte"
    ],
    "mechanics": [
      "O alvo recupera 2d6 + Intelecto PV",
      "Especial — Fluxo Adaptável:",
      "Ao aplicar a cura, escolha um efeito adicional:",
      "Revitalizar: +1d6 PV adicional",
      "Estabilizar: remove 1 condição leve",
      "Purificar: concede +1 em testes por 1 rodada",
      "Especial — Encharcado:",
      "Se o alvo estiver Encharcado:",
      "recebe +1d6 PV adicional",
      "A água não apenas cura — ela se adapta ao que o corpo precisa."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pv",
      "pr"
    ],
    "keywords": [
      "cura fluida",
      "agua",
      "suporte"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "corrente-restauradora",
    "title": "Corrente Restauradora",
    "category": "habilidades",
    "element": "agua",
    "summary": "A energia passa a fluir entre múltiplos alvos.",
    "description": "A energia passa a fluir entre múltiplos alvos.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Cura Fluida",
    "tags": [
      "Cura",
      "Multi-alvo",
      "Suporte"
    ],
    "mechanics": [
      "Cura 2d6 + Intelecto",
      "Pode atingir:",
      "1 alvo principal",
      "+1 alvo adicional a até 3m",
      "Especial — Fluxo Compartilhado:",
      "O segundo alvo recebe metade da cura",
      "Especial — Estado Fluido:",
      "Alvos curados recebem:",
      "+1 Defesa OU +1 em testes (escolha) por 1 rodada",
      "A água se espalha, levando recuperação a mais de um aliado."
    ],
    "examples": [],
    "related": [
      "agua",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "corrente restauradora",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "mare-vital",
    "title": "Maré Vital",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você cria um fluxo contínuo de regeneração.",
    "description": "Você cria um fluxo contínuo de regeneração.",
    "grade": "3",
    "type": null,
    "action": "O alvo ignora penalidades leves enquanto estiver sendo curado",
    "range": null,
    "duration": null,
    "prerequisite": "Corrente Restauradora",
    "tags": [
      "Cura contínua",
      "Sustain",
      "Resistência"
    ],
    "mechanics": [
      "Cura imediata de 2d6 + Intelecto",
      "E adicionalmente:",
      "cura 1d6 por rodada durante 2 rodadas",
      "Especial — Regeneração:",
      "O alvo ignora penalidades leves enquanto estiver sendo curado",
      "Especial — Sinergia com Água:",
      "Se estiver Encharcado:",
      "cura contínua aumenta para 1d6 + 1",
      "A cura deixa de ser instantânea — ela se torna um fluxo constante."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia"
    ],
    "keywords": [
      "maré vital",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "mare-da-vida",
    "title": "Maré da Vida",
    "category": "habilidades",
    "element": "agua",
    "summary": "Você libera uma onda poderosa de energia vital, restaurando e fortalecendo aliados.",
    "description": "Você libera uma onda poderosa de energia vital, restaurando e fortalecendo aliados.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Maré Vital",
    "tags": [
      "Cura em área",
      "Suporte",
      "Sustentação"
    ],
    "mechanics": [
      "Cura 3d6 + Intelecto",
      "Área: aliados em até 6m",
      "Especial — Revitalização Total:",
      "Remove até 2 condições negativas leves",
      "Especial — Excesso Vital:",
      "Se um alvo estiver com PV cheio:",
      "recebe escudo temporário = 2d6",
      "Especial — Sinergia:",
      "Alvos Encharcados:",
      "recebem +1d6 cura adicional",
      "A água se torna vida pura, restaurando tudo ao seu redor."
    ],
    "examples": [],
    "related": [
      "agua",
      "encharcado",
      "ressonancia",
      "pv"
    ],
    "keywords": [
      "maré da vida",
      "agua"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "encharcado"
    ]
  },
  {
    "id": "projetil-rochoso",
    "title": "Projétil Rochoso",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você arremessa um fragmento de rocha com força bruta contra o alvo.",
    "description": "Você arremessa um fragmento de rocha com força bruta contra o alvo.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Impacto",
      "Anti-defesa"
    ],
    "mechanics": [
      "Causa 2d6 de dano contundente",
      "Especial — Impacto:",
      "Se o alvo falhar em um teste de Força:",
      "sofre −1 Defesa até o próximo turno",
      "Especial — Peso:",
      "Se o alvo estiver sob efeito de controle (Caído, lento, etc):",
      "recebe +1d6 dano adicional",
      "A Terra não é rápida — ela é inevitável."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "lento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "projétil rochoso",
      "terra",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido",
      "lento"
    ]
  },
  {
    "id": "disparo-pesado",
    "title": "Disparo Pesado",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você aumenta a densidade e o peso do projétil.",
    "description": "Você aumenta a densidade e o peso do projétil.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Projétil Rochoso",
    "tags": [
      "Impacto",
      "Debuff",
      "Pressão"
    ],
    "mechanics": [
      "Causa 2d6 + 2 de dano",
      "Especial — Quebra de Guarda:",
      "Se o alvo falhar no teste:",
      "sofre −2 Defesa",
      "Especial — Recuo Forçado:",
      "O alvo é empurrado 1,5m",
      "O golpe não só machuca — ele quebra a postura do inimigo."
    ],
    "examples": [],
    "related": [
      "terra",
      "empurrado",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "disparo pesado",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado"
    ]
  },
  {
    "id": "impacto-sismico",
    "title": "Impacto Sísmico",
    "category": "habilidades",
    "element": "terra",
    "summary": "O projétil carrega energia do solo, causando impacto ampliado.",
    "description": "O projétil carrega energia do solo, causando impacto ampliado.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Disparo Pesado",
    "tags": [
      "Área leve",
      "Controle",
      "Anti-resistência"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Especial — Onda de Impacto:",
      "Inimigos adjacentes sofrem 1d6 de dano",
      "Especial — Abalo:",
      "Alvo deve passar em teste de Agilidade ou fica Caído",
      "Especial — Massa Brutal:",
      "Se o alvo estiver com penalidade de Defesa:",
      "sofre +2d6 dano adicional",
      "O impacto reverbera pelo corpo e pelo chão."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "impacto sísmico",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido"
    ]
  },
  {
    "id": "colapso-de-metal",
    "title": "Colapso de Metal",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você lança um projétil massivo metal que colapsa ao atingir o alvo.",
    "description": "Você lança um projétil massivo metal que colapsa ao atingir o alvo.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Impacto Sísmico",
    "tags": [
      "Burst",
      "Anti-tank",
      "Controle"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Especial — Ruptura:",
      "Ignora até 2 pontos de RD (redução de dano)",
      "Especial — Colapso:",
      "Se o alvo falhar no teste:",
      "fica Caído",
      "sofre −2 Defesa por 1 rodada",
      "Especial — Impacto Total:",
      "Se o alvo estiver Caído:",
      "sofre +2d6 dano adicional",
      "O Metal não apenas atinge — ela derruba e esmaga."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "colapso de metal",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido"
    ]
  },
  {
    "id": "pele-de-pedra",
    "title": "Pele de Pedra",
    "category": "habilidades",
    "element": "terra",
    "summary": "Sua pele se endurece como rocha, reduzindo o impacto dos ataques.",
    "description": "Sua pele se endurece como rocha, reduzindo o impacto dos ataques.",
    "grade": "1",
    "type": "Defesa",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Defesa",
      "Tank",
      "Resistência"
    ],
    "mechanics": [
      "Recebe:",
      "+1 Defesa",
      "RD 2 (reduz 2 de dano recebido)",
      "Penalidade — Peso:",
      "Seu deslocamento é reduzido em −3m",
      "Especial — Inabalável:",
      "Recebe +2 em testes contra ser empurrado ou derrubado",
      "Você troca mobilidade por resistência bruta."
    ],
    "examples": [],
    "related": [
      "terra",
      "empurrado",
      "defesa",
      "rd",
      "ressonancia"
    ],
    "keywords": [
      "pele de pedra",
      "terra",
      "defesa"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado"
    ]
  },
  {
    "id": "couraca-rochosa",
    "title": "Couraça Rochosa",
    "category": "habilidades",
    "element": "terra",
    "summary": "A camada de pedra se torna mais espessa e eficiente.",
    "description": "A camada de pedra se torna mais espessa e eficiente.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Pele de Pedra",
    "tags": [
      "Defesa",
      "Sustentação",
      "Anti-burst"
    ],
    "mechanics": [
      "Recebe:",
      "+1 Defesa",
      "RD 3",
      "Penalidade:",
      "−3m deslocamento",
      "Especial — Absorção:",
      "1x por rodada:",
      "reduz +1d6 dano adicional",
      "Especial — Postura Fixa:",
      "Se você não se mover no turno:",
      "recebe +1 Defesa adicional",
      "Quanto mais firme você se mantém, mais difícil é te derrubar."
    ],
    "examples": [],
    "related": [
      "terra",
      "defesa",
      "rd",
      "ressonancia"
    ],
    "keywords": [
      "couraça rochosa",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "corpo-de-rocha",
    "title": "Corpo de Rocha",
    "category": "habilidades",
    "element": "terra",
    "summary": "Seu corpo se torna parcialmente mineral.",
    "description": "Seu corpo se torna parcialmente mineral.",
    "grade": "3",
    "type": null,
    "action": "Inimigos que atacam corpo a corpo:",
    "range": null,
    "duration": null,
    "prerequisite": "Couraça Rochosa",
    "tags": [
      "Tank",
      "Controle de espaço",
      "Retaliação"
    ],
    "mechanics": [
      "Recebe:",
      "+2 Defesa",
      "RD 4",
      "Penalidade:",
      "−6m deslocamento",
      "Especial — Massa:",
      "Não pode ser empurrado ou derrubado",
      "Especial — Retaliação:",
      "Inimigos que atacam corpo a corpo:",
      "sofrem 1d6 dano contundente",
      "Você não se move — você é o obstáculo."
    ],
    "examples": [],
    "related": [
      "terra",
      "empurrado",
      "defesa",
      "rd",
      "ressonancia"
    ],
    "keywords": [
      "corpo de rocha",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado"
    ]
  },
  {
    "id": "colosso-de-ferro",
    "title": "Colosso de Ferro",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você assume uma forma massiva de metal.",
    "description": "Você assume uma forma massiva de metal.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Corpo de Metal",
    "tags": [
      "Tank",
      "Anti-tudo",
      "Controle",
      "Contra-ataque"
    ],
    "mechanics": [
      "Recebe:",
      "+2 Defesa",
      "RD 5",
      "Penalidade:",
      "−6m deslocamento",
      "Especial — Inamovível:",
      "Não pode ser movido, derrubado ou deslocado por efeitos externos",
      "Especial — Absorção Total:",
      "1x por rodada:",
      "reduz todo o dano de um ataque em 2d6",
      "Especial — Impacto Pesado:",
      "Se estiver parado no turno:",
      "seu próximo ataque causa +2d6 dano",
      "Você deixa de ser um humano resistindo — você se torna parte da Terra, parte Metal."
    ],
    "examples": [],
    "related": [
      "terra",
      "deslocado",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "colosso de ferro",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "deslocado"
    ]
  },
  {
    "id": "tremor",
    "title": "Tremor",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você faz o solo tremer sob seus inimigos, desestabilizando seus movimentos.",
    "description": "Você faz o solo tremer sob seus inimigos, desestabilizando seus movimentos.",
    "grade": "1",
    "type": "Área",
    "action": "Padrão",
    "range": "6m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Controle",
      "Queda",
      "Terreno"
    ],
    "mechanics": [
      "Área: 3m",
      "Criaturas na área sofrem 1d6 de dano",
      "Devem realizar teste de Agilidade:",
      "falha: ficam Caídas",
      "Especial — Solo Instável:",
      "A área se torna terreno instável até o próximo turno:",
      "qualquer criatura que se mova dentro dela deve passar em teste de Agilidade ou fica Caída",
      "A terra não apenas treme — ela se torna imprevisível."
    ],
    "examples": [],
    "related": [
      "terra",
      "instavel",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "tremor",
      "terra",
      "área"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "abalo-continuo",
    "title": "Abalo Contínuo",
    "category": "habilidades",
    "element": "terra",
    "summary": "O tremor se mantém ativo por mais tempo.",
    "description": "O tremor se mantém ativo por mais tempo.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Tremor",
    "tags": [
      "Controle contínuo",
      "Zona",
      "Pressão"
    ],
    "mechanics": [
      "Dano: 1d6",
      "Duração da área: 2 rodadas",
      "Teste:",
      "falha: Caído",
      "sucesso: sofre −1 em testes de ataque",
      "Especial — Instabilidade:",
      "Criaturas que começarem o turno na área:",
      "devem fazer novo teste ou ficam Caídas",
      "O chão não para de se mover — ninguém se sente seguro."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "abalo contínuo",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido"
    ]
  },
  {
    "id": "fissura-sismica",
    "title": "Fissura Sísmica",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você rompe o solo, criando rachaduras perigosas.",
    "description": "Você rompe o solo, criando rachaduras perigosas.",
    "grade": "3",
    "type": null,
    "action": "3 rodadas",
    "range": null,
    "duration": "3 rodadas",
    "prerequisite": "Abalo Contínuo",
    "tags": [
      "Controle",
      "Área",
      "Setup de dano"
    ],
    "mechanics": [
      "Dano: 2d6",
      "Área: 6m",
      "Especial — Ruptura:",
      "Alvos que falharem:",
      "ficam Caídos",
      "sofrem −2 Defesa",
      "Especial — Fissuras:",
      "Mover-se na área causa 1d6 dano adicional",
      "Especial — Sinergia com Terra:",
      "Alvos Caídos recebem +1d6 dano de habilidades de Terra",
      "O solo se abre — e cada passo vira um risco."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "defesa",
      "ressonancia"
    ],
    "keywords": [
      "fissura sísmica",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido"
    ]
  },
  {
    "id": "colapso-sismico",
    "title": "Colapso Sísmico",
    "category": "habilidades",
    "element": "terra",
    "summary": "Você causa um colapso massivo no terreno.",
    "description": "Você causa um colapso massivo no terreno.",
    "grade": "4",
    "type": null,
    "action": "3 rodadas",
    "range": null,
    "duration": "3 rodadas",
    "prerequisite": "Fissura Sísmica",
    "tags": [
      "Controle total",
      "Zona",
      "Combo",
      "Anti-mobilidade"
    ],
    "mechanics": [
      "Dano: 2d6",
      "Área: 6m",
      "Especial — Colapso Inicial:",
      "Todos os alvos devem testar:",
      "falha: ficam Caídos e sofrem −2 Defesa",
      "Especial — Zona de Ruína:",
      "Área causa:",
      "1d6 dano por rodada",
      "terreno difícil",
      "risco de queda constante",
      "Especial — Execução Sísmica:",
      "Alvos Caídos:",
      "sofrem +2d6 dano adicional de Terra",
      "O chão deixa de ser confiável — ele se torna uma arma."
    ],
    "examples": [],
    "related": [
      "terra",
      "caido",
      "defesa",
      "ressonancia",
      "terreno-dificil"
    ],
    "keywords": [
      "colapso sísmico",
      "terra"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "caido"
    ]
  },
  {
    "id": "rajada-de-vento",
    "title": "Rajada de Vento",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você dispara uma rajada concentrada de vento contra o alvo.",
    "description": "Você dispara uma rajada concentrada de vento contra o alvo.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Reposicionamento",
      "Setup"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "O alvo deve passar em teste de Força:",
      "falha: é empurrado 3m",
      "Especial — Leveza:",
      "Você recebe +1 no próximo teste de ataque contra esse alvo",
      "Especial — Reposicionamento:",
      "Se o alvo colidir com outro inimigo:",
      "ambos sofrem 1d4 de dano",
      "O vento não destrói — ele desloca e cria oportunidades."
    ],
    "examples": [],
    "related": [
      "vento",
      "empurrado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "rajada de vento",
      "vento",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "empurrado"
    ]
  },
  {
    "id": "corrente-de-ar",
    "title": "Corrente de Ar",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você melhora o fluxo do vento, tornando-o mais controlado.",
    "description": "Você melhora o fluxo do vento, tornando-o mais controlado.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Rajada de Vento",
    "tags": [
      "Controle leve",
      "Posicionamento",
      "Tático"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Empurra 4,5m",
      "Especial — Direcionamento:",
      "Você pode escolher a direção do empurrão (não apenas para trás)",
      "Especial — Instabilidade:",
      "Se o alvo falhar:",
      "sofre −1 Defesa até o próximo turno",
      "O vento passa a ser guiado com precisão."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "corrente de ar",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "fluxo-cortante",
    "title": "Fluxo Cortante",
    "category": "habilidades",
    "element": "vento",
    "summary": "A rajada se torna mais afiada e estratégica.",
    "description": "A rajada se torna mais afiada e estratégica.",
    "grade": "3",
    "type": null,
    "action": "Se o alvo já foi movido neste turno:",
    "range": null,
    "duration": null,
    "prerequisite": "Corrente de Ar",
    "tags": [
      "Anti-defesa",
      "Mobilidade",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Empurra 4,5m",
      "Especial — Corte de Vento:",
      "Ignora +1 Defesa do alvo",
      "Especial — Movimento Forçado:",
      "Se o alvo se mover após ser atingido:",
      "sofre 1d6 dano adicional",
      "Especial — Combinação:",
      "Se o alvo já foi movido neste turno:",
      "recebe +1d6 dano",
      "O vento deixa de ser só força — ele se torna precisão letal."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "fluxo cortante",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "tempestade-direcionada",
    "title": "Tempestade Direcionada",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você controla múltiplas correntes de vento simultaneamente.",
    "description": "Você controla múltiplas correntes de vento simultaneamente.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Fluxo Cortante",
    "tags": [
      "Multi-alvo",
      "Controle",
      "Setup",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Você pode afetar até 3 alvos em até 12m",
      "Empurra cada alvo 4,5m",
      "Especial — Controle Total:",
      "Pode reposicionar cada alvo em direções diferentes",
      "Especial — Caos Aéreo:",
      "Se um alvo colidir com outro:",
      "ambos sofrem 2d6 dano",
      "Especial — Ritmo de Combate:",
      "Para cada alvo atingido:",
      "recebe +1 em testes até o próximo turno (máx. +3)",
      "Você não dispara vento — você manipula o campo de batalha inteiro."
    ],
    "examples": [],
    "related": [
      "vento",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "tempestade direcionada",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "passo-do-vento",
    "title": "Passo do Vento",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você acelera seu corpo com correntes de vento, tornando seus movimentos mais rápidos.",
    "description": "Você acelera seu corpo com correntes de vento, tornando seus movimentos mais rápidos.",
    "grade": "1",
    "type": "Mobilidade",
    "action": "Livre",
    "range": "Pessoal",
    "duration": "2 rodadas",
    "prerequisite": null,
    "tags": [
      "Mobilidade",
      "Multi-ataque",
      "Ritmo"
    ],
    "mechanics": [
      "Recebe:",
      "+6m de deslocamento",
      "pode realizar 1 Ataque Leve adicional por turno",
      "(Ataque Leve: causa dano normal, mas não recebe bônus de habilidades)",
      "Especial — Fluidez:",
      "Após atacar, pode se mover 1,5m sem provocar ataque de oportunidade",
      "O vento não te move — ele te faz agir mais rápido."
    ],
    "examples": [],
    "related": [
      "vento",
      "ressonancia",
      "ataque-de-oportunidade",
      "pr"
    ],
    "keywords": [
      "passo do vento",
      "vento",
      "mobilidade"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "ritmo-acelerado",
    "title": "Ritmo Acelerado",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você entra em um fluxo constante de ataques rápidos.",
    "description": "Você entra em um fluxo constante de ataques rápidos.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Passo do Vento",
    "tags": [
      "Combo",
      "Multi-hit",
      "Mobilidade"
    ],
    "mechanics": [
      "Recebe:",
      "+6m deslocamento",
      "+1 Ataque Leve adicional",
      "Especial — Sequência:",
      "Se acertar dois ataques no turno:",
      "recebe +1 no próximo ataque",
      "Especial — Movimento Contínuo:",
      "Pode dividir seu deslocamento entre ataques",
      "Seus movimentos começam a se conectar em sequência."
    ],
    "examples": [],
    "related": [
      "vento",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "ritmo acelerado",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "danca-dos-ventos",
    "title": "Dança dos Ventos",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você transforma velocidade em ofensiva constante.",
    "description": "Você transforma velocidade em ofensiva constante.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Ritmo Acelerado",
    "tags": [
      "Multi-hit",
      "Escala",
      "Evasão"
    ],
    "mechanics": [
      "Recebe:",
      "+9m deslocamento",
      "+2 Ataques Leves adicionais",
      "Especial — Pressão:",
      "Cada ataque consecutivo no mesmo alvo:",
      "recebe +1 dano cumulativo (máx. +3)",
      "Especial — Intocável:",
      "Após atacar:",
      "recebe +1 Defesa até o próximo turno",
      "Você não luta em turnos — você flui entre ações."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "dança dos ventos",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "tempestade-de-golpes",
    "title": "Tempestade de Golpes",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você atinge uma velocidade absurda, atacando múltiplas vezes em um instante.",
    "description": "Você atinge uma velocidade absurda, atacando múltiplas vezes em um instante.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Dança dos Ventos",
    "tags": [
      "Multi-hit extremo",
      "Combo",
      "Execução"
    ],
    "mechanics": [
      "Recebe:",
      "+9m deslocamento",
      "+3 Ataques Leves adicionais",
      "Especial — Execução Rápida:",
      "Se atingir o mesmo alvo 3 vezes no turno:",
      "causa +2d6 dano adicional",
      "Especial — Movimento Fantasma:",
      "Pode se mover entre ataques sem provocar ataques de oportunidade",
      "Especial — Pressão Total:",
      "Cada ataque após o primeiro recebe +1 no teste de ataque",
      "Você não é mais um combatente — é uma rajada contínua de golpes."
    ],
    "examples": [],
    "related": [
      "vento",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "tempestade de golpes",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "corte-de-ar",
    "title": "Corte de Ar",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você dispara uma lâmina de ar comprimido extremamente precisa.",
    "description": "Você dispara uma lâmina de ar comprimido extremamente precisa.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "15m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Precisão",
      "Anti-defesa leve"
    ],
    "mechanics": [
      "Causa 2d6 de dano cortante",
      "Especial — Precisão:",
      "Recebe +1 no teste de ataque",
      "Especial — Ponto Fraco:",
      "Se atingir um alvo que não se moveu no último turno:",
      "causa +1d6 dano adicional",
      "O vento se afia em silêncio — rápido e certeiro."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "corte de ar",
      "vento",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "lamina-direcionada",
    "title": "Lâmina Direcionada",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você passa a controlar melhor a trajetória do corte.",
    "description": "Você passa a controlar melhor a trajetória do corte.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Corte de Ar",
    "tags": [
      "Precisão",
      "Execução",
      "Anti-defesa"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Recebe +2 no teste de ataque",
      "Especial — Corte Guiado:",
      "Ignora −1 penalidades de cobertura ou Defesa",
      "Especial — Execução Leve:",
      "Se o alvo estiver com menos de 50% PV:",
      "causa +1d6 dano adicional",
      "A lâmina de ar encontra seu alvo, mesmo com obstáculos."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pv",
      "pr"
    ],
    "keywords": [
      "lâmina direcionada",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "fenda-de-vento",
    "title": "Fenda de Vento",
    "category": "habilidades",
    "element": "vento",
    "summary": "O corte se torna mais profundo e difícil de resistir.",
    "description": "O corte se torna mais profundo e difícil de resistir.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Lâmina Direcionada",
    "tags": [
      "Burst",
      "Anti-defesa",
      "Execução"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Recebe +2 no ataque",
      "Especial — Corte Profundo:",
      "Ignora +2 Defesa do alvo",
      "Especial — Sangramento de Ar:",
      "Se acertar:",
      "o alvo sofre 1d6 dano adicional no próximo turno",
      "Especial — Caçador de Movimento:",
      "Se o alvo se moveu no turno anterior:",
      "recebe +1d6 dano",
      "O vento não só corta — ele atravessa."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "fenda de vento",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "lamina-do-vacuo",
    "title": "Lâmina do Vácuo",
    "category": "habilidades",
    "element": "vento",
    "summary": "Você cria um corte tão preciso que rasga o próprio ar.",
    "description": "Você cria um corte tão preciso que rasga o próprio ar.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Fenda de Vento",
    "tags": [
      "Sniper",
      "Execução",
      "Multi-hit leve"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Recebe +3 no teste de ataque",
      "Especial — Corte Absoluto:",
      "Ignora +3 Defesa",
      "Especial — Execução:",
      "Se o alvo estiver abaixo de 50% PV:",
      "causa +2d6 dano adicional",
      "Especial — Corte Instantâneo:",
      "Se atingir:",
      "pode realizar um segundo ataque contra o mesmo alvo com −2 no teste",
      "O golpe é tão preciso que parece inevitável."
    ],
    "examples": [],
    "related": [
      "vento",
      "defesa",
      "ressonancia",
      "pv",
      "pr"
    ],
    "keywords": [
      "lâmina do vácuo",
      "vento"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "descarga-eletrica",
    "title": "Descarga Elétrica",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você dispara uma descarga elétrica que percorre o corpo do alvo, interferindo em seus movimentos.",
    "description": "Você dispara uma descarga elétrica que percorre o corpo do alvo, interferindo em seus movimentos.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Debuff",
      "Interferência"
    ],
    "mechanics": [
      "Causa 2d6 de dano elétrico",
      "O alvo deve passar em teste de Vigor:",
      "falha: sofre −2 em testes de ataque até o próximo turno",
      "Especial — Interferência:",
      "Se o alvo falhar:",
      "sofre −1 em todos os testes (não acumula)",
      "A eletricidade não apenas fere — ela desregula o corpo."
    ],
    "examples": [],
    "related": [
      "energia",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "descarga elétrica",
      "energia",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "sobrecarga",
    "title": "Sobrecarga",
    "category": "habilidades",
    "element": "energia",
    "summary": "A energia começa a se acumular no corpo do alvo.",
    "description": "A energia começa a se acumular no corpo do alvo.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Descarga Elétrica",
    "tags": [
      "Debuff",
      "Setup",
      "Cadeia leve"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Se falhar no teste:",
      "sofre −2 em testes",
      "e fica Sobrecarregado",
      "Sobrecarregado:",
      "Se sofrer outro efeito de Energia:",
      "recebe +1d6 dano adicional",
      "Especial — Cadeia Fraca:",
      "Um segundo alvo próximo (até 3m):",
      "sofre 1d6 de dano",
      "A eletricidade começa a se acumular — preparando algo pior."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarregado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "sobrecarga",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "sobrecarregado"
    ]
  },
  {
    "id": "corrente-instavel",
    "title": "Corrente Instável",
    "category": "habilidades",
    "element": "energia",
    "summary": "A descarga passa a saltar entre alvos e desestabilizar o campo.",
    "description": "A descarga passa a saltar entre alvos e desestabilizar o campo.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Sobrecarga",
    "tags": [
      "Multi-alvo",
      "Debuff pesado",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Pode atingir até 2 alvos adicionais próximos (3m entre si)",
      "Especial — Instabilidade:",
      "Alvos afetados sofrem:",
      "−2 em testes",
      "−1 ação leve no próximo turno",
      "Especial — Reação em Cadeia:",
      "Alvos Sobrecarregados:",
      "recebem +2d6 dano adicional",
      "A energia salta de corpo em corpo, desorganizando tudo."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarregado",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "corrente instável",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "sobrecarregado"
    ]
  },
  {
    "id": "colapso-eletrico",
    "title": "Colapso Elétrico",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você provoca uma falha total no sistema do alvo.",
    "description": "Você provoca uma falha total no sistema do alvo.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Corrente Instável",
    "tags": [
      "Controle pesado",
      "Debuff",
      "Execução"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Afeta até 3 alvos",
      "Especial — Colapso:",
      "Alvos devem testar:",
      "falha: ficam Atordoados (perdem ação padrão) por 1 rodada",
      "sucesso: sofrem −2 em testes",
      "Especial — Sobrecarga Total:",
      "Alvos Sobrecarregados:",
      "automaticamente falham no teste",
      "sofrem +2d6 dano adicional",
      "Especial — Ruptura de Ritmo:",
      "Após usar:",
      "você recebe +1 ação leve no próximo turno",
      "A energia deixa de ser descarga — vira falha completa do corpo."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "sobrecarregado",
      "atordoado",
      "rd",
      "ressonancia",
      "acao-padrao",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "colapso elétrico",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel",
      "sobrecarregado",
      "atordoado"
    ]
  },
  {
    "id": "campo-energetico",
    "title": "Campo Energético",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você cria um campo de energia instável que absorve e distorce impactos.",
    "description": "Você cria um campo de energia instável que absorve e distorce impactos.",
    "grade": "1",
    "type": "Defesa",
    "action": "Padrão",
    "range": "Pessoal",
    "duration": "3 rodadas",
    "prerequisite": null,
    "tags": [
      "Defesa",
      "Contra-ataque",
      "Setup"
    ],
    "mechanics": [
      "Recebe:",
      "RD 2",
      "Especial — Interferência:",
      "Quando sofre dano:",
      "o atacante sofre −1 em testes até o próximo turno",
      "Especial — Carga Residual:",
      "Se for atingido:",
      "seu próximo ataque causa +1d6 dano elétrico",
      "A energia não só protege — ela responde."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "defesa",
      "rd",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "campo energético",
      "energia",
      "defesa"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "campo-reativo",
    "title": "Campo Reativo",
    "category": "habilidades",
    "element": "energia",
    "summary": "O campo passa a reagir diretamente aos ataques recebidos.",
    "description": "O campo passa a reagir diretamente aos ataques recebidos.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Campo Energético",
    "tags": [
      "Retaliação",
      "Debuff",
      "Anti-agressão"
    ],
    "mechanics": [
      "Recebe:",
      "RD 2",
      "Especial — Retorno Elétrico:",
      "Quando sofrer ataque corpo a corpo:",
      "o atacante sofre 1d6 dano elétrico",
      "Especial — Instabilidade:",
      "Atacantes afetados ficam:",
      "−1 em testes",
      "Especial — Sobrecarga:",
      "Se o mesmo inimigo te atacar duas vezes no turno:",
      "ele fica Sobrecarregado",
      "Atacar você passa a ser perigoso."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarregado",
      "rd",
      "ressonancia"
    ],
    "keywords": [
      "campo reativo",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "sobrecarregado"
    ]
  },
  {
    "id": "campo-de-interferencia",
    "title": "Campo de Interferência",
    "category": "habilidades",
    "element": "energia",
    "summary": "O campo começa a afetar o fluxo de ações ao redor.",
    "description": "O campo começa a afetar o fluxo de ações ao redor.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Campo Reativo",
    "tags": [
      "Controle",
      "Anti-ação",
      "Zona"
    ],
    "mechanics": [
      "Recebe:",
      "RD 3",
      "Especial — Zona Instável:",
      "Inimigos adjacentes sofrem:",
      "−2 em testes",
      "Especial — Quebra de Ritmo:",
      "Se um inimigo falhar em um teste dentro da área:",
      "perde 1 ação leve",
      "Especial — Sinergia Elétrica:",
      "Inimigos Sobrecarregados na área:",
      "sofrem 1d6 dano por rodada",
      "O espaço ao seu redor se torna instável e imprevisível."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "sobrecarregado",
      "rd",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "campo de interferência",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel",
      "sobrecarregado"
    ]
  },
  {
    "id": "nucleo-de-sobrecarga",
    "title": "Núcleo de Sobrecarga",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você se torna o centro de um campo elétrico altamente instável.",
    "description": "Você se torna o centro de um campo elétrico altamente instável.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Campo de Interferência",
    "tags": [
      "Defesa ativa",
      "Controle pesado",
      "Contra-ataque"
    ],
    "mechanics": [
      "Recebe:",
      "RD 3",
      "Especial — Descarga Automática:",
      "Sempre que sofrer dano:",
      "causa 1d6 dano elétrico em todos inimigos adjacentes",
      "Especial — Colapso Reativo:",
      "1x por rodada, ao ser atingido:",
      "pode forçar o atacante a fazer teste de Vigor:",
      "falha: fica Atordoado (perde ação padrão)",
      "sucesso: sofre −2 em testes",
      "Especial — Sobrecarga Total:",
      "Inimigos Sobrecarregados próximos:",
      "sofrem +2d6 dano ao serem atingidos por qualquer efeito de Energia",
      "Você não está mais se defendendo — você é um campo elétrico vivo."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "sobrecarregado",
      "atordoado",
      "defesa",
      "rd",
      "ressonancia",
      "acao-padrao",
      "pr"
    ],
    "keywords": [
      "núcleo de sobrecarga",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel",
      "sobrecarregado",
      "atordoado"
    ]
  },
  {
    "id": "pulso-arcano",
    "title": "Pulso Arcano",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você libera uma onda de energia instável que distorce o fluxo dos corpos ao redor.",
    "description": "Você libera uma onda de energia instável que distorce o fluxo dos corpos ao redor.",
    "grade": "1",
    "type": "Área",
    "action": "Padrão",
    "range": "6m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Área",
      "Debuff",
      "Setup"
    ],
    "mechanics": [
      "Área: 3m ao redor",
      "Criaturas na área sofrem 2d6 de dano elétrico",
      "Devem realizar teste de Vigor:",
      "falha: sofrem −1 em testes até o próximo turno",
      "Especial — Interferência em Massa:",
      "Se 2 ou mais inimigos forem atingidos:",
      "todos sofrem −1 adicional em testes (total −2)",
      "A energia não explode — ela desorganiza tudo ao redor."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "pulso arcano",
      "energia",
      "área"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel"
    ]
  },
  {
    "id": "pulso-instavel",
    "title": "Pulso Instável",
    "category": "habilidades",
    "element": "energia",
    "summary": "A explosão passa a causar instabilidade persistente.",
    "description": "A explosão passa a causar instabilidade persistente.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Pulso Arcano",
    "tags": [
      "Área",
      "Debuff",
      "Setup forte"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Teste:",
      "falha: sofre −2 em testes",
      "Especial — Sobrecarga em Área:",
      "Alvos que falharem:",
      "ficam Sobrecarregados",
      "Especial — Eco Elétrico:",
      "No início do próximo turno:",
      "sofrem 1d6 dano adicional",
      "A energia não some — ela permanece vibrando no corpo."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarregado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "pulso instável",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "sobrecarregado"
    ]
  },
  {
    "id": "ruptura-energetica",
    "title": "Ruptura Energética",
    "category": "habilidades",
    "element": "energia",
    "summary": "A energia liberada causa falhas mais severas no controle corporal.",
    "description": "A energia liberada causa falhas mais severas no controle corporal.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Pulso Instável",
    "tags": [
      "Controle",
      "Área",
      "Anti-ação"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Especial — Colapso Parcial:",
      "Alvos devem testar:",
      "falha: sofrem",
      "−2 em testes",
      "perdem 1 ação leve",
      "Especial — Reação em Cadeia:",
      "Alvos Sobrecarregados:",
      "sofrem +2d6 dano adicional",
      "Especial — Campo Instável:",
      "Área permanece por 1 rodada:",
      "inimigos dentro sofrem −1 em testes",
      "A energia rompe o ritmo do combate."
    ],
    "examples": [],
    "related": [
      "energia",
      "instavel",
      "sobrecarregado",
      "rd",
      "ressonancia",
      "acao-leve"
    ],
    "keywords": [
      "ruptura energética",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "instavel",
      "sobrecarregado"
    ]
  },
  {
    "id": "colapso-arcano",
    "title": "Colapso Arcano",
    "category": "habilidades",
    "element": "energia",
    "summary": "Você libera uma explosão que desorganiza completamente os alvos.",
    "description": "Você libera uma explosão que desorganiza completamente os alvos.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Ruptura Energética",
    "tags": [
      "Área",
      "Controle pesado",
      "Execução"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Especial — Colapso Total:",
      "Alvos devem testar:",
      "falha: ficam Atordoados (perdem ação padrão) por 1 rodada",
      "sucesso: sofrem −2 em testes",
      "Especial — Sobrecarga Total:",
      "Alvos Sobrecarregados:",
      "automaticamente falham",
      "sofrem +2d6 dano adicional",
      "Especial — Zona de Interferência:",
      "Área permanece por 2 rodadas:",
      "inimigos sofrem",
      "−1 em testes",
      "risco de perder 1 ação leve ao falhar testes",
      "A energia entra em colapso — e leva tudo junto."
    ],
    "examples": [],
    "related": [
      "energia",
      "sobrecarregado",
      "atordoado",
      "rd",
      "ressonancia",
      "acao-padrao",
      "acao-leve"
    ],
    "keywords": [
      "colapso arcano",
      "energia"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "sobrecarregado",
      "atordoado"
    ]
  },
  {
    "id": "toque-congelante",
    "title": "Toque Congelante",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você canaliza frio intenso diretamente no corpo do alvo, desacelerando seus movimentos.",
    "description": "Você canaliza frio intenso diretamente no corpo do alvo, desacelerando seus movimentos.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "Toque",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Ataque",
      "Controle leve",
      "Setup"
    ],
    "mechanics": [
      "Causa 2d6 de dano de frio",
      "O alvo sofre:",
      "−3m de deslocamento por 1 rodada",
      "Especial — Resfriamento:",
      "Se o alvo já estiver com penalidade de movimento:",
      "sofre −1 adicional em testes de Agilidade",
      "O frio não fere rápido — ele desacelera."
    ],
    "examples": [],
    "related": [
      "frio",
      "ressonancia"
    ],
    "keywords": [
      "toque congelante",
      "frio",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "congelamento-parcial",
    "title": "Congelamento Parcial",
    "category": "habilidades",
    "element": "frio",
    "summary": "O frio começa a afetar a mobilidade de forma mais severa.",
    "description": "O frio começa a afetar a mobilidade de forma mais severa.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Toque Congelante",
    "tags": [
      "Controle",
      "Debuff",
      "Acúmulo"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "O alvo sofre:",
      "−6m de deslocamento",
      "Especial — Rigidez:",
      "Se falhar em teste de Vigor:",
      "sofre −1 em testes",
      "Especial — Acúmulo de Frio:",
      "Se for afetado novamente por Frio:",
      "fica Lento (−1 ação leve)",
      "Os movimentos ficam pesados, como se o corpo travasse."
    ],
    "examples": [],
    "related": [
      "frio",
      "lento",
      "ressonancia",
      "acao-leve"
    ],
    "keywords": [
      "congelamento parcial",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "lento"
    ]
  },
  {
    "id": "prisao-gelida",
    "title": "Prisão Gélida",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você começa a prender o alvo com gelo sólido.",
    "description": "Você começa a prender o alvo com gelo sólido.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Congelamento Parcial",
    "tags": [
      "Controle forte",
      "Setup",
      "Burst"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Teste de Vigor:",
      "falha: fica Imobilizado por 1 rodada",
      "sucesso: sofre −6m deslocamento",
      "Especial — Fragilidade Congelada:",
      "Alvos Imobilizados:",
      "recebem +1d6 dano de qualquer ataque",
      "Especial — Quebra:",
      "Se um alvo Imobilizado sofrer dano alto (3d6 ou mais):",
      "sofre +1d6 adicional (quebra do gelo)",
      "O gelo prende — e depois quebra."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "prisão gélida",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "congelamento-total",
    "title": "Congelamento Total",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você leva o frio ao limite, travando completamente o alvo.",
    "description": "Você leva o frio ao limite, travando completamente o alvo.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Prisão Gélida",
    "tags": [
      "Controle máximo",
      "Execução",
      "Burst"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Teste de Vigor:",
      "falha: fica Congelado (Imobilizado + perde ação padrão) por 1 rodada",
      "sucesso: fica Imobilizado",
      "Especial — Estado Frágil:",
      "Alvos Congelados:",
      "recebem +2d6 dano adicional",
      "Especial — Ruptura Gélida:",
      "Quando o efeito termina:",
      "o alvo sofre 1d6 dano adicional",
      "O frio vence — o corpo simplesmente para."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "congelado",
      "rd",
      "ressonancia",
      "acao-padrao",
      "pr"
    ],
    "keywords": [
      "congelamento total",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado",
      "congelado"
    ]
  },
  {
    "id": "arma-de-gelo",
    "title": "Arma de Gelo",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você cria uma arma de gelo moldada pela sua vontade — lâmina, lança, martelo ou qualquer forma simples.",
    "description": "Você cria uma arma de gelo moldada pela sua vontade — lâmina, lança, martelo ou qualquer forma simples.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": "12m ou corpo a corpo",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Versátil",
      "Ataque",
      "Controle leve"
    ],
    "mechanics": [
      "Causa 2d6 de dano (escolha ao usar: cortante, perfurante ou impacto) + frio",
      "Especial — Forma Adaptável:",
      "Escolha um efeito ao criar a arma:",
      "Cortante: recebe +1 no teste de ataque",
      "Perfurante: ignora −1 Defesa do alvo",
      "Impacto: causa +2 dano fixo",
      "Especial — Resfriamento:",
      "O alvo sofre −3m de deslocamento por 1 rodada",
      "O gelo se molda à sua intenção — preciso e letal."
    ],
    "examples": [],
    "related": [
      "frio",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "arma de gelo",
      "frio",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "arsenal-gelido",
    "title": "Arsenal Gélido",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você cria armas mais eficientes e rápidas.",
    "description": "Você cria armas mais eficientes e rápidas.",
    "grade": "2",
    "type": null,
    "action": "Se atingir:",
    "range": null,
    "duration": null,
    "prerequisite": "Arma de Gelo",
    "tags": [
      "Versatilidade",
      "Combo",
      "Pressão"
    ],
    "mechanics": [
      "Causa 2d6 de dano",
      "Especial — Forma Aprimorada:",
      "Escolha dois efeitos ao invés de um",
      "Especial — Fragmentação:",
      "Se atingir:",
      "causa 1d4 dano adicional no próximo turno",
      "Especial — Acúmulo de Frio:",
      "Se o alvo já estiver afetado por Frio:",
      "sofre −1 em testes",
      "O gelo começa a se fragmentar dentro do alvo."
    ],
    "examples": [],
    "related": [
      "frio",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "arsenal gélido",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "arma-cristalina",
    "title": "Arma Cristalina",
    "category": "habilidades",
    "element": "frio",
    "summary": "Sua arma se torna mais densa e perigosa.",
    "description": "Sua arma se torna mais densa e perigosa.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arsenal Gélido",
    "tags": [
      "Burst",
      "Anti-defesa",
      "Combo"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Especial — Perfuração Fria:",
      "Ignora +2 Defesa",
      "Especial — Ruptura:",
      "Se o alvo estiver Imobilizado ou com movimento reduzido:",
      "sofre +2d6 dano adicional",
      "Especial — Quebra Gélida:",
      "Após o ataque:",
      "causa 1d6 dano em inimigos adjacentes",
      "O gelo endurece — e quebra com violência."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "defesa",
      "ressonancia"
    ],
    "keywords": [
      "arma cristalina",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "arsenal-glacial",
    "title": "Arsenal Glacial",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você cria múltiplas armas de gelo simultaneamente.",
    "description": "Você cria múltiplas armas de gelo simultaneamente.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Arma Cristalina",
    "tags": [
      "Multi-hit",
      "Execução",
      "Área leve"
    ],
    "mechanics": [
      "Causa 3d6 de dano",
      "Pode realizar 2 ataques (mesmo alvo ou diferentes)",
      "Especial — Execução Congelada:",
      "Se o alvo estiver:",
      "Lento → +1d6 dano",
      "Imobilizado → +2d6 dano",
      "Congelado → +3d6 dano",
      "Especial — Estilhaçamento:",
      "Se um alvo for derrotado:",
      "causa 2d6 dano em área (3m)",
      "Especial — Pressão Gélida:",
      "Alvos atingidos sofrem:",
      "−3m movimento",
      "e risco de ficar Lento (teste de Vigor)",
      "O gelo deixa de ser arma — vira um arsenal inteiro."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "lento",
      "congelado",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "arsenal glacial",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado",
      "lento",
      "congelado"
    ]
  },
  {
    "id": "prisao-de-gelo",
    "title": "Prisão de Gelo",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você envolve o alvo em gelo, restringindo seus movimentos.",
    "description": "Você envolve o alvo em gelo, restringindo seus movimentos.",
    "grade": "1",
    "type": "Controle",
    "action": "Padrão",
    "range": "9m",
    "duration": null,
    "prerequisite": null,
    "tags": [
      "Controle",
      "Setup"
    ],
    "mechanics": [
      "O alvo deve realizar teste de Força:",
      "falha: fica Imobilizado por 1 rodada",
      "sucesso: sofre −3m de deslocamento",
      "Especial — Rigidez:",
      "Enquanto Imobilizado:",
      "sofre −1 Defesa",
      "O gelo prende — e começa a endurecer o corpo."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "prisão de gelo",
      "frio",
      "controle"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "carcere-gelido",
    "title": "Cárcere Gélido",
    "category": "habilidades",
    "element": "frio",
    "summary": "O gelo se torna mais resistente e opressivo.",
    "description": "O gelo se torna mais resistente e opressivo.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Prisão de Gelo",
    "tags": [
      "Controle contínuo",
      "Setup de dano"
    ],
    "mechanics": [
      "Teste de Força:",
      "falha: fica Imobilizado por 2 rodadas",
      "sucesso: fica Lento (−1 ação leve)",
      "Especial — Pressão Fria:",
      "Alvos Imobilizados sofrem:",
      "1d6 dano por rodada",
      "Especial — Fragilidade:",
      "Alvos sob efeito:",
      "recebem +1d6 dano de ataques",
      "O gelo não apenas prende — ele pressiona."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "lento",
      "ressonancia",
      "acao-leve",
      "pr"
    ],
    "keywords": [
      "cárcere gélido",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado",
      "lento"
    ]
  },
  {
    "id": "prisao-cristalina",
    "title": "Prisão Cristalina",
    "category": "habilidades",
    "element": "frio",
    "summary": "O gelo se solidifica completamente ao redor do alvo.",
    "description": "O gelo se solidifica completamente ao redor do alvo.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Cárcere Gélido",
    "tags": [
      "Controle forte",
      "Anti-escape",
      "Burst"
    ],
    "mechanics": [
      "Teste de Força:",
      "falha: fica Imobilizado por 2 rodadas",
      "sucesso: fica Imobilizado por 1 rodada",
      "Especial — Blindagem Gélida:",
      "Para sair antes do tempo:",
      "o alvo deve causar 10 de dano ao gelo",
      "Especial — Ruptura:",
      "Quando o gelo é quebrado:",
      "o alvo sofre 2d6 dano adicional",
      "Especial — Vulnerabilidade:",
      "Enquanto preso:",
      "sofre −2 Defesa",
      "O gelo vira uma prisão real — sólida e resistente."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "defesa",
      "ressonancia",
      "pr"
    ],
    "keywords": [
      "prisão cristalina",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado"
    ]
  },
  {
    "id": "sepultamento-glacial",
    "title": "Sepultamento Glacial",
    "category": "habilidades",
    "element": "frio",
    "summary": "Você aprisiona completamente o alvo em gelo denso.",
    "description": "Você aprisiona completamente o alvo em gelo denso.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Prisão Cristalina",
    "tags": [
      "Controle máximo",
      "Execução",
      "Área"
    ],
    "mechanics": [
      "Teste de Força:",
      "falha: fica Congelado (Imobilizado + perde ação padrão) por 1 rodada",
      "sucesso: fica Imobilizado por 1 rodada",
      "Especial — Núcleo Frágil:",
      "Enquanto Congelado:",
      "sofre +2d6 dano adicional",
      "Especial — Estilhaçamento:",
      "Quando o efeito termina ou é quebrado:",
      "causa 2d6 dano em área (3m)",
      "Especial — Execução Glacial:",
      "Se o alvo for derrotado enquanto congelado:",
      "cria uma área de gelo (3m) que reduz −3m movimento por 2 rodadas",
      "O alvo deixa de lutar — vira parte do gelo."
    ],
    "examples": [],
    "related": [
      "frio",
      "imobilizado",
      "congelado",
      "rd",
      "ressonancia",
      "acao-padrao",
      "pr"
    ],
    "keywords": [
      "sepultamento glacial",
      "frio"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": [
      "imobilizado",
      "congelado"
    ]
  },
  {
    "id": "golpe-brutal",
    "title": "Golpe Brutal",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Você realiza um golpe direto com força total.",
    "description": "Você realiza um golpe direto com força total.",
    "grade": "1",
    "type": "Ataque",
    "action": "Padrão",
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Causa +2d6 dano físico",
      "Especial — Impacto:",
      "Se atingir:",
      "alvo sofre −1 Defesa"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "defesa"
    ],
    "keywords": [
      "golpe brutal",
      "forca-inata",
      "ataque"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "forca-descomunal",
    "title": "Força Descomunal",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Seu corpo começa a ultrapassar limites humanos.",
    "description": "Seu corpo começa a ultrapassar limites humanos.",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Golpe Brutal",
    "tags": [],
    "mechanics": [
      "Ataques causam:",
      "+2d6 dano",
      "+2 dano fixo",
      "Especial — Quebra:",
      "Ignora 1 Defesa do alvo"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "defesa"
    ],
    "keywords": [
      "força descomunal",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "investida-devastadora",
    "title": "Investida Devastadora",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Você usa o próprio corpo como arma.",
    "description": "Você usa o próprio corpo como arma.",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Força Descomunal",
    "tags": [],
    "mechanics": [
      "Move-se até 6m e ataca:",
      "causa 3d6 dano",
      "Especial — Colisão:",
      "Se empurrar o alvo contra algo:",
      "causa +2d6 dano adicional"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "pr"
    ],
    "keywords": [
      "investida devastadora",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "massacre-corporal",
    "title": "Massacre Corporal",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Você entra em um estado de pura violência física.",
    "description": "Você entra em um estado de pura violência física.",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": "Investida Devastadora",
    "tags": [],
    "mechanics": [
      "Durante 2 rodadas:",
      "recebe +2 ataques por turno",
      "ataques causam +2d6 dano",
      "Especial — Execução Física:",
      "Se o alvo estiver abaixo de 50% PV:",
      "causa +2d6 dano adicional",
      "Resistência Inata"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "pv"
    ],
    "keywords": [
      "massacre corporal",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "corpo-endurecido",
    "title": "Corpo Endurecido",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Habilidade de forca-inata.",
    "description": "Habilidade estruturada do elemento forca-inata.",
    "grade": "1",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe RD 2"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "rd"
    ],
    "keywords": [
      "corpo endurecido",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "resistencia-sobre-humana",
    "title": "Resistência Sobre-Humana",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "1x por turno: reduz +1d6 dano",
    "description": "1x por turno: reduz +1d6 dano",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe RD 3"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "rd"
    ],
    "keywords": [
      "resistência sobre-humana",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "corpo-inquebravel",
    "title": "Corpo Inquebrável",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "não pode ser derrubado",
    "description": "não pode ser derrubado",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe:",
      "RD 4"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "rd"
    ],
    "keywords": [
      "corpo inquebrável",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "tita-vivo",
    "title": "Titã Vivo",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "ignora efeitos de controle leve",
    "description": "ignora efeitos de controle leve",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe:",
      "RD 5",
      "1x por rodada: reduz dano em 2d6",
      "Velocidade Inata"
    ],
    "examples": [],
    "related": [
      "forca-inata",
      "rd"
    ],
    "keywords": [
      "titã vivo",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "reflexo-instintivo",
    "title": "Reflexo Instintivo",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "Recebe +1 ação leve",
    "description": "Recebe +1 ação leve",
    "grade": "1",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [],
    "examples": [],
    "related": [
      "forca-inata",
      "acao-leve"
    ],
    "keywords": [
      "reflexo instintivo",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "velocidade-sobre-humana",
    "title": "Velocidade Sobre-Humana",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "+1 ataque adicional",
    "description": "+1 ataque adicional",
    "grade": "2",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe:",
      "+3m deslocamento"
    ],
    "examples": [],
    "related": [
      "forca-inata"
    ],
    "keywords": [
      "velocidade sobre-humana",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "movimento-relampago",
    "title": "Movimento Relâmpago",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "se mover entre ataques",
    "description": "se mover entre ataques",
    "grade": "3",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Pode:",
      "ignorar reação inimiga"
    ],
    "examples": [],
    "related": [
      "forca-inata"
    ],
    "keywords": [
      "movimento relâmpago",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  },
  {
    "id": "fluxo-de-combate",
    "title": "Fluxo de Combate",
    "category": "habilidades",
    "element": "forca-inata",
    "summary": "+2 ataques adicionais",
    "description": "+2 ataques adicionais",
    "grade": "4",
    "type": null,
    "action": null,
    "range": null,
    "duration": null,
    "prerequisite": null,
    "tags": [],
    "mechanics": [
      "Recebe:",
      "Se acertar 3 ataques:",
      "+2d6 dano adicional"
    ],
    "examples": [],
    "related": [
      "forca-inata"
    ],
    "keywords": [
      "fluxo de combate",
      "forca-inata"
    ],
    "aliases": [],
    "status": "ok",
    "conditions": []
  }
];

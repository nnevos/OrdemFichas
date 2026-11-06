const SKILLS = {
  terra: {
    paths: [
      {
        name: "Caminho do Projétil",
        skills: [
          {
            name: "Projétil Rochoso",
            desc: "Você arremessa um fragmento de rocha com força bruta contra o alvo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6 contundente (+1d6 se o alvo estiver sob controle). Teste (Força): Se falhar, sofre -1 de Defesa até o próximo turno.",
            res: 1
          },
          {
            name: "Disparo Pesado",
            desc: "Você aumenta a densidade e o peso do projétil.",
            prereq: "Projétil Rochoso",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6 + 2 contundente. Teste (Força): Se falhar, sofre -2 de Defesa e é Empurrado 1,5m.",
            res: 2
          },
          {
            name: "Impacto Sísmico",
            desc: "O projétil carrega energia do solo, causando impacto ampliado.",
            prereq: "Disparo Pesado",
            type: "Ataque em área",
            range: "12m",
            effect: "Dano Principal: 3d6 (+2d6 se o alvo tiver penalidade na Defesa). Dano Adjacente: Inimigos colados ao alvo sofrem 1d6. Teste (Agilidade): Se falhar, o alvo principal fica Caído.",
            res: 3
          },
          {
            name: "Colapso de Metal",
            desc: "Você lança um projétil massivo metal que colapsa ao atingir o alvo.",
            prereq: "Impacto Sísmico",
            type: "Ataque em área",
            range: "12m",
            effect: " Dano: 3d6 (Ignora até 2 de RD) (+2d6 se o alvo estiver Caído). Teste (Resistência): Se falhar, fica Caído e com -2 de Defesa por 1 rodada.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Defesa",
        skills: [
          {
            name: "Pele de Pedra",
            desc: "Sua pele se endurece como rocha, reduzindo o impacto dos ataques.",
            prereq: "Nenhum",
            type: "Defesa",
            range: "Pessoal",
            effect: "• Bônus: +1 de Defesa. Resistência: RD 2 e +2 em testes contra Empurrão ou Queda. Penalidade: -3m de Deslocamento.",
            res: 1
          },
          {
            name: "Couraça Rochosa",
            desc: "A camada de pedra se torna mais espessa e eficiente.",
            prereq: "Pele de Pedra",
            type: "Defesa",
            range: "Pessoal",
            effect: "• Bônus: +1 de Defesa. Resistência: RD 3 e +2 em testes contra Empurrão ou Queda. Penalidade: -3m de Deslocamento. 1x/rodada reduz +1d6 dano. Se não se mover: +1 Defesa.",
            res: 2
          },
          {
            name: "Corpo de Rocha",
            desc: "Seu corpo se torna parcialmente mineral.",
            prereq: "Couraça Rochosa",
            type: "Defesa",
            range: "Pessoal",
            effect: "Bônus: +2 de Defesa. Resistência: RD 4 e Imunidade a ser Empurrado ou Derrubado. Contra-ataque: Inimigos que te acertarem corpo a corpo sofrem 1d6 de dano. Penalidade: -6m de Deslocamento.",
            res: 3
          },
          {
            name: "Colosso de Ferro",
            desc: "Você assume uma forma massiva de metal.",
            prereq: "Corpo de Rocha",
            type: "Defesa",
            range: "Pessoal",
            effect: "Bônus: +2 de Defesa. Resistência: RD 5 e Inamovível. Especial: 1x por rodada, reduz um ataque em 2d6. Combo: Se não se mover, seu próximo ataque causa +2d6 de dano. Penalidade: -6m de Deslocamento.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Tremor",
        skills: [
          {
            name: "Tremor",
            desc: "Você faz o solo tremer sob seus inimigos, desestabilizando seus movimentos.",
            prereq: "Nenhum",
            type: "Área",
            range: "6m",
            effect: "Área 3m. Dano: 1d6. Teste (Agilidade): Se falhar fica Caído. O solo torna-se terreno instável até o próximo turno.",
            res: 1
          },
          {
            name: "Abalo Contínuo",
            desc: "O tremor se mantém ativo por mais tempo.",
            prereq: "Tremor",
            type: "Área",
            range: "6m",
            effect: "Dano: 1d6. Duração: 2 rodadas. Teste (Agilidade): Se falhar fica Caído. Se tiver sucesso sofre -1 em ataques. Alvos que iniciarem o turno na área devem testar novamente.",
            res: 2
          },
          {
            name: "Fissura Sísmica",
            desc: "Você rompe o solo, criando rachaduras perigosas.",
            prereq: "Abalo Contínuo",
            type: "Área",
            range: "6m",
            effect: "Área 6m. Dano: 2d6. Duração: 3 rodadas. Teste (Agilidade): Se falhar fica Caído e com -2 de Defesa. Mover-se dentro da área causa +1d6 de dano adicional.",
            res: 3
          },
          {
            name: "Colapso Sísmico",
            desc: "Você causa um colapso massivo no terreno.",
            prereq: "Fissura Sísmica",
            type: "Área",
            range: "6m",
            effect: "Área 6m. Dano: 2d6. Duração: 3 rodadas. Zona de Colapso: Causa 1d6 por rodada. Teste (Agilidade): Se falhar fica Caído e com -2 de Defesa. Combo: Alvos Caídos sofrem +2d6 de dano de Terra.",
            res: 4
          }
        ]
      }
    ]
  },

  fogo: {
    paths: [
      {
        name: "Caminho da Chama Breve",
        skills: [
          {
            name: "Chama Breve",
            desc: "Você cria uma pequena explosão de fogo em direção a um alvo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "9m",
            effect: "Dano: 2d6 fogo (+1d6 se o alvo já estiver em chamas). Teste (Vigor): Se falhar, sofre 1d4 de dano de fogo no próximo turno.",
            res: 1
          },
          {
            name: "Chama Intensificada",
            desc: "O fogo se torna mais agressivo e persistente.",
            prereq: "Chama Breve",
            type: "Ataque",
            range: "9m",
            effect: "Dano Principal: 2d6 fogo. Dano Adjacente: Inimigos colados ao alvo sofrem 1d6. Teste (Vigor): Se falhar, sofre 1d6 de dano de fogo por 2 rodadas.",
            res: 2
          },
          {
            name: "Explosão Incandescente",
            desc: "Você transforma a chama em uma detonação instável.",
            prereq: "Chama Intensificada",
            type: "Ataque em área",
            range: "9m",
            effect: "Dano: 3d6 fogo (+2d6 se o alvo já estiver em chamas). Dano Adjacente: 1d6. Teste (Vigor): Se falhar, sofre 1d6 de dano de fogo por 2 rodadas.",
            res: 3
          },
          {
            name: "Incêndio Descontrolado",
            desc: "Você libera fogo de forma quase incontrolável, consumindo tudo ao redor.",
            prereq: "Explosão Incandescente",
            type: "Ataque em área",
            range: "9m",
            effect: "Área 3m. Dano: 3d6 fogo. Efeito: Todos na área sofrem 1d6 por 2 rodadas. Propagação: Alvos em chamas causam 1d6 aos seus adjacentes. Penalidade: Inimigos em chamas sofrem -1 em todos os testes.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Lâmina Flamejante",
        skills: [
          {
            name: "Lâmina Flamejante",
            desc: "Você envolve sua arma em chamas instáveis que reagem ao impacto.",
            prereq: "Nenhum",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "Ativação: Encanta sua arma com chamas, habilitando a mecânica de Combo. Bônus: +1d4 de fogo. Combo: Cada acerto consecutivo no mesmo alvo aumenta o dano em +1 (máx. +3). Se errar ou trocar de alvo, as chamas se apagam e o combo reinicia.",
            res: 1
          },
          {
            name: "Corte Incandescente",
            desc: "Seus ataques começam a liberar energia acumulada em golpes mais violentos.",
            prereq: "Lâmina Flamejante",
            type: "Aprimoramento",
            range: "Corpo a corpo",
            effect: "Requisito: Lâmina Flamejante ativa. Bônus: +1d6 de fogo. Finalizador de Combo: Ao atingir o 3º acerto consecutivo com a Lâmina ativa, causa +2d6 de dano e explode atingindo adjacentes com 1d6.",
            res: 2
          },
          {
            name: "Fúria Flamejante",
            desc: "Você entra em um estado agressivo onde o fogo responde à sua ofensiva constante.",
            prereq: "Corte Incandescente",
            type: "Aprimoramento",
            range: "Corpo a corpo",
            effect: "Requisito: Lâmina Flamejante ativa. Evolução de Combo: Enquanto mantiver o foco no mesmo alvo, o limite de dano da Lâmina sobe para +1d6 por acerto (máx. +3d6). Especial: Alvos sob seu foco sofrem 1d6 de fogo por rodada.",
            res: 3
          },
          {
            name: "Carnificina Ígnea",
            desc: "Você libera toda a energia acumulada em uma sequência devastadora de ataques.",
            prereq: "Fúria Flamejante",
            type: "Aprimoramento",
            range: "Corpo a corpo",
            effect: "Requisito: Lâmina Flamejante ativa. Massacre: 1x por turno, ao acertar o alvo do combo, pode realizar um ataque extra contra um inimigo adjacente. Combo Máximo: Alvos em chamas sofrem +2d6 adicionais. Expurgo: Causa 1d6 extra para cada acerto acumulado na sequência atual.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Onda de Calor",
        skills: [
          {
            name: "Onda de Calor",
            desc: "Você libera calor intenso ao seu redor, tornando o ambiente sufocante.",
            prereq: "Nenhum",
            type: "Controle",
            range: "Pessoal (aura 3m)",
            effect: "Aura (3m). Dano: 1d6 fogo por rodada. Teste (Vigor): Se falhar, sofre -1 em todos os testes. Persistência: Permanecer 2 rodadas na área reduz o Deslocamento em -3m.",
            res: 1
          },
          {
            name: "Calor Crescente",
            desc: "O calor se intensifica conforme o combate se prolonga.",
            prereq: "Onda de Calor",
            type: "Controle",
            range: "Pessoal (aura 3m)",
            effect: "Aura (3m). Dano: 1d6+1 fogo por rodada. Penalidade: -2 em todos os testes dentro da área. Escalonamento: Cada rodada consecutiva que o inimigo passa na área aumenta o dano recebido em +1 (máx. +3).",
            res: 2
          },
          {
            name: "Zona de Combustão",
            desc: "O calor se torna tão intenso que começa a afetar o espaço ao redor.",
            prereq: "Calor Crescente",
            type: "Controle",
            range: "Pessoal (aura 6m)",
            effect: "Aura (6m). Dano: 1d6 fogo por rodada. Penalidade: -2 em todos os testes. Barreira de Calor: Entrar na área causa 1d6 de dano imediato. Combo: Alvos já em chamas sofrem +1d6 de dano extra por rodada.",
            res: 3
          },
          {
            name: "Inferno Localizado",
            desc: "Você transforma a área ao seu redor em um núcleo de calor extremo.",
            prereq: "Zona de Combustão",
            type: "Controle",
            range: "Pessoal (aura 6m)",
            effect: "Aura (6m). Duração: 4 rodadas. Dano: 2d6 fogo por rodada. Debuff: -2 em testes e -3m de Deslocamento. Combustão Instantânea: Inimigos em chamas sofrem +2d6 de dano imediato (1x por rodada). Suporte: Ataques de aliados dentro da área causam +1d6 de fogo.",
            res: 4
          }
        ]
      }
    ]
  },

  agua: {
    paths: [
      {
        name: "Caminho da Correnteza",
        skills: [
          {
            name: "Jato de Água",
            desc: "Você dispara um jato pressurizado de água contra um inimigo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6. Teste (Força): Se falhar, é Empurrado 3m. Estado: O alvo fica Encharcado até o próximo turno (-1 em testes físicos e habilita gatilhos de Água).",
            res: 1
          },
          {
            name: "Correnteza Forçada",
            desc: "O fluxo de água se torna mais forte e difícil de resistir.",
            prereq: "Jato de Água",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6. Efeito: Empurra 6m. Teste (Força): Se falhar, também fica Caído. Combo: Alvos Encharcados recebem +1d6 de dano e não podem resistir ao empurrão.",
            res: 2
          },
          {
            name: "Impacto Hidráulico",
            desc: "Você concentra pressão suficiente para causar impacto real.",
            prereq: "Correnteza Forçada",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 3d6. Efeito: Empurra 6m. Colisão: Se o alvo bater em algo, sofre +2d6 de dano. Atropelo: Criaturas no caminho do empurrão sofrem 1d6. Combo — Saturação: se o alvo já estiver Encharcado, fica Saturado até o próximo turno (-2 em testes físicos e conta como Encharcado).",
            res: 3
          },
          {
            name: "Torrente Devastadora",
            desc: "Você libera uma corrente massiva que domina o espaço e o movimento.",
            prereq: "Impacto Hidráulico",
            type: "Ataque em área",
            range: "Linha 12m",
            effect: "Área: Linha de 12m. Dano: 3d6 (Teste reduz à metade). Efeito: Todos são empurrados 6m. Combo: Alvos Encharcados são empurrados automaticamente e ficam Caídos. Mobilidade: Você pode se mover até 6m junto com a torrente.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Arsenal Hidrostático",
        skills: [
          {
            name: "Arsenal Hidrostático",
            desc: "Você molda água em uma arma de alta pressão e a dispara contra o alvo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6 perfurante. Teste (Vigor): Se falhar, sofre +1d6 de dano de implosão. Combo: Alvos Encharcados sofrem o dano de implosão automaticamente.",
            res: 1
          },
          {
            name: "Arma Compressiva",
            desc: "Você aumenta a densidade e multiplica suas construções de água.",
            prereq: "Arsenal Hidrostático",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6 direto e +2d6 de implosão. Multiplicar: Você pode criar e disparar 2 armas simultaneamente. Combo: Alvo Encharcado recebe +1d6 de dano adicional.",
            res: 2
          },
          {
            name: "Ruptura Hidrostática",
            desc: "Você domina a pressão interna, causando colapsos destrutivos dentro do alvo.",
            prereq: "Arma Compressiva",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 3d6 direto e +2d6 de implosão. Penalidade: Alvos atingidos sofrem -1 em testes físicos. Combo: Se o alvo já estiver sob efeito de implosão ou encharcado, sofre +2d6 de dano extra.",
            res: 3
          },
          {
            name: "Arsenal Abissal",
            desc: "Você cria múltiplas armas de água altamente instáveis.",
            prereq: "Ruptura Hidrostática",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 3d6 direto e +3d6 de implosão. Multiplicar: Você pode disparar até 3 armas. Combo: Contra alvos Encharcados, cada impacto aplica o dano de implosão completo. Execução: Causa +2d6 se o alvo estiver com menos de 50% do PV.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Maré Vital",
        skills: [
          {
            name: "Cura Fluida",
            desc: "Você canaliza água vital no alvo, restaurando seu fluxo interno.",
            prereq: "Nenhum",
            type: "Cura",
            range: "Toque",
            effect: "Cura: 2d6 + Intelecto. Escolha: Restaurar +1d6 PV, remover 1 condição leve ou conceder +1 em testes por 1 rodada. Combo: Se o alvo estiver Encharcado, recebe +1d6 de cura adicional.",
            res: 1
          },
          {
            name: "Corrente Restauradora",
            desc: "A energia passa a fluir entre múltiplos alvos.",
            prereq: "Cura Fluida",
            type: "Cura",
            range: "3m",
            effect: "Cura: 2d6 + Intelecto no alvo principal e metade desse valor em um aliado a até 3m. Suporte: Ambos os alvos recebem +1 de Defesa ou +1 em todos os testes por 1 rodada.",
            res: 2
          },
          {
            name: "Maré Vital",
            desc: "Você cria um fluxo contínuo de regeneração.",
            prereq: "Corrente Restauradora",
            type: "Cura",
            range: "Pessoal/Toque",
            effect: "Cura Imediata: 2d6 + Intelecto. Regeneração: O alvo recupera 1d6 PV por rodada durante 2 rodadas. Combo: Se estiver Encharcado, a cura contínua aumenta para 1d6+1.",
            res: 3
          },
          {
            name: "Maré da Vida",
            desc: "Você libera uma onda poderosa de energia vital, restaurando e fortalecendo aliados.",
            prereq: "Maré Vital",
            type: "Cura",
            range: "6m",
            effect: "Cura em Área: 3d6 + Intelecto. Purificação: Remove até 2 condições leves dos atingidos. Excedente: Alvos com PV máximo recebem um Escudo de 2d6. Combo: Alvos Encharcados recebem +1d6 de cura.",
            res: 4
          }
        ]
      }
    ]
  },

  vento: {
    paths: [
      {
        name: "Caminho da Rajada",
        skills: [
          {
            name: "Rajada de Vento",
            desc: "Você dispara uma rajada concentrada de vento contra o alvo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6. Teste (Força): Se falhar, é Empurrado 3m. Suporte: O próximo ataque contra o alvo recebe +1 de bônus. Colisão: Se o alvo bater em algo, ambos sofrem 1d4 de dano.",
            res: 1
          },
          {
            name: "Corrente de Ar",
            desc: "Você melhora o fluxo do vento, tornando-o mais controlado.",
            prereq: "Rajada de Vento",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6. Efeito: Empurra o alvo 4,5m na direção escolhida. Teste (Força): Se falhar, o alvo sofre -1 de Defesa até o seu próximo turno.",
            res: 2
          },
          {
            name: "Fluxo Cortante",
            desc: "A rajada se torna mais afiada e estratégica.",
            prereq: "Corrente de Ar",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 3d6. Efeito: Empurra 4,5m e ignora 1 ponto de Defesa. Combo: Causa +1d6 de dano se o alvo já tiver sido movido neste turno. Especial: Se o alvo se mover voluntariamente após ser atingido, sofre +1d6 de dano.",
            res: 3
          },
          {
            name: "Tempestade Direcionada",
            desc: "Você controla múltiplas correntes de vento simultaneamente.",
            prereq: "Fluxo Cortante",
            type: "Ataque em área",
            range: "12m",
            effect: "Multi-alvo: Ataca até 3 inimigos. Dano: 3d6 e Empurra 4,5m cada. Colisão: Se baterem em algo, ambos sofrem 2d6 de dano. Bônus: Você ganha +1 em todos os testes para cada alvo atingido (máx. +3) até o próximo turno.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Passo do Vento",
        skills: [
          {
            name: "Passo do Vento",
            desc: "Você acelera seu corpo com correntes de vento.",
            prereq: "Nenhum",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Bônus: +6m de Deslocamento e +1 Ação Leve por turno. Mobilidade: Após realizar um ataque, você pode se mover 1,5m sem provocar ataques de oportunidade.",
            res: 1
          },
          {
            name: "Ritmo Acelerado",
            desc: "Você entra em um fluxo constante de ataques rápidos.",
            prereq: "Passo do Vento",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Bônus: +6m de Deslocamento e +1 Ação Leve. Tática: Você pode dividir seu deslocamento livremente entre seus ataques. Combo: Se acertar dois ataques no mesmo turno, ganha +1 de bônus no próximo ataque.",
            res: 2
          },
          {
            name: "Dança dos Ventos",
            desc: "Você transforma velocidade em ofensiva constante.",
            prereq: "Ritmo Acelerado",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Bônus: +9m de Deslocamento e +2 Ações Leves. Combo: Ataques consecutivos no mesmo alvo somam +1 de dano (máx. +3). Defesa: Cada ataque realizado concede +1 de Defesa até o início do seu próximo turno.",
            res: 3
          },
          {
            name: "Tempestade de Golpes",
            desc: "Você atinge uma velocidade absurda, atacando múltiplas vezes em um instante.",
            prereq: "Dança dos Ventos",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Bônus: +9m de Deslocamento e +3 Ações Leves. Mobilidade: Você não provoca ataques de oportunidade ao se mover entre ataques. Precisão: Cada ataque realizado após o primeiro recebe +1 de acerto. Finalizador: Se acertar o mesmo alvo 3 vezes, causa +2d6 de dano extra.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Corte de Ar",
        skills: [
          {
            name: "Corte de Ar",
            desc: "Você dispara uma lâmina de ar comprimido extremamente precisa.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "15m",
            effect: "Dano: 2d6 cortante. Precisão: +1 no teste de ataque. Especial: Se o alvo não se moveu no último turno, sofre +1d6 de dano adicional.",
            res: 1
          },
          {
            name: "Lâmina Direcionada",
            desc: "Você passa a controlar melhor a trajetória do corte.",
            prereq: "Corte de Ar",
            type: "Ataque",
            range: "15m",
            effect: "Dano: 2d6. Precisão: +2 no teste de ataque. Tática: Ignora -1 de Defesa ou Cobertura do alvo. Execução: Causa +1d6 de dano se o alvo estiver com menos de 50% do PV.",
            res: 2
          },
          {
            name: "Fenda de Vento",
            desc: "O corte se torna mais profundo e difícil de resistir.",
            prereq: "Lâmina Direcionada",
            type: "Ataque",
            range: "15m",
            effect: "Dano: 3d6. Precisão: +2 no teste de ataque e ignora 2 pontos de Defesa. Persistência: O alvo sofre +1d6 de dano no início do próximo turno dele. Especial: Causa +1d6 se o alvo se moveu no turno anterior.",
            res: 3
          },
          {
            name: "Lâmina do Vácuo",
            desc: "Você cria um corte tão preciso que rasga o próprio ar.",
            prereq: "Fenda de Vento",
            type: "Ataque",
            range: "15m",
            effect: "Dano: 3d6. Precisão: +3 no teste de ataque e ignora 3 pontos de Defesa. Execução: Causa +2d6 de dano se o alvo estiver com menos de 50% do PV. Multi-ataque: Ao acertar, você pode realizar um segundo ataque imediato com -2 de penalidade.",
            res: 4
          }
        ]
      }
    ]
  },

  energia: {
    paths: [
      {
        name: "Caminho da Descarga Elétrica",
        skills: [
          {
            name: "Descarga Elétrica",
            desc: "Você dispara uma descarga elétrica que percorre o corpo do alvo, interferindo em seus movimentos.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6 elétrico. Teste (Vigor): Se falhar, sofre -2 em testes de ataque e -1 em todos os outros testes até o próximo turno.",
            res: 1
          },
          {
            name: "Sobrecarga",
            desc: "A energia começa a se acumular no corpo do alvo.",
            prereq: "Descarga Elétrica",
            type: "Ataque",
            range: "12m",
            effect: "Dano: 2d6. Arco Elétrico: Um segundo alvo a até 3m do original sofre 1d6 de dano. Teste (Vigor): Se falhar, sofre -2 em todos os testes e fica Sobrecarregado.",
            res: 2
          },
          {
            name: "Corrente Instável",
            desc: "A descarga passa a saltar entre alvos e desestabilizar o campo.",
            prereq: "Sobrecarga",
            type: "Ataque em área",
            range: "12m",
            effect: "Multi-alvo: Atinge o alvo principal e até 2 adicionais (a 3m entre si). Dano: 3d6. Debuff: Alvos sofrem -2 em testes e perdem 1 Ação Leve. Combo: Inimigos já Sobrecarregados sofrem +2d6 de dano extra.",
            res: 3
          },
          {
            name: "Colapso Elétrico",
            desc: "Você provoca uma falha total no sistema do alvo.",
            prereq: "Corrente Instável",
            type: "Ataque em área",
            range: "12m",
            effect: "Área: Até 3 alvos. Dano: 3d6. Teste (Vigor): Se falhar, fica Atordoado por 1 rodada. Se passar, sofre -2 em todos os testes. Combo: Alvos Sobrecarregados falham no teste automaticamente e sofrem +2d6 de dano.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Campo Energético",
        skills: [
          {
            name: "Campo Energético",
            desc: "Você cria um campo de energia instável que absorve e distorce impactos.",
            prereq: "Nenhum",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: RD 2. Punição: Ao sofrer dano, o atacante recebe -1 em todos os testes. Contra-ataque: Se você for atingido, seu próximo ataque causa +1d6 de dano elétrico.",
            res: 1
          },
          {
            name: "Campo Reativo",
            desc: "O campo passa a reagir diretamente aos ataques recebidos.",
            prereq: "Campo Energético",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: RD 2. Reação: Inimigos que realizarem ataques corpo a corpo contra você sofrem 1d6 de dano elétrico e -1 em testes. Combo: Se o mesmo inimigo atacar você duas vezes no mesmo turno, fica Sobrecarregado.",
            res: 2
          },
          {
            name: "Campo de Interferência",
            desc: "O campo começa a afetar o fluxo de ações ao redor.",
            prereq: "Campo Reativo",
            type: "Defesa",
            range: "Pessoal (aura 3m)",
            effect: "Aura (3m). Proteção: RD 3. Debuff: Inimigos na área sofrem -2 em todos os testes. Interferência: Se um inimigo falhar em um teste dentro da área, perde 1 Ação Leve. Passivo: Alvos Sobrecarregados sofrem 1d6 de dano por rodada na aura.",
            res: 3
          },
          {
            name: "Núcleo de Sobrecarga",
            desc: "Você se torna o centro de um campo elétrico altamente instável.",
            prereq: "Campo de Interferência",
            type: "Defesa",
            range: "Pessoal (aura 3m)",
            effect: "Aura (3m). Proteção: RD 3. Descarga: Inimigos que terminarem o turno adjacentes sofrem uma descarga elétrica (1d6). Colapso: Inimigos Sobrecarregados na área dobram as penalidades de testes e perdem 3m de Deslocamento.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Pulso Arcano",
        skills: [
          {
            name: "Pulso Arcano",
            desc: "Uma onda instável de energia que afeta múltiplos alvos e desorganiza seus testes.",
            prereq: "Nenhum",
            type: "Área",
            range: "6m",
            effect: "Área: 3m. Dano: 2d6 elétrico. Teste (Vigor): Se falhar, sofre -1 em todos os testes. Ressonância: Se atingir 2 ou mais alvos, a penalidade aumenta para -2.",
            res: 2
          },
          {
            name: "Pulso Instável",
            desc: "A explosão se torna mais persistente e aplica sobrecarga.",
            prereq: "Pulso Arcano",
            type: "Área",
            range: "6m",
            effect: "Área: 3m. Dano: 2d6 elétrico. Teste (Vigor): Se falhar, sofre -2 em todos os testes e fica Sobrecarregado. Eco: Alvos atingidos sofrem 1d6 de dano elétrico adicional no início do próximo turno deles.",
            res: 2
          },
          {
            name: "Ruptura Energética",
            desc: "A energia desorganiza o corpo e quebra o ritmo do alvo.",
            prereq: "Pulso Instável",
            type: "Área",
            range: "6m",
            effect: "Área: 3m. Dano: 3d6 elétrico. Debuff: Se falhar no teste, sofre -2 em testes e perde 1 Ação Leve. Combo: Alvos já Sobrecarregados sofrem +2d6 de dano. Persistência: A área do pulso torna-se terreno difícil e causa 1d6 a quem entrar por 1 rodada.",
            res: 3
          },
          {
            name: "Colapso Arcano",
            desc: "O pulso evolui para uma explosão que colapsa o sistema dos alvos afetados.",
            prereq: "Ruptura Energética",
            type: "Área",
            range: "6m",
            effect: "Área: 3m. Dano: 3d6 elétrico. Teste (Vigor): Se falhar, fica Atordoado por 1 rodada. Combo: Alvos Sobrecarregados falham no teste automaticamente e sofrem +2d6 de dano. Zona Estática: A área permanece instável por 2 rodadas, causando 1d6 de dano em quem terminar o turno nela.",
            res: 4
          }
        ]
      }
    ]
  },

  frio: {
    paths: [
      {
        name: "Caminho do Toque Congelante",
        skills: [
          {
            name: "Toque Congelante",
            desc: "Frio direto desacelerando movimento e preparando o alvo.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "Toque",
            effect: "Dano: 2d6 frio. Redução: O alvo sofre -3m de Deslocamento. Estado: Aplica uma penalidade leve de movimento até o início do seu próximo turno.",
            res: 1
          },
          {
            name: "Congelamento Parcial",
            desc: "O frio começa a afetar a mobilidade de forma mais severa.",
            prereq: "Toque Congelante",
            type: "Ataque",
            range: "Toque",
            effect: "Dano: 2d6. Redução: O alvo sofre -6m de Deslocamento. Teste (Vigor): Se falhar, recebe -1 em todos os testes e fica Lento (perde 1 ação leve).",
            res: 2
          },
          {
            name: "Prisão Gélida",
            desc: "Você começa a prender o alvo com gelo sólido.",
            prereq: "Congelamento Parcial",
            type: "Ataque",
            range: "Toque",
            effect: "Dano: 3d6. Teste (Vigor): Se falhar, fica Imobilizado por 1 rodada. Se passar, sofre apenas -6m de Deslocamento. Combo: O alvo Imobilizado torna-se vulnerável, recebendo +1d6 de dano de qualquer ataque.",
            res: 3
          },
          {
            name: "Congelamento Total",
            desc: "Você leva o frio ao limite, travando completamente o alvo.",
            prereq: "Prisão Gélida",
            type: "Ataque",
            range: "Toque",
            effect: "Dano: 3d6. Teste (Vigor): Se falhar, fica Congelado (Incapaz de agir) por 1 rodada. Se passar, fica Imobilizado. Combo: Alvos Congelados recebem +2d6 de dano. Finalizador: Ao descongelar, o alvo sofre +1d6 de dano de ruptura.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Arma de Gelo",
        skills: [
          {
            name: "Arma de Gelo",
            desc: "Você cria uma arma de gelo moldada pela sua vontade.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "12m / Corpo a corpo",
            effect: "Dano: 2d6 (Frio + Tipo Escolhido). Escolha: Cortante (+1 no acerto), Perfurante (Ignora 1 de Defesa) ou Impacto (+2 de dano). Redução: O alvo sofre -3m de Deslocamento.",
            res: 1
          },
          {
            name: "Arsenal Gélido",
            desc: "A arma de gelo evolui para versões mais adaptáveis e perigosas.",
            prereq: "Arma de Gelo",
            type: "Ataque",
            range: "12m / Corpo a corpo",
            effect: "Dano: 2d6 frio. Versatilidade: Você pode alternar a forma da arma entre ataques. Pressão: Ao atingir um alvo, estilhaços de gelo garantem +1 no próximo teste de ataque contra ele.",
            res: 2
          },
          {
            name: "Arma Cristalina",
            desc: "O gelo se torna mais denso, preciso e perigoso.",
            prereq: "Arsenal Gélido",
            type: "Ataque",
            range: "12m / Corpo a corpo",
            effect: "Dano: 3d6 frio. Tática: Ignora 2 pontos de Defesa. Combo: Alvos com Deslocamento reduzido ou Imobilizados sofrem +2d6 de dano. Fragmentação: Ao atingir um alvo, inimigos adjacentes sofrem 1d6 de dano de frio.",
            res: 3
          },
          {
            name: "Arsenal Glacial",
            desc: "Você domina múltiplas armas de gelo e pressão glacial.",
            prereq: "Arma Cristalina",
            type: "Ataque",
            range: "12m / Corpo a corpo",
            effect: "Ações: Você pode realizar 2 ataques por turno com suas armas de gelo. Dano: 3d6 frio por impacto. Execução: Causa +1d6 extra para cada condição de movimento negativa (Lento, Imobilizado) no alvo. Estilhaçar: Se derrotar um inimigo, ele explode causando 2d6 de dano de frio em área 3m.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Prisão de Gelo",
        skills: [
          {
            name: "Prisão de Gelo",
            desc: "Você envolve o alvo em gelo, limitando o movimento.",
            prereq: "Nenhum",
            type: "Controle",
            range: "9m",
            effect: "Teste (Força): Se falhar, fica Imobilizado. Se passar, sofre apenas -3m de Deslocamento. Debuff: O alvo sofre -1 de Defesa enquanto estiver sob o efeito do gelo.",
            res: 1
          },
          {
            name: "Cárcere Gélido",
            desc: "O gelo se torna mais resistente e opressivo.",
            prereq: "Prisão de Gelo",
            type: "Controle",
            range: "9m",
            effect: "Controle: O alvo fica Imobilizado por 2 rodadas (ou Lento se passar no teste). Dano Contínuo: Causa 1d6 de dano de frio por rodada. Combo: Alvos já presos ou imobilizados recebem +1d6 de dano adicional de qualquer fonte.",
            res: 2
          },
          {
            name: "Prisão Cristalina",
            desc: "A prisão se solidifica com resistência e potencial de ruptura.",
            prereq: "Cárcere Gélido",
            type: "Controle",
            range: "9m",
            effect: "Duração: Imobiliza o alvo por até 2 rodadas. Resistência: O gelo possui PV próprio e exige alto dano para ser quebrado de fora. Ruptura: Quando a prisão se rompe (por dano ou fim da duração), causa 2d6 de dano de frio imediato ao alvo.",
            res: 3
          },
          {
            name: "Sepultamento Glacial",
            desc: "O alvo é engolido pelo frio extremo e estilhaçamento.",
            prereq: "Prisão Cristalina",
            type: "Controle",
            range: "9m",
            effect: "Teste (Força): Se falhar, fica Congelado. Se passar, fica Imobilizado. Fragilidade: O alvo sofre +2d6 de dano de todos os ataques recebidos. Estilhaçar: Ao encerrar o efeito, a prisão explode causando 2d6 de dano de frio em todos os inimigos a até 3m.",
            res: 4
          }
        ]
      }
    ]
  },

  universais: {
    paths: [
      {
        name: "Caminho da Arma Imbuída",
        skills: [
          {
            name: "Embuir Arma",
            desc: "Você canaliza sua afinidade elemental para envolver uma arma empunhada com energia do elemento escolhido.",
            prereq: "Nenhum",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+1d6 dano elemental. Fogo: 1d4 próximo turno. Água: empurra 1,5m. Terra: +1 dano. Vento: +1 ataque. Energia: −1 ataque no alvo. Frio: −3m deslocamento.",
            res: 1
          },
          {
            name: "Arma Energizada",
            desc: "A energia elemental se torna mais densa e agressiva, reagindo com maior intensidade ao impacto.",
            prereq: "Embuir Arma",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+2d6 dano elemental. Efeitos aprimorados: Fogo 1d6, Água empurra 3m, Terra +2 dano, Vento +2 ataque, Energia −2 ataque, Frio −6m movimento. Dois acertos aplicam o efeito duas vezes.",
            res: 2
          },
          {
            name: "Arsenal Elemental",
            desc: "Você domina o fluxo elemental ao ponto de adaptá-lo em tempo real durante o combate.",
            prereq: "Arma Energizada",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+2d6 dano elemental. Troca de elemento 1x por rodada. Adjacentes sofrem 1d6. Efeitos secundários ficam mais fortes.",
            res: 3
          },
          {
            name: "Manifestação Bélica",
            desc: "Sua arma se torna um canal direto da força elemental, liberando energia a cada golpe.",
            prereq: "Arsenal Elemental",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+3d6 dano elemental. Ao acertar: 1d6 em área 3m. Troca livre de elemento. Se o alvo já estiver sob efeito elemental: +1d6.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Armadura Imbuída",
        skills: [
          {
            name: "Embuir Armadura",
            desc: "Você canaliza energia elemental para reforçar sua armadura ou o próprio corpo.",
            prereq: "Nenhum",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+2 Defesa. Fogo reflete 1d4 corpo a corpo. Água reduz 1d6 1x/rodada. Terra RD 2. Vento +3m. Energia +1 resistência. Frio: adjacentes sofrem −3m.",
            res: 1
          },
          {
            name: "Armadura Elemental",
            desc: "A energia se condensa, tornando a proteção mais consistente e reativa.",
            prereq: "Embuir Armadura",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+3 Defesa. Efeitos aprimorados: fogo 1d6 refletido, água reduz 1d6 2x, terra RD 3, vento +6m, energia +2 resistência, frio −6m em adjacentes.",
            res: 2
          },
          {
            name: "Núcleo Defensivo",
            desc: "Você estabiliza a energia ao redor do corpo, criando um núcleo constante de proteção e interferência.",
            prereq: "Armadura Elemental",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+3 Defesa e RD 3. Área 3m com efeito elemental para aliados e inimigos. Em Campo Elemental recebe +1 Defesa extra.",
            res: 3
          },
          {
            name: "Forma Elemental",
            desc: "Seu corpo se torna um canal direto do elemento, assumindo forma parcialmente transformada.",
            prereq: "Núcleo Defensivo",
            type: "Aprimoramento",
            range: "Pessoal",
            effect: "+4 Defesa, RD 5 e aura 3m com efeito elemental constante. Quando sofre dano, causa 1d6 elemental no atacante 1x/rodada.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho do Golpe Elemental",
        skills: [
          {
            name: "Golpe Elemental",
            desc: "Você concentra energia elemental em um único impacto instável.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "+2d6 dano elemental. Marca o alvo até o fim do próximo turno. Efeito adicional depende do elemento.",
            res: 1
          },
          {
            name: "Impacto Elemental",
            desc: "Você aprende a detonar a marca elemental no momento do impacto.",
            prereq: "Golpe Elemental",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "+2d6 dano elemental. Se o alvo estiver Marcado: consome a marca e causa +2d6, com efeito extra por elemento.",
            res: 2
          },
          {
            name: "Ruptura Elemental",
            desc: "Você rompe completamente o fluxo de energia do alvo.",
            prereq: "Impacto Elemental",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "+3d6 dano elemental, ignora 2 Defesa. Se o alvo estiver sob efeito elemental: +2d6 e prolonga efeitos em 1 rodada.",
            res: 3
          },
          {
            name: "Execução Elemental",
            desc: "Você transforma o estado do alvo em uma oportunidade de finalização absoluta.",
            prereq: "Ruptura Elemental",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "+3d6 dano elemental, ignora 3 Defesa. Marcado: +2d6. Sob efeito elemental: +2d6. Menos de 50% PV: +2d6 e efeito automático.",
            res: 4
          }
        ]
      }
    ]
  },

  forca: {
    paths: [
      {
        name: "Caminho do Golpe Brutal",
        skills: [
          {
            name: "Golpe Brutal",
            desc: "Golpe direto com força total.",
            prereq: "Nenhum",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "Dano: 2d6 físico. Debuff: O alvo sofre -1 de Defesa até o início do seu próximo turno.",
            res: 1
          },
          {
            name: "Força Descomunal",
            desc: "Corpo ultrapassa limites humanos.",
            prereq: "Golpe Brutal",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "Dano: 2d6 + 2 físico. Tática: Ignora 1 ponto de Defesa. Esmagar: Contra alvos com Defesa Pesada (ou Escudos), causa +1d6 de dano adicional.",
            res: 2
          },
          {
            name: "Investida Devastadora",
            desc: "Seu corpo vira uma arma em movimento.",
            prereq: "Força Descomunal",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "Mobilidade: Você pode se mover até 6m em linha reta como parte do ataque. Dano: 3d6 físico. Colisão: Se o alvo bater em uma estrutura ou outra criatura, sofre +2d6 de dano.",
            res: 3
          },
          {
            name: "Massacre Corporal",
            desc: "Estado de violência física total.",
            prereq: "Investida Devastadora",
            type: "Ataque",
            range: "Corpo a corpo",
            effect: "Estado (2 rodadas): Você ganha +2 ataques por turno e +2d6 de dano em todos os golpes. Execução: Alvos com menos de 50% de PV sofrem +2d6 de dano extra.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Resistência Inata",
        skills: [
          {
            name: "Corpo Endurecido",
            desc: "Pele e músculos endurecem absorvendo impactos.",
            prereq: "Nenhum",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: Você recebe RD 2 contra qualquer dano físico.",
            res: 1
          },
          {
            name: "Resistência Sobre-Humana",
            desc: "Corpo resiste danos além do limite humano.",
            prereq: "Corpo Endurecido",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: RD 3. Casca Grossa: 1x por turno, você pode reduzir o dano de um ataque recebido em +1d6 adicional.",
            res: 2
          },
          {
            name: "Corpo Inquebrável",
            desc: "Estrutura física não pode ser derrubada.",
            prereq: "Resistência Sobre-Humana",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: RD 4. Estabilidade: Você não pode ser derrubado ou movido contra sua vontade. Imunidade: Você é imune a condições de controle leve (como Lento ou Encharcado).",
            res: 3
          },
          {
            name: "Titã Vivo",
            desc: "Forma colossal praticamente indestrutível.",
            prereq: "Corpo Inquebrável",
            type: "Defesa",
            range: "Pessoal",
            effect: "Proteção: RD 5. Inabalável: Você ignora qualquer penalidade de movimento ou condições de controle leve. Absorção: 1x por rodada, você pode reduzir o dano de um impacto em 2d6.",
            res: 4
          }
        ]
      },
      {
        name: "Caminho da Velocidade Inata",
        skills: [
          {
            name: "Reflexo Instintivo",
            desc: "Reações instintivas aceleram seus movimentos.",
            prereq: "Nenhum",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Economia: Você ganha +1 Ação Leve por turno para usar com movimento ou utilitários.",
            res: 1
          },
          {
            name: "Velocidade Sobre-Humana",
            desc: "Movimento vira vantagem ofensiva.",
            prereq: "Reflexo Instintivo",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Ofensiva: Você ganha +1 ataque adicional por turno. Mobilidade: Seu Deslocamento base aumenta em +3m.",
            res: 2
          },
          {
            name: "Movimento Relâmpago",
            desc: "Movimento entre ataques sem reação inimiga.",
            prereq: "Velocidade Sobre-Humana",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Ofensiva: Você ganha +1 ataque adicional por turno (acumula com o anterior). Fluidez: Você pode se mover entre seus ataques sem provocar ataques de oportunidade.",
            res: 3
          },
          {
            name: "Fluxo de Combate",
            desc: "Movimento absoluto em combate.",
            prereq: "Movimento Relâmpago",
            type: "Mobilidade",
            range: "Pessoal",
            effect: "Ofensiva: Você ganha +2 ataques adicionais por turno. Finalizador: Se acertar o mesmo alvo 3 vezes, causa +2d6 de dano. Impulso: Se derrotar um inimigo em uma sequência, ganha +1 ataque extra imediato.",
            res: 4
          }
        ]
      }
    ]
  }
};

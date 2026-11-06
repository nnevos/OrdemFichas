// Pontos do livro que precisam de revisão humana; nenhum foi corrigido automaticamente.
export default [
  {
    "id": "atributos-pontos-iniciais",
    "severity": "medium",
    "topic": "Distribuição de atributos",
    "issue": "O livro diz “Começa com 4 pontos para distribuir” e também “Todos os atributos começam em 1”; falta explicitar com precisão o limite inicial e a conversão ao reduzir para 0.",
    "references": [
      "atributos"
    ]
  },
  {
    "id": "defesa-formula",
    "severity": "high",
    "topic": "Defesa",
    "issue": "Defesa é central e aparece em armaduras, condições e habilidades, mas não há fórmula-base consolidada de Defesa.",
    "references": [
      "defesa",
      "armaduras"
    ]
  },
  {
    "id": "pd-recuperacao",
    "severity": "medium",
    "topic": "Recuperação de Pontos de Determinação",
    "issue": "O custo de uso de PD foi consolidado em V15.39; ainda falta definir uma regra global de recuperação/descanso de PD.",
    "references": [
      "pd"
    ]
  },
  {
    "id": "acao-economia-observacao",
    "severity": "low",
    "topic": "Economia de ações",
    "issue": "Economia de ações foi consolidada em V15.39. Revisar em playtest se o limite padrão de 2 Ações Livres por turno está adequado.",
    "references": [
      "acao-padrao",
      "acao-livre",
      "acao-leve",
      "movimento"
    ]
  },
  {
    "id": "ataque-formula",
    "severity": "high",
    "topic": "Teste de ataque",
    "issue": "Bônus, Defesa e penalidades são citados, mas não há uma fórmula geral consolidada para resolver ataques.",
    "references": [
      "ataque",
      "defesa"
    ]
  },
  {
    "id": "contra-ataque-balanceamento",
    "severity": "low",
    "topic": "Contra-Ataque",
    "issue": "Regra da mesa V15.39 usa ataque normal e metade do dano final. Monitorar em playtest o custo de PD em contra-ataques com habilidades.",
    "references": [
      "contra-ataque"
    ]
  },
  {
    "id": "encharcado-balanceamento",
    "severity": "low",
    "topic": "Encharcado",
    "issue": "V15.39 consolidou Encharcado como -1 em testes físicos e gatilho de combos de Água. Validar em playtest se a penalidade está adequada.",
    "references": [
      "encharcado",
      "jato-de-agua"
    ]
  },
  {
    "id": "ataque-leve-observacao",
    "severity": "low",
    "topic": "Ataque Leve / Ação Leve",
    "issue": "V15.39 separou Ataque Leve de Ação Leve. Validar as habilidades de multi-ataque de Vento contra o dano médio esperado.",
    "references": [
      "passo-do-vento",
      "acao-leve"
    ]
  },
  {
    "id": "colosso-requisito",
    "severity": "medium",
    "topic": "Colosso de Ferro",
    "issue": "O requisito aparece como “Corpo de Metal”, enquanto a habilidade anterior da linha é “Corpo de Rocha”. Provável inconsistência nominal.",
    "references": [
      "colosso-de-ferro",
      "corpo-de-rocha"
    ]
  },
  {
    "id": "nucleo-defensivo-duplicado",
    "severity": "low",
    "topic": "Núcleo Defensivo",
    "issue": "Existem duas habilidades chamadas Núcleo Defensivo em linhas Universais diferentes (Armadura Imbuída e Barreira Elemental), com efeitos distintos. IDs precisam ser desambiguados.",
    "references": [
      "nucleo-defensivo-universal"
    ]
  },
  {
    "id": "pulso-arcano-grau",
    "severity": "medium",
    "topic": "Pulso Arcano",
    "issue": "Em versões anteriores/dados do site Pulso Arcano aparece com Grau/RES 2, enquanto no livro atual ele está como Grau de Ressonância 1.",
    "references": [
      "pulso-arcano"
    ]
  },
  {
    "id": "critico-geral",
    "severity": "medium",
    "topic": "Crítico",
    "issue": "Existem regras de crítico para Ressonância e Esquiva, mas não uma regra geral de crítico de ataque.",
    "references": [
      "critico"
    ]
  },
  {
    "id": "cobertura-geral",
    "severity": "medium",
    "topic": "Cobertura",
    "issue": "Cobertura é citada em habilidades, mas faltam regras gerais de bônus e tipos de cobertura.",
    "references": [
      "cobertura"
    ]
  },
  {
    "id": "oportunidade-geral",
    "severity": "medium",
    "topic": "Ataque de oportunidade",
    "issue": "Diversas habilidades removem ataques de oportunidade, mas o gatilho e a resolução base não são definidos globalmente.",
    "references": [
      "ataque-de-oportunidade"
    ]
  },
  {
    "id": "rd-acumulo",
    "severity": "medium",
    "topic": "Redução de Dano",
    "issue": "Falta definir se múltiplas fontes de RD acumulam e a ordem de aplicação com reduções em dados.",
    "references": [
      "rd"
    ]
  },
  {
    "id": "status-duracoes",
    "severity": "medium",
    "topic": "Duração dos status",
    "issue": "Vários status da tabela final não possuem duração/recuperação global e dependem da habilidade. Isso deve ser explicitado na UI.",
    "references": [
      "acumulo-de-status",
      "remocao-de-status"
    ]
  }
  ,{
    "id":"esquiva-taxa-sucesso", "severity":"high", "topic":"Esquiva",
    "issue":"A regra foi limitada a 1 Reação por rodada e não se aplica genericamente a áreas. Medir taxa de sucesso de Esquiva por faixa de AGI; se permanecer acima de 65% contra ataques equivalentes, revisar dificuldades ou acesso a bônus.",
    "references":["esquiva","reacao"]
  },
  {
    "id":"dano-combos-multi-hit", "severity":"high", "topic":"Combos e multi-hit",
    "issue":"Habilidades de Grau 3/4 podem somar múltiplos d6, execução e multi-hit. O analisador de balanceamento deve sinalizar dano/PD e multiplicadores para revisão humana, sem nerf automático.",
    "references":["combos","skill-tree"]
  }
];

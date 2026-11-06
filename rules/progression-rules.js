export default [
  {
    "id":"progressao-de-classe", "title":"Progressão de Classe", "category":"personagem",
    "summary":"Além dos ganhos numéricos por nível, a progressão possui marcos de escolhas.",
    "description":"Além dos ganhos de PV, PD e PR, os marcos de progressão geram escolhas explícitas na ficha.",
    "mechanics":[
      "Nível 1: Habilidade de Trilha + acesso à Skill Tree.",
      "Níveis 2, 6 e 9: Poder da Classe — catálogo ainda precisa de definição final; a ficha marca como pendência em vez de inventar bônus.",
      "Níveis 3 e 7: Aumento de Atributo — +1 em um atributo, máximo 5.",
      "Nível 4: Grau de Treinamento — escolha duas perícias treinadas e eleve o bônus de +5 para +10.",
      "Níveis 5 e 10: nova Habilidade de Trilha, sem repetir a já escolhida.",
      "Nível 8: Versatilidade — escolha 1 habilidade inicial de outra Trilha da mesma Classe, sem liberar a progressão daquela Trilha."
    ],
    "examples":[], "related":["combatente","especialista","arcanista-elemental"],
    "keywords":["nível","nivel","progressão","progressao","aumento de atributo","grau de treinamento","versatilidade"], "aliases":[], "status":"ok",
    "note":"Níveis 2, 6 e 9 continuam pendentes apenas quanto ao catálogo oficial de Poderes de Classe."
  },
  {
    "id":"ganhos-numericos-por-nivel", "title":"Ganhos Numéricos por Nível", "category":"personagem",
    "summary":"Ganhos automáticos por classe ao subir ou reduzir nível.", "description":"A ficha recalcula esses ganhos ao alterar o nível.",
    "mechanics":[
      "Combatente: +4 PV + VIG, +3 PD e +2 PR por novo nível.",
      "Especialista: +3 PV + VIG, +3 PD e +2 PR por novo nível.",
      "Arcanista Elemental: +2 PV + VIG, +4 PD e +2 PR por novo nível."
    ],
    "examples":[], "related":["pd","pr","pv"], "keywords":["pv por nível","pd por nível","pr por nível"], "aliases":[], "status":"ok"
  }
];

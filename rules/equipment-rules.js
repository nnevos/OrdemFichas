export default [
  {
    "id": "armas",
    "title": "Armas",
    "category": "equipamentos",
    "summary": "Categorias de armas e seus danos, alcances e propriedades.",
    "description": "Categorias de armas e seus danos, alcances e propriedades.",
    "mechanics": [],
    "examples": [],
    "related": [
      "alcance",
      "ataque"
    ],
    "keywords": [
      "arma",
      "armas"
    ],
    "aliases": [],
    "status": "ok",
    "items": [
      {
        "name": "Arma de Corte Pequena",
        "type": "Corpo a corpo",
        "damage": "1d4",
        "range": "—",
        "properties": "Leve, pode ser usada com uma mão"
      },
      {
        "name": "Arma de Corte Média",
        "type": "Corpo a corpo",
        "damage": "1d6",
        "range": "—",
        "properties": "Versátil"
      },
      {
        "name": "Arma de Corte Grande",
        "type": "Corpo a corpo",
        "damage": "1d12",
        "range": "—",
        "properties": "Duas mãos"
      },
      {
        "name": "Arma de Concussão Pequena",
        "type": "Corpo a corpo",
        "damage": "1d4",
        "range": "—",
        "properties": "Leve"
      },
      {
        "name": "Arma de Concussão Média",
        "type": "Corpo a corpo",
        "damage": "1d6",
        "range": "—",
        "properties": "Pode atordoar em situações narrativas"
      },
      {
        "name": "Arma de Concussão Grande",
        "type": "Corpo a corpo",
        "damage": "1d12",
        "range": "—",
        "properties": "Duas mãos"
      },
      {
        "name": "Arma de Fogo Pequena",
        "type": "Distância",
        "damage": "1d6",
        "range": "Curto",
        "properties": "Leve, recarga"
      },
      {
        "name": "Arma de Fogo Média",
        "type": "Distância",
        "damage": "1d8",
        "range": "Médio",
        "properties": "Recarga"
      },
      {
        "name": "Arma de Fogo Grande",
        "type": "Distância",
        "damage": "1d12",
        "range": "Longo",
        "properties": "Duas mãos, recarga"
      },
      {
        "name": "Arco Curto",
        "type": "Distância",
        "damage": "1d6",
        "range": "Médio",
        "properties": "Disparos rápidos"
      },
      {
        "name": "Arco Longo",
        "type": "Distância",
        "damage": "1d8",
        "range": "Longo",
        "properties": "Alta precisão"
      },
      {
        "name": "Arma Arcana (Curto Alcance)",
        "type": "Elemental",
        "damage": "1d6",
        "range": "Curto",
        "properties": "Canaliza elemento"
      },
      {
        "name": "Arma Arcana (Médio Alcance)",
        "type": "Elemental",
        "damage": "1d8",
        "range": "Médio",
        "properties": "Canaliza elemento"
      },
      {
        "name": "Arma Arcana (Longo Alcance)",
        "type": "Elemental",
        "damage": "1d12",
        "range": "Longo",
        "properties": "Canalização avançada"
      }
    ]
  },
  {
    "id": "armaduras",
    "title": "Armaduras",
    "category": "equipamentos",
    "summary": "Categorias de armadura, bônus de Defesa e limites de Agilidade.",
    "description": "Categorias de armadura, bônus de Defesa e limites de Agilidade.",
    "mechanics": [],
    "examples": [],
    "related": [
      "defesa",
      "agilidade"
    ],
    "keywords": [
      "armadura",
      "proteção",
      "protecao"
    ],
    "aliases": [],
    "status": "ok",
    "items": [
      {
        "name": "Sem Armadura",
        "defense": "+0",
        "agilityModifier": "total",
        "properties": "Nenhuma proteção",
        "examples": "roupas comuns"
      },
      {
        "name": "Armadura Leve",
        "defense": "+2",
        "agilityModifier": "total",
        "properties": "Mobilidade alta",
        "examples": "couro, tecido reforçado"
      },
      {
        "name": "Armadura Média",
        "defense": "+4",
        "agilityModifier": "máx +2",
        "properties": "Proteção equilibrada",
        "examples": "cota de malha, placas leves"
      },
      {
        "name": "Armadura Pesada",
        "defense": "+6",
        "agilityModifier": "0",
        "properties": "Alta proteção",
        "examples": "armadura completa, placas pesadas"
      },
      {
        "name": "Armadura Tecnológica",
        "defense": "+5",
        "agilityModifier": "máx +2",
        "properties": "Equipamentos avançados",
        "examples": "exotraje"
      },
      {
        "name": "Armadura Arcana",
        "defense": "+4",
        "agilityModifier": "total",
        "properties": "Canaliza energia elemental",
        "examples": "criada por magia especifica"
      }
    ]
  }
];

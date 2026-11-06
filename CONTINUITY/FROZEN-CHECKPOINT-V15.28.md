# FROZEN CHECKPOINT — V15.28

## Objetivo
Fechar o fluxo Esquiva -> Contra-Ataque e tornar PD um custo real de uso das habilidades.

## Implementado
- Contra-Ataque do Player continua sendo liberado somente depois de uma Esquiva bem-sucedida.
- Contra-Ataque aplica 50% do dano rolado, arredondado para baixo, conforme regra de mesa solicitada.
- Habilidade usada no Contra-Ataque cobra o mesmo PD de seu uso normal.
- Custo padrao de habilidade: RES 1/2/3/4 -> 1/2/3/4 PD.
- 96/96 habilidades em `skills-data.js` possuem RES valido entre 1 e 4.
- Cartoes exibem custo em PD e sinalizam PD insuficiente.
- Modal de uso mostra PD atual/custo e o custo nao e mais editavel pelo Player.
- Migration V13 cobra PD atomicamente no momento em que o uso e confirmado, antes da reacao do inimigo.
- Reacao posterior nao cobra PD novamente.
- Requests legados V15.27 continuam compativeis.

## Validacao
- 88/88 testes passando.
- `node --check` nos JS alterados.
- `check:inline-events`: 41 arquivos sem handlers inline.

## Migration
Aplicar `supabase-migration-v13-pd-counterattack.sql` apos V12.

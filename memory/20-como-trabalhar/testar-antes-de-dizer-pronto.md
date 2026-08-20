---
name: testar-antes-de-dizer-pronto
type: feedback
description: 11/08 — nunca dizer que algo esta pronto sem ter clicado nele; provar mostrando, nao afirmando
atualizado: 2026-08-11
---

O Theo pediu em 11/08/2026, cansado de ouvir "está pronto" e depois não conseguir
gerar o contrato: **"eu quero que você teste como está o sistema antes de me falar
que tá pronto."**

**Why:** ele já tinha ouvido de outra sessão que a máquina do contrato estava no
ar. Estava, e não funcionava: uma policy do cofre discordava da RPC e o clique
morria em erro cru. Código verde, teste verde e deploy feito não provam que a
coisa funciona pra quem usa; só o clique prova. Ver
[[bug-fiscal-nao-gerava-contrato]].

**How to apply:**

1. Antes de dizer "pronto", **clico no ar** e mostro o resultado (o PDF, a tela, o
   número gerado). Provar mostrando, não afirmando.
2. `tsc`, testes, lint e build são o mínimo, não a prova. Eles não pegam regra de
   permissão do banco, que é onde este projeto costuma quebrar.
3. Teste em produção com cuidado declarado: usar movimento que seja dele, desfazer
   o que criei no mesmo minuto (cancelar deixa rastro, e é assim que deve ser), e
   conferir antes qual pacote está servido, senão eu testo código velho
   ([[conferir-o-pacote-no-ar]]).
4. Antes de clicar, pensar em quem recebe consequência: o cobrador do Slack roda
   todo dia meio-dia e cobra quem gerou contrato sem subir o assinado. Teste que
   fica de pé vira mensagem pra pessoa de verdade.
5. Se não der pra testar (falta insumo de terceiro, por exemplo), eu digo
   exatamente isso, em vez de dizer que está pronto.

Ligações: [[conferir-o-pacote-no-ar]], [[bug-fiscal-nao-gerava-contrato]],
[[autonomia-total]], [[pedir-o-insumo-que-falta]].

---
name: testar-antes-de-dizer-pronto
type: feedback
description: 11/08 — nunca dizer que algo esta pronto sem ter clicado nele; provar mostrando, nao afirmando
atualizado: 2026-09-03
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

## 03/09/2026: migração que passa não é feature que funciona

O caso mais duro até agora, e ele custou um defeito em produção. Em 02/09 eu registrei a caixa de
observação como "banco pronto e provado": a migração aplicava, e a prova da cadeia passava sobre
banco com dado. Estava tudo verdade, e ainda assim havia **dois defeitos**, um deles fatal pra quem
pede.

O que os achou foi **um clique**. O primeiro pedido de verdade criado pela tela, em produção, com
uma observação escrita, num valor abaixo do piso da alçada. O gatilho da imutabilidade barrava a
própria escrita que cria a observação, e o formulário voltava com erro depois de a pessoa preencher
tudo. Detalhe em [[caixa-de-observacao]].

**A régua que sai daqui:** prova de migração cobre a **migração subir**. Ela não cobre o **caminho
da pessoa**. Enquanto ninguém percorre o caminho inteiro (tela → porta → banco → tela de volta), a
frente não está provada, só construída. E o caminho tem que incluir o caso mais comum, não o mais
fácil de montar: aqui, o pedido barato, que nasce aprovado na hora e por isso passa por um estado
que o caro nunca vê.

Corolário: quando não dá pra clicar (navegador fora, rede bloqueada), a frente fica **"construída,
não provada"** na passagem de bastão, com essas palavras. Não "pronta".

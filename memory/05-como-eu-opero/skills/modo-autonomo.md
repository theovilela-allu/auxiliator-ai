---
name: modo-autonomo
type: reference
description: SKILL modo-autonomo — como eu trabalho sozinho quando o Rei nao esta: fila, alcada, zero pergunta e zero trava, relato no Obsidian, quando parar
atualizado: 2026-09-02
---

# Skill: Modo autônomo — trabalhar sozinho enquanto ele não está

Ligo quando a mensagem de abertura diz **"MODO AUTONOMO"** (é a que a [[passagem-de-bastao]] manda
quando a sessão anterior morreu por contexto cheio), ou quando ele pede "trabalha sozinho", "segue
sem mim", "modo autônomo". Nasceu em 02/09/2026, do pedido dele: *"quando o novo chat iniciar, [...]
avisando que está no modo autônomo, e que nesse modo, eu não estou ali, então, é para o próprio
agente ler o que está acontecendo e comece a trabalhar sozinho nas coisas que ficaram pra fazer."*

## A regra que manda em todas as outras

Ele: *"é importante que enquanto estiver no modo autonomo, não caia em travas e nem me faça
perguntas, se não, vai ficar inoperante."*

Então: **nenhuma pergunta, nenhum diálogo, nenhuma espera.** Decido, anoto e sigo. O que pede a
palavra dele vira item na lista "pra ele" e eu pulo pra próxima frente. A sessão só fica parada
quando a fila acaba. Coisas que são trava disfarçada e eu não faço aqui: `AskUserQuestion`,
`EnterPlanMode` (já barrado por gancho), esperar login do Auxiliator, esperar a janela de autorização
do Granola, pedir "um Run" pra alguém, "prefere A ou B?".

## Como começo (uns 5 minutos)

1. Leio, nesta ordem: `memory/00-guia/passagem-de-bastao.md` (a seção Estado), `memory/MEMORY.md`,
   e o painel de projeto que a passagem aponta (hoje: [[onde-retomar-depois-da-virada]]).
2. Confiro o chão: `git status`, branch e commit das worktrees citadas, e se o que a passagem diz
   "no ar" ainda bate com o repositório. Passagem desatualizada → o repo manda, e eu corrijo a nota.
3. Auxiliator: tento **uma** vez. Deslogado → não espero, anoto "Auxiliator fora, sem sessão" na
   passagem e trabalho pelo Obsidian. Granola: pulo.
4. Monto a fila: os itens "MEU" da passagem, na ordem que ela dá. Sem item meu → o que sobrou nas
   notas do projeto e não depende dele. Nada disso → paro (seção "Quando paro").
5. Começo o primeiro. Sem preâmbulo pra tela: ninguém está lendo.

## Alçada

**Pode:** código, teste, migração em produção, publicar front, subir função, mexer no Auxiliator,
commit e push. Escolha dele em 02/09: *"pode subir pro ar também"*, sabendo o risco.

**Único limite:** [[o-que-eu-nao-posso-fazer]], as seis proibições. Duas mordem justamente aqui:
nada de reset ou limpeza em massa sozinho (item 2), e nada de dado da Allu em lugar público (item 6).
Modo autônomo não inventa proibição nova nem afrouxa nenhuma.

**Fica pra ele, e não é falta de permissão, é que a decisão é dele:** as 14 contas de custo de
operação, o recado pro time, os valores da alçada, e qualquer coisa que só ele saiba responder.

**Mensagem em nome dele pra terceiro:** deixo o rascunho pronto na passagem, não disparo de madrugada.
Ele derruba isso com uma frase quando quiser.

## Como trabalho

- **Uma frente por vez**, até fechar ou até travar em coisa dele. Fechou → prova → nota → commit →
  push → próxima. Nunca duas frentes meio feitas.
- **Prova antes de dizer pronto** ([[testar-antes-de-dizer-pronto]]), uma bateria e segue
  ([[uma-bateria-conserta-e-segue]]), testo só o que mudou ([[testar-so-o-que-mudou]]). Produção se
  confere no banco, nunca no log.
- **Plano em texto, não em plan mode:** cinco linhas na passagem (o que, em que ordem, o que assumo),
  e executo. Igual ao [[modo-especialista]] de agora.
- **Imprevisto que muda o rumo do projeto:** não decido de madrugada. Anoto na passagem, congelo a
  frente, vou pra próxima.
- **Ajudantes com parcimônia**, como sempre. Imagem e PDF pesado só via ajudante.
- **O relato vai pro Obsidian, não pra tela.** A seção Estado da [[passagem-de-bastao]] é o diário
  da noite: atualizo a cada frente fechada, não só no fim. Se eu morrer no meio, o próximo sabe onde
  parei.
- **Nota de projeto** que a frente tocou: atualizo também, na hora, com data.

## Quando paro

- **Fila vazia, ou só sobrou coisa dele:** escrevo o resumo da noite na passagem (feito / falta /
  pra ele / onde está / rascunhos prontos), commit, push, e paro. Fico quieto esperando ele. **Não
  invento trabalho** e não abro frente que ele pediu pra esperar ([[orcamento-nao-e-prioridade]]).
- **Contexto bateu 500k:** o gancho passa o bastão de novo e a corrente continua sozinha.
- **Ele falou:** modo autônomo acaba na hora. Resposta normal, na persona, abrindo com o resumo de
  três linhas do que fiz enquanto ele não estava e o que ficou pra ele.

## O que eu nunca faço aqui

- Perguntar, de qualquer forma.
- Esperar login, autorização, clique, resposta de terceiro.
- Bateria ou invasão do projeto inteiro: isso é marco, não madrugada ([[testar-so-o-que-mudou]]).
- Mandar mensagem em nome dele.
- Qualquer uma das seis de [[o-que-eu-nao-posso-fazer]].

---
name: loop
type: reference
description: SKILL loop — eu viro GESTOR de uma equipe de subagentes seniores no assunto pedido; como briefar, quando trocar (60% de contexto) e quando encerrar (2 baterias limpas)
atualizado: 2026-08-17
---

# Skill: Loop — eu gerencio, a equipe executa

Criada a pedido do Theo em 17/08/2026, com ele no papel de CEO: *"você é o gestor de uma
equipe, eu quero que a sua equipe faça X"*. Vale pra **qualquer** assunto, não só teste de
software: o assunto que ele pedir define a senioridade da equipe.

> [!warning] O nome colide com um comando embutido
> Existe um `/loop` nativo do Claude Code (rodar um prompt em intervalo). Esta skill do
> projeto tem o mesmo nome e passa na frente dele. Foi decisão dele, ciente disso.

## Antes de montar a equipe — o procedimento de abertura

**Nunca saia criando sub.** Pedido dele em 17/08/2026, e é passo obrigatório:

1. **Avise** que vamos entrar no loop, em uma linha.
2. **Entre no modo de planejamento** (`EnterPlanMode`) antes de qualquer execução.
3. **Faça TODAS as perguntas necessárias**, de uma vez, não em conta-gotas. O que sempre
   precisa estar decidido antes de a equipe sair: o escopo exato, se pode escrever em
   produção ou é só leitura, se pode disparar coisa que atinge terceiro, quantas frentes,
   e se a equipe conserta o que achar ou só reporta.
4. Só com as respostas na mão eu monto as frentes e briefo os subs.

**Why:** sub é caro e trabalha às cegas. Pergunta que eu deixo de fazer no começo vira
bateria inteira jogada fora, ou pior, escrita em produção que ninguém autorizou.

## Os dois papéis, e a linha que não se cruza

| Quem | Faz | NÃO faz |
|---|---|---|
| **Eu (gestor)** | Divido o trabalho, briefo, leio o que voltou, **avalio criticamente**, cobro prova, junto tudo e dou a devolutiva pro CEO | Não executo a bateria eu mesmo. Se eu estou lendo o código linha a linha, saí do papel |
| **Sub (sênior)** | Executa a frente dele até o fim, com prova, e devolve achado + evidência | Não decide escopo, não fala com o CEO, não encerra o trabalho |

**Eu avalio, não repasso.** Achado de sub sem evidência que sustente, eu devolvo ou mando
outro conferir. Relatório meu que é só colagem do que o sub disse é trabalho não feito.

## Briefing obrigatório de todo sub, sempre

Todo sub nasce sem memória nenhuma. **Todo prompt de criação leva os 5 blocos abaixo**, sem
exceção, inclusive nas trocas por contexto cheio:

1. **Quem eu sou:** "Eu sou o gestor desta equipe. Quem reporta a mim é você; quem me cobra
   é o CEO. Você não fala com o CEO, fala comigo."
2. **O que estamos fazendo:** o objetivo da bateria inteira, em duas linhas, e onde a
   frente dele encaixa no todo.
3. **Quem ele é — diga o cargo, com essas palavras:** "Você é um(a) **[cargo] sênior** de
   [especialidade]." Ele tem que se enxergar no papel: sênior de segurança, sênior de
   dados, sênior de front, sênior de FP&A, o que o assunto pedir.
4. **A função dele:** o recorte exato, o que é dele e o que é dos outros, e o formato do
   que eu espero de volta (achado, evidência, gravidade, onde reproduzir).
5. **Onde o antecessor parou:** o que já foi coberto, o que ficou aberto, e as pistas
   quentes. Primeiro da fila? Diga isso com todas as letras: "você é o primeiro desta
   frente, não há antecessor."

## Avaliar a entrega do sub — nada passa direto

Pedido dele em 17/08/2026: *"sempre que um sub te entregar um trabalho pronto, você deve
avaliar o que ele fez, caso não esteja de acordo com as expectativas do CEO, você deve
corrigir e apontar ele na direção correta."*

Toda entrega passa por este filtro **antes** de virar qualquer coisa:

1. **Bateu com o que o CEO pediu?** Escopo torto, frente errada, profundidade rasa: eu
   **corrijo na hora**. Mando de volta pro mesmo sub dizendo o que estava errado, o que era
   esperado e por onde ele recomeça. Não é reclamação, é rumo.
2. **Tem evidência?** Achado sem cenário concreto e sem arquivo:linha (ou sem o fluxo
   clicado, quando é de tela) volta. Teoria não entra na lista.
3. **"Não achei nada" vale?** Só com a lista do que ele cobriu. Sem isso a frente não fechou.
4. **Sustenta em pé?** O que cheirar a falso positivo eu confirmo por outro caminho, ou mando
   um segundo sub tentar derrubar antes de aceitar.

Relatório meu que é colagem do que o sub escreveu é trabalho não feito.

## Erro e defeito: quem conserta

**O sub reporta, o sub não conserta.** Ele apura, prova e devolve. Eu avalio, decido o que é
defeito de verdade e **dou as instruções do que fazer** — seja mandar o próprio sub corrigir
com o rumo certo, seja consertar eu mesmo. Sub que sai consertando por conta própria em cima
de sistema no ar é risco, não produtividade.

## Troca por contexto cheio (a regra dos 60%)

Sub que chega a **60% de contexto** é encerrado e substituído. Como sub não enxerga a
própria porcentagem, o briefing manda ele mesmo puxar o freio:

> "Quando você julgar que já consumiu uns 60% do seu espaço de trabalho, **pare onde está**
> e me devolva um **HANDOFF**: o que cobri, o que achei (com evidência), o que ficou pela
> metade, o que eu faria a seguir e as armadilhas que encontrei. Não comece frente nova
> depois disso."

Recebi o handoff: encerro aquele sub, abro um novo **com os 5 blocos** e o bloco 5
preenchido com o handoff. O trabalho continua de onde parou, não do zero.

## Paralelismo, e a trava do navegador

Frentes independentes rodam **em paralelo**, uma chamada só com vários subs. Mas o
navegador é **um só**: dois subs no Playwright ao mesmo tempo batem em "browser is already
in use". Então trabalho de tela é **serializado**, um sub por vez, enquanto os de leitura
de código correm juntos.

## Regra de produção, sempre

Sub que testa em produção segue o padrão da casa: valor baixo, descrição começando com
"TESTE DO SISTEMA, pode ignorar", **limpeza na mesma sessão**, e **nada** que mande
mensagem, e-mail ou cobrança pra terceiro sem eu autorizar antes. Ver
[[seguranca-e-confirmacao]].

## Como encerra, e quando eu falo com o CEO

O ciclo fecha quando a equipe fizer **mais duas baterias completas de checagem sem achar
nenhum defeito, erro, bug ou furo de segurança**. Achou qualquer coisa numa delas: conserta,
e o contador **volta pra duas baterias limpas**.

**A devolutiva ao CEO é só no fim.** Enquanto o critério de encerramento não bater, eu não
levo relatório parcial, lista de achado nem prévia: eu recebo, avalio, corrijo o rumo de quem
entregou torto, mando consertar e sigo tocando as baterias. Ele ouve de mim **uma vez**, com
o resultado fechado. Se ele perguntar no meio, respondo em que pé está — sem entregar o
conteúdo antes da hora.

Ligações: [[_como-eu-opero]], [[seguranca-e-confirmacao]], [[testar-antes-de-dizer-pronto]],
[[comando-barrado-para-e-pergunta]].

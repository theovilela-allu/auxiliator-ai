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

**Eu NÃO executo — nem "só uma coisinha".** Regra dele em 17/08/2026: *"você não vai fazer
nada que não seja gerir, senão vai ocupar muito contexto seu. Você vai sempre somente apontar
na direção correta. Só."* Então: não leio código pra conferir, não clico na tela, não rodo
teste, não conserto. Peguei vontade de fazer? Vira instrução pra um sub. Meu contexto é o
recurso mais escasso da operação, e ele é pra ler entrega, julgar e dar rumo.

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
   que eu espero de volta (achado, evidência, gravidade, onde reproduzir). **Peça relatório
   enxuto:** só os achados com a prova, em lista. Nada de narrar o passo a passo do que
   tentou, repetir o briefing, nem escrever introdução e conclusão. "Trabalhe calado e me
   entregue o resultado" — o caminho até o achado não me interessa, o achado com evidência
   sim. Relatório curto do sub é relatório que eu releio barato a cada turno.
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
defeito de verdade e **mando um sub corrigir com o rumo certo**. Eu mesmo não meto a mão:
gerir é gerir. Sub que sai consertando por conta própria, sem eu mandar, em cima de sistema
no ar é risco, não produtividade.

## Troca por contexto cheio (número ABSOLUTO, não 60%)

Sub que enche o contexto é encerrado e substituído. O gatilho é **número absoluto, não
porcentagem** — o diagnóstico de 20/08/2026 mostrou por quê: nas duas baterias, 48 dos 82
subs passaram de 150 mil tokens e 6 passaram de 300 mil, e o custo de um sub cresce com o
**quadrado** do tamanho dele. O "60%" da versão antiga não segurava nada numa janela grande
(60% de 1M = 600k). A equipe foi **52% de todo o gasto de agosto** — é aqui que mora o dinheiro.

Como sub não enxerga o próprio tamanho, o briefing manda ele puxar o freio cedo:

> "Quando você tiver produzido em torno de **umas 6 a 8 respostas de trabalho**, ou sentir
> que já cobriu bastante, **pare onde está** e me devolva um **HANDOFF**: o que cobri, o que
> achei (com evidência), o que ficou pela metade, o que eu faria a seguir e as armadilhas.
> Não comece frente nova depois disso. Handoff enxuto é melhor que frente inteira jogada fora."

Recebi o handoff: encerro aquele sub, abro um novo **com os 5 blocos** e o bloco 5
preenchido com o handoff. O trabalho continua de onde parou, não do zero. **Frente estreita
por sub** (um recorte pequeno, não "audite o sistema todo") é o que mantém cada sub curto.

## Modelo do sub: leve por padrão, pesado só onde pensa

O sub herda o modo de pensamento que estiver ativo — e nas baterias de agosto eles rodaram
todos no modo avançado (caro), inclusive os que só liam código e clicavam tela. **Isso é
desperdício:** trabalho mecânico (ler arquivo e listar o que viu, reproduzir um passo,
rodar um teste) rende igual no modo leve, que é ~10x mais barato por token de saída.

Regra: **o sub de execução mecânica vai no modo leve; o modo avançado fica pro sub que
precisa raciocinar** — achar o furo de lógica, montar o ataque, julgar se um achado é real.
Eu (gestor) permaneço no modo em que o CEO me deixou; quem eu poupo é a tropa. Se a
plataforma me deixar escolher o modelo por sub, escolho o leve pra execução; se não, monto
frentes mecânicas mais estreitas pra elas fecharem em poucas respostas.

## Disciplina de leitura e comando do sub — o filler de verdade

O diagnóstico de 20/08/2026 mostrou onde o contexto do sub incha: **95% é o que ele lê**
(Bash 49%, Read 46%). Tudo que um sub lê, ele **relê a cada turno até morrer** — então
resultado gordo cobrado uma vez vira cobrança repetida dezenas de vezes. O briefing manda o
sub segurar isso:

> "Todo comando e toda leitura sua fica no seu espaço de trabalho e é relido a cada passo, então **mantenha cada saída pequena**: filtre a saída de teste/log com `grep`/`head`/`tail` ou jogue num arquivo em vez de despejar tudo; leia o **trecho** do arquivo que interessa (linhas X a Y), não o arquivo inteiro; **nunca** abra imagem, PDF ou dump gigante inteiro só pra dar uma olhada. Um comando certo vale dez tentativas jogadas na tela."

Frente estreita ajuda aqui também: sub com recorte pequeno lê pouco. E o `--fix` de bateria
grande em cima de log verboso é o pior ofensor: peça o resumo do teste (contagem, os que
falharam), não a corrida inteira.

## Uma worktree por frente (lição de 27/08)

Na bateria do racional invertido rodei **seis consertos ao mesmo tempo na mesma worktree**, separando por arquivo no briefing. Funcionou, mas por sorte: um sub commitou por baixo do outro, dois carregaram no commit deles mudanças de um terceiro, e a integração final teve que conciliar tudo. **Da próxima: worktree por frente** (`git worktree add -b <frente> ../compras-allu-<frente> <base>`), ou fila, quando as frentes tocam o mesmo arquivo. Vale principalmente pro que mexe em banco: migração nova por frente, com timestamp separado, e uma frente de INTEGRAÇÃO no fim pra rodar a cadeia em ordem e resolver colisão.

**A armadilha que travou dois subs naquele dia:** patch de corpo vivo por `pg_get_functiondef` com **âncora de várias linhas não casa**, porque o repo está em CRLF. Só âncora de uma linha funciona. Ponha isso no briefing de quem for remendar função.

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

## Fase de invasão — obrigatória quando é site ou código

Pedido dele em 17/08/2026: quando o alvo for **site, sistema ou qualquer coisa ligada a
código**, depois que a bateria de testes fechar (as duas rodadas limpas), **eu monto uma
equipe de hackers pra tentar invadir de verdade.** Não é releitura do código: é ataque.

Isto **não se aplica** a assunto sem código (texto, análise, planejamento) — aí a skill
encerra na bateria de testes normal.

**O CEO não é técnico.** Ele não sabe de código nem de invasão, então **eu escrevo o plano
de ataque**: as especialidades da equipe e o passo a passo de cada frente, no briefing dos
5 blocos. Cada hacker é um **sênior** na dele. Divisão de referência (ajusto ao alvo):

- **Sênior de autenticação e sessão** — burlar login, roubo/reuso de token, escalar de
  usuário comum pra privilegiado, sequestro de sessão, fluxo de OAuth.
- **Sênior de autorização e acesso a dado** — ler ou escrever o que não é dele (IDOR),
  furar a separação por permissão e por centro de custo, chamar a API direto pulando a tela.
- **Sênior de injeção** — SQL/PostgREST, XSS, injeção em template de e-mail ou PDF, upload
  malicioso no cofre.
- **Sênior de abuso de lógica de negócio** — usar as regras do jeito errado pra tirar
  proveito: aprovar o próprio gasto, forjar valor, disparar aviso/cobrança em nome de outro.
- **Sênior de infra e configuração** — segredo exposto, CORS frouxo, header faltando,
  função sem autenticação, dependência com falha conhecida.

Mesma disciplina do resto da skill: briefing de 5 blocos, troca aos 60%, e **cada invasão
alegada só vale com a prova de como se reproduz** (a requisição, o passo, o dado que vazou).
Invadiu? Vira defeito, eu mando consertar, e a **fase de invasão recomeça do zero** depois
do conserto — invasão que teve sucesso zera este contador, igual à bateria de testes.

## Como encerra, e quando eu falo com o CEO

O ciclo só fecha com **as duas condições**: (1) a equipe de testes fez **duas baterias
completas seguidas sem achar nenhum defeito, erro, bug ou furo**, E (2) quando é site ou
código, **a equipe de hackers não conseguiu invadir** o sistema. Qualquer achado ou qualquer
invasão bem-sucedida no caminho: conserta e o contador daquela fase **volta ao zero**.

**A devolutiva ao CEO é só no fim.** Enquanto o critério de encerramento não bater, eu não
levo relatório parcial, lista de achado nem prévia: eu recebo, avalio, corrijo o rumo de quem
entregou torto, mando consertar e sigo tocando as baterias. Ele ouve de mim **uma vez**, com
o resultado fechado. Se ele perguntar no meio, respondo em que pé está — sem entregar o
conteúdo antes da hora.

Ligações: [[_como-eu-opero]], [[seguranca-e-confirmacao]], [[testar-antes-de-dizer-pronto]],
[[comando-barrado-para-e-pergunta]].

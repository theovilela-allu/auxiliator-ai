---
name: loop
type: reference
description: SKILL loop — eu viro GESTOR de uma equipe de subagentes seniores no assunto pedido; como briefar, qual o ESCOPO da bateria (proporcional ao que mudou, nunca o projeto inteiro), quando trocar (tamanho absoluto), quando encerrar (2 baterias limpas do escopo) e por que a invasão só roda em marco de projeto
atualizado: 2026-08-28
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
   precisa estar decidido antes de a equipe sair: se pode escrever em produção ou é só
   leitura, se pode disparar coisa que atinge terceiro, e se a equipe conserta o que achar
   ou só reporta. **O escopo não é pergunta:** eu monto o raio e declaro o nível (seção
   seguinte); ele alarga se quiser.
4. Só com as respostas na mão eu monto as frentes e briefo os subs.

**Why:** sub é caro e trabalha às cegas. Pergunta que eu deixo de fazer no começo vira
bateria inteira jogada fora, ou pior, escrita em produção que ninguém autorizou.

## O que é uma bateria — o escopo é proporcional ao que mudou

Mudança de 28/08/2026, pedida por ele com urgência: *"os agentes tão testando o projeto inteiro
todas as vezes que eu peço algo. Tá demorando demais."* Estava certo, e a culpa era desta skill:
ela cobrava "duas baterias limpas" **sem nunca dizer o que é uma bateria**. Sem alvo definido, o
padrão virou varrer o sistema todo, duas vezes, mais invasão completa, pra qualquer pedido.

**Bateria não é "o sistema". Bateria é um escopo declarado.** Três níveis, e o padrão é o menor:

| Nível | Quando | O alvo |
|---|---|---|
| **Alvo** (padrão) | qualquer pedido do dia a dia | **o que foi implementado por último** + o que encosta nele + o smoke fixo. **2 a 4 frentes** |
| **Ampla** | a mexida é transversal: login/sessão, permissão/alçada, migração ou função de banco, componente compartilhado, regra de valor/rateio, disparo de mensagem | todos os fluxos que passam pela peça mexida |
| **Total** | ele pediu, ou é véspera de subir pacote grande | o sistema |

**A régua, na palavra dele (28/08):** *"testes somente no que foi implementado por último e no que
tange o que foi implementado."* O alvo é **o último pacote de mudança e a vizinhança dele**. Código
que ninguém tocou não entra na bateria, mesmo estando ali do lado. O smoke fixo é a única exceção,
e é curto de propósito.

**Eu monto o raio antes de briefar** — é leitura minha, três comandos, não vale abrir sub pra isso:

1. **O que mudou:** `git diff --stat <base>..HEAD`, mais as migrações e funções tocadas.
2. **Quem depende:** `grep` pelos nomes que mudaram (função, coluna, rota, componente).
3. **O smoke fixo:** entrar, abrir o quadro, criar pedido, aprovar, ver o pedido no lugar certo.
   É o caminho que, se quebrar, ninguém trabalha — e ele roda em **toda** bateria, em qualquer nível.

Com o raio na mão eu **declaro o escopo em uma linha** no anúncio do loop ("bateria alvo: tal tela,
tal função e o smoke") e sigo sem esperar resposta. Ele alarga se quiser.

**Fora do escopo não se testa.** Sub que "aproveitou pra dar uma olhada no resto" saiu da frente
dele: eu corto na avaliação. O recorte vai explícito no bloco 4 do briefing, com o que é dele e o
que está fora.

**Tropeçou em algo fora do raio?** O sub reporta **em uma linha** e não investiga. Eu decido: entra
nesta bateria só se for grave (perda de dado, furo de acesso, fluxo crítico quebrado); senão vira
tarefa pra depois e **não zera** o contador desta bateria.

**Why:** o custo da equipe cresce com o tamanho do alvo, não com a dificuldade do problema. Escopo
proporcional é o que faz um ajuste de tela fechar em minutos e uma mexida em alçada seguir levando
o tempo que ela merece.

## Depois do conserto, reteste o conserto — não o projeto

Achou defeito e eu mandei consertar: a bateria seguinte cobre **o conserto + o que o defeito
encostou + o smoke**. O contador de rodadas limpas volta a zero, mas o que ele conta é o **escopo
declarado** desta bateria, nunca o sistema inteiro. Ler "o contador zerou" como "roda tudo de novo"
foi exatamente o que deixou o ciclo lento.

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

## Fase de invasão — só em marco de projeto

Quando o alvo é **site, sistema ou qualquer coisa ligada a código**, em algum momento **eu monto
uma equipe de hackers pra tentar invadir de verdade.** Não é releitura do código: é ataque.

**Quando ela roda (revisão de 28/08/2026):** só em **marco** — fim de projeto ou de frente grande,
véspera de commit/pacote grande, véspera de atualização grande, ou quando ele pedir. Entra depois
de a bateria daquele marco fechar limpa. **Não roda em pedido do dia a dia:** na versão antiga era
obrigatória em tudo que fosse código, e montar cinco frentes de ataque por causa de um ajuste de
tela era o item mais caro do ciclo, sem retorno nenhum.

**A contrapartida, e como eu cubro:** furo de segurança que entra numa mudança do dia a dia fica
sem ataque até o próximo marco. Então, quando o que foi implementado **encosta em login, permissão,
alçada ou dado de terceiro**, eu aviso em uma linha e ofereço a invasão pontual ali mesmo. Ele
decide; sem o "pode", segue pro marco.

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

**No marco vão as cinco frentes**, em cima do que o projeto expõe. Se ele pedir invasão **fora**
de marco, em cima de uma mudança pontual, eu convoco **só as frentes que a mudança encosta**
(permissão → autorização; formulário ou upload → injeção; valor ou alçada → abuso de lógica;
login ou sessão → autenticação; segredo, header ou dependência → infra).

Mesma disciplina do resto da skill: briefing de 5 blocos, troca por tamanho absoluto, e **cada invasão
alegada só vale com a prova de como se reproduz** (a requisição, o passo, o dado que vazou).
Invadiu? Vira defeito, eu mando consertar, e a **fase de invasão recomeça do zero** depois
do conserto — invasão que teve sucesso zera este contador, igual à bateria de testes.

## O conserto é o primeiro alvo da passada seguinte (lição de 28/08)

Na bateria do racional invertido, **3 dos 10 achados da última passada eram buracos nos consertos
da passada anterior** — não em código velho. O comprovante de pagamento foi fechado por policy e a
passada seguinte furou ele com **subpasta** (o `%` do `like` engole a barra); a recusa de coluna
ambígua que eu mandei fazer virou **falso positivo** que parava o fechamento do mês por uma coluna
vazia. Conserto é código novo, e código novo é o menos testado da casa.

Então, na passada depois de consertar, **o conserto entra no raio antes de qualquer outra coisa**, e
o briefing do sub diz isso com estas palavras: *"seu trabalho é tentar furar o conserto, não reler o
achado."* Vale principalmente quando o conserto foi de recusa: **toda trava nova pode recusar
demais**, e falso positivo em fluxo de fechamento ou de pagamento custa mais que o defeito que ele
evita — peça a tabela de casos (o que passa, o que recusa, o que avisa), não só o caso que motivou.

**E quando a regra vive em dois lugares, exija uma régua só.** O furo da subpasta existiu porque a
validação do pagamento e a policy de leitura decidiam **por caminhos diferentes** sobre a mesma
coisa. O conserto bom foi extrair funções puras usadas pelas duas pontas: o conjunto que sobe passou
a ser, por construção, o conjunto que paga. Sempre que o sub disser "espelhei a regra do outro
lado", pergunte se dá pra ser **a mesma função** em vez de duas parecidas.

## Como encerra, e quando eu falo com o CEO

**No pedido do dia a dia** o ciclo fecha com uma condição: a equipe de testes fez **duas baterias
completas seguidas sem achar nenhum defeito, erro, bug ou furo**. **No marco** (fim de projeto,
commit ou atualização grande) entra a segunda condição: **a equipe de hackers não conseguiu
invadir**. Qualquer achado ou qualquer invasão bem-sucedida no caminho: conserta e o contador
daquela fase **volta ao zero**.

**"Completa" é o escopo declarado coberto de ponta a ponta**, com a lista do que foi coberto na
mão — não é o sistema inteiro. E a **segunda rodada é uma passada nova no mesmo escopo, com as
frentes redistribuídas** (outro sub, outro ângulo), nunca o mesmo roteiro repetido pelo mesmo sub:
segunda rodada em cópia carbono não prova nada, só cobra o dobro.

**A devolutiva ao CEO é só no fim.** Enquanto o critério de encerramento não bater, eu não
levo relatório parcial, lista de achado nem prévia: eu recebo, avalio, corrijo o rumo de quem
entregou torto, mando consertar e sigo tocando as baterias. Ele ouve de mim **uma vez**, com
o resultado fechado. Se ele perguntar no meio, respondo em que pé está — sem entregar o
conteúdo antes da hora.

Ligações: [[_como-eu-opero]], [[seguranca-e-confirmacao]], [[testar-antes-de-dizer-pronto]],
[[comando-barrado-para-e-pergunta]].

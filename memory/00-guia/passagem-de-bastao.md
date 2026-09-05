---
name: passagem-de-bastao
type: painel
description: LEIA PRIMEIRO em sessao nova — a secao Estado diz o que a sessao anterior estava fazendo e onde parou; a secao Como funciona explica a corrente de 500k
atualizado: 2026-09-05
status: em-andamento
aliases:
  - bastao
  - retomar-daqui
---

## Estado (reescrito a cada passagem)

> [!danger] ESTE ARQUIVO SOBE PRO GITHUB PUBLICO. O DETALHE FICA NO COFRE LOCAL.
> `memory/00-guia/**` e versionado, e o repo do assessor e **publico**. Entao aqui vai **o jeito de
> trabalhar e o ponto de retomada**; nome de funcao, caminho de exploracao, numero de negocio e
> detalhe de sistema da empresa **ficam nas notas locais**, que o `.gitignore` cobre.
> Regra: [[o-que-vai-pro-github]]. Passagens antigas vazaram detalhe demais; nao repita.

### MODO AUTONOMO desde 05/09/2026, 07h. Ele saiu ao meio-dia de 04/09 e mandou seguir.

Sessao anterior passou o bastao por contexto cheio. Frente unica: o site que
substitui os slides, em `Desktop\deck-allu`. **Nada travado, tudo commitado.**

> [!important] PRIMEIRO PASSO
> `memory/60-visual/site-de-apresentacoes.md` (onde o projeto esta) e
> `memory/60-visual/modelo-3d-como-eu-faco.md` (o metodo). Os dois valem mais
> que esta secao.

### ONDE ESTA

Projeto em `Desktop\deck-allu`, **fora do repo do assessor** e sem git proprio.
Servidor: **`python servidor.py`** na pasta (nao o `http.server` de fabrica: ele
deixa o navegador guardar o JavaScript velho). Abre em
`http://127.0.0.1:8123/prototipo.html`. O assador (`python assador.py`) so
precisa subir pra gravar.

### FEITO NESTA SESSAO

**Primeira parte (07h-07h50), sem ele:**

1. **A animacao do aparelho virou video, com fundo transparente.** O deck toca video;
   o 3D virou reserva; o retrato parado e a reserva da reserva. 36 a 86 ms ate o
   primeiro quadro, contra 289 a 329 do 3D.
2. **A fonte do deck estava quebrada desde 04/09** e ninguem tinha visto: caminho
   duplicado dentro do `.css`, 404 nas 24 declaracoes, um dia inteiro numa fonte de
   sistema. Consertado.
3. **Servidor de conferencia proprio** (`servidor.py`).
4. **O passa-bastao agora confere o alvo** antes de matar, e deixa caderno em
   `~/.claude/bastao.log`.
5. **`LEIAME.md` na pasta do deck** e **`shot.ps1` avisando que mente**.

**Segunda parte (08h-08h30), com ele acordado, mandando ajuste e voltando a dormir:**

6. **A lente da camera foi refeita a partir de quatro fotos que ele mandou.** As
   medidas viraram contrato e estao na nota do projeto. O que ele apontou: aro grosso
   demais (era 0,18 do raio, e 0,12), lente muito proxima do corpo (o colar subia
   0,085, sao 0,25) e lente chapada de preto (nao existia interior nenhum).
7. **O giro virou uma volta continua de 24s**, com rubato: demora nas costas, passa
   depressa pela frente e pelos perfis. Pedido dele: "comecando junto do slide, ai faz
   rodando devagar". Sumiu o tranco e a piscada, porque sumiu a troca entre dois videos.
8. **O aparelho atravessa a virada sem parar de girar** (slides 09 e 10). Ele saiu de
   dentro do card e virou um hospedeiro pendurado em cima do trilho.
9. **O servidor passou a aceitar pedido por faixa de bytes.** Sem isso o navegador
   marca o video como nao buscavel e o congelamento de conferencia falha em silencio.

### DUAS COISAS PRA ELE OLHAR QUANDO ACORDAR

- **A tela da frente agora aparece.** Com a volta inteira ela fica visivel metade do
  tempo, e antes nunca aparecia. Ela estava acesa demais e brigava com o laser; baixei
  o brilho pra tela em descanso. Se ele quiser algo nosso ali, e escolha dele.
- **O rubato do giro** e escolha minha, nao dele: ele pediu "devagar", eu pus o giro pra
  demorar nas costas. Dois numeros zeram isso (`RUBATO` e `RUBATO2` em `aparelho3d.js`).

### CORRECAO DE UMA COISA QUE EU ESCREVI ERRADO HOJE

Eu tinha registrado que **o deck nao escala pra tela grande**, com numeros. Os numeros
estavam certos e a conclusao estava errada: o deck escala sim, `escala()` aplica
`scale(min(largura/1280, altura/720))` no palco inteiro. Eu li a transform numa janela
de 1280x720, onde ela e a identidade — medi a regua no unico ponto em que ela marca
zero. **Confirmar que algo nao existe exige olhar onde ele apareceria.**

### O QUE DEPENDE DELE, e por isso eu nao toco

- O tema dos outros slides, pra eu desenhar o fundo de cada um
- Creditar o autor do modelo 3D, ou trocar por um nosso, antes de mostrar pra fora
- Olhar o **slide 10** e dizer se o desenho do grafico serve
- Os numeros reais: os do slide 9 e do 10 sao exemplo
- Editor e banco do deck: as decisoes estao fechadas, a implementacao nao comecou
- O que a TELA do aparelho mostra, agora que a volta inteira faz ela aparecer

### FILA

Vazia do meu lado. Uma frente congelada de proposito: o **acabamento do corpo**
(chapa das costas, ilha da camera e trilhos laterais sao um material so hoje). E
olho dele, e ele pediu com todas as letras pra eu parar de afinar material no
chute.

> [!important] Mexeu no acabamento? ASSA E GRAVA DE NOVO
> `prototipo.html?assar=1&gravar=1` faz os dois numa passada, uns 40 segundos.
> Assar sem gravar deixa a apresentacao com o aparelho velho, porque ela nem olha
> pro modelo — quem ela toca e o video.

### OUTRA SESSAO DE PE

Tem outro agente anunciado como trabalhando (`35672`, de pe desde 05h45). Nao
encostei nele. Por causa dele a maquina nao desliga quando eu termino, e esta
certo assim. O servidor do deck (porta 8123) e o assador (8124) ficaram ligados.

### O QUE ESTES DOIS DIAS ENSINARAM, e serve fora deste projeto

- **Antes de cacar o defeito, prove que voce esta olhando pro objeto certo.**
  Print sem placa de video mente; pagina com cache roda o codigo velho; trocar so
  a ancora do endereco nem recarrega. Marca de versao no arquivo resolve em 10s.
- **Classifique o defeito antes de consertar.** Duas provas de 30 segundos
  fecharam questao onde eu ja tinha gasto cinco tentativas.
- **Contar o que deu certo nao e conferir.** "Zero recursos de fora" deu zero e
  era verdade; ninguem contou o pedido que FALHOU, e a fonte estava caida.
- **Otimizacao boa se mede**, senao e chute. Espelho pega o pico do ambiente,
  fosco pega a media.
- **Ferramenta de conferencia nao pode vazar pro uso normal** — mas TER ferramenta
  de conferencia paga na primeira vez: a lupa que chega perto da peca, a pintura de
  cada peca com uma cor, e esconder a camada de cima. Em 05/09 eu afinei material
  quatro vezes achando que o problema era acabamento, e a prova de cor mostrou em
  trinta segundos que quem escondia tudo era o vidro por cima.
- **Confirmar que algo NAO existe exige olhar onde ele apareceria.** Eu declarei que
  o deck nao escalava depois de ler a escala do palco numa janela de 1280x720 — o
  unico tamanho em que ela e a identidade.

### O RITMO DELE, e o erro que a sessao passada cometeu

Ele manda mensagem curta em cima de mensagem curta enquanto eu trabalho. Em 04/09
a sessao ficou calada tempo demais encadeando ferramenta e ele cobrou: *"me
responde caceta"*. **Junte as mensagens, execute, mas responda em texto antes de
sumir de novo.** E ele pediu, com todas as letras, **parar de afinar material no
chute**: quando algo estiver estranho, perguntar o que especificamente, ou medir.

## Como funciona (não mexer sem atualizar o código junto)

A corrente nasceu em 02/09/2026. Pedido dele: *"quando atingisse [o limite], ele salvasse tudo na
memória automaticamente e rodasse um script para encerrar o terminal, e iniciar um novo claude e
mandar a seguinte mensagem: bom dia, da uma lida pra pegar contexto."* Limite: **500 mil tokens**.

| Peça | Onde | O que faz |
|---|---|---|
| Laço do `claude` | `C:\Users\Allu\Documents\WindowsPowerShell\profile.ps1` | A função `claude` exporta `BASTAO_SINAL` (um arquivo por terminal, `~\.claude\bastao-<PID>.sinal`) e roda o `claude.exe --dangerously-skip-permissions` em laço. Morreu com sinal preenchido → limpa o console e relança **no mesmo terminal, com a mesma flag**, com a mensagem do sinal como primeiro prompt. Sinal vazio → sai normal |
| Gancho `Stop` | `.claude/hooks/bastao-de-contexto.cjs` | No fim de cada resposta minha, soma o `usage` mais recente do transcript. Acima de 500k, grava a marca `<transcript>.bastao` e devolve (código 2) a lista: consistência, reescrever a seção Estado daqui, commit/push, uma linha pro Rei, rodar o script. Uma vez por sessão; ignora `stop_hook_active` |
| Script | `.claude/hooks/passar-o-bastao.cjs` | Grava a mensagem de abertura no sinal e dispara, **pelo WMI** (`Win32_Process.Create`, que nasce fora da minha árvore; filho destacado morre junto com a ferramenta que o disparou), um matador que 2s depois derruba a **árvore inteira** do `claude.exe` (senão o navegador do Playwright fica vivo segurando a trava do perfil). `--seco` só mostra o que faria. Confere se o alvo está mesmo debaixo do terminal dono do sinal e recusa se não estiver; anota toda tentativa em `~/.claude/bastao.log`. Sem `BASTAO_SINAL` não mata nada e devolve a frase pra colar na mão |
| Barra de status | `C:\Users\Allu\.claude\statusline.cjs` | Laranja aos 500k ("passagem a caminho"), vermelho aos 800k ("a passagem falhou, olha isso") |
| A sessão nova | [[modo-autonomo]] | A mensagem de abertura diz "MODO AUTONOMO": ela lê este arquivo, o `MEMORY.md` e o painel do projeto, e trabalha sozinha na fila, sem pergunta e sem trava |

A mensagem de abertura, fixa no script:

```
bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de
bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.
```

**Coisas que a corrente NÃO faz:** não apaga arquivo nenhum (sinal é esvaziado, marca fica), não
fecha terminal nem abre janela, não passa o bastão no meio de uma tarefa (o `Stop` só roda quando eu
terminei de responder), e não repete a passagem numa sessão em que ela já falhou (a marca impede;
por isso o vermelho da barra existe).

**Testar sem esperar 500k:** num terminal NOVO, `$env:BASTAO_LIMITE = 1000` e depois `claude`. A primeira
resposta já passa o bastão. O laço zera esse limite antes de relançar, então a sessão que nasce volta
ao 500k de sempre (senão a corrente viraria laço infinito).

> [!warning] A régua de teste fica no TERMINAL, não no projeto, e pega qualquer pasta
> `BASTAO_LIMITE` é variável de ambiente do terminal e **só é zerada quando uma passagem acontece
> naquele terminal**. Em 02/09 ele abriu outro projeto no mesmo terminal do teste e a sessão passou o
> bastão na primeira resposta, o que pareceu bug e não era. Conserto: `Remove-Item Env:BASTAO_LIMITE`,
> ou abrir terminal novo. **E os ganchos precisam de caminho absoluto** (`node "$CLAUDE_PROJECT_DIR"/.claude/hooks/...`):
> com caminho relativo eles não rodam quando o Claude abre de outra pasta. **Provado em 02/09/2026** num shell de
mentira: relançou no mesmo terminal, com a flag, com a mensagem; sinal esvaziado; laço fecha com
sinal vazio. **A primeira passagem REAL** (02/09/2026 22h25, régua em 1k, terminal do VS Code) **falhou**:
o matador destacado morreu junto com a ferramenta que o disparou. Prova: um filho destacado que devia
gravar um arquivo em 4s não gravou; o mesmo filho criado pelo WMI gravou. Não tinha nada a ver com o
VS Code, a árvore estava certa (`Code.exe` → `powershell.exe` do laço → `claude.exe`). Corrigido no
mesmo minuto e refeito.

**A morte real foi PROVADA em 02/09/2026 às 22h29** (segunda tentativa, com o matador pelo WMI). Quem
escreve isto é a sessão que nasceu dela. O que a sessão nova conferiu de dentro, na abertura:

- **Renasceu no mesmo terminal**: `powershell.exe` 36596 (o do VS Code, aberto às 22h19) é o pai do
  `claude.exe` novo (89756, nascido às 22h29m35, 17 segundos depois do último commit da origem), com
  `--dangerously-skip-permissions` e a mensagem de abertura como primeiro prompt. O sinal
  `bastao-36596.sinal` estava esvaziado pelo laço, a marca `.bastao` da origem ficou.
- **A árvore morreu inteira, navegador incluído**: o Auxiliator da origem usava o perfil
  `mcp-chrome-3c24d0c` (gravado até 22h22). Não sobrou processo nenhum dele, e o boot da sessão nova
  abriu **o mesmo perfil** às 22h32 sem erro de trava e já logado. A outra sessão minha, no terminal
  das 21h06 (`claude.exe` 49532, perfil `28c730e`), ficou intacta, como devia.
- **O terminal ficou limpo.** Isso não dá pra conferir de dentro; ele confirmou às 23h30 de
  02/09/2026 (*"sim"*, à pergunta se o terminal ficou limpo depois da morte).

Ligações: [[travar-em-60-de-contexto]] · [[modo-autonomo]] · [[o-que-eu-nao-posso-fazer]] ·
[[terminal-e-powershell]]

## O ALVO DA PASSAGEM, e o susto de 04/09/2026

Em 04/09, 20h, uma passagem nao matou a sessao e ficou a suspeita de que o script
**achava o `claude.exe` por NOME** e, com varias sessoes abertas, matava uma irma. Hoje
tem **tres `claude.exe` vivos** nesta maquina, entao a suspeita era razoavel. (A anotacao
daquela noite tinha sido colada no fim da nota do deck, e nao aqui; voltou pro lugar em
05/09.)

**Nao era isso.** O script ja subia a cadeia de pai a partir do PID do proprio node desde
02/09 (commit `ea4b2e6`), e conferido em 05/09 ele acerta o alvo: sobe
`node -> bash -> bash -> bash -> claude.exe`, e esse `claude.exe` e mesmo o desta sessao.
O que faltou em 04/09 foi **prova**: nao existia registro nenhum do que o script mirou,
entao a investigacao virou reconstrucao. O sinal daquela noite (`bastao-17504.sinal`)
continua cheio e o terminal dele morreu sem o laco consumir — coerente com a sessao ter
sido fechada na mao, que foi o contorno usado.

Duas coisas mudaram em 05/09 pra isso nao se repetir:

1. **Conferencia cruzada.** Duas coisas independentes dizem qual sessao e a minha: a
   cadeia de processo e o nome do arquivo de sinal (`bastao-<pid do terminal>.sinal`).
   Agora elas tem que concordar. Se o `claude.exe` encontrado nao estiver debaixo do
   terminal dono do sinal, o script **recusa** e diz por que, em vez de derrubar a irma
   em silencio. Provado nos dois lados: com o sinal certo diz `CONFERE`; com o sinal de
   outro terminal recusa, sai com erro e nao mata nada.
2. **Caderno em `~/.claude/bastao.log`.** Uma linha por tentativa: alvo, terminal, cadeia
   e desfecho. Custa nada e evita a proxima adivinhacao.

**Se mesmo assim a passagem nao acontecer:** o sinal ja fica gravado, entao basta fechar a
sessao na mao (`/exit` ou Ctrl+C duas vezes); o laco `while ($true)` da funcao `claude` no
`profile.ps1` le o sinal e relanca no mesmo terminal com a mensagem de abertura. E o
caderno agora diz o que aconteceu.
